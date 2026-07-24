"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import type { Language } from "@/i18n/translations";

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  const handleClick = (lang: Language) => {
    setLanguage(lang);
  };

  const handleKeyDown = (e: React.KeyboardEvent, lang: Language) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setLanguage(lang);
    }
  };

  return (
    <div
      className="flex items-center gap-1 text-[13px]"
      role="group"
      aria-label="Language switcher"
    >
      <button
        type="button"
        onClick={() => handleClick("zh")}
        onKeyDown={(e) => handleKeyDown(e, "zh")}
        className={`px-2 py-1 rounded transition-colors cursor-pointer ${
          language === "zh"
            ? "text-[#171717] dark:text-[#ededed] font-medium"
            : "text-[#b0b0b0] hover:text-[#6b6b6b] dark:hover:text-[#9b9b9b]"
        }`}
        aria-label="Switch to Chinese"
        aria-pressed={language === "zh"}
      >
        {t.common.chinese}
      </button>
      <span className="text-[#d0d0d0] select-none">|</span>
      <button
        type="button"
        onClick={() => handleClick("en")}
        onKeyDown={(e) => handleKeyDown(e, "en")}
        className={`px-2 py-1 rounded transition-colors cursor-pointer ${
          language === "en"
            ? "text-[#171717] dark:text-[#ededed] font-medium"
            : "text-[#b0b0b0] hover:text-[#6b6b6b] dark:hover:text-[#9b9b9b]"
        }`}
        aria-label="Switch to English"
        aria-pressed={language === "en"}
      >
        {t.common.english}
      </button>
    </div>
  );
}
