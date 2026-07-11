"use client";

import { useRouter } from "next/navigation";

const strengths = ["Product Strategy", "User Research", "AI Product Design"];
const opportunities = ["Frontend Development", "AI Engineering"];
const skills = [
  { name: "Product Management", value: 90 },
  { name: "AI Knowledge", value: 70 },
  { name: "Coding", value: 50 },
];

export default function ProfilePage() {
  const router = useRouter();
  return (
    <div className="flex justify-center min-h-screen px-6 py-16">
      <main className="flex flex-col max-w-xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-[#171717] dark:text-[#ededed]">
            Your AI Career Profile
          </h1>
          <p className="mt-2 text-base text-[#6b6b6b] dark:text-[#9b9b9b]">
            Based on your resume analysis
          </p>
        </div>

        {/* Career Direction */}
        <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-6 mb-6">
          <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-1">
            Career Direction
          </p>
          <p className="text-2xl font-bold text-[#171717] dark:text-[#ededed]">
            AI Product Manager
          </p>
        </div>

        {/* Key Strengths & Growth Opportunities */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-5">
            <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-3">
              Key Strengths
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

          <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-5">
            <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-3">
              Growth Opportunities
            </p>
            <ul className="space-y-2">
              {opportunities.map((o) => (
                <li
                  key={o}
                  className="flex items-center gap-2 text-sm text-[#171717] dark:text-[#ededed]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Skill Assessment */}
        <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-6 mb-12">
          <p className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wide mb-4">
            Skill Assessment
          </p>
          <div className="space-y-5">
            {skills.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium text-[#171717] dark:text-[#ededed]">
                    {skill.name}
                  </span>
                  <span className="text-sm text-[#a0a0a0]">{skill.value}%</span>
                </div>
                <div className="w-full h-2 bg-[#f0f0f0] dark:bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#171717] dark:bg-[#ededed] rounded-full transition-all duration-700"
                    style={{ width: `${skill.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.push("/jd")}
          className="w-full px-10 py-3.5 text-base font-medium text-white bg-[#171717] dark:bg-[#ededed] dark:text-[#171717] rounded-lg hover:bg-[#333] dark:hover:bg-[#ccc] active:scale-98 transition cursor-pointer border-none"
        >
          Analyze Target Job
        </button>
      </main>
    </div>
  );
}
