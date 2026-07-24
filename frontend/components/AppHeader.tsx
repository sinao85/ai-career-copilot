"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";

export default function AppHeader() {
  const { t } = useLanguage();

  return (
    <header className="w-full border-b border-[#e5e5e5] dark:border-[#2a2a2a] bg-white dark:bg-[#0a0a0a]">
      <div className="mx-auto px-6 h-[60px] flex items-center justify-between max-w-5xl">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold text-[#171717] dark:text-[#ededed] hover:text-[#6b6b6b] dark:hover:text-[#9b9b9b] transition-colors no-underline"
        >
          <Logo className="flex-shrink-0" />
          {t.common.productName}
        </Link>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
