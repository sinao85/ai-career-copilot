"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

type Status = "idle" | "loading" | "success" | "error";

interface JDAnalysisData {
  job_title: string;
  responsibilities: string[];
  requirements: string[];
  location: string;
  education_experience: string;
  salary_range: string;
  raw_content?: string;
}

interface JDAnalysisResponse {
  input_type: string;
  provider: string;
  model: string;
  data: JDAnalysisData;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * 将 JD 解析结果拼装为完整 JD 文本，供 /api/match 使用。
 * 用户的补充说明（userText）也会一并拼入，参与匹配。
 */
function buildJDTextFromResult(
  data: JDAnalysisData,
  userText?: string
): string {
  const parts: string[] = [];

  if (data.job_title && data.job_title !== "未识别到") {
    parts.push(`岗位名称：${data.job_title}`);
  }
  if (data.responsibilities.length > 0) {
    parts.push(
      `岗位职责：\n${data.responsibilities
        .map((r, i) => `${i + 1}. ${r}`)
        .join("\n")}`
    );
  }
  if (data.requirements.length > 0) {
    parts.push(
      `任职要求：\n${data.requirements
        .map((r, i) => `${i + 1}. ${r}`)
        .join("\n")}`
    );
  }
  if (data.location && data.location !== "未识别到") {
    parts.push(`工作地点：${data.location}`);
  }
  if (
    data.education_experience &&
    data.education_experience !== "未识别到"
  ) {
    parts.push(`学历与经验要求：${data.education_experience}`);
  }
  if (data.salary_range && data.salary_range !== "未识别到") {
    parts.push(`岗位薪资范围：${data.salary_range}`);
  }
  if (userText && userText.trim()) {
    parts.push(`补充说明：${userText.trim()}`);
  }

  // 兜底：如果结构化字段全空但有 raw_content，直接用 raw_content
  if (parts.length === 0 && data.raw_content) {
    return data.raw_content;
  }

  return parts.join("\n\n");
}

interface ResumeContext {
  resumeText: string;
  careerProfile: unknown;
}

/**
 * 从 sessionStorage 读取简历分析结果，没有则返回 null。
 */
function loadResumeContext(): ResumeContext | null {
  const raw = sessionStorage.getItem("careerAnalysisResult");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as {
      profile: unknown;
      resume_text?: string;
    };
    const resumeText =
      typeof parsed.resume_text === "string" ? parsed.resume_text : "";
    // 必须有 resume_text 才算有效上下文
    if (!resumeText.trim()) return null;
    return { resumeText, careerProfile: parsed.profile };
  } catch {
    return null;
  }
}

export default function JDPage() {
  const MAX_CHARS = 1500;
  const router = useRouter();
  const [jdText, setJdText] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [documents, setDocuments] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingHint, setLoadingHint] = useState(
    "正在识别职位信息，约需 10–30 秒"
  );
  const [result, setResult] = useState<JDAnalysisData | null>(null);
  const [resultMeta, setResultMeta] = useState<{
    provider: string;
    model: string;
    input_type: string;
  } | null>(null);

  const hasInput = useMemo(() => {
    return (
      jdText.trim().length > 0 ||
      screenshot !== null ||
      documents.length > 0
    );
  }, [jdText, screenshot, documents]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const validTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ];
      if (validTypes.includes(file.type)) {
        setScreenshot(file);
        setStatus("idle");
        setErrorMessage("");
        setResult(null);
        setResultMeta(null);
      } else {
        setErrorMessage(
          "Unsupported image format. Please use PNG, JPG, JPEG, or WebP."
        );
      }
    }
    // 重置 input 以便重复选择同一文件
    e.target.value = "";
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

  const removeScreenshot = () => {
    setScreenshot(null);
    setStatus("idle");
    setErrorMessage("");
    setResult(null);
    setResultMeta(null);
  };

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (status === "loading") return;

    // Document upload 仍是占位
    if (documents.length > 0) {
      setErrorMessage("Document upload will be supported in the next version.");
      return;
    }

    const hasImage = screenshot !== null;
    const hasText = jdText.trim().length > 0;

    if (!hasImage && !hasText) return;

    // 统一检查 resume 上下文（图片和文本流程都需要简历才能 match）
    const resumeCtx = loadResumeContext();
    if (!resumeCtx) {
      setErrorMessage(
        "请先在首页上传简历并完成简历分析后，再进行 JD 匹配。"
      );
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    setResult(null);
    setResultMeta(null);

    try {
      // ---- 第一步：确定 JD 文本 ----
      let finalJDText = "";

      if (hasImage) {
        // 图片流程：先调用 /api/jd/analyze 解析图片
        setLoadingHint("正在识别职位信息，约需 10–30 秒");

        const formData = new FormData();
        if (hasText) {
          // 补充说明随图片一起发给视觉模型
          formData.append("jd_text", jdText);
        }
        formData.append("jd_image", screenshot!);

        // 不手动设置 Content-Type，浏览器自动添加 multipart boundary
        const analyzeResponse = await fetch(`${BACKEND_URL}/api/jd/analyze`, {
          method: "POST",
          body: formData,
        });

        if (!analyzeResponse.ok) {
          const errorText = await analyzeResponse.text();
          throw new Error(
            `JD analysis failed (${analyzeResponse.status}): ${errorText}`
          );
        }

        const analyzeData: JDAnalysisResponse = await analyzeResponse.json();

        // 保存解析结果（兜底展示用）
        setResult(analyzeData.data);
        setResultMeta({
          provider: analyzeData.provider,
          model: analyzeData.model,
          input_type: analyzeData.input_type,
        });

        // 拼装 JD 文本（包含补充说明）用于 match
        finalJDText = buildJDTextFromResult(analyzeData.data, jdText);

        if (!finalJDText.trim()) {
          throw new Error(
            "JD 解析结果为空，请尝试更清晰的截图或补充文本说明。"
          );
        }
      } else {
        // 纯文本流程：直接使用用户输入
        finalJDText = jdText;
      }

      // ---- 第二步：调用 /api/match 进行匹配 ----
      setLoadingHint("正在匹配简历与职位，请稍候...");

      const body: Record<string, unknown> = {
        jd_text: finalJDText,
        resume_text: resumeCtx.resumeText,
      };

      if (resumeCtx.careerProfile) {
        body.career_profile = resumeCtx.careerProfile;
      }

      const matchResponse = await fetch(`${BACKEND_URL}/api/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!matchResponse.ok) {
        const errorText = await matchResponse.text();
        throw new Error(
          `Match analysis failed (${matchResponse.status}): ${errorText}`
        );
      }

      const matchData: unknown = await matchResponse.json();
      sessionStorage.setItem("jdMatchResult", JSON.stringify(matchData));
      sessionStorage.setItem("jdText", finalJDText);
      router.push("/jd-match");
    } catch (error: unknown) {
      console.error("JD match failed:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Analysis failed. Please try again."
      );
      setStatus("error");
    }
  };

  const isLoading = status === "loading";

  return (
    <div className="flex justify-center px-6 py-8">
      <main className="flex flex-col max-w-3xl w-full">
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
          {/* Image Upload - MVP 单张 */}
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.webp"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`block rounded-xl border cursor-pointer p-4 text-center transition-colors min-h-52 ${
              screenshot
                ? "border-green-300 bg-[#f7fdf7] dark:border-green-700 dark:bg-[#0f1a0f]"
                : "border-[#e5e5e5] hover:border-[#a0a0a0] dark:border-[#2a2a2a] dark:hover:border-[#666]"
            }`}
          >
            <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-3">
              Upload Screenshot
            </p>
            {screenshot ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 bg-white dark:bg-[#0a0a0a] rounded-lg px-3 py-1.5 border border-[#e5e5e5] dark:border-[#2a2a2a]">
                  <div className="flex flex-col items-start min-w-0">
                    <span className="text-xs font-medium text-[#171717] dark:text-[#ededed] truncate max-w-full">
                      {screenshot.name}
                    </span>
                    <span className="text-[10px] text-[#a0a0a0]">
                      {formatFileSize(screenshot.size)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeScreenshot();
                    }}
                    className="text-xs text-red-500 hover:text-red-600 flex-shrink-0"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-xs text-[#a0a0a0] mt-2">
                  Click to replace
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#6b6b6b] dark:text-[#9b9b9b]">
                Click to upload PNG / JPG / WebP
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
            className={`block rounded-xl border cursor-pointer p-4 text-center transition-colors min-h-52 ${
              documents.length > 0
                ? "border-green-300 bg-[#f7fdf7] dark:border-green-700 dark:bg-[#0f1a0f]"
                : "border-[#e5e5e5] hover:border-[#a0a0a0] dark:border-[#2a2a2a] dark:hover:border-[#666]"
            }`}
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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeDocument(index);
                      }}
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

        {/* Loading hint */}
        {isLoading && (
          <div className="mt-3 mb-3 flex items-center justify-center gap-2 text-sm text-[#6b6b6b] dark:text-[#9b9b9b]">
            <div className="w-4 h-4 border-2 border-[#a0a0a0] border-t-transparent rounded-full animate-spin" />
            <span>{loadingHint}</span>
          </div>
        )}

        {/* Error message */}
        {status === "error" && errorMessage && (
          <p className="mt-3 text-sm text-red-500 dark:text-red-400">
            {errorMessage}
          </p>
        )}

        {/* CTA */}
        <button
          disabled={!hasInput || isLoading}
          onClick={handleAnalyze}
          className={`w-full px-10 py-3.5 text-base font-medium rounded-lg transition cursor-pointer border-none ${
            hasInput && !isLoading
              ? "text-white bg-[#171717] dark:bg-[#ededed] dark:text-[#171717] hover:bg-[#333] dark:hover:bg-[#ccc] active:scale-98"
              : "text-[#a0a0a0] bg-[#f5f5f5] dark:bg-[#1a1a1a] cursor-not-allowed"
          }`}
        >
          {isLoading ? "Analyzing..." : "Analyze Job Match"}
        </button>

        {/* Success Result */}
        {status === "success" && result && (
          <div className="mt-8 rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-6 bg-[#fafafa] dark:bg-[#1a1a1a]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#171717] dark:text-[#ededed]">
                JD Analysis Result
              </h2>
              {resultMeta && (
                <span className="text-xs text-[#a0a0a0]">
                  {resultMeta.provider} · {resultMeta.model}
                </span>
              )}
            </div>

            <div className="space-y-4">
              {/* 岗位名称 */}
              <div>
                <p className="text-xs font-medium text-[#a0a0a0] uppercase tracking-wide mb-1">
                  岗位名称
                </p>
                <p className="text-sm text-[#171717] dark:text-[#ededed]">
                  {result.job_title || "未识别到"}
                </p>
              </div>

              {/* 岗位职责 */}
              <div>
                <p className="text-xs font-medium text-[#a0a0a0] uppercase tracking-wide mb-1">
                  岗位职责
                </p>
                {result.responsibilities.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {result.responsibilities.map((item, i) => (
                      <li
                        key={i}
                        className="text-sm text-[#171717] dark:text-[#ededed]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[#a0a0a0]">未识别到</p>
                )}
              </div>

              {/* 任职要求 */}
              <div>
                <p className="text-xs font-medium text-[#a0a0a0] uppercase tracking-wide mb-1">
                  任职要求
                </p>
                {result.requirements.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {result.requirements.map((item, i) => (
                      <li
                        key={i}
                        className="text-sm text-[#171717] dark:text-[#ededed]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[#a0a0a0]">未识别到</p>
                )}
              </div>

              {/* 工作地点 */}
              <div>
                <p className="text-xs font-medium text-[#a0a0a0] uppercase tracking-wide mb-1">
                  工作地点
                </p>
                <p className="text-sm text-[#171717] dark:text-[#ededed]">
                  {result.location || "未识别到"}
                </p>
              </div>

              {/* 学历与经验要求 */}
              <div>
                <p className="text-xs font-medium text-[#a0a0a0] uppercase tracking-wide mb-1">
                  学历与经验要求
                </p>
                <p className="text-sm text-[#171717] dark:text-[#ededed]">
                  {result.education_experience || "未识别到"}
                </p>
              </div>

              {/* 岗位薪资范围 */}
              <div>
                <p className="text-xs font-medium text-[#a0a0a0] uppercase tracking-wide mb-1">
                  岗位薪资范围
                </p>
                <p className="text-sm text-[#171717] dark:text-[#ededed]">
                  {result.salary_range || "未识别到"}
                </p>
              </div>

              {/* raw_content 调试信息（仅 JSON 解析失败时出现） */}
              {result.raw_content && (
                <div className="mt-4 pt-4 border-t border-[#e5e5e5] dark:border-[#2a2a2a]">
                  <p className="text-xs font-medium text-[#a0a0a0] uppercase tracking-wide mb-1">
                    Raw Content (debug)
                  </p>
                  <pre className="text-xs text-[#6b6b6b] dark:text-[#9b9b9b] bg-white dark:bg-[#0a0a0a] border border-[#e5e5e5] dark:border-[#2a2a2a] rounded-lg p-3 overflow-auto max-h-48 whitespace-pre-wrap">
                    {result.raw_content}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
