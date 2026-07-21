from abc import ABC, abstractmethod
from typing import Union

# LLMInput = str 用于纯文本，list[dict] 用于多模态消息
LLMInput = Union[str, list[dict]]


class BaseLLMProvider(ABC):

    @abstractmethod
    def generate(
        self,
        input_data: LLMInput,
        system_message: str | None = None,
    ) -> str:
        """
        生成 LLM 响应。

        input_data:
            str  → 纯文本 prompt
            list[dict] → 多模态 messages（如 OpenAI vision 格式）

        不支持多模态的 Provider 应在收到 list[dict] 时抛出 RuntimeError。
        """
        pass
