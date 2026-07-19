import json

from app.models.career_profile import CareerProfile
from app.services.llm_client import call_llm


PROMPT_TEMPLATE = """You are a senior career advisor. Analyze the resume below and generate a career profile.

Language rules (CRITICAL — follow strictly):
- First, detect the primary language of the resume content by counting characters and complete sentences.
- If the resume is primarily Chinese, write all JSON string values (summary, strengths, skills, career_direction) in Chinese.
- If the resume is primarily English, write all JSON string values in English.
- If the resume is mixed Chinese and English, use the dominant language (the one with more running text and complete sentences).
- Do NOT use the language of these instructions to determine the output language. These instructions happen to be in English, but that is irrelevant.
- Do NOT mistake English technical terms (e.g. AI, LLM, FastAPI, Next.js, Python) inside a Chinese resume as evidence that the resume is English.
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

    prompt = PROMPT_TEMPLATE.format(
        resume_text=text
    )

    response = call_llm(prompt)

    print("========== LLM RAW RESPONSE ==========")
    print(response)
    print("======================================")

    result = json.loads(response)

    return CareerProfile(
        summary=result["summary"],
        strengths=result["strengths"],
        skills=result["skills"],
        career_direction=result["career_direction"],
    )