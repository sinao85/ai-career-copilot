"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const u = t.home;

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-60px)] px-6">
      <main className="flex flex-col items-center text-center max-w-2xl w-full">
        {/* Subtle label */}
        <p className="text-sm text-[#a0a0a0]">{u.label}</p>

        {/* Main title */}
        <h1 className="mt-4 text-[36px] sm:text-[44px] md:text-[52px] font-bold tracking-tight text-[#171717] leading-[1.15] dark:text-[#ededed]">
          {u.title}
        </h1>

        {/* Highlights */}
        <ul className="mt-5 space-y-2 text-base sm:text-lg text-[#6b6b6b] dark:text-[#9b9b9b] max-w-[520px] leading-relaxed">
          {u.highlights.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-left">
              <span className="mt-0.5 flex-shrink-0 text-[#171717] dark:text-[#ededed] text-sm">&#10003;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Link
          href="/upload"
          className="mt-8 inline-flex items-center px-10 h-[48px] sm:h-[52px] text-base font-semibold text-white bg-[#171717] dark:bg-[#ededed] dark:text-[#171717] rounded-lg hover:bg-[#333] dark:hover:bg-[#ccc] active:scale-98 transition max-sm:w-full max-sm:justify-center max-sm:max-w-sm"
        >
          {u.cta}
        </Link>

        {/* Privacy notice */}
        <p className="mt-4 text-xs text-[#c0c0c0] max-w-[480px] leading-relaxed dark:text-[#666]">
          {u.privacy}
        </p>
      </main>
    </div>
  );
}
