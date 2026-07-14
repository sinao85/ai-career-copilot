import os
import json
from typing import Optional


class LLMConfig:
    def __init__(
        self,
        api_key: Optional[str] = None,
        model: str = "Optional[str] = None",
        base_url: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2048,
    ):
        self.api_key = api_key or os.getenv("LLM_API_KEY", "")
        self.model = (
    model
    or os.getenv("LLM_MODEL")
    or "deepseek-chat"
)
        self.base_url = base_url or os.getenv("LLM_BASE_URL")
        self.temperature = temperature
        self.max_tokens = max_tokens


def call_llm(prompt: str, config: Optional[LLMConfig] = None) -> str:
    """
    统一 LLM 调用入口。

    当前返回 mock 响应，接入真实 API 时只需替换此函数实现。
    """
    if config is None:
        config = LLMConfig()

    return _mock_call(prompt, config)


def _mock_call(prompt: str, config: LLMConfig) -> str:
    preview = prompt.strip()[:120].replace("\n", " ")

    result = {
        "summary": f"[Mock LLM] 基于输入的分析结果。Prompt 长度: {len(prompt)} 字符。"
                   f"模型: {config.model}。输入预览: {preview}...",
        "strengths": [
            "专业领域经验丰富",
            "团队协作与沟通能力强",
            "具备数据驱动的分析能力",
        ],
        "skills": [
            "项目管理",
            "需求分析",
            "系统设计",
            "数据分析",
        ],
        "career_direction": "综合发展方向",
    }

    return json.dumps(result, ensure_ascii=False, indent=2)
