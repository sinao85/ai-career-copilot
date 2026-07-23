"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

type LoadStatus = "loading" | "ready" | "error";
type GenerateStatus = "idle" | "loading" | "success" | "error";

interface GenerateResult {
  customized_resume: string;
  customization_summary: string;
  key_changes: string[];
}

interface SessionData {
  resumeText: string;
  profile: unknown;
  jdText: string;
  jdMatchResult: unknown;
}

export default function CustomResumePage() {
  const router = useRouter();
  const [loadStatus, setLoadStatus] = useState<LoadStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [generateResult, setGenerateResult] = useState<GenerateResult | null>(null);
  const [generateStatus, setGenerateStatus] = useState<GenerateStatus>("idle");
  const [generateError, setGenerateError] = useState("");

  useEffect(() => {
    try {
      // 1. careerAnalysisResult：简历文本 + 职业画像
      const careerRaw = sessionStorage.getItem("careerAnalysisResult");
      if (!careerRaw) {
        throw new Error("缺少简历分析数据，请先在首页上传简历并完成分析。");
      }
      const careerData = JSON.parse(careerRaw);
      const resumeText =
        typeof careerData.resume_text === "string" ? careerData.resume_text : "";
      if (!resumeText.trim()) {
        throw new Error("简历分析结果中缺少简历文本，请重新上传简历。");
      }

      // 2. jdText：目标职位描述
      const jdText = sessionStorage.getItem("jdText");
      if (!jdText || !jdText.trim()) {
        throw new Error("缺少目标职位描述（JD），请先完成 JD 匹配流程。");
      }

      // 3. jdMatchResult：职位匹配结果
      const matchRaw = sessionStorage.getItem("jdMatchResult");
      if (!matchRaw) {
        throw new Error("缺少职位匹配结果，请先完成 JD 匹配流程。");
      }
      const matchData = JSON.parse(matchRaw);

      setSessionData({
        resumeText,
        profile: careerData.profile,
        jdText,
        jdMatchResult: matchData,
      });
      setLoadStatus("ready");
    } catch (error) {
      setLoadStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "读取数据失败，请重试。"
      );
    }
  }, []);

  // sessionData 就绪后调用 /api/generate
  useEffect(() => {
    if (!sessionData) return;

    const fetchGenerate = async () => {
      setGenerateStatus("loading");
      try {
        const response = await fetch(`${API_BASE_URL}/api/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resume_text: sessionData.resumeText,
            jd_text: sessionData.jdText,
            career_profile: sessionData.profile,
            match_result: sessionData.jdMatchResult,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`生成失败 (${response.status}): ${errorText}`);
        }

        const data: GenerateResult = await response.json();
        setGenerateResult(data);
        setGenerateStatus("success");
      } catch (error) {
        setGenerateStatus("error");
        setGenerateError(
          error instanceof Error ? error.message : "生成失败，请重试。"
        );
      }
    };

    fetchGenerate();
  }, [sessionData]);

  /**
   * 将 customized_resume 文本按空行拆分为逻辑段落。
   */
  function parseResumeSections(text: string): string[] {
    return text
      .split(/\n{2,}/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  const buildResumeHtml = () => {
    const text = generateResult?.customized_resume || "";
    const sections = parseResumeSections(text);

    const sectionsHtml = sections
      .map((section, i) => {
        const lines = section.split("\n");
        const firstLine = lines[0].trim();
        const isSectionHeader =
          i > 0 &&
          /^[A-Z][A-Z\s/&]{2,}$/.test(firstLine) &&
          firstLine.length < 40;

        const body = isSectionHeader
          ? lines.slice(1).join("\n").trim()
          : section;

        const divider =
          i > 0
            ? '<div class="section-divider"></div>'
            : "";

        if (isSectionHeader) {
          return `${divider}<h3>${escapeHtml(firstLine)}</h3><p>${escapeHtml(body)}</p>`;
        }
        return `${divider}<p>${escapeHtml(section)}</p>`;
      })
      .join("\n");

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Customized Resume</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #171717; max-width: 800px; margin: 0 auto; padding: 48px 40px 60px; }
  p { font-size: 14px; line-height: 1.8; color: #444; white-space: pre-wrap; margin: 0; }
  h3 { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e5e5e5; padding-bottom: 6px; margin: 0 0 10px; }
  .section-divider { border-top: 1px solid #e5e5e5; margin: 24px 0; }
  .resume-footer { text-align: center; font-size: 11px; color: #999; margin-top: 48px; padding-top: 16px; border-top: 1px solid #e5e5e5; }
  @page { margin: 0; size: auto; }
  @media print {
    body { padding: 60px 40px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .resume-footer { position: fixed; bottom: 30px; left: 0; right: 0; margin-top: 0; border-top: 1px solid #e5e5e5; }
    @page { margin: 0; }
  }
</style></head>
<body>
  ${sectionsHtml}
  <div class="resume-footer">Generated by AI Career Copilot</div>
</body></html>`;
  };

  function escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const handleDownloadHTML = async () => {
    if (!generateResult) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/export/html`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customized_resume: generateResult.customized_resume,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "customized-resume.html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
      }
    } catch {
      // 后端不可用时，fallback 到客户端生成
    }

    // 客户端生成 HTML 并下载
    const html = buildResumeHtml();
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customized-resume.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const showComingSoon = () => {
    alert("Coming Soon");
  };

  return (
    <div className="flex justify-center min-h-screen px-6 py-16">
      <main className="flex flex-col w-full max-w-6xl">
        {/* Loading State */}
        {loadStatus === "loading" && (
          <div className="flex items-center justify-center gap-3 py-20">
            <div className="w-5 h-5 border-2 border-[#a0a0a0] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-[#6b6b6b] dark:text-[#9b9b9b]">
              正在读取数据...
            </span>
          </div>
        )}

        {/* Error State */}
        {loadStatus === "error" && (
          <div className="text-center py-20">
            <p className="text-sm text-red-500 dark:text-red-400 mb-6">
              {errorMessage}
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2.5 text-sm font-medium rounded-lg border border-[#d4d4d4] dark:border-[#404040] text-[#6b6b6b] dark:text-[#9b9b9b] hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a] transition cursor-pointer"
            >
              返回首页重新开始
            </button>
          </div>
        )}

        {/* Ready State */}
        {loadStatus === "ready" && (
          <>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-[#171717] dark:text-[#ededed]">
            Your Customized Resume
          </h1>
          <p className="mt-2 text-base text-[#6b6b6b] dark:text-[#9b9b9b]">
            Optimized for your target job
          </p>
        </div>

        {/* Generate Loading */}
        {generateStatus === "loading" && (
          <div className="flex items-center justify-center gap-3 py-12">
            <div className="w-5 h-5 border-2 border-[#a0a0a0] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-[#6b6b6b] dark:text-[#9b9b9b]">
              AI 正在生成定制简历...
            </span>
          </div>
        )}

        {/* Generate Error */}
        {generateStatus === "error" && (
          <div className="text-center py-12">
            <p className="text-sm text-red-500 dark:text-red-400 mb-4">
              {generateError}
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2.5 text-sm font-medium rounded-lg border border-[#d4d4d4] dark:border-[#404040] text-[#6b6b6b] dark:text-[#9b9b9b] hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a] transition cursor-pointer"
            >
              返回首页重新开始
            </button>
          </div>
        )}

        {/* Generate Success */}
        {generateStatus === "success" && generateResult && (
          <>
        {/* Three-column layout */}
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          {/* Left Column: AI Customization Reasoning */}
          <div className="lg:w-64 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-16">
              <h2 className="text-lg font-semibold text-[#171717] dark:text-[#ededed] mb-4">
                How AI Customized Your Resume
              </h2>

              <div className="space-y-5">
                <div>
                  <p className="text-sm font-medium text-[#171717] dark:text-[#ededed] mb-1.5">
                    Customization Summary
                  </p>
                  <p className="text-sm text-[#6b6b6b] dark:text-[#9b9b9b]">
                    {generateResult.customization_summary}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-[#171717] dark:text-[#ededed] mb-2">
                    Key Changes
                  </p>
                  <ul className="space-y-1.5">
                    {generateResult.key_changes.map((change, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-[#6b6b6b] dark:text-[#9b9b9b]"
                      >
                        <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column: Resume Preview */}
          <div className="flex-1 min-w-0">
            <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] bg-white dark:bg-[#0a0a0a] p-8 sm:p-10">
              {parseResumeSections(generateResult.customized_resume).map((section, i) => {
                const lines = section.split("\n");
                const firstLine = lines[0].trim();
                const isSectionHeader =
                  i > 0 &&
                  /^[A-Z][A-Z\s/&]{2,}$/.test(firstLine) &&
                  firstLine.length < 40;

                return (
                  <div
                    key={i}
                    className={
                      i > 0
                        ? "mt-5 pt-5 border-t border-[#e5e5e5] dark:border-[#2a2a2a]"
                        : ""
                    }
                  >
                    {isSectionHeader && (
                      <h3 className="text-xs font-semibold text-[#171717] dark:text-[#ededed] uppercase tracking-wider mb-2">
                        {firstLine}
                      </h3>
                    )}
                    <p className="text-sm leading-relaxed text-[#404040] dark:text-[#a0a0a0] whitespace-pre-wrap">
                      {isSectionHeader
                        ? lines.slice(1).join("\n").trim()
                        : section}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Export Resume */}
          <div className="lg:w-44 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-16 rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-5">
              <h3 className="text-sm font-semibold text-[#171717] dark:text-[#ededed] mb-4">
                Export Resume
              </h3>

              <div className="space-y-2.5">
                <button
                  onClick={handleDownloadHTML}
                  className="w-full px-4 py-2.5 text-sm font-medium rounded-lg border border-[#d4d4d4] dark:border-[#404040] text-[#171717] dark:text-[#ededed] hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a] transition cursor-pointer"
                >
                  Download HTML
                </button>

                <button
                  onClick={showComingSoon}
                  className="w-full px-4 py-2.5 text-sm font-medium rounded-lg border border-[#d4d4d4] dark:border-[#404040] text-[#6b6b6b] dark:text-[#9b9b9b] hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a] transition cursor-pointer"
                >
                  Download Word
                </button>

                <button
                  onClick={showComingSoon}
                  className="w-full px-4 py-2.5 text-sm font-medium rounded-lg border border-[#d4d4d4] dark:border-[#404040] text-[#6b6b6b] dark:text-[#9b9b9b] hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a] transition cursor-pointer"
                >
                  Download PDF
                </button>
              </div>

              <button
                onClick={() => router.push("/")}
                className="mt-5 w-full py-2 text-xs font-medium text-[#a0a0a0] hover:text-[#6b6b6b] dark:hover:text-[#9b9b9b] transition cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
          </>
        )}
          </>
        )}
      </main>
    </div>
  );
}
