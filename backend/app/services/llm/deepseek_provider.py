import os
import time

from dotenv import load_dotenv
from openai import OpenAI

from .base import BaseLLMProvider, LLMInput

load_dotenv()

SYSTEM_MESSAGE = (
    "You are a senior career advisor. "
    "Use the same language as the resume content provided by the user. "
    "Follow the output language specified in the user's instructions exactly."
)

MAX_RETRIES = 3  # 1 initial + 2 retries
RETRY_BACKOFF_SECONDS = [2, 4]
USER_FRIENDLY_ERROR = "AI service temporarily unavailable. Please try again later."


class DeepSeekProvider(BaseLLMProvider):

    def __init__(self):
        self.client = OpenAI(
            api_key=os.getenv("LLM_API_KEY"),
            base_url=os.getenv("LLM_BASE_URL"),
            timeout=60.0,
        )

        self.model = os.getenv("LLM_MODEL", "deepseek-chat")
        self.temperature = float(os.getenv("LLM_TEMPERATURE", "0.7"))
        self.max_tokens = int(os.getenv("LLM_MAX_TOKENS", "2048"))

    def generate(
        self,
        input_data: LLMInput,
        system_message: str | None = None,
    ) -> str:
        if not isinstance(input_data, str):
            raise RuntimeError(
                "DeepSeekProvider does not support multimodal input. "
                "Use GLMProvider for vision tasks."
            )

        messages: list[dict[str, str]] = []

        if system_message is None:
            system_message = SYSTEM_MESSAGE

        messages.append({"role": "system", "content": system_message})
        messages.append({"role": "user", "content": input_data})

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

                if not _is_retryable(e):
                    print(
                        f"[DeepSeek Provider] Non-retryable error "
                        f"(HTTP {_extract_status_code(e)}): {e}"
                    )
                    break

                if attempt < MAX_RETRIES - 1:
                    wait = RETRY_BACKOFF_SECONDS[min(attempt, len(RETRY_BACKOFF_SECONDS) - 1)]
                    print(
                        f"[DeepSeek Provider] Retry {attempt + 1}/{MAX_RETRIES - 1} "
                        f"for model {self.model} (HTTP {_extract_status_code(e)}), "
                        f"waiting {wait}s..."
                    )
                    time.sleep(wait)

        # 重试耗尽或不可重试，返回统一用户友好提示
        print(f"[DeepSeek Provider] All retries exhausted or non-retryable: {last_error}")
        raise RuntimeError(USER_FRIENDLY_ERROR) from last_error


def _is_retryable(error: Exception) -> bool:
    """判断异常是否可重试（429、5xx、超时、连接错误）。"""
    status_code = _extract_status_code(error)

    # HTTP 429、5xx 可重试
    if status_code == 429 or (500 <= status_code < 600):
        return True

    # 400、401、403 不可重试
    if status_code in {400, 401, 403}:
        return False

    # 连接错误 / 超时可重试
    error_msg = str(error).lower()
    if "connection" in error_msg or "timeout" in error_msg:
        return True

    return False


def _extract_status_code(error: Exception) -> int:
    """从 OpenAI SDK 异常中提取 HTTP 状态码，提取失败返回 0。"""
    try:
        return int(getattr(error, "status_code", 0))
    except (TypeError, ValueError):
        return 0
