"use client";

import { useState, useMemo } from "react";

export default function JDPage() {
  const MAX_CHARS = 1500;
  const [jdText, setJdText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const hasInput = useMemo(() => {
    return jdText.trim().length > 0 || imageFile !== null || documentFile !== null;
  }, [jdText, imageFile, documentFile]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFile(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const clearDocument = () => {
    setDocumentFile(null);
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
          />
          <label
            htmlFor="image-upload"
            className={`block rounded-xl border cursor-pointer p-4 text-center transition-colors ${imageFile ? "border-green-300 bg-[#f7fdf7] dark:border-green-700 dark:bg-[#0f1a0f]" : "border-[#e5e5e5] hover:border-[#a0a0a0] dark:border-[#2a2a2a] dark:hover:border-[#666]"}`}
          >
            <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-3">
              Upload Screenshot
            </p>
            {imageFile ? (
              <div>
                <div className="max-h-32 mx-auto mb-2">
                  <img
                    src={imagePreview}
                    alt="Uploaded screenshot"
                    className="max-h-full max-w-full rounded-lg object-contain"
                  />
                </div>
                <p className="text-xs font-medium text-[#171717] dark:text-[#ededed] mb-2 truncate">
                  {imageFile.name}
                </p>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); clearImage(); }}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
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
          />
          <label
            htmlFor="document-upload"
            className={`block rounded-xl border cursor-pointer p-4 text-center transition-colors ${documentFile ? "border-green-300 bg-[#f7fdf7] dark:border-green-700 dark:bg-[#0f1a0f]" : "border-[#e5e5e5] hover:border-[#a0a0a0] dark:border-[#2a2a2a] dark:hover:border-[#666]"}`}
          >
            <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-3">
              Upload Document
            </p>
            {documentFile ? (
              <div>
                <p className="text-xs font-medium text-[#171717] dark:text-[#ededed] mb-2 truncate">
                  {documentFile.name}
                </p>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); clearDocument(); }}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ) : (
              <p className="text-xs text-[#6b6b6b] dark:text-[#9b9b9b]">
                Click to upload PDF / DOCX
              </p>
            )}
          </label>
        </div>

        {/* CTA */}
        <button
          disabled={!hasInput}
          className={`w-full px-10 py-3.5 text-base font-medium rounded-lg transition cursor-pointer border-none ${hasInput ? "text-white bg-[#171717] dark:bg-[#ededed] dark:text-[#171717] hover:bg-[#333] dark:hover:bg-[#ccc] active:scale-98" : "text-[#a0a0a0] bg-[#f5f5f5] dark:bg-[#1a1a1a] cursor-not-allowed"}`}
        >
          Analyze Job Match
        </button>
      </main>
    </div>
  );
}
