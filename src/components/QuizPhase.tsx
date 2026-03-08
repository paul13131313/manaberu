"use client";

import { useState } from "react";
import { QuizQuestion } from "@/types";

interface QuizPhaseProps {
  questions: QuizQuestion[];
  onSubmit: (answers: Record<number, number | string>) => void;
}

export default function QuizPhase({ questions, onSubmit }: QuizPhaseProps) {
  const [answers, setAnswers] = useState<Record<number, number | string>>({});

  const multipleChoice = questions.filter((q) => q.type === "multiple_choice");
  const descriptive = questions.filter((q) => q.type === "descriptive");

  const handleSelectAnswer = (questionId: number, optionIndex: number) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleTextAnswer = (questionId: number, text: string) => {
    setAnswers({ ...answers, [questionId]: text });
  };

  const allMultipleChoiceAnswered = multipleChoice.every(
    (q) => answers[q.id] !== undefined
  );

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-dark font-serif mb-2">
            問題集
          </h2>
          <p className="text-sub">
            選択式{multipleChoice.length}問 + 記述式{descriptive.length}問
          </p>
        </div>

        {/* Multiple choice */}
        <div className="mb-12">
          <h3 className="text-lg font-bold text-dark font-serif mb-6 flex items-center gap-2">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
              style={{ background: "#c0392b" }}
            >
              A
            </span>
            選択式問題
          </h3>

          <div className="space-y-8">
            {multipleChoice.map((q, qi) => (
              <div
                key={q.id}
                className="p-5 bg-white rounded-lg border border-border"
              >
                <p className="font-bold text-dark mb-4">
                  Q{qi + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.type === "multiple_choice" &&
                    q.options.map((option, oi) => (
                      <button
                        key={oi}
                        onClick={() => handleSelectAnswer(q.id, oi)}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition text-sm ${
                          answers[q.id] === oi
                            ? "border-accent bg-accent/5 text-dark"
                            : "border-border hover:border-sub text-dark"
                        }`}
                      >
                        <span className="font-bold mr-2">
                          {String.fromCharCode(65 + oi)}.
                        </span>
                        {option}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Descriptive */}
        <div className="mb-12">
          <h3 className="text-lg font-bold text-dark font-serif mb-6 flex items-center gap-2">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
              style={{ background: "#c0392b" }}
            >
              ✍
            </span>
            記述式問題
          </h3>

          <div className="space-y-8">
            {descriptive.map((q, qi) => (
              <div
                key={q.id}
                className="p-5 bg-white rounded-lg border border-border"
              >
                <p className="font-bold text-dark mb-4">
                  Q{multipleChoice.length + qi + 1}. {q.question}
                </p>
                <textarea
                  value={(answers[q.id] as string) || ""}
                  onChange={(e) => handleTextAnswer(q.id, e.target.value)}
                  placeholder="ここに回答を入力してください..."
                  className="w-full h-32 px-4 py-3 rounded-lg border border-border bg-bg text-dark placeholder-sub focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => onSubmit(answers)}
          disabled={!allMultipleChoiceAnswered}
          className="w-full py-3 rounded-lg text-white font-bold text-lg transition disabled:opacity-50"
          style={{
            background: "linear-gradient(135deg, #c0392b, #96281b)",
          }}
        >
          採点する
        </button>
      </div>
    </div>
  );
}
