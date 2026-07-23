"""
JD 分析 API。

POST /api/jd/analyze
    - multipart/form-data
    - jd_text: 可选字符串
    - jd_image: 可选 UploadFile（png/jpg/jpeg/webp）

路由规则（复用 input_classifier + llm/router）：
    - 有图片 → 视觉 Provider（GLM-4.6V-Flash）
    - 仅文本 → 文本 Provider
    - 两者都为空 → 400
    - 图片 + 文本 → 一起发送给视觉模型，文本作为补充说明
"""

import os
from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.services.input_classifier import is_image_file
from app.services.jd_analyzer import (
    IMAGE_EXT_TO_MIME,
    analyze_jd_image,
    analyze_jd_text,
)
from app.services.llm.router import get_provider_for_input


router = APIRouter()

ALLOWED_IMAGE_TYPES = {"image/png", "image/jpeg", "image/webp"}


def _get_provider_name(provider) -> str:
    """从 Provider 实例推断名称（GLMProvider → glm）。"""
    class_name = provider.__class__.__name__
    if class_name.endswith("Provider"):
        return class_name[: -len("Provider")].lower()
    return class_name.lower()


def _get_file_ext(filename: str) -> str:
    """从文件名提取小写扩展名（含 .），无扩展名时返回空字符串。"""
    if "." not in filename:
        return ""
    return "." + filename.rsplit(".", 1)[-1].lower()


@router.post("/api/jd/analyze")
async def analyze_jd(
    jd_text: Optional[str] = Form(default=None),
    jd_image: Optional[UploadFile] = File(default=None),
):
    """
    分析 JD 图片或文本，返回结构化职位信息。

    返回结构：
        {
            "input_type": "image" | "image_with_text" | "text",
            "provider": "glm" | "deepseek" | "gemini",
            "model": "glm-4.6v-flash",
            "data": {
                "job_title": "",
                "responsibilities": [],
                "requirements": [],
                "location": "",
                "education_experience": "",
                "raw_content": "..."  # 仅 JSON 解析失败时出现
            }
        }
    """
    text_content = (jd_text or "").strip()
    has_text = bool(text_content)
    has_image = jd_image is not None and jd_image.filename

    # 规则 3：图片和文本都为空 → 400
    if not has_image and not has_text:
        raise HTTPException(
            status_code=400,
            detail="Either jd_text or jd_image must be provided.",
        )

    if has_image:
        # 校验图片类型（扩展名）
        filename = jd_image.filename
        ext = _get_file_ext(filename)

        if not is_image_file(filename):
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type. "
                "Supported image formats: png, jpg, jpeg, webp.",
            )

        # 校验图片 MIME 类型
        if jd_image.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {jd_image.content_type}. "
                "Only PNG, JPEG, and WebP images are accepted.",
            )

        mime_type = IMAGE_EXT_TO_MIME.get(ext)
        if not mime_type:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot determine MIME type for: {filename}",
            )

        # 读取图片字节
        image_bytes = await jd_image.read()
        if not image_bytes:
            raise HTTPException(
                status_code=400,
                detail="Image file is empty.",
            )

        # 规则 1 & 4：图片（可选附带文本）→ 视觉 Provider
        print("[Input Classifier] Input type: image")
        provider = get_provider_for_input(has_image=True)

        data = analyze_jd_image(
            provider=provider,
            image_bytes=image_bytes,
            mime_type=mime_type,
            jd_text=text_content if has_text else None,
        )
        input_type = "image_with_text" if has_text else "image"
    else:
        # 规则 2：纯文本 → 文本 Provider
        print("[Input Classifier] Input type: text")
        provider = get_provider_for_input(has_image=False)

        data = analyze_jd_text(provider=provider, jd_text=text_content)
        input_type = "text"

    provider_name = _get_provider_name(provider)
    model_name = getattr(provider, "model", "unknown")

    return {
        "input_type": input_type,
        "provider": provider_name,
        "model": model_name,
        "data": data,
    }
