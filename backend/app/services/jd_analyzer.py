"""
JD 分析服务：从图片或文本中提取职位描述的结构化信息。

复用：
- GLMProvider 的 image_to_data_url / build_vision_message 工具
- BaseLLMProvider.generate() 接口（已支持 list[dict] 多模态输入）
"""

import json
import re

from app.services.llm.base import BaseLLMProvider
from app.services.llm.glm_provider import (
    build_vision_message,
    image_to_data_url,
)


# 文件扩展名 → MIME 类型映射（供 API 层校验使用）
IMAGE_EXT_TO_MIME = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
}


# JD 图片分析 Prompt（复用 test_glm_image.py 已验证的提取项，增加 JSON 输出约束）
JD_IMAGE_PROMPT = """请读取这张职位描述截图，并提取：
1. 岗位名称
2. 岗位职责
3. 任职要求
4. 工作地点
5. 学历与经验要求
6. 岗位薪资范围

如果图片中没有对应信息，请返回"未识别到"。

请以合法 JSON 格式返回，不要包裹在 Markdown 代码块中，不要添加任何额外说明。

格式：
{
  "job_title": "string",
  "responsibilities": ["string"],
  "requirements": ["string"],
  "location": "string",
  "education_experience": "string",
  "salary_range": "string"
}"""


JD_TEXT_PROMPT = """请从下面的职位描述文本中提取：
1. 岗位名称
2. 岗位职责
3. 任职要求
4. 工作地点
5. 学历与经验要求
6. 岗位薪资范围

如果文本中没有对应信息，请返回"未识别到"。

请以合法 JSON 格式返回，不要包裹在 Markdown 代码块中，不要添加任何额外说明。

格式：
{{
  "job_title": "string",
  "responsibilities": ["string"],
  "requirements": ["string"],
  "location": "string",
  "education_experience": "string",
  "salary_range": "string"
}}

职位描述文本：
{jd_text}"""


def _strip_markdown_codeblock(text: str) -> str:
    """清理模型返回中可能出现的 Markdown 代码块标记。"""
    text = text.strip()
    # 匹配 ```json\n...\n``` 或 ```\n...\n```
    match = re.match(r"^```(?:json)?\s*\n?(.*?)\n?```$", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text


def _parse_jd_json(raw_content: str) -> dict | None:
    """解析模型返回的 JSON，失败时返回 None。"""
    cleaned = _strip_markdown_codeblock(raw_content)
    try:
        result = json.loads(cleaned)
        if isinstance(result, dict):
            return result
    except (json.JSONDecodeError, ValueError) as e:
        print(f"[JD Analyzer] JSON parse failed: {e}")
    return None


def _build_result(parsed: dict | None, raw_content: str) -> dict:
    """根据解析结果构建统一返回结构。JSON 解析失败时附带 raw_content 用于调试。"""
    if parsed is None:
        return {
            "job_title": "",
            "responsibilities": [],
            "requirements": [],
            "location": "",
            "education_experience": "",
            "salary_range": "",
            "raw_content": raw_content,
        }

    def _to_str_list(value) -> list[str]:
        if isinstance(value, list):
            return [str(item) for item in value]
        if isinstance(value, str) and value.strip():
            return [value.strip()]
        return []

    return {
        "job_title": str(parsed.get("job_title", "")),
        "responsibilities": _to_str_list(parsed.get("responsibilities")),
        "requirements": _to_str_list(parsed.get("requirements")),
        "location": str(parsed.get("location", "")),
        "education_experience": str(parsed.get("education_experience", "")),
        "salary_range": str(parsed.get("salary_range", "")),
    }


def analyze_jd_image(
    provider: BaseLLMProvider,
    image_bytes: bytes,
    mime_type: str,
    jd_text: str | None = None,
) -> dict:
    """
    分析 JD 图片（可选附加文本作为补充上下文）。

    Args:
        provider: 已路由好的 LLM Provider（视觉模型）
        image_bytes: 图片字节数据
        mime_type: 图片 MIME 类型（image/png、image/jpeg、image/webp）
        jd_text: 可选的补充文本说明，与图片一起发送给视觉模型

    Returns:
        结构化 JD 信息 dict
    """
    data_url = image_to_data_url(image_bytes, mime_type)

    # 构建多模态消息
    prompt = JD_IMAGE_PROMPT
    if jd_text and jd_text.strip():
        # 图片 + 文本：文本作为用户补充说明，不忽略任何一个
        prompt = f"{JD_IMAGE_PROMPT}\n\n用户补充说明：\n{jd_text.strip()}"

    messages = build_vision_message(prompt, data_url)

    print(
        f"[JD Analyzer] Calling vision provider with image "
        f"({len(image_bytes)} bytes), text attached: {bool(jd_text and jd_text.strip())}"
    )

    raw_content = provider.generate(messages)

    print(f"[JD Analyzer] Vision LLM response received ({len(raw_content)} chars)")

    return _build_result(_parse_jd_json(raw_content), raw_content)


def analyze_jd_text(provider: BaseLLMProvider, jd_text: str) -> dict:
    """分析 JD 纯文本，返回结构化结果。"""
    prompt = JD_TEXT_PROMPT.format(jd_text=jd_text)

    print(f"[JD Analyzer] Calling text provider with text ({len(jd_text)} chars)")

    raw_content = provider.generate(prompt)

    print(f"[JD Analyzer] Text LLM response received ({len(raw_content)} chars)")

    return _build_result(_parse_jd_json(raw_content), raw_content)
