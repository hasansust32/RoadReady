export type Language = "both" | "en" | "bn";

export interface Rule {
  title: string;
  explanation_en: string;
  explanation_bn: string;
}

export interface Question {
  id: string;
  rule_id: string;
  question_en: string;
  question_bn: string;
  options: string[];
  correct_index: number;
}

export interface WeekData {
  week: string;
  title: string;
  rules: Record<string, Rule>;
  questions: Question[];
}

export interface SavedProgress {
  learnedRules: string[];
  bookmarks: string[];
  mistakes: string[];
  attempts: number;
  correct: number;
  bestMock: number;
  completedSessions: number;
  streak: number;
  lastStudyDate: string;
  weekScores: Record<string, { correct: number; total: number }>;
}

export type ViewName =
  | "home"
  | "learn"
  | "practice"
  | "mock"
  | "numbers"
  | "vocabulary"
  | "hazard";
