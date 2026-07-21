import os

from .deepseek_provider import DeepSeekProvider


def get_llm_provider():
    provider = os.getenv("LLM_PROVIDER", "deepseek")

    if provider == "deepseek":
        return DeepSeekProvider()

    raise ValueError(f"Unsupported provider: {provider}")
