"use client";

import { useRouter } from "next/navigation";

const personalInfo = {
  name: "Alex Chen",
  phone: "+86 138-0000-0000",
  email: "alex.chen@email.com",
  targetPosition: "AI Product Manager",
};

const education = {
  school: "Zhejiang University",
  degree: "Bachelor's Degree",
  major: "Computer Science",
  dates: "2018 - 2022",
};

const experiences = [
  {
    company: "HealthTech Co., Ltd.",
    position: "Product Manager",
    duration: "2023 - Present",
    achievements: [
      "Led product strategy for AI-powered health management platform serving 2M+ users",
      "Designed AI symptom checker workflow, reducing user diagnosis time by 40%",
      "Collaborated with ML engineers to integrate LLM-based medical Q&A feature",
    ],
  },
  {
    company: "TechStart Inc.",
    position: "Associate Product Manager",
    duration: "2022 - 2023",
    achievements: [
      "Managed user growth product line, improving monthly active users by 35%",
      "Conducted user research with 200+ participants to identify core pain points",
      "Launched A/B testing framework for product feature validation",
    ],
  },
];

const projects = [
  {
    name: "AI Health Assistant",
    role: "Product Lead",
    impact: "Reduced patient triage time by 50% through AI-powered pre-consultation",
  },
  {
    name: "Smart Recommendation Engine",
    role: "Product Designer",
    impact: "Increased content engagement by 28% via personalized recommendations",
  },
];

const productSkills = ["Product Strategy", "User Research", "A/B Testing", "Roadmap Planning"];
const aiSkills = ["LLM Application Design", "Prompt Engineering", "AI Workflow Design"];
const technicalSkills = ["SQL", "Python Basics", "Figma", "Jira"];

export default function CustomResumePage() {
  const router = useRouter();

  const buildResumeHtml = () => {
    const expHtml = experiences
      .map(
        (exp) => `
      <div style="margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
          <div>
            <p style="font-weight:600;margin:0;font-size:14px">${exp.position}</p>
            <p style="color:#666;margin:0;font-size:14px">${exp.company}</p>
          </div>
          <p style="color:#999;margin:0;font-size:13px;white-space:nowrap;margin-left:16px">${exp.duration}</p>
        </div>
        <ul style="margin:4px 0 0 0;padding-left:18px">
          ${exp.achievements.map((a) => `<li style="font-size:13px;color:#444;line-height:1.6">${a}</li>`).join("")}
        </ul>
      </div>`
      )
      .join("");

    const projHtml = projects
      .map(
        (proj) => `
      <div style="margin-bottom:12px">
        <p style="font-weight:600;margin:0;font-size:14px">${proj.name}</p>
        <p style="color:#666;margin:2px 0;font-size:13px"><b>Role:</b> ${proj.role}</p>
        <p style="color:#666;margin:2px 0;font-size:13px"><b>Impact:</b> ${proj.impact}</p>
      </div>`
      )
      .join("");

    const skillTags = (label: string, skills: string[]) =>
      `<div style="margin-bottom:8px"><span style="font-size:12px;color:#999">${label}</span><div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">${skills.map((s) => `<span style="padding:2px 8px;font-size:12px;background:#f5f5f5;border-radius:4px;color:#444">${s}</span>`).join("")}</div></div>`;

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Customized Resume - ${personalInfo.name}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #171717; max-width: 800px; margin: 0 auto; padding: 48px 40px 60px; }
  h2 { margin: 0 0 4px; font-size: 24px; }
  h3 { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e5e5e5; padding-bottom: 6px; margin: 24px 0 10px; }
  .resume-footer { text-align: center; font-size: 11px; color: #999; margin-top: 48px; padding-top: 16px; border-top: 1px solid #e5e5e5; }
  @page { margin: 0; size: auto; }
  @media print {
    body { padding: 60px 40px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .resume-footer { position: fixed; bottom: 30px; left: 0; right: 0; margin-top: 0; border-top: 1px solid #e5e5e5; }
    @page { margin: 0; }
  }
</style></head>
<body>
  <div style="border-bottom:1px solid #e5e5e5;padding-bottom:20px;margin-bottom:20px">
    <h2>${personalInfo.name}</h2>
    <p style="font-size:15px;color:#555;margin:4px 0 12px">${personalInfo.targetPosition}</p>
    <p style="font-size:13px;color:#888;margin:0">${personalInfo.phone}  |  ${personalInfo.email}</p>
  </div>

  <h3>Professional Summary</h3>
  <p style="font-size:13px;line-height:1.7;color:#444">Results-driven Product Manager with 3+ years of experience building AI-powered products. Proven track record of leading cross-functional teams to deliver user-centric solutions that drive engagement and business growth. Passionate about leveraging LLM technologies to solve real-world problems.</p>

  <h3>Education</h3>
  <div style="display:flex;justify-content:space-between;align-items:baseline">
    <div>
      <p style="font-weight:600;margin:0;font-size:14px">${education.school}</p>
      <p style="color:#666;margin:2px 0 0;font-size:13px">${education.degree} in ${education.major}</p>
    </div>
    <p style="color:#999;margin:0;font-size:13px;white-space:nowrap;margin-left:16px">${education.dates}</p>
  </div>

  <h3>Work Experience</h3>
  ${expHtml}

  <h3>Project Experience</h3>
  ${projHtml}

  <h3>Skills</h3>
  ${skillTags("Product", productSkills)}
  ${skillTags("AI", aiSkills)}
  ${skillTags("Technical", technicalSkills)}

  <div class="resume-footer">Generated by AI Career Copilot</div>
</body></html>`;
  };

  const handleDownloadWord = () => {
    const html = buildResumeHtml();
    const blob = new Blob([html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customized-resume.doc";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    const html = buildResumeHtml();
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="flex justify-center min-h-screen px-6 py-16">
      <main className="flex flex-col w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-[#171717] dark:text-[#ededed]">
            Your Customized Resume
          </h1>
          <p className="mt-2 text-base text-[#6b6b6b] dark:text-[#9b9b9b]">
            Optimized for your target job
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          {/* Left Column: AI Explanation */}
          <div className="lg:w-80 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-16">
              <h2 className="text-lg font-semibold text-[#171717] dark:text-[#ededed] mb-4">
                How AI Customized Your Resume
              </h2>

              <p className="text-sm text-[#6b6b6b] dark:text-[#9b9b9b] mb-6">
                Based on your resume, project experience, and target job description.
              </p>

              <div className="space-y-5">
                <div>
                  <p className="text-sm font-medium text-[#171717] dark:text-[#ededed] mb-1.5">
                    Highlighted AI product experience
                  </p>
                  <p className="text-sm text-[#6b6b6b] dark:text-[#9b9b9b]">
                    AI identified your AI Health Assistant and LLM integration work
                    as the most relevant to this position.
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-[#171717] dark:text-[#ededed] mb-1.5">
                    Reorganized project achievements
                  </p>
                  <p className="text-sm text-[#6b6b6b] dark:text-[#9b9b9b]">
                    Reordered bullet points to put measurable impact and AI-related
                    results first.
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-[#171717] dark:text-[#ededed] mb-1.5">
                    Improved skill alignment
                  </p>
                  <p className="text-sm text-[#6b6b6b] dark:text-[#9b9b9b]">
                    Skills are now grouped by Product, AI, and Technical categories
                    to match the job requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Resume Preview */}
          <div className="flex-1 min-w-0">
            <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] bg-white dark:bg-[#0a0a0a] p-8 sm:p-10">
              {/* Personal Information */}
              <div className="border-b border-[#e5e5e5] dark:border-[#2a2a2a] pb-6 mb-6">
                <h2 className="text-2xl font-bold text-[#171717] dark:text-[#ededed] tracking-tight mb-1">
                  {personalInfo.name}
                </h2>
                <p className="text-base font-medium text-[#404040] dark:text-[#a0a0a0] mb-4">
                  {personalInfo.targetPosition}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#6b6b6b] dark:text-[#9b9b9b]">
                  <span>{personalInfo.phone}</span>
                  <span>{personalInfo.email}</span>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#171717] dark:text-[#ededed] uppercase tracking-wider mb-2">
                  Professional Summary
                </h3>
                <p className="text-sm leading-relaxed text-[#404040] dark:text-[#a0a0a0]">
                  Results-driven Product Manager with 3+ years of experience building
                  AI-powered products. Proven track record of leading cross-functional
                  teams to deliver user-centric solutions that drive engagement and
                  business growth. Passionate about leveraging LLM technologies to
                  solve real-world problems.
                </p>
              </div>

              {/* Education */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#171717] dark:text-[#ededed] uppercase tracking-wider mb-2">
                  Education
                </h3>
                <div className="flex justify-between items-baseline">
                  <div>
                    <p className="text-sm font-medium text-[#171717] dark:text-[#ededed]">
                      {education.school}
                    </p>
                    <p className="text-sm text-[#6b6b6b] dark:text-[#9b9b9b]">
                      {education.degree} in {education.major}
                    </p>
                  </div>
                  <p className="text-sm text-[#a0a0a0] flex-shrink-0 ml-4">
                    {education.dates}
                  </p>
                </div>
              </div>

              {/* Work Experience */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#171717] dark:text-[#ededed] uppercase tracking-wider mb-3">
                  Work Experience
                </h3>
                <div className="space-y-5">
                  {experiences.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <div>
                          <p className="text-sm font-medium text-[#171717] dark:text-[#ededed]">
                            {exp.position}
                          </p>
                          <p className="text-sm text-[#6b6b6b] dark:text-[#9b9b9b]">
                            {exp.company}
                          </p>
                        </div>
                        <p className="text-sm text-[#a0a0a0] flex-shrink-0 ml-4">
                          {exp.duration}
                        </p>
                      </div>
                      <ul className="list-disc list-outside ml-4 space-y-0.5">
                        {exp.achievements.map((a, j) => (
                          <li
                            key={j}
                            className="text-sm text-[#404040] dark:text-[#a0a0a0] leading-relaxed"
                          >
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Experience */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#171717] dark:text-[#ededed] uppercase tracking-wider mb-3">
                  Project Experience
                </h3>
                <div className="space-y-4">
                  {projects.map((proj, i) => (
                    <div key={i}>
                      <p className="text-sm font-medium text-[#171717] dark:text-[#ededed]">
                        {proj.name}
                      </p>
                      <p className="text-sm text-[#6b6b6b] dark:text-[#9b9b9b]">
                        <span className="font-medium text-[#404040] dark:text-[#a0a0a0]">Role: </span>
                        {proj.role}
                      </p>
                      <p className="text-sm text-[#6b6b6b] dark:text-[#9b9b9b]">
                        <span className="font-medium text-[#404040] dark:text-[#a0a0a0]">Impact: </span>
                        {proj.impact}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-sm font-semibold text-[#171717] dark:text-[#ededed] uppercase tracking-wider mb-3">
                  Skills
                </h3>

                <div className="mb-3">
                  <p className="text-xs font-medium text-[#a0a0a0] mb-1.5">Product</p>
                  <div className="flex flex-wrap gap-1.5">
                    {productSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#f5f5f5] text-[#404040] dark:bg-[#1a1a1a] dark:text-[#a0a0a0]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs font-medium text-[#a0a0a0] mb-1.5">AI</p>
                  <div className="flex flex-wrap gap-1.5">
                    {aiSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#f5f5f5] text-[#404040] dark:bg-[#1a1a1a] dark:text-[#a0a0a0]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-[#a0a0a0] mb-1.5">Technical</p>
                  <div className="flex flex-wrap gap-1.5">
                    {technicalSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#f5f5f5] text-[#404040] dark:bg-[#1a1a1a] dark:text-[#a0a0a0]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="rounded-xl border border-[#e5e5e5] dark:border-[#2a2a2a] p-6">
          <h3 className="text-lg font-semibold text-[#171717] dark:text-[#ededed]">
            Download your customized resume
          </h3>
          <p className="mt-2 text-sm text-[#6b6b6b] dark:text-[#9b9b9b]">
            Choose format:
          </p>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleDownloadWord}
              className="flex flex-col items-start px-5 py-4 rounded-lg border border-[#d4d4d4] dark:border-[#404040] hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a] transition cursor-pointer">
              <span className="text-base font-medium text-[#171717] dark:text-[#ededed]">
                📄 Word
              </span>
              <span className="mt-1 text-sm text-[#6b6b6b] dark:text-[#9b9b9b]">
                Editable format
              </span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex flex-col items-start px-5 py-4 rounded-lg border border-[#d4d4d4] dark:border-[#404040] hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a] transition cursor-pointer">
              <span className="text-base font-medium text-[#171717] dark:text-[#ededed]">
                📑 PDF
              </span>
              <span className="mt-1 text-sm text-[#6b6b6b] dark:text-[#9b9b9b]">
                Ready to apply
              </span>
            </button>
          </div>

          <button
            onClick={() => router.push("/")}
            className="mt-4 w-full py-2.5 text-sm font-medium text-[#6b6b6b] dark:text-[#9b9b9b] hover:text-[#171717] dark:hover:text-[#ededed] transition cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}
