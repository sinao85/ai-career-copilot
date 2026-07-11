const strengths = ["Product Strategy", "User Research", "AI Product Design"];
const gaps = ["Backend Development", "LLM API Integration", "AI Engineering"];
const suggestions = [
  "Highlight AI workflow experience",
  "Add measurable product impact",
  "Showcase technical collaboration",
];

export default function JDMatchPage() {
  return (
    <div className="flex justify-center min-h-screen px-6 py-16">
      <main className="flex flex-col max-w-xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-[#171717] dark:text-[#ededed]">
            AI Job Match Analysis
          </h1>
          <p className="mt-2 text-base text-[#6b6b6b] dark:text-[#9b9b9b]">
            See how your experience matches this opportunity.
          </p>
        </div>

        {/* Match Score */}
        <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-8 mb-6 text-center">
          <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-4">
            Match Score
          </p>
          <p className="text-5xl font-bold text-[#171717] dark:text-[#ededed] mb-2">
            82%
          </p>
          <p className="text-base font-medium text-green-600 dark:text-green-400">
            Strong Match
          </p>
        </div>

        {/* Strengths & Gaps */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Strengths */}
          <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-5">
            <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-3">
              Matching Strengths
            </p>
            <ul className="space-y-2">
              {strengths.map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-2 text-sm text-[#171717] dark:text-[#ededed]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Gaps */}
          <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-5">
            <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-3">
              Potential Gaps
            </p>
            <ul className="space-y-2">
              {gaps.map((g) => (
                <li
                  key={g}
                  className="flex items-center gap-2 text-sm text-[#171717] dark:text-[#ededed]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Suggestions */}
        <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-6 mb-12">
          <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-4">
            Optimization Suggestions
          </p>
          <ul className="space-y-3">
            {suggestions.map((s) => (
              <li
                key={s}
                className="flex items-start gap-3 text-sm text-[#171717] dark:text-[#ededed]"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#171717] dark:bg-[#ededed] flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <button className="w-full px-10 py-3.5 text-base font-medium text-white bg-[#171717] dark:bg-[#ededed] dark:text-[#171717] rounded-lg hover:bg-[#333] dark:hover:bg-[#ccc] active:scale-98 transition cursor-pointer border-none">
          Generate Customized Resume
        </button>
      </main>
    </div>
  );
}
