export default function OptimizePage() {
  return (
    <div className="flex justify-center min-h-screen px-6 py-16">
      <main className="flex flex-col max-w-xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-[#171717] dark:text-[#ededed]">
            AI Resume Optimization
          </h1>
          <p className="mt-2 text-base text-[#6b6b6b] dark:text-[#9b9b9b]">
            Improve your resume with AI-powered suggestions
          </p>
        </div>

        {/* Experience Optimization */}
        <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-6 mb-6">
          <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-4">
            Experience Optimization
          </p>

          <div className="space-y-4">
            {/* Before */}
            <div className="rounded-lg bg-[#f9f9f9] dark:bg-[#1a1a1a] p-4">
              <p className="text-xs font-medium text-[#a0a0a0] uppercase tracking-wide mb-1">
                Before
              </p>
              <p className="text-sm text-[#171717] dark:text-[#ededed]">
                &ldquo;Responsible for product design&rdquo;
              </p>
            </div>

            {/* AI Suggestion */}
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 p-4">
              <p className="text-xs font-medium text-blue-500 uppercase tracking-wide mb-1">
                AI Suggestion
              </p>
              <p className="text-sm text-[#171717] dark:text-[#ededed]">
                Add measurable impact and business outcomes
              </p>
            </div>

            {/* After */}
            <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900 p-4">
              <p className="text-xs font-medium text-green-500 uppercase tracking-wide mb-1">
                After
              </p>
              <p className="text-sm text-[#171717] dark:text-[#ededed]">
                &ldquo;Led product strategy and improved user engagement&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Skills Enhancement */}
        <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-6 mb-12">
          <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-4">
            Skills Enhancement
          </p>

          <div className="mb-4">
            <p className="text-sm font-medium text-[#171717] dark:text-[#ededed] mb-2">
              Missing Skills
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800">
                AI Product Development
              </span>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800">
                Frontend Basics
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-[#171717] dark:text-[#ededed] mb-2">
              Recommendations
            </p>
            <div className="rounded-lg bg-[#f9f9f9] dark:bg-[#1a1a1a] p-4">
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-[#171717] dark:text-[#ededed]">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#171717] dark:bg-[#ededed] flex-shrink-0" />
                  Build projects with Next.js + AI APIs
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button className="w-full px-10 py-3.5 text-base font-medium text-white bg-[#171717] dark:bg-[#ededed] dark:text-[#171717] rounded-lg hover:bg-[#333] dark:hover:bg-[#ccc] active:scale-98 transition cursor-pointer border-none">
          Generate New Resume
        </button>
      </main>
    </div>
  );
}
