import json

from app.models.customized_resume import (
    CustomizedResumeResult,
    ResumeGenerationRequest,
)
from app.services.llm_client import call_llm


RESUME_GENERATION_PROMPT = """You are a senior resume writer and career advisor.

Generate a customized resume based on the original resume and the target job description.

Language rules:
- Detect the primary language of the Job Description.
- Write all output string values in the same language as the Job Description.
- Keep all JSON keys in English.

Requirements:
- Preserve all factual information from the original resume.
- Do not invent companies, projects, dates, skills, achievements, or metrics.
- Reorganize and rewrite the resume to better match the target role.
- Prioritize experiences and skills that are relevant to the JD.
- Naturally include important JD keywords only when supported by the resume.
- Keep the resume professional, concise, and suitable for job applications.
- Return a complete customized resume, not only suggestions.

Return ONLY valid JSON. No Markdown code blocks. No extra text.

Format:
{{
  "customized_resume": "complete customized resume text",
  "customization_summary": "short explanation of the customization strategy",
  "key_changes": ["change 1", "change 2", "change 3"]
}}

Target Job Description:
{jd_text}

Original Resume:
{resume_text}

Career Profile:
{career_profile}

Match Analysis:
{match_result}
"""


def generate_customized_resume(
    request: ResumeGenerationRequest,
) -> CustomizedResumeResult:
    if not request.resume_text.strip():
        raise ValueError("Resume text is required.")

    if not request.jd_text.strip():
        raise ValueError("Job description text is required.")

    career_profile = (
        request.career_profile.model_dump_json()
        if request.career_profile
        else "Not provided"
    )

    match_result = (
        request.match_result.model_dump_json()
        if request.match_result
        else "Not provided"
    )

    prompt = RESUME_GENERATION_PROMPT.format(
        jd_text=request.jd_text,
        resume_text=request.resume_text,
        career_profile=career_profile,
        match_result=match_result,
    )

    response = call_llm(prompt)

    print("========== RESUME GENERATION RAW RESPONSE ==========")
    print(response)
    print("====================================================")

    result = json.loads(response)

    return CustomizedResumeResult(
        customized_resume=result["customized_resume"],
        customization_summary=result["customization_summary"],
        key_changes=result["key_changes"],
    )