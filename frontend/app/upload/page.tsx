"use client";

import { useState, useRef, type DragEvent } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFile = (selected: File | null) => {
    if (selected && (selected.type === "application/pdf" || selected.name.endsWith(".docx") || selected.name.endsWith(".doc"))) {
      setFile(selected);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0] ?? null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null);
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-8">
      <main className="flex flex-col items-center text-center max-w-lg w-full">
        <h1 className="text-4xl font-bold tracking-tight text-[#171717] dark:text-[#ededed]">
          Upload Your Resume
        </h1>
        <p className="mt-2 text-base text-[#6b6b6b] dark:text-[#9b9b9b]">
          We support PDF and DOCX formats. Your resume will be analyzed by AI to generate your career profile.
        </p>

        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`mt-10 w-full border-2 border-dashed rounded-xl p-12 cursor-pointer transition-colors ${isDragging ? "border-[#171717] bg-[#f5f5f5] dark:border-[#ededed] dark:bg-[#1a1a1a]" : file ? "border-green-300 bg-[#f7fdf7] dark:border-green-700 dark:bg-[#0f1a0f]" : "border-[#d4d4d4] hover:border-[#a0a0a0] dark:border-[#404040] dark:hover:border-[#666]"}`}
        >
          {file ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-lg font-medium text-[#171717] dark:text-[#ededed] truncate max-w-[280px]">
                  {file.name}
                </p>
              </div>
              <p className="text-sm text-[#6b6b6b] dark:text-[#9b9b9b]">
                {(file.size / 1024).toFixed(0)} KB &middot; Upload successful
              </p>
              <p className="text-xs text-[#a0a0a0]">
                Click to change file
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-base text-[#6b6b6b] dark:text-[#9b9b9b]">
                Drag & drop your resume here
              </p>
              <p className="text-sm text-[#a0a0a0]">
                or click to browse files
              </p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.doc"
            onChange={handleChange}
            className="hidden"
          />
        </div>

        {/* Continue button */}
        <button
          disabled={!file}
          onClick={() => router.push("/analyze")}
          className={`mt-8 px-10 py-3.5 text-base font-medium rounded-lg transition border-none w-full max-w-80 ${file ? "text-white bg-[#171717] hover:bg-[#333] dark:bg-[#ededed] dark:text-[#171717] dark:hover:bg-[#ccc] active:scale-98 cursor-pointer" : "text-[#a0a0a0] bg-[#e5e5e5] dark:text-[#666] dark:bg-[#2a2a2a] cursor-not-allowed"}`}
        >
          Continue
        </button>
      </main>
    </div>
  );
}
