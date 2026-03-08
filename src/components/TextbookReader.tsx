"use client";

import { useState, useRef } from "react";
import { ChapterContent, Level } from "@/types";
import RichText from "./RichText";
import PatternCard from "./PatternCard";

interface TextbookReaderProps {
  chapters: ChapterContent[];
  topic: string;
  level: Level;
  onGoToQuiz: () => void;
}

export default function TextbookReader({
  chapters,
  topic,
  level,
  onGoToQuiz,
}: TextbookReaderProps) {
  const [activeChapter, setActiveChapter] = useState(-1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const levelLabel =
    level === "beginner"
      ? "初心者向け"
      : level === "intermediate"
        ? "中級者向け"
        : "上級者向け";

  const isCover = activeChapter === -1;
  const [pdfLoading, setPdfLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;

      // PDF用のHTMLを構築
      const container = document.createElement("div");
      container.style.cssText = "font-family: 'Noto Sans JP', sans-serif; color: #1a1a2e; padding: 40px; max-width: 700px;";

      // 表紙
      container.innerHTML = `
        <div style="text-align: center; padding: 80px 20px; page-break-after: always;">
          <div style="font-size: 36px; font-weight: bold; font-family: 'Noto Serif JP', serif; margin-bottom: 16px;">${topic}</div>
          <div style="font-size: 16px; color: #8a8570; margin-bottom: 8px;">${levelLabel}</div>
          <div style="font-size: 14px; color: #8a8570;">全${chapters.length}章 ・ AI生成教科書</div>
          <div style="font-size: 12px; color: #8a8570; margin-top: 40px;">まなべーる で生成</div>
        </div>
      `;

      // 各章の内容
      for (const ch of chapters) {
        const chapterHtml = `
          <div style="page-break-before: always; padding-top: 20px;">
            <h1 style="font-size: 24px; font-weight: bold; font-family: 'Noto Serif JP', serif; margin-bottom: 20px; color: #c0392b;">${ch.title}</h1>
            <div style="font-size: 14px; line-height: 1.8; white-space: pre-wrap;">${ch.content}</div>
            ${ch.keyPoints.length > 0 ? `
              <div style="margin-top: 24px; padding: 16px; background: #faf8f0; border: 1px solid #e8e4d9; border-radius: 8px;">
                <div style="font-weight: bold; margin-bottom: 8px;">この章の要点</div>
                <ul style="margin: 0; padding-left: 20px;">
                  ${ch.keyPoints.map((p) => `<li style="margin-bottom: 4px; font-size: 13px;">${p}</li>`).join("")}
                </ul>
              </div>
            ` : ""}
          </div>
        `;
        container.innerHTML += chapterHtml;
      }

      await html2pdf()
        .set({
          margin: [15, 15, 15, 15],
          filename: `${topic}_教科書.pdf`,
          image: { type: "jpeg", quality: 0.95 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["css", "legacy"] },
        })
        .from(container)
        .save();
    } catch (error) {
      alert("PDF生成中にエラーが発生しました");
      console.error(error);
    } finally {
      setPdfLoading(false);
    }
  };

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
        <button
          onClick={() => {
            setActiveChapter(-1);
            setSidebarOpen(false);
          }}
          className="w-full text-left mb-4 mt-8 md:mt-0"
        >
          <h2 className={`text-lg font-bold font-serif mb-1 transition ${isCover ? "text-accent" : "text-dark hover:text-accent"}`}>
            {topic}
          </h2>
          <p className="text-xs text-sub">AI生成教科書</p>
        </button>

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
        <button
          onClick={handleDownloadPdf}
          disabled={pdfLoading}
          className="w-full mt-3 py-3 rounded-lg border border-border text-dark font-bold text-sm hover:border-accent hover:text-accent transition disabled:opacity-50"
        >
          {pdfLoading ? "PDF生成中..." : "PDF保存"}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-12 max-w-3xl mx-auto">
        {isCover ? (
          /* 表紙 */
          <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
            <div className="mb-8">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: "linear-gradient(135deg, #c0392b, #96281b)" }}
              >
                <span className="text-white text-3xl">📖</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-dark font-serif mb-4 leading-tight">
                {topic}
              </h1>
              <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold text-accent bg-accent/10 mb-6">
                {levelLabel}
              </div>
              <p className="text-sub text-sm max-w-md mx-auto mb-2">
                全{chapters.length}章 ・ AI生成教科書
              </p>
              <p className="text-sub/60 text-xs">
                まなべーる で生成
              </p>
            </div>

            <div className="w-full max-w-sm space-y-2 mt-4">
              <p className="text-xs text-sub mb-3 font-bold">目次</p>
              {chapters.map((ch, i) => (
                <button
                  key={i}
                  onClick={() => setActiveChapter(i)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-border hover:border-accent/40 transition text-left"
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white"
                    style={{ background: "#c0392b" }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-dark text-sm">{ch.title}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <button
                onClick={() => setActiveChapter(0)}
                className="px-8 py-3 rounded-lg text-white font-bold transition"
                style={{
                  background: "linear-gradient(135deg, #c0392b, #96281b)",
                }}
              >
                第1章から読む →
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={pdfLoading}
                className="px-8 py-3 rounded-lg border-2 border-border text-dark font-bold hover:border-accent hover:text-accent transition disabled:opacity-50"
              >
                {pdfLoading ? "PDF生成中..." : "PDFでダウンロード"}
              </button>
            </div>
          </div>
        ) : (
          /* 章の内容 */
          <>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: "#c0392b" }}
                >
                  {activeChapter + 1}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-dark font-serif">
                  {chapters[activeChapter].title}
                </h1>
              </div>
            </div>

            <RichText content={chapters[activeChapter].content} />

            {chapters[activeChapter].bestPractices.length > 0 && (
              <div className="mt-8">
                {chapters[activeChapter].bestPractices.map((bp, i) => (
                  <PatternCard
                    key={i}
                    title={bp.title}
                    description={bp.description}
                  />
                ))}
              </div>
            )}

            {chapters[activeChapter].keyPoints.length > 0 && (
              <div className="mt-8 p-5 bg-white rounded-lg border border-border">
                <h3 className="font-bold text-dark mb-3 font-serif">
                  📌 この章の要点
                </h3>
                <ul className="space-y-2">
                  {chapters[activeChapter].keyPoints.map((point, i) => (
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
                onClick={() => setActiveChapter(activeChapter === 0 ? -1 : activeChapter - 1)}
                className="px-4 py-2 rounded-lg border border-border text-dark text-sm hover:bg-border/30 transition"
              >
                ← {activeChapter === 0 ? "表紙" : "前の章"}
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
          </>
        )}
      </main>
    </div>
  );
}
