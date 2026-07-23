export type Language = "zh" | "en";

export interface CommonTranslations {
  productName: string;
  chinese: string;
  english: string;
}

export interface StepTranslations {
  upload: string;
  profile: string;
  jd: string;
  match: string;
  customResume: string;
  stepIndicator: string; // "Step X / Y"
}

export interface Translations {
  common: CommonTranslations;
  steps: StepTranslations;
}

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
};

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
};

export const translations: Record<Language, Translations> = { zh, en };
