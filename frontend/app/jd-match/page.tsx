"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface MatchResult {
  match_score: number;
  summary: string;
  matched_strengths: string[];
  skill_gaps: string[];
  missing_keywords: string[];
  recommendations: string[];
}

const scoreLabel = (score: number): string => {
  if (score >= 85) return "Strong Match";
  if (score >= 65) return "Good Match";
  if (score >= 45) return "Moderate Match";
  return "Low Match";
};

const scoreColor = (score: number): string => {
  if (score >= 85) return "text-green-600 dark:text-green-400";
  if (score >= 65) return "text-amber-600 dark:text-amber-400";
  return "text-red-500 dark:text-red-400";
};

export default function JDMatchPage() {
  const router = useRouter();
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("jdMatchResult");

      if (!raw) {
        setErrorMessage(
          "No match analysis found. Please enter a job description and analyze it first."
        );
        return;
      }

      const parsed: unknown = JSON.parse(raw);
      const data = parsed as MatchResult;

      if (
        typeof data?.match_score !== "number" ||
        !Array.isArray(data?.matched_strengths)
      ) {
        setErrorMessage("Invalid match data. Please try analyzing the job description again.");
        return;
      }

      setMatch(data);
    } catch (error: unknown) {
      console.error("Failed to parse match result:", error);
      setErrorMessage("Failed to load match analysis.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center px-6 py-8">
        <main className="flex flex-col items-center justify-center max-w-3xl w-full">
          <p className="text-lg text-[#6b6b6b] dark:text-[#9b9b9b]">
            Loading match analysis...
          </p>
        </main>
      </div>
    );
  }

  if (errorMessage || !match) {
    return (
      <div className="flex justify-center px-6 py-8">
        <main className="flex flex-col items-center text-center max-w-3xl w-full">
          <p className="text-base text-red-500 dark:text-red-400 mb-6">
            {errorMessage || "No match analysis found."}
          </p>
          <button
            onClick={() => router.push("/jd")}
            className="px-8 py-3 text-base font-medium rounded-lg transition border-none cursor-pointer text-white bg-[#171717] hover:bg-[#333] dark:bg-[#ededed] dark:text-[#171717] dark:hover:bg-[#ccc] active:scale-98"
          >
            Enter Job Description
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex justify-center px-6 py-8">
      <main className="flex flex-col max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-[#171717] dark:text-[#ededed]">
            AI Job Match Analysis
          </h1>
          <p className="mt-2 text-base text-[#6b6b6b] dark:text-[#9b9b9b]">
            See how your experience matches this opportunity.
          </p>
        </div>

        {/* Match Score */}
        <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-8 mb-6 text-center">
          <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-4">
            Match Score
          </p>
          <p className="text-5xl font-bold text-[#171717] dark:text-[#ededed] mb-2">
            {match.match_score}%
          </p>
          <p className={`text-base font-medium ${scoreColor(match.match_score)}`}>
            {scoreLabel(match.match_score)}
          </p>
        </div>

        {/* Match Summary */}
        <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-6 mb-6">
          <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-3">
            Analysis Summary
          </p>
          <p className="text-sm text-[#171717] dark:text-[#ededed] leading-relaxed">
            {match.summary}
          </p>
        </div>

        {/* Strengths & Gaps */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Strengths */}
          <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-5">
            <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-3">
              Matching Strengths
            </p>
            <ul className="space-y-2">
              {match.matched_strengths.map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-2 text-sm text-[#171717] dark:text-[#ededed]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Skill Gaps */}
          <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-5">
            <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-3">
              Skill Gaps
            </p>
            <ul className="space-y-2">
              {match.skill_gaps.map((g) => (
                <li
                  key={g}
                  className="flex items-center gap-2 text-sm text-[#171717] dark:text-[#ededed]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-6 mb-6">
          <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-4">
            Missing Keywords
          </p>
          <div className="flex flex-wrap gap-2">
            {match.missing_keywords.map((kw) => (
              <span
                key={kw}
                className="px-3 py-1 text-xs rounded-full border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-6 mb-12">
          <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-4">
            Recommendations
          </p>
          <ul className="space-y-3">
            {match.recommendations.map((r) => (
              <li
                key={r}
                className="flex items-start gap-3 text-sm text-[#171717] dark:text-[#ededed]"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#171717] dark:bg-[#ededed] flex-shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push("/custom-resume")}
          className="w-full px-10 py-3.5 text-base font-medium text-white bg-[#171717] dark:bg-[#ededed] dark:text-[#171717] rounded-lg hover:bg-[#333] dark:hover:bg-[#ccc] active:scale-98 transition cursor-pointer border-none"
        >
          Generate Customized Resume
        </button>
      </main>
    </div>
  );
}
