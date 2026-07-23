"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function AppHeader() {
  const { t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-[#e5e5e5] dark:border-[#2a2a2a] bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-sm">
      <div className="mx-auto px-6 sm:px-10 h-[56px] flex items-center justify-between max-w-6xl">
        <Link
          href="/"
          className="text-lg sm:text-xl font-semibold text-[#171717] dark:text-[#ededed] hover:text-[#6b6b6b] dark:hover:text-[#9b9b9b] transition-colors no-underline"
        >
          {t.common.productName}
        </Link>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
