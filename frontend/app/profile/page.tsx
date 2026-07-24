"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";

interface CareerProfile {
  summary: string;
  strengths: string[];
  skills: string[];
  career_direction: string;
}

interface CareerAnalysisResult {
  profile: CareerProfile;
  work_materials: unknown[];
}

export default function ProfilePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<CareerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("careerAnalysisResult");

      if (!raw) {
        setErrorMessage(
          t.profile.errorNoData
        );
        return;
      }

      const parsed: unknown = JSON.parse(raw);
      const data = parsed as CareerAnalysisResult;

      if (!data?.profile) {
        setErrorMessage(
          t.profile.errorNoData
        );
        return;
      }

      setProfile(data.profile);
    } catch (error: unknown) {
      console.error("Failed to parse career analysis result:", error);
      setErrorMessage(t.profile.errorLoadFailed);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center px-6 py-8">
        <main className="flex flex-col items-center justify-center max-w-3xl w-full">
          <p className="text-lg text-[#6b6b6b] dark:text-[#9b9b9b]">
            {t.profile.loading}
          </p>
        </main>
      </div>
    );
  }

  if (errorMessage || !profile) {
    return (
      <div className="flex justify-center px-6 py-8">
        <main className="flex flex-col items-center text-center max-w-3xl w-full">
          <p className="text-base text-red-500 dark:text-red-400 mb-6">
            {errorMessage || t.profile.errorNoData}
          </p>
          <button
            onClick={() => router.push("/upload")}
            className="px-8 py-3 text-base font-medium rounded-lg transition border-none cursor-pointer text-white bg-[#171717] hover:bg-[#333] dark:bg-[#ededed] dark:text-[#171717] dark:hover:bg-[#ccc] active:scale-98"
          >
            {t.profile.uploadAgain}
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
            {t.profile.title}
          </h1>
          <p className="mt-2 text-base text-[#6b6b6b] dark:text-[#9b9b9b]">
            {t.profile.subtitle}
          </p>
        </div>

        {/* Career Direction */}
        <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-6 mb-6">
          <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-1">
            {t.profile.careerDirection}
          </p>
          <p className="text-2xl font-bold text-[#171717] dark:text-[#ededed]">
            {profile.career_direction}
          </p>
        </div>

        {/* Professional Summary */}
        <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-6 mb-6">
          <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-3">
            {t.profile.professionalSummary}
          </p>
          <p className="text-sm text-[#171717] dark:text-[#ededed] leading-relaxed">
            {profile.summary}
          </p>
        </div>

        {/* Key Strengths (full width) */}
        <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-6 mb-6">
          <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-3">
            {t.profile.keyStrengths}
          </p>
          <ul className="space-y-2">
            {profile.strengths.map((s) => (
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

        {/* Skills */}
        <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-6 mb-12">
          <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-4">
            {t.profile.skills}
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 text-sm rounded-lg border border-[#e5e5e5] dark:border-[#404040] text-[#171717] dark:text-[#ededed] bg-white dark:bg-[#0a0a0a]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.push("/jd")}
          className="w-full px-10 py-3.5 text-base font-medium text-white bg-[#171717] dark:bg-[#ededed] dark:text-[#171717] rounded-lg hover:bg-[#333] dark:hover:bg-[#ccc] active:scale-98 transition cursor-pointer border-none"
        >
          {t.profile.analyzeTargetJob}
        </button>
      </main>
    </div>
  );
}
