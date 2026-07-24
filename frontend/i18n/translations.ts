export type Language = "zh" | "en";

// ── Common ──

export interface CommonTranslations {
  productName: string;
  chinese: string;
  english: string;
}

// ── Steps ──

export interface StepTranslations {
  upload: string;
  profile: string;
  jd: string;
  match: string;
  customResume: string;
  stepIndicator: string;
}

// ── Upload ──

export interface UploadTranslations {
  pageTitle: string;
  pageDescription: string;
  resumeLabel: string;
  resumeHint: string;
  resumeDropText: string;
  resumeBrowseText: string;
  readyToAnalyze: string;
  clickToChangeFile: string;
  workLabel: string;
  workHint: string;
  workDropText: string;
  workFormats: string;
  optional: string;
  remove: string;
  clickToAddMore: string;
  continue: string;
  analyzing: string;
}

// ── Analyze ──

export interface AnalyzeTranslations {
  title: string;
  description: string;
  step1: string;
  step2: string;
  step3: string;
}

// ── Profile ──

export interface ProfileTranslations {
  title: string;
  subtitle: string;
  careerDirection: string;
  professionalSummary: string;
  keyStrengths: string;
  skills: string;
  loading: string;
  errorNoData: string;
  errorLoadFailed: string;
  uploadAgain: string;
  analyzeTargetJob: string;
}

// ── JD ──

export interface JDTranslations {
  title: string;
  subtitle1: string;
  subtitle2: string;
  pasteLabel: string;
  textPlaceholder: string;
  uploadScreenshot: string;
  uploadDocument: string;
  remove: string;
  clickToReplace: string;
  clickToUploadImage: string;
  clickToAddMore: string;
  clickToUploadDoc: string;
  analyzing: string;
  analyzeButton: string;
  resultTitle: string;
  fieldJobTitle: string;
  fieldResponsibilities: string;
  fieldRequirements: string;
  fieldLocation: string;
  fieldEducation: string;
  fieldSalary: string;
  fieldRawContent: string;
  unidentified: string;
  errorUnsupportedImage: string;
  errorDocumentComing: string;
  errorNoResumeContext: string;
  errorEmptyAnalysis: string;
  errorAnalysisFailed: string;
  loadingHintAnalyze: string;
  loadingHintMatch: string;
}

// ── Match ──

export interface MatchTranslations {
  title: string;
  subtitle: string;
  matchScore: string;
  analysisSummary: string;
  matchingStrengths: string;
  skillGaps: string;
  missingKeywords: string;
  recommendations: string;
  generateResume: string;
  loading: string;
  errorNoData: string;
  errorInvalidData: string;
  errorLoadFailed: string;
  enterJD: string;
  strongMatch: string;
  goodMatch: string;
  moderateMatch: string;
  lowMatch: string;
}

// ── Custom Resume ──

export interface CustomResumeTranslations {
  title: string;
  subtitle: string;
  loadingData: string;
  generating: string;
  howCustomized: string;
  customizationSummary: string;
  keyChanges: string;
  exportResume: string;
  downloadHTML: string;
  downloadWord: string;
  downloadPDF: string;
  backToHome: string;
  backToHomeRestart: string;
  comingSoon: string;
  errorNoResumeData: string;
  errorNoResumeText: string;
  errorNoJD: string;
  errorNoMatch: string;
  errorReadData: string;
  errorGenerateFailed: string;
}

// ── Home ──

export interface HomeTranslations {
  label: string;
  title: string;
  highlights: string[];
  cta: string;
  privacy: string;
}

// ── Master ──

export interface Translations {
  common: CommonTranslations;
  steps: StepTranslations;
  upload: UploadTranslations;
  analyze: AnalyzeTranslations;
  profile: ProfileTranslations;
  jd: JDTranslations;
  match: MatchTranslations;
  customResume: CustomResumeTranslations;
  home: HomeTranslations;
}

// ══════════════════════════════════════════════
//  Chinese
// ══════════════════════════════════════════════

const zh: Translations = {
  common: {
    productName: "AI Career Copilot",
    chinese: "中文",
    english: "EN",
  },
  steps: {
    upload: "上传材料",
    profile: "职业画像",
    jd: "目标岗位",
    match: "匹配分析",
    customResume: "定制简历",
    stepIndicator: "步骤",
  },
  upload: {
    pageTitle: "上传职业材料",
    pageDescription: "上传简历和工作材料，AI 将分析并生成你的职业画像。",
    resumeLabel: "简历",
    resumeHint: "上传你的简历（PDF / DOCX）",
    resumeDropText: "将简历拖放到这里",
    resumeBrowseText: "或点击选择文件",
    readyToAnalyze: "可以开始分析",
    clickToChangeFile: "点击更换文件",
    workLabel: "工作与项目材料",
    workHint: "上传 PRD、项目文档、报告、作品集或其他职业材料。",
    workDropText: "将工作材料拖放到这里",
    workFormats: "PDF / DOCX / PPT / TXT",
    optional: "可选",
    remove: "移除",
    clickToAddMore: "点击添加更多文件",
    continue: "继续",
    analyzing: "分析中...",
  },
  analyze: {
    title: "正在分析简历",
    description: "AI 正在处理你的简历，只需几秒钟。",
    step1: "提取工作经验",
    step2: "分析技能",
    step3: "生成职业画像",
  },
  profile: {
    title: "AI 职业画像",
    subtitle: "基于你的简历分析",
    careerDirection: "职业方向",
    professionalSummary: "专业概述",
    keyStrengths: "核心优势",
    skills: "技能",
    loading: "正在加载职业画像...",
    errorNoData: "未找到职业分析结果，请重新上传简历。",
    errorLoadFailed: "加载职业画像失败。",
    uploadAgain: "重新上传简历",
    analyzeTargetJob: "分析目标岗位",
  },
  jd: {
    title: "目标岗位描述",
    subtitle1: "粘贴岗位描述或上传文件进行分析",
    subtitle2: "选择一种输入方式：粘贴文本、上传截图或上传文档。",
    pasteLabel: "粘贴岗位描述",
    textPlaceholder: "在此粘贴岗位描述文本...",
    uploadScreenshot: "上传截图",
    uploadDocument: "上传文档",
    remove: "移除",
    clickToReplace: "点击更换",
    clickToUploadImage: "点击上传 PNG / JPG / WebP",
    clickToAddMore: "点击添加更多",
    clickToUploadDoc: "点击上传 PDF / DOCX",
    analyzing: "分析中...",
    analyzeButton: "分析岗位匹配度",
    resultTitle: "JD 分析结果",
    fieldJobTitle: "岗位名称",
    fieldResponsibilities: "岗位职责",
    fieldRequirements: "任职要求",
    fieldLocation: "工作地点",
    fieldEducation: "学历与经验要求",
    fieldSalary: "岗位薪资范围",
    fieldRawContent: "原始内容（调试）",
    unidentified: "未识别到",
    errorUnsupportedImage: "不支持的图片格式，请使用 PNG、JPG、JPEG 或 WebP。",
    errorDocumentComing: "文档上传功能将在下个版本支持。",
    errorNoResumeContext: "请先在首页上传简历并完成简历分析后，再进行 JD 匹配。",
    errorEmptyAnalysis: "JD 解析结果为空，请尝试更清晰的截图或补充文本说明。",
    errorAnalysisFailed: "分析失败，请重试。",
    loadingHintAnalyze: "正在识别职位信息，约需 10–30 秒",
    loadingHintMatch: "正在匹配简历与职位，请稍候...",
  },
  match: {
    title: "AI 岗位匹配分析",
    subtitle: "查看你的经验与这个岗位的匹配程度。",
    matchScore: "匹配分数",
    analysisSummary: "分析摘要",
    matchingStrengths: "匹配优势",
    skillGaps: "技能差距",
    missingKeywords: "缺失关键词",
    recommendations: "优化建议",
    generateResume: "生成定制简历",
    loading: "正在加载匹配分析...",
    errorNoData: "未找到匹配分析结果，请先输入岗位描述进行分析。",
    errorInvalidData: "匹配数据无效，请重新分析岗位描述。",
    errorLoadFailed: "加载匹配分析失败。",
    enterJD: "输入岗位描述",
    strongMatch: "高度匹配",
    goodMatch: "良好匹配",
    moderateMatch: "中等匹配",
    lowMatch: "低匹配",
  },
  customResume: {
    title: "你的定制简历",
    subtitle: "针对目标岗位优化",
    loadingData: "正在读取数据...",
    generating: "AI 正在生成定制简历...",
    howCustomized: "AI 如何定制你的简历",
    customizationSummary: "定制摘要",
    keyChanges: "关键修改",
    exportResume: "导出简历",
    downloadHTML: "下载 HTML",
    downloadWord: "下载 Word",
    downloadPDF: "下载 PDF",
    backToHome: "返回首页",
    backToHomeRestart: "返回首页重新开始",
    comingSoon: "即将推出",
    errorNoResumeData: "缺少简历分析数据，请先在首页上传简历并完成分析。",
    errorNoResumeText: "简历分析结果中缺少简历文本，请重新上传简历。",
    errorNoJD: "缺少目标职位描述（JD），请先完成 JD 匹配流程。",
    errorNoMatch: "缺少职位匹配结果，请先完成 JD 匹配流程。",
    errorReadData: "读取数据失败，请重试。",
    errorGenerateFailed: "生成失败，请重试。",
  },
  home: {
    label: "AI Career Copilot",
    title: "让每一次求职，都更有方向",
    highlights: [
      "上传你的简历",
      "分析您的职业优势，形成职业画像",
      "分析目标岗位，发现你的潜力和差距",
      "打造更有竞争力的简历",
    ],
    cta: "开始构建我的职业方案",
    privacy: "本次您上传的文件和材料，仅用于分析，不会长期存储。",
  },
};

// ══════════════════════════════════════════════
//  English
// ══════════════════════════════════════════════

const en: Translations = {
  common: {
    productName: "AI Career Copilot",
    chinese: "中文",
    english: "EN",
  },
  steps: {
    upload: "Upload",
    profile: "Career Profile",
    jd: "Target Job",
    match: "Match Analysis",
    customResume: "Custom Resume",
    stepIndicator: "Step",
  },
  upload: {
    pageTitle: "Upload Your Career Materials",
    pageDescription:
      "Upload your resume and work materials. AI will analyze them to build your career profile.",
    resumeLabel: "Resume",
    resumeHint: "Upload your resume (PDF / DOCX)",
    resumeDropText: "Drag & drop your resume here",
    resumeBrowseText: "or click to browse files",
    readyToAnalyze: "Ready to analyze",
    clickToChangeFile: "Click to change file",
    workLabel: "Work & Project Materials",
    workHint:
      "Upload PRDs, project documents, reports, portfolios or other career materials.",
    workDropText: "Drag & drop work materials here",
    workFormats: "PDF / DOCX / PPT / TXT",
    optional: "Optional",
    remove: "Remove",
    clickToAddMore: "Click to add more files",
    continue: "Continue",
    analyzing: "Analyzing...",
  },
  analyze: {
    title: "Analyzing Your Resume",
    description: "Our AI is processing your resume. This will only take a few seconds.",
    step1: "Extracting experience",
    step2: "Analyzing skills",
    step3: "Creating career profile",
  },
  profile: {
    title: "Your AI Career Profile",
    subtitle: "Based on your resume analysis",
    careerDirection: "Career Direction",
    professionalSummary: "Professional Summary",
    keyStrengths: "Key Strengths",
    skills: "Skills",
    loading: "Loading your career profile...",
    errorNoData: "No career analysis found. Please upload your resume again.",
    errorLoadFailed: "Failed to load your career profile.",
    uploadAgain: "Upload Resume Again",
    analyzeTargetJob: "Analyze Target Job",
  },
  jd: {
    title: "Target Job Description",
    subtitle1: "Paste job description or upload files to analyze",
    subtitle2:
      "Choose one input method: paste text, upload screenshot, or upload document.",
    pasteLabel: "Paste Job Description",
    textPlaceholder: "Paste job description text here...",
    uploadScreenshot: "Upload Screenshot",
    uploadDocument: "Upload Document",
    remove: "Remove",
    clickToReplace: "Click to replace",
    clickToUploadImage: "Click to upload PNG / JPG / WebP",
    clickToAddMore: "Click to add more",
    clickToUploadDoc: "Click to upload PDF / DOCX",
    analyzing: "Analyzing...",
    analyzeButton: "Analyze Job Match",
    resultTitle: "JD Analysis Result",
    fieldJobTitle: "Job Title",
    fieldResponsibilities: "Responsibilities",
    fieldRequirements: "Requirements",
    fieldLocation: "Location",
    fieldEducation: "Education & Experience",
    fieldSalary: "Salary Range",
    fieldRawContent: "Raw Content (Debug)",
    unidentified: "Not identified",
    errorUnsupportedImage:
      "Unsupported image format. Please use PNG, JPG, JPEG, or WebP.",
    errorDocumentComing:
      "Document upload will be supported in the next version.",
    errorNoResumeContext:
      "Please upload your resume and complete the analysis on the homepage before JD matching.",
    errorEmptyAnalysis:
      "JD analysis result is empty. Please try a clearer screenshot or add supplementary text.",
    errorAnalysisFailed: "Analysis failed. Please try again.",
    loadingHintAnalyze: "Analyzing job description, about 10-30 seconds...",
    loadingHintMatch: "Matching resume with job, please wait...",
  },
  match: {
    title: "AI Job Match Analysis",
    subtitle: "See how your experience matches this opportunity.",
    matchScore: "Match Score",
    analysisSummary: "Analysis Summary",
    matchingStrengths: "Matching Strengths",
    skillGaps: "Skill Gaps",
    missingKeywords: "Missing Keywords",
    recommendations: "Recommendations",
    generateResume: "Generate Customized Resume",
    loading: "Loading match analysis...",
    errorNoData:
      "No match analysis found. Please enter a job description and analyze it first.",
    errorInvalidData:
      "Invalid match data. Please try analyzing the job description again.",
    errorLoadFailed: "Failed to load match analysis.",
    enterJD: "Enter Job Description",
    strongMatch: "Strong Match",
    goodMatch: "Good Match",
    moderateMatch: "Moderate Match",
    lowMatch: "Low Match",
  },
  customResume: {
    title: "Your Customized Resume",
    subtitle: "Optimized for your target job",
    loadingData: "Loading data...",
    generating: "AI is generating your customized resume...",
    howCustomized: "How AI Customized Your Resume",
    customizationSummary: "Customization Summary",
    keyChanges: "Key Changes",
    exportResume: "Export Resume",
    downloadHTML: "Download HTML",
    downloadWord: "Download Word",
    downloadPDF: "Download PDF",
    backToHome: "Back to Home",
    backToHomeRestart: "Back to Home & Restart",
    comingSoon: "Coming Soon",
    errorNoResumeData:
      "Missing resume analysis data. Please upload your resume on the homepage first.",
    errorNoResumeText:
      "Resume text is missing from the analysis result. Please re-upload your resume.",
    errorNoJD: "Missing job description. Please complete the JD matching flow first.",
    errorNoMatch: "Missing match result. Please complete the JD matching flow first.",
    errorReadData: "Failed to read data. Please try again.",
    errorGenerateFailed: "Generation failed. Please try again.",
  },
  home: {
    label: "AI Career Copilot",
    title: "Make every job application smarter",
    highlights: [
      "Upload your resume",
      "Analyze your strengths and build your career profile",
      "Analyze target roles to discover your potential and gaps",
      "Create a more competitive resume",
    ],
    cta: "Build My Application",
    privacy: "Your uploaded files and materials are only used for analysis and are not permanently stored.",
  },
};

export const translations: Record<Language, Translations> = { zh, en };
