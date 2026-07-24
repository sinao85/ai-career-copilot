"use client";

import { usePathname } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";

const STEPS = [
  { route: "/upload", key: "upload" as const },
  { route: "/analyze", key: "upload" as const },
  { route: "/profile", key: "profile" as const },
  { route: "/jd", key: "jd" as const },
  { route: "/jd-match", key: "match" as const },
  { route: "/custom-resume", key: "customResume" as const },
];

const STEP_KEYS = ["upload", "profile", "jd", "match", "customResume"] as const;

function getCurrentStep(pathname: string): number {
  for (let i = 0; i < STEPS.length; i++) {
    if (pathname.startsWith(STEPS[i].route)) {
      return i;
    }
  }
  return -1;
}

export default function ProgressStepper() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const stepIndex = getCurrentStep(pathname);
  if (stepIndex === -1) return null;

  // Map route index to step number (1-based)
  const currentStepNum =
    stepIndex === 0
      ? 1
      : stepIndex === 1
        ? 1
        : stepIndex === 2
          ? 2
          : stepIndex === 3
            ? 3
            : stepIndex === 4
              ? 4
              : 5;
  const totalSteps = 5;
  const currentStepKey = STEPS[stepIndex].key;

  return (
    <div className="w-full pt-6 pb-4">
      <div className="mx-auto px-6 max-w-xl">
        {/* Mobile */}
        <div className="sm:hidden">
          <div className="flex items-center gap-2 mb-2">
            {STEP_KEYS.map((key, idx) => (
              <div key={key} className="flex items-center flex-1 last:flex-[0_0_auto]">
                <div
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    idx < currentStepNum
                      ? "bg-[#171717] dark:bg-[#ededed]"
                      : idx === currentStepNum - 1
                        ? "bg-[#171717] dark:bg-[#ededed]"
                        : "border border-[#d0d0d0] bg-transparent"
                  }`}
                />
                {idx < STEP_KEYS.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-1 ${
                      idx < currentStepNum - 1
                        ? "bg-[#171717] dark:bg-[#ededed]"
                        : "bg-[#d0d0d0]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-[13px] text-[#171717] dark:text-[#ededed] font-medium">
            {t.steps.stepIndicator} {currentStepNum} / {totalSteps}
            {" · "}
            {t.steps[currentStepKey]}
          </p>
        </div>

        {/* Desktop */}
        <div className="hidden sm:flex items-center justify-center">
          {STEP_KEYS.map((key, idx) => {
            const stepNumber = idx + 1;
            const isCompleted = stepNumber < currentStepNum;
            const isCurrent = stepNumber === currentStepNum;

            return (
              <div key={key} className="flex items-center">
                {/* Dot */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium transition-colors ${
                      isCompleted
                        ? "bg-[#171717] dark:bg-[#ededed] text-white dark:text-[#171717]"
                        : isCurrent
                          ? "bg-[#171717] dark:bg-[#ededed] text-white dark:text-[#171717]"
                          : "border-2 border-[#d0d0d0] text-transparent"
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.5 6L5 8.5L9.5 3.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      stepNumber
                    )}
                  </div>
                  <span
                    className={`mt-1.5 text-[11px] whitespace-nowrap ${
                      isCurrent
                        ? "text-[#171717] dark:text-[#ededed] font-medium"
                        : "text-[#b0b0b0]"
                    }`}
                  >
                    {t.steps[key]}
                  </span>
                </div>

                {/* Connecting line (not after last) */}
                {idx < STEP_KEYS.length - 1 && (
                  <div
                    className={`w-16 sm:w-24 h-px mx-2 mb-5 ${
                      stepNumber < currentStepNum
                        ? "bg-[#171717] dark:bg-[#ededed]"
                        : "bg-[#d0d0d0]"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
