import json
import re

from app.models.career_profile import CareerProfile
from app.services.llm_client import call_llm


def detect_resume_language(text: str) -> str:
    """
    根据中文字符占比判断简历的主要语言。

    使用中文字符占比而非中英文字母字数，避免技术简历中大量
    英文术语（AI、LLM、FastAPI 等）导致误判。

    Returns:
        "Chinese" 或 "English"
    """
    chinese_chars = re.findall(r"[\u4e00-\u9fff]", text)
    chinese_count = len(chinese_chars)

    # 总非空字符数
    total_chars = len(re.sub(r"\s+", "", text))

    if total_chars == 0:
        return "English"

    chinese_ratio = chinese_count / total_chars

    # 中文字符占比超过 25% 判定为中文简历
    return "Chinese" if chinese_ratio > 0.25 else "English"


PROMPT_TEMPLATE = """You are a senior career advisor. Analyze the resume below and generate a career profile.

Language requirement (CRITICAL — follow strictly):

The required output language has already been determined by the application.

Required output language: {output_language}

- Write all JSON string values in {output_language}.
- Do not independently detect or change the output language.
- Do not translate into another language.
- Keep all JSON keys in English.

Output requirements:
- summary: A paragraph summarizing professional background, core experience, and key highlights.
- strengths: 3-5 core professional strengths.
- skills: 5-8 key skills.
- career_direction: A recommended career development direction.

Return ONLY valid JSON. Do NOT wrap it in Markdown code blocks. Do NOT add any explanatory text. Do NOT add extra fields.

Format:

{{
  "summary": "string",
  "strengths": ["string"],
  "skills": ["string"],
  "career_direction": "string"
}}

Resume content:
{resume_text}
"""


def analyze_resume(text: str) -> CareerProfile:
    output_language = detect_resume_language(text)

    print(f"[Career Analyzer] Detected output language: {output_language}")

    prompt = PROMPT_TEMPLATE.format(
        output_language=output_language,
        resume_text=text,
    )

    response = call_llm(prompt)

    print(f"[Career Analyzer] LLM response received ({len(response)} chars)")

    result = json.loads(response)

    return CareerProfile(
        summary=result["summary"],
        strengths=result["strengths"],
        skills=result["skills"],
        career_direction=result["career_direction"],
    )