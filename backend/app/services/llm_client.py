import os
from typing import Optional

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

class LLMConfig:
    def __init__(
        self,
        api_key: Optional[str] = None,
        model: Optional[str] = None,
        base_url: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2048,
    ):
        self.api_key = api_key or os.getenv("LLM_API_KEY", "")
        self.model = model or os.getenv("LLM_MODEL") or "deepseek-chat"
        self.base_url = base_url or os.getenv("LLM_BASE_URL")
        self.temperature = temperature
        self.max_tokens = max_tokens


def call_llm(prompt: str, config: Optional[LLMConfig] = None) -> str:
    """
    统一 LLM 调用入口。

    使用 OpenAI SDK 调用远程 LLM API，返回模型响应文本。
    """
    if config is None:
        config = LLMConfig()

    try:
        client = OpenAI(
            api_key=config.api_key,
            base_url=config.base_url,
        )

        response = client.chat.completions.create(
            model=config.model,
            messages=[
        {
            "role": "system",
            "content": "你是一名资深职业规划顾问，负责分析用户简历并输出结构化职业画像。"
        },
        {
            "role": "user",
            "content": prompt,
        }
    ],
            temperature=config.temperature,
            max_tokens=config.max_tokens,
        )

        return response.choices[0].message.content

    except Exception as e:
        raise RuntimeError(f"LLM API 调用失败: {e}") from e
