export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen px-8">
      <main className="flex flex-col items-center text-center max-w-lg w-full">
        <h1 className="text-5xl font-bold tracking-tight text-[#171717] leading-tight dark:text-[#ededed]">
          AI Career Copilot
        </h1>
        <p className="mt-3 text-lg text-[#8b8b8b]">
          AI-powered career assistant
        </p>
        <p className="mt-1 text-base text-[#6b6b6b] dark:text-[#9b9b9b]">
          Transform your resume into career intelligence.
        </p>

        <button className="mt-12 px-10 py-3.5 text-base font-medium text-white bg-[#171717] dark:bg-[#ededed] dark:text-[#171717] rounded-lg hover:bg-[#333] dark:hover:bg-[#ccc] active:scale-98 transition cursor-pointer border-none max-sm:w-full max-sm:max-w-80">
          Upload Resume
        </button>

        <p className="mt-4 text-[13px] text-[#b0b0b0]">
          Supports PDF / DOCX
        </p>
      </main>
    </div>
  );
}
