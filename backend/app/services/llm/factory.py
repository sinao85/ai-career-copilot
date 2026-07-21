import os

from .base import BaseLLMProvider
from .deepseek_provider import DeepSeekProvider
from .gemini_provider import GeminiProvider
from .glm_provider import GLMProvider


def get_llm_provider() -> BaseLLMProvider:
    provider = os.getenv("LLM_PROVIDER", "deepseek").lower().strip()
    print(f"[LLM Factory] Selected provider: {provider}")

    if provider == "deepseek":
        return DeepSeekProvider()

    if provider == "gemini":
        return GeminiProvider()

    if provider == "glm":
        return GLMProvider()

    raise ValueError(f"Unsupported provider: {provider}")


def get_provider_by_name(name: str) -> BaseLLMProvider:
    """根据名称返回 Provider 实例。用于 Router 内部调用。"""
    name = name.lower().strip()

    if name == "deepseek":
        return DeepSeekProvider()
    if name == "gemini":
        return GeminiProvider()
    if name == "glm":
        return GLMProvider()

    raise ValueError(f"Unsupported provider: {name}")
