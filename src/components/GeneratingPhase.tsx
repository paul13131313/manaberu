"use client";

import ProgressBar from "./ProgressBar";

interface GeneratingPhaseProps {
  currentChapter: number;
  totalChapters: number;
  chapterTitle: string;
  isGeneratingQuiz: boolean;
}

export default function GeneratingPhase({
  currentChapter,
  totalChapters,
  chapterTitle,
  isGeneratingQuiz,
}: GeneratingPhaseProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center animate-pulse"
            style={{ background: "linear-gradient(135deg, #c0392b, #e74c3c)" }}>
            <span className="text-white text-2xl">📖</span>
          </div>
          <h2 className="text-2xl font-bold text-dark font-serif mb-2">
            教科書を生成中
          </h2>
          <p className="text-sub">
            {isGeneratingQuiz
              ? "問題集を作成中..."
              : `第${currentChapter}章「${chapterTitle}」を執筆中...`}
          </p>
        </div>

        <ProgressBar current={currentChapter} total={totalChapters} />
      </div>
    </div>
  );
}
