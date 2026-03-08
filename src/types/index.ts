export type Level = "beginner" | "intermediate" | "advanced";

export interface ChapterOutline {
  chapter: number;
  title: string;
  summary: string;
  sections: string[];
}

export interface ChapterContent {
  title: string;
  content: string;
  bestPractices: { title: string; description: string }[];
  keyPoints: string[];
}

export interface MultipleChoiceQuestion {
  id: number;
  type: "multiple_choice";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DescriptiveQuestion {
  id: number;
  type: "descriptive";
  question: string;
  sampleAnswer: string;
  explanation: string;
}

export type QuizQuestion = MultipleChoiceQuestion | DescriptiveQuestion;

export type Phase =
  | "input"
  | "toc-review"
  | "generating"
  | "textbook"
  | "quiz"
  | "results";
