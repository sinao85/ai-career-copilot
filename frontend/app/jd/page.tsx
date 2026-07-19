"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function JDPage() {
  const MAX_CHARS = 1500;
  const router = useRouter();
  const [jdText, setJdText] = useState("");
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const hasInput = useMemo(() => {
    return jdText.trim().length > 0 || screenshots.length > 0 || documents.length > 0;
  }, [jdText, screenshots, documents]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(
        (f) => f.type === "image/jpeg" || f.type === "image/png"
      );
      if (validFiles.length > 0) {
        setScreenshots((prev) => [...prev, ...validFiles]);
      }
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(
        (f) =>
          f.type === "application/pdf" ||
          f.name.endsWith(".docx") ||
          f.name.endsWith(".doc")
      );
      if (validFiles.length > 0) {
        setDocuments((prev) => [...prev, ...validFiles]);
      }
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (isSubmitting) return;

    // Coming soon: file upload modes
    if (documents.length > 0) {
      setErrorMessage("Document upload will be supported in the next version.");
      return;
    }
    if (screenshots.length > 0) {
      setErrorMessage("Screenshot parsing will be supported in the next version.");
      return;
    }

    if (!jdText.trim()) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const raw = sessionStorage.getItem("careerAnalysisResult");
      let resumeText = "";
      let careerProfile: unknown = null;

      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        const data = parsed as { profile: unknown; resume_text?: string };
        careerProfile = data.profile;
        resumeText = typeof data.resume_text === "string" ? data.resume_text : "";
      }

      const body: Record<string, unknown> = {
        jd_text: jdText,
        resume_text: resumeText,
      };

      if (careerProfile) {
        body.career_profile = careerProfile;
      }

      const response = await fetch("http://127.0.0.1:8000/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Match analysis failed (${response.status}): ${errorText}`
        );
      }

      const data: unknown = await response.json();
      sessionStorage.setItem("jdMatchResult", JSON.stringify(data));
      router.push("/jd-match");
    } catch (error: unknown) {
      console.error("Match analysis failed:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Match analysis failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen px-6 py-16">
      <main className="flex flex-col max-w-xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-[#171717] dark:text-[#ededed]">
            Target Job Description
          </h1>
          <p className="mt-2 text-base text-[#6b6b6b] dark:text-[#9b9b9b]">
            Paste job description or upload files to analyze
          </p>
          <p className="mt-1.5 text-sm text-[#a0a0a0]">
            Choose one input method: paste text, upload screenshot, or upload document.
          </p>
        </div>

        {/* Text Input */}
        <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-6 mb-6">
          <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-3">
            Paste Job Description
          </p>
          <textarea
            value={jdText}
            onChange={(e) => {
              const val = e.target.value;
              if (val.length <= MAX_CHARS) setJdText(val);
            }}
            maxLength={MAX_CHARS}
            placeholder="Paste job description text here..."
            className="w-full h-24 px-4 py-3 text-sm text-[#171717] dark:text-[#ededed] bg-[#fafafa] dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-lg resize-none focus:outline-none focus:border-[#171717] dark:focus:border-[#ededed]"
          />
          <p className="text-right text-xs text-[#a0a0a0] mt-1.5">
            {jdText.length} / {MAX_CHARS}
          </p>
        </div>

        {/* Secondary Upload Options */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          {/* Image Upload */}
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
            multiple
          />
          <label
            htmlFor="image-upload"
            className={`block rounded-xl border cursor-pointer p-4 text-center transition-colors min-h-52 ${screenshots.length > 0 ? "border-green-300 bg-[#f7fdf7] dark:border-green-700 dark:bg-[#0f1a0f]" : "border-[#e5e5e5] hover:border-[#a0a0a0] dark:border-[#2a2a2a] dark:hover:border-[#666]"}`}
          >
            <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-3">
              Upload Screenshot
            </p>
            {screenshots.length > 0 ? (
              <div className="space-y-1.5">
                {screenshots.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 bg-white dark:bg-[#0a0a0a] rounded-lg px-3 py-1.5 border border-[#e5e5e5] dark:border-[#2a2a2a]"
                  >
                    <span className="text-xs font-medium text-[#171717] dark:text-[#ededed] truncate">
                      {file.name}
                    </span>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeScreenshot(index); }}
                      className="text-xs text-red-500 hover:text-red-600 flex-shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <p className="text-xs text-[#a0a0a0] mt-2">Click to add more</p>
              </div>
            ) : (
              <p className="text-xs text-[#6b6b6b] dark:text-[#9b9b9b]">
                Click to upload JPG / PNG
              </p>
            )}
          </label>

          {/* Document Upload */}
          <input
            type="file"
            accept=".pdf,.docx,.doc"
            onChange={handleDocumentUpload}
            className="hidden"
            id="document-upload"
            multiple
          />
          <label
            htmlFor="document-upload"
            className={`block rounded-xl border cursor-pointer p-4 text-center transition-colors min-h-52 ${documents.length > 0 ? "border-green-300 bg-[#f7fdf7] dark:border-green-700 dark:bg-[#0f1a0f]" : "border-[#e5e5e5] hover:border-[#a0a0a0] dark:border-[#2a2a2a] dark:hover:border-[#666]"}`}
          >
            <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-3">
              Upload Document
            </p>
            {documents.length > 0 ? (
              <div className="space-y-1.5">
                {documents.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 bg-white dark:bg-[#0a0a0a] rounded-lg px-3 py-1.5 border border-[#e5e5e5] dark:border-[#2a2a2a]"
                  >
                    <span className="text-xs font-medium text-[#171717] dark:text-[#ededed] truncate">
                      {file.name}
                    </span>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeDocument(index); }}
                      className="text-xs text-red-500 hover:text-red-600 flex-shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <p className="text-xs text-[#a0a0a0] mt-2">Click to add more</p>
              </div>
            ) : (
              <p className="text-xs text-[#6b6b6b] dark:text-[#9b9b9b]">
                Click to upload PDF / DOCX
              </p>
            )}
          </label>
        </div>

        {/* Error message */}
        {errorMessage && (
          <p className="mt-3 text-sm text-red-500 dark:text-red-400">
            {errorMessage}
          </p>
        )}

        {/* CTA */}
        <button
          disabled={!hasInput || isSubmitting}
          onClick={handleAnalyze}
          className={`w-full px-10 py-3.5 text-base font-medium rounded-lg transition cursor-pointer border-none ${
            hasInput && !isSubmitting
              ? "text-white bg-[#171717] dark:bg-[#ededed] dark:text-[#171717] hover:bg-[#333] dark:hover:bg-[#ccc] active:scale-98"
              : "text-[#a0a0a0] bg-[#f5f5f5] dark:bg-[#1a1a1a] cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Analyzing..." : "Analyze Job Match"}
        </button>
      </main>
    </div>
  );
}