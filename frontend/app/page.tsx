import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-56px)] px-6 sm:px-10 py-16">
      <main className="flex flex-col items-center text-center max-w-3xl w-full">
        <h1 className="text-[56px] sm:text-[72px] md:text-[80px] font-bold tracking-tight text-[#171717] leading-tight dark:text-[#ededed]">
          AI Career Copilot
        </h1>
        <p className="mt-8 text-2xl sm:text-3xl text-[#6b6b6b] dark:text-[#9b9b9b]">
          AI-powered career assistant
        </p>
        <p className="mt-4 text-xl text-[#8b8b8b] dark:text-[#9b9b9b]">
          Transform your resume into career intelligence.
        </p>

        <Link
          href="/upload"
          className="mt-14 px-14 py-5 text-xl font-semibold text-white bg-[#171717] dark:bg-[#ededed] dark:text-[#171717] rounded-lg hover:bg-[#333] dark:hover:bg-[#ccc] active:scale-98 transition inline-block max-sm:w-full max-sm:max-w-md"
        >
          Start Building Resume
        </Link>

        <p className="mt-6 text-lg text-[#a0a0a0]">
          Supports PDF / DOCX
        </p>
      </main>
    </div>
  );
}
