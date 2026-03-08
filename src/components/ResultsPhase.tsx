"use client";

import { QuizQuestion, MultipleChoiceQuestion } from "@/types";

interface ResultsPhaseProps {
  questions: QuizQuestion[];
  answers: Record<number, number | string>;
  onBackToTextbook: () => void;
  onNewTextbook: () => void;
}

export default function ResultsPhase({
  questions,
  answers,
  onBackToTextbook,
  onNewTextbook,
}: ResultsPhaseProps) {
  const multipleChoice = questions.filter(
    (q): q is MultipleChoiceQuestion => q.type === "multiple_choice"
  );
  const descriptive = questions.filter((q) => q.type === "descriptive");

  const correctCount = multipleChoice.filter(
    (q) => answers[q.id] === q.correctIndex
  ).length;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Score card */}
        <div className="text-center mb-10 p-8 bg-white rounded-xl border border-border">
          <h2 className="text-2xl font-bold text-dark font-serif mb-4">
            採点結果
          </h2>
          <div className="text-5xl font-bold mb-2" style={{ color: "#c0392b" }}>
            {correctCount} / {multipleChoice.length}
          </div>
          <p className="text-sub">選択式の正答数</p>
        </div>

        {/* Multiple choice results */}
        <div className="mb-12">
          <h3 className="text-lg font-bold text-dark font-serif mb-6">
            選択式問題の結果
          </h3>
          <div className="space-y-6">
            {multipleChoice.map((q, qi) => {
              const userAnswer = answers[q.id] as number;
              const isCorrect = userAnswer === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-lg border-2 ${
                    isCorrect ? "border-green-400 bg-green-50" : "border-red-300 bg-red-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">
                      {isCorrect ? "⭕" : "❌"}
                    </span>
                    <span className="font-bold text-dark">
                      Q{qi + 1}. {q.question}
                    </span>
                  </div>
                  <div className="text-sm text-dark mb-1">
                    あなたの回答:{" "}
                    <span className={isCorrect ? "text-green-700" : "text-red-600"}>
                      {String.fromCharCode(65 + userAnswer)}. {q.options[userAnswer]}
                    </span>
                  </div>
                  {!isCorrect && (
                    <div className="text-sm text-green-700 mb-1">
                      正解: {String.fromCharCode(65 + q.correctIndex)}.{" "}
                      {q.options[q.correctIndex]}
                    </div>
                  )}
                  <div className="text-sm text-sub mt-2 p-3 bg-white/60 rounded">
                    💡 {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Descriptive results */}
        <div className="mb-12">
          <h3 className="text-lg font-bold text-dark font-serif mb-6">
            記述式問題の模範解答
          </h3>
          <div className="space-y-6">
            {descriptive.map((q, qi) => (
              <div
                key={q.id}
                className="p-5 bg-white rounded-lg border border-border"
              >
                <p className="font-bold text-dark mb-3">
                  Q{multipleChoice.length + qi + 1}. {q.question}
                </p>

                {answers[q.id] && (
                  <div className="mb-3 p-3 bg-bg rounded-lg">
                    <p className="text-xs text-sub mb-1">あなたの回答:</p>
                    <p className="text-dark text-sm">{answers[q.id]}</p>
                  </div>
                )}

                <div className="p-3 bg-accent/5 rounded-lg border-l-4" style={{ borderColor: "#c0392b" }}>
                  <p className="text-xs text-accent font-bold mb-1">
                    模範解答:
                  </p>
                  <p className="text-dark text-sm">
                    {q.type === "descriptive" && q.sampleAnswer}
                  </p>
                </div>

                <div className="mt-3 text-sm text-sub">
                  📝 採点のポイント: {q.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onBackToTextbook}
            className="flex-1 py-3 rounded-lg border-2 border-border text-dark font-bold hover:bg-border/30 transition"
          >
            教科書に戻る
          </button>
          <button
            onClick={onNewTextbook}
            className="flex-1 py-3 rounded-lg text-white font-bold transition"
            style={{
              background: "linear-gradient(135deg, #c0392b, #96281b)",
            }}
          >
            新しい教科書を作る
          </button>
        </div>
      </div>
    </div>
  );
}
