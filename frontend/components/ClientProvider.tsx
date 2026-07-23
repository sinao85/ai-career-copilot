"use client";

import { LanguageProvider } from "@/i18n/LanguageContext";
import type { ReactNode } from "react";

export default function ClientProvider({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
