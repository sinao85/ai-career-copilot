import json
from app.models.career_profile import CareerProfile
from app.services.llm_client import call_llm


PROMPT_TEMPLATE = """你是一位资深职业规划顾问。请分析以下简历内容，生成职业画像。

要求：
- summary: 一段总结，包含职业背景、核心经验和关键亮点
- strengths: 3-5 个核心优势
- skills: 5-8 个关键技能
- career_direction: 推荐的职业发展方向

请以 JSON 格式返回：
{{
  "summary": "string",
  "strengths": ["string"],
  "skills": ["string"],
  "career_direction": "string"
}}

简历内容：
{resume_text}"""


def analyze_resume(text: str) -> CareerProfile:
    prompt = PROMPT_TEMPLATE.format(resume_text=text)

    response = call_llm(prompt)
    result = json.loads(response)

    return CareerProfile(
        summary=result["summary"],
        strengths=result["strengths"],
        skills=result["skills"],
        career_direction=result["career_direction"],
    )