"""
LLM 统一调用入口。

内部委托给 Provider 架构（llm/ 包），保持 call_llm() 兼容旧调用方。
"""

from app.services.llm import get_llm_provider


def call_llm(prompt: str) -> str:
    """
    调用 LLM，返回响应文本。

    使用 LLM_PROVIDER 环境变量选择 Provider，默认 deepseek。
    """
    provider = get_llm_provider()
    return provider.generate(prompt)
