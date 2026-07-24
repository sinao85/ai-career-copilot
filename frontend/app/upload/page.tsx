"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export default function UploadPage() {
  const { t } = useLanguage();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [workFiles, setWorkFiles] = useState<File[]>([]);
  const [isDraggingResume, setIsDraggingResume] = useState(false);
  const [isDraggingWork, setIsDraggingWork] = useState(false);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const workInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const isPDFOrDocx = (file: File) =>
    file.type === "application/pdf" ||
    file.name.endsWith(".docx") ||
    file.name.endsWith(".doc");

  const handleResumeFile = (selected: File | null) => {
    if (selected && isPDFOrDocx(selected)) {
      setResumeFile(selected);
    }
  };

  const handleWorkFiles = (files: File[]) => {
    const valid = files.filter(
      (f) =>
        f.type === "application/pdf" ||
        f.name.endsWith(".docx") ||
        f.name.endsWith(".doc") ||
        f.name.endsWith(".ppt") ||
        f.name.endsWith(".pptx") ||
        f.type === "text/plain"
    );
    if (valid.length > 0) {
      setWorkFiles((prev) => [...prev, ...valid]);
    }
  };

  const removeWorkFile = (index: number) => {
    setWorkFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContinue = async () => {
    if (!resumeFile || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const formData = new FormData();

      formData.append("resume", resumeFile);

      workFiles.forEach((file) => {
        formData.append("work_materials", file);
      });

      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error(
            "Resume file is too large. Please upload a file smaller than 10MB."
          );
        }
        throw new Error("Analysis failed. Please try again.");
      }

      const data: unknown = await response.json();

      sessionStorage.setItem(
        "careerAnalysisResult",
        JSON.stringify(data)
      );

      router.push("/analyze");
    } catch (error: unknown) {
      console.error("Resume analysis failed:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Resume analysis failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center px-6 py-8">
      <main className="flex flex-col items-center text-center max-w-2xl w-full">
        <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-[#171717] dark:text-[#ededed]">
          {t.upload.pageTitle}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#6b6b6b] dark:text-[#9b9b9b] max-w-lg">
          {t.upload.pageDescription}
        </p>

        {/* Resume Upload Section */}
        <div className="mt-8 w-full text-left">
          <p className="text-[13px] sm:text-sm font-semibold text-[#171717] dark:text-[#ededed] mb-1">
            {t.upload.resumeLabel} <span className="text-red-400">*</span>
          </p>
          <p className="text-xs sm:text-[13px] text-[#6b6b6b] dark:text-[#9b9b9b] mb-3">
            {t.upload.resumeHint}
          </p>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingResume(true);
            }}
            onDragLeave={() => setIsDraggingResume(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingResume(false);
              handleResumeFile(e.dataTransfer.files[0] ?? null);
            }}
            onClick={() => resumeInputRef.current?.click()}
            className={`w-full border-2 border-dashed rounded-xl py-8 px-6 min-h-[110px] cursor-pointer transition-colors ${
              isDraggingResume
                ? "border-[#171717] bg-[#f5f5f5] dark:border-[#ededed] dark:bg-[#1a1a1a]"
                : resumeFile
                  ? "border-green-300 bg-[#f7fdf7] dark:border-green-700 dark:bg-[#0f1a0f]"
                  : "border-[#d4d4d4] hover:border-[#a0a0a0] dark:border-[#404040] dark:hover:border-[#666]"
            }`}
          >
            {resumeFile ? (
              <div className="space-y-1 text-center">
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-base font-medium text-[#171717] dark:text-[#ededed] truncate max-w-[260px]">
                    {resumeFile.name}
                  </p>
                </div>
                <p className="text-sm text-[#6b6b6b] dark:text-[#9b9b9b]">
                  {(resumeFile.size / 1024).toFixed(0)} KB &middot; {t.upload.readyToAnalyze}
                </p>
                <p className="text-xs text-[#a0a0a0]">{t.upload.clickToChangeFile}</p>
              </div>
            ) : (
              <div className="space-y-1 text-center">
                <p className="text-base text-[#6b6b6b] dark:text-[#9b9b9b]">
                  {t.upload.resumeDropText}
                </p>
                <p className="text-sm text-[#a0a0a0]">
                  {t.upload.resumeBrowseText}
                </p>
              </div>
            )}
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={(e) => handleResumeFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
          </div>
        </div>

        {/* Work & Project Materials Section */}
        <div className="mt-6 w-full text-left">
          <p className="text-[13px] sm:text-sm font-semibold text-[#171717] dark:text-[#ededed] mb-1">
            {t.upload.workLabel}
          </p>
          <p className="text-xs sm:text-[13px] text-[#6b6b6b] dark:text-[#9b9b9b] mb-3">
            {t.upload.workHint}
          </p>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingWork(true);
            }}
            onDragLeave={() => setIsDraggingWork(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingWork(false);
              handleWorkFiles(Array.from(e.dataTransfer.files));
            }}
            onClick={() => workInputRef.current?.click()}
            className={`w-full border-2 border-dashed rounded-xl py-8 px-6 min-h-[110px] cursor-pointer transition-colors ${
              isDraggingWork
                ? "border-[#171717] bg-[#f5f5f5] dark:border-[#ededed] dark:bg-[#1a1a1a]"
                : workFiles.length > 0
                  ? "border-green-300 bg-[#f7fdf7] dark:border-green-700 dark:bg-[#0f1a0f]"
                  : "border-[#d4d4d4] hover:border-[#a0a0a0] dark:border-[#404040] dark:hover:border-[#666]"
            }`}
          >
            {workFiles.length > 0 ? (
              <div className="space-y-2 text-center">
                {workFiles.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 bg-white dark:bg-[#0a0a0a] rounded-lg px-4 py-2 border border-[#e5e5e5] dark:border-[#2a2a2a]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <svg
                        className="w-4 h-4 text-green-500 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-[#171717] dark:text-[#ededed] truncate">
                        {f.name}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeWorkFile(i);
                      }}
                      className="text-xs text-red-500 hover:text-red-600 flex-shrink-0 cursor-pointer"
                    >
                      {t.upload.remove}
                    </button>
                  </div>
                ))}
                <p className="text-xs text-[#a0a0a0] mt-2">
                  {t.upload.clickToAddMore}
                </p>
              </div>
            ) : (
              <div className="space-y-1 text-center">
                <p className="text-base text-[#6b6b6b] dark:text-[#9b9b9b]">
                  {t.upload.workDropText}
                </p>
                <p className="text-sm text-[#a0a0a0]">
                  {t.upload.workFormats}
                </p>
              </div>
            )}
            <input
              ref={workInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.ppt,.pptx,.txt,text/plain"
              multiple
              onChange={(e) =>
                handleWorkFiles(Array.from(e.target.files ?? []))
              }
              className="hidden"
            />
          </div>
          <p className="mt-2 text-xs text-[#a0a0a0]">{t.upload.optional}</p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <p className="mt-3 text-sm text-red-500 dark:text-red-400">
            {errorMessage}
          </p>
        )}

        {/* Continue button */}
        <button
          disabled={!resumeFile || isSubmitting}
          onClick={handleContinue}
          className={`mt-6 px-10 py-3 text-base font-medium rounded-lg transition border-none w-full ${
            resumeFile && !isSubmitting
              ? "text-white bg-[#171717] hover:bg-[#333] dark:bg-[#ededed] dark:text-[#171717] dark:hover:bg-[#ccc] active:scale-98 cursor-pointer"
              : "text-[#a0a0a0] bg-[#e5e5e5] dark:text-[#666] dark:bg-[#2a2a2a] cursor-not-allowed"
          }`}
        >
          {isSubmitting ? t.upload.analyzing : t.upload.continue}
        </button>
      </main>
    </div>
  );
}
