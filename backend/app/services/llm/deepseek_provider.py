import os

from dotenv import load_dotenv
from openai import OpenAI

from .base import BaseLLMProvider

load_dotenv()


SYSTEM_MESSAGE = (
    "You are a senior career advisor. "
    "Use the same language as the resume content provided by the user. "
    "Follow the output language specified in the user's instructions exactly."
)


class DeepSeekProvider(BaseLLMProvider):

    def __init__(self):
        self.client = OpenAI(
            api_key=os.getenv("LLM_API_KEY"),
            base_url=os.getenv("LLM_BASE_URL"),
        )

        self.model = os.getenv("LLM_MODEL", "deepseek-chat")
        self.temperature = float(os.getenv("LLM_TEMPERATURE", "0.7"))
        self.max_tokens = int(os.getenv("LLM_MAX_TOKENS", "2048"))

    def generate(
        self,
        prompt: str,
        system_message: str | None = None,
    ) -> str:
        messages: list[dict[str, str]] = []

        if system_message is None:
            system_message = SYSTEM_MESSAGE

        messages.append({"role": "system", "content": system_message})
        messages.append({"role": "user", "content": prompt})

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens,
            )
            return response.choices[0].message.content
        except Exception as e:
            raise RuntimeError(f"LLM API 调用失败: {e}") from e
