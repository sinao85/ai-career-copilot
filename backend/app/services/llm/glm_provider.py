import base64
import os
import time

from dotenv import load_dotenv
from openai import OpenAI

from .base import BaseLLMProvider, LLMInput

load_dotenv()

# 重试配置
MAX_RETRIES = 3
RETRY_BACKOFF_SECONDS = [2, 4]  # 第 1、2 次重试等待秒数

# 不可重试的 HTTP 状态码
NON_RETRYABLE_STATUS_CODES = {400, 401, 403}

# 可重试的错误消息关键词
RETRYABLE_MESSAGE_KEYWORDS = [
    "当前请求量大",
    "当前访问量过大",
    "服务繁忙",
    "稍后再试",
    "rate limit",
    "rate exceeded",
    "too many requests",
]


class GLMProvider(BaseLLMProvider):
    """GLM-4.6V-Flash 多模态 Provider，支持文本和视觉输入。"""

    def __init__(self):
        api_key = os.getenv("GLM_API_KEY")
        if not api_key:
            raise RuntimeError(
                "GLM_API_KEY is not set. Please configure it in .env "
                "or set the environment variable."
            )

        base_url = os.getenv("GLM_BASE_URL", "https://open.bigmodel.cn/api/paas/v4/")

        self.client = OpenAI(
            api_key=api_key,
            base_url=base_url,
        )

        self.model = os.getenv("GLM_MODEL", "glm-4.6v-flash")
        self.temperature = float(os.getenv("LLM_TEMPERATURE", "0.3"))
        self.max_tokens = int(os.getenv("LLM_MAX_TOKENS", "2000"))

        print(f"[GLM Provider] Model: {self.model}")

    def generate(
        self,
        input_data: LLMInput,
        system_message: str | None = None,
    ) -> str:
        """
        生成 LLM 响应，带有限重试机制。

        - str → 纯文本调用
        - list[dict] → 多模态 messages（含图片）
        """
        messages = _build_messages(input_data, system_message)
        last_error: Exception | None = None

        for attempt in range(MAX_RETRIES):
            try:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=self.temperature,
                    max_tokens=self.max_tokens,
                )
                return response.choices[0].message.content

            except Exception as e:
                last_error = e

                if not is_retryable_error(e):
                    raise RuntimeError(f"GLM API 调用失败: {e}") from e

                if attempt < MAX_RETRIES - 1:
                    status_code = _extract_status_code(e)
                    wait = RETRY_BACKOFF_SECONDS[min(attempt, len(RETRY_BACKOFF_SECONDS) - 1)]
                    print(
                        f"[GLM Provider] Retry {attempt + 1}/{MAX_RETRIES - 1} "
                        f"for model {self.model} (HTTP {status_code}), "
                        f"waiting {wait}s..."
                    )
                    time.sleep(wait)

        # 所有重试耗尽
        raise RuntimeError("视觉模型当前繁忙，请稍后重试。") from last_error


def is_retryable_error(error: Exception) -> bool:
    """
    判断异常是否应该重试。

    可重试：429、502、503、504、网络超时、服务繁忙消息等。
    不可重试：400、401、403、模型不存在等。
    """
    status_code = _extract_status_code(error)

    # HTTP 429、5xx 可重试
    if status_code == 429 or (500 <= status_code < 600):
        return True

    # 明确不可重试的状态码
    if status_code in NON_RETRYABLE_STATUS_CODES:
        return False

    # 根据错误消息判断
    error_msg = str(error).lower()
    for keyword in RETRYABLE_MESSAGE_KEYWORDS:
        if keyword.lower() in error_msg:
            return True

    # 连接错误 / 超时可重试
    if "connection" in error_msg or "timeout" in error_msg:
        return True

    return False


def _extract_status_code(error: Exception) -> int:
    """从 OpenAI SDK 异常中提取 HTTP 状态码，提取失败返回 0。"""
    try:
        return int(getattr(error, "status_code", 0))
    except (TypeError, ValueError):
        return 0


def _build_messages(
    input_data: LLMInput,
    system_message: str | None = None,
) -> list[dict]:
    """根据输入类型构建 messages 列表。"""
    if isinstance(input_data, str):
        messages: list[dict] = []
        if system_message:
            messages.append({"role": "system", "content": system_message})
        messages.append({"role": "user", "content": input_data})
        return messages

    if isinstance(input_data, list):
        messages = list(input_data)
        if system_message:
            messages.insert(0, {"role": "system", "content": system_message})
        return messages

    raise TypeError(
        f"Unsupported input type: {type(input_data)}. "
        "Expected str or list[dict]."
    )


# ---- 工具函数（不变） ----


def image_to_data_url(file_bytes: bytes, mime_type: str) -> str:
    """
    将图片字节转换为 OpenAI-compatible data URL。

    Args:
        file_bytes: 图片字节数据
        mime_type: MIME 类型，如 "image/png", "image/jpeg"

    Returns:
        data:image/png;base64,... 格式的字符串

    Raises:
        ValueError: 不支持的 MIME 类型
    """
    supported = {"image/png", "image/jpeg", "image/jpg", "image/webp"}
    mime_type = mime_type.lower().strip()

    if mime_type not in supported:
        raise ValueError(
            f"Unsupported image MIME type: '{mime_type}'. "
            f"Supported types: {', '.join(sorted(supported))}"
        )

    b64 = base64.b64encode(file_bytes).decode("utf-8")
    return f"data:{mime_type};base64,{b64}"


def build_vision_message(prompt: str, image_data_url: str) -> list[dict]:
    """
    构建单图片 + 文本的多模态消息。

    Args:
        prompt: 文本指令
        image_data_url: data:image/...;base64,... 格式的图片

    Returns:
        OpenAI-compatible 多模态 messages
    """
    return [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {
                    "type": "image_url",
                    "image_url": {"url": image_data_url},
                },
            ],
        }
    ]
