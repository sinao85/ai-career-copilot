"""
最小真实图片测试脚本：验证 GLM-4.6V-Flash 的图片理解能力。

运行命令（在 backend/ 目录下执行）：
    uv run python test_glm_image.py

前置条件：
    1. backend/.env 已配置 GLM_API_KEY
    2. backend/test_files/test_jd.png 存在（职位描述截图）
"""

import sys
import time
from pathlib import Path

from app.services.llm.glm_provider import (
    GLMProvider,
    build_vision_message,
    image_to_data_url,
)

IMAGE_PATH = Path(__file__).parent / "test_files" / "test_jd.png"

PROMPT = """请读取这张职位描述截图，并提取：
1. 岗位名称
2. 岗位职责
3. 任职要求
4. 工作地点
5. 学历与经验要求

如果图片中没有对应信息，请返回'未识别到'。"""

# 文件扩展名 → MIME 类型映射
_EXT_TO_MIME = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
}


def main() -> None:
    # 1. 校验图片文件存在
    if not IMAGE_PATH.exists():
        print(f"[ERROR] 测试图片不存在：{IMAGE_PATH}")
        print("请将职位描述截图放置到 backend/test_files/test_jd.png 后重试。")
        sys.exit(1)

    ext = IMAGE_PATH.suffix.lower()
    mime_type = _EXT_TO_MIME.get(ext)
    if not mime_type:
        print(f"[ERROR] 不支持的图片格式：{ext}")
        sys.exit(1)

    # 2. 读取图片并转换为 Base64 data URL（复用已有工具）
    image_bytes = IMAGE_PATH.read_bytes()
    image_size = len(image_bytes)
    data_url = image_to_data_url(image_bytes, mime_type)

    # 3. 构建多模态 messages（复用已有工具）
    messages = build_vision_message(PROMPT, data_url)

    # 4. 初始化 Provider 并调用 generate（已支持 list[dict]）
    provider = GLMProvider()
    model_name = provider.model

    print("=" * 60)
    print("GLM-4.6V-Flash 图片理解测试")
    print("=" * 60)
    print(f"使用的模型: {model_name}")
    print(f"图片文件名: {IMAGE_PATH.name}")
    print(f"图片大小: {image_size} bytes ({image_size / 1024:.2f} KB)")
    print("-" * 60)
    print("正在调用模型，请稍候...")

    # 5. 计时调用
    start = time.time()
    try:
        response = provider.generate(messages)
    except Exception as e:
        elapsed = time.time() - start
        print(f"\n[ERROR] 调用失败（耗时 {elapsed:.2f}s）：{e}")
        sys.exit(1)
    elapsed = time.time() - start

    # 6. 打印结果（不打印 API Key 或完整 Base64）
    print("-" * 60)
    print(f"总耗时: {elapsed:.2f}s")
    print("-" * 60)
    print("模型返回内容：")
    print(response)
    print("=" * 60)


if __name__ == "__main__":
    main()
