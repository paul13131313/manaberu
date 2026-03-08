"use client";

import { useState } from "react";
import { ChapterContent } from "@/types";
import RichText from "./RichText";
import PatternCard from "./PatternCard";

interface TextbookReaderProps {
  chapters: ChapterContent[];
  topic: string;
  onGoToQuiz: () => void;
}

export default function TextbookReader({
  chapters,
  topic,
  onGoToQuiz,
}: TextbookReaderProps) {
  const [activeChapter, setActiveChapter] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chapter = chapters[activeChapter];

  return (
    <div className="min-h-screen flex">
      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center md:hidden shadow-sm"
      >
        <span className="text-dark text-lg">{sidebarOpen ? "✕" : "☰"}</span>
      </button>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-white border-r border-border p-6 overflow-y-auto z-40 transition-transform md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-lg font-bold text-dark font-serif mb-1 mt-8 md:mt-0">
          {topic}
        </h2>
        <p className="text-xs text-sub mb-6">AI生成教科書</p>

        <nav className="space-y-1">
          {chapters.map((ch, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveChapter(i);
                setSidebarOpen(false);
              }}
              className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm ${
                activeChapter === i
                  ? "bg-accent/10 text-accent font-bold"
                  : "text-dark hover:bg-border/30"
              }`}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  background: activeChapter === i ? "#c0392b" : "#e8e4d9",
                  color: activeChapter === i ? "#fff" : "#8a8570",
                }}
              >
                {i + 1}
              </span>
              <span className="truncate">{ch.title}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={onGoToQuiz}
          className="w-full mt-8 py-3 rounded-lg text-white font-bold text-sm transition"
          style={{
            background: "linear-gradient(135deg, #c0392b, #96281b)",
          }}
        >
          問題を解く
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-12 max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ background: "#c0392b" }}
            >
              {activeChapter + 1}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-dark font-serif">
              {chapter.title}
            </h1>
          </div>
        </div>

        <RichText content={chapter.content} />

        {chapter.bestPractices.length > 0 && (
          <div className="mt-8">
            {chapter.bestPractices.map((bp, i) => (
              <PatternCard
                key={i}
                title={bp.title}
                description={bp.description}
              />
            ))}
          </div>
        )}

        {chapter.keyPoints.length > 0 && (
          <div className="mt-8 p-5 bg-white rounded-lg border border-border">
            <h3 className="font-bold text-dark mb-3 font-serif">
              📌 この章の要点
            </h3>
            <ul className="space-y-2">
              {chapter.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-dark text-sm">
                  <span className="text-accent mt-0.5">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Chapter navigation */}
        <div className="flex justify-between mt-12 pt-6 border-t border-border">
          <button
            onClick={() => setActiveChapter(Math.max(0, activeChapter - 1))}
            disabled={activeChapter === 0}
            className="px-4 py-2 rounded-lg border border-border text-dark text-sm hover:bg-border/30 transition disabled:opacity-30"
          >
            ← 前の章
          </button>
          <button
            onClick={() =>
              setActiveChapter(
                Math.min(chapters.length - 1, activeChapter + 1)
              )
            }
            disabled={activeChapter === chapters.length - 1}
            className="px-4 py-2 rounded-lg border border-border text-dark text-sm hover:bg-border/30 transition disabled:opacity-30"
          >
            次の章 →
          </button>
        </div>
      </main>
    </div>
  );
}
