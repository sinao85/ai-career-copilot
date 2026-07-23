import json

from app.models.match_result import MatchResult, MatchRequest
from app.services.llm_client import call_llm


MATCH_PROMPT = """You are a senior career advisor and recruiter. Compare the resume/career profile against the job description below and evaluate how well they match.

Language rules:
- Detect the primary language of the Job Description.
- Write all JSON string values in the same language as the JD.
- If the JD is primarily Chinese, output in Chinese.
- If the JD is primarily English, output in English.
- Keep all JSON keys in English.

Analysis requirements:
- match_score: An integer from 0 to 100 representing the overall match percentage.
- summary: A concise paragraph explaining the overall fit between the candidate and the role.
- matched_strengths: 3-5 specific strengths from the candidate's background that directly match JD requirements.
- skill_gaps: 2-4 areas where the candidate lacks skills or experience mentioned in the JD.
- missing_keywords: 3-6 important keywords or qualifications from the JD that are absent from the resume.
- recommendations: 3-5 actionable suggestions to improve the match.

Return ONLY valid JSON. No Markdown code blocks. No extra text.

Format:
{{
  "match_score": 85,
  "summary": "string",
  "matched_strengths": ["string"],
  "skill_gaps": ["string"],
  "missing_keywords": ["string"],
  "recommendations": ["string"]
}}

Job Description:
{jd_text}

Resume / Career Profile:
{resume_info}
"""


def match_jd(request: MatchRequest) -> MatchResult:
    if not request.resume_text.strip():
        raise ValueError("Resume text is required.")
    if not request.jd_text.strip():
        raise ValueError("Job description text is required.")

    resume_info_parts = [f"Resume Text:\n{request.resume_text}"]

    if request.career_profile:
        profile = request.career_profile
        resume_info_parts.append(
            f"\nAI Career Profile:\n"
            f"Summary: {profile.summary}\n"
            f"Strengths: {', '.join(profile.strengths)}\n"
            f"Skills: {', '.join(profile.skills)}\n"
            f"Career Direction: {profile.career_direction}"
        )

    resume_info = "\n".join(resume_info_parts)

    prompt = MATCH_PROMPT.format(
        jd_text=request.jd_text,
        resume_info=resume_info,
    )

    response = call_llm(prompt)

    print(f"[Job Matcher] LLM response received ({len(response)} chars)")

    result = json.loads(response)

    return MatchResult(
        match_score=result["match_score"],
        summary=result["summary"],
        matched_strengths=result["matched_strengths"],
        skill_gaps=result["skill_gaps"],
        missing_keywords=result["missing_keywords"],
        recommendations=result["recommendations"],
    )
