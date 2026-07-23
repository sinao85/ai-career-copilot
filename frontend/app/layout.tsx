import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ClientProvider from "@/components/ClientProvider";
import AppHeader from "@/components/AppHeader";
import StepperWrapper from "@/components/StepperWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Career Copilot",
  description: "AI-powered career assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <ClientProvider>
          <AppHeader />
          <StepperWrapper>{children}</StepperWrapper>
        </ClientProvider>
      </body>
    </html>
  );
}
