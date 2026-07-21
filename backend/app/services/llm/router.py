import os

from .base import BaseLLMProvider
from .factory import get_llm_provider, get_provider_by_name


def get_provider_for_input(
    has_image: bool = False,
    requires_vision: bool = False,
) -> BaseLLMProvider:
    """
    根据输入类型路由到合适的 LLM Provider。

    路由规则：
        - has_image=True 或 requires_vision=True → 视觉模型
        - 否则 → 文本模型

    环境变量：
        TEXT_LLM_PROVIDER   → 文本模型 Provider（默认 deepseek，回退读 LLM_PROVIDER）
        VISION_LLM_PROVIDER → 视觉模型 Provider（默认 glm）
    """
    if has_image or requires_vision:
        provider_name = os.getenv("VISION_LLM_PROVIDER", "glm")
        print(f"[LLM Router] Input type: image/vision")
    else:
        provider_name = os.getenv(
            "TEXT_LLM_PROVIDER",
            os.getenv("LLM_PROVIDER", "deepseek"),
        )
        print(f"[LLM Router] Input type: text")

    print(f"[LLM Router] Selected provider: {provider_name}")
    return get_provider_by_name(provider_name)
