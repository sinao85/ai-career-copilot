"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const steps = [
  { id: 1, label: "Extracting experience" },
  { id: 2, label: "Analyzing skills" },
  { id: 3, label: "Creating career profile" },
];

export default function AnalyzePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => setCurrentStep(i + 1), (i + 1) * 1200)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/profile");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen px-8">
      <main className="flex flex-col items-center text-center max-w-md w-full">
        <h1 className="text-3xl font-bold tracking-tight text-[#171717] dark:text-[#ededed]">
          Analyzing Your Resume
        </h1>
        <p className="mt-2 text-base text-[#6b6b6b] dark:text-[#9b9b9b]">
          Our AI is processing your resume. This will only take a few seconds.
        </p>

        {/* Spinner */}
        <div className="mt-10">
          <div className="w-10 h-10 border-[3px] border-[#e5e5e5] border-t-[#171717] dark:border-[#2a2a2a] dark:border-t-[#ededed] rounded-full animate-spin" />
        </div>

        {/* Steps */}
        <div className="mt-10 w-full space-y-4">
          {steps.map((step, i) => {
            const isActive = i < currentStep;
            const isCurrent = i === currentStep;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-colors duration-300 ${
                  isActive
                    ? "text-[#171717] dark:text-[#ededed]"
                    : isCurrent
                      ? "text-[#171717] dark:text-[#ededed]"
                      : "text-[#a0a0a0]"
                }`}
              >
                {/* Status icon */}
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                  {isActive ? (
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : isCurrent ? (
                    <div className="w-4 h-4 border-2 border-[#171717] dark:border-[#ededed] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-[#d4d4d4] dark:border-[#404040]" />
                  )}
                </div>

                <span className="text-sm font-medium">{step.label}</span>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
