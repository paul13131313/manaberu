"use client";

import { useState } from "react";
import { ChapterOutline } from "@/types";

interface TocReviewProps {
  chapters: ChapterOutline[];
  onApprove: (chapters: ChapterOutline[]) => void;
  onBack: () => void;
  topic: string;
  level: string;
}

export default function TocReview({
  chapters: initialChapters,
  onApprove,
  onBack,
  topic,
  level,
}: TocReviewProps) {
  const [chapters, setChapters] = useState<ChapterOutline[]>(initialChapters);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    // Save chapters to sessionStorage for retrieval after payment
    sessionStorage.setItem(
      "manaberu_toc",
      JSON.stringify({ topic, level, chapters })
    );

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, level }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "決済URLの取得に失敗しました");
      }
    } catch (error) {
      alert(`エラー: ${error instanceof Error ? error.message : String(error)}`);
      setCheckoutLoading(false);
    }
  };

  const updateTitle = (index: number, title: string) => {
    const updated = [...chapters];
    updated[index] = { ...updated[index], title };
    setChapters(updated);
  };

  const removeChapter = (index: number) => {
    if (chapters.length <= 2) return;
    const updated = chapters
      .filter((_, i) => i !== index)
      .map((ch, i) => ({ ...ch, chapter: i + 1 }));
    setChapters(updated);
  };

  const addChapter = () => {
    setChapters([
      ...chapters,
      {
        chapter: chapters.length + 1,
        title: "新しい章",
        summary: "",
        sections: ["セクション1"],
      },
    ]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-dark font-serif mb-2">
            目次レビュー
          </h2>
          <p className="text-sub">
            「{topic}」の目次を確認・編集してください
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {chapters.map((ch, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-white rounded-lg border border-border"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                style={{ background: "#c0392b" }}
              >
                {ch.chapter}
              </div>
              <input
                type="text"
                value={ch.title}
                onChange={(e) => updateTitle(index, e.target.value)}
                className="flex-1 px-3 py-2 rounded border border-border bg-transparent text-dark focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
              {chapters.length > 2 && (
                <button
                  onClick={() => removeChapter(index)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sub hover:text-accent hover:bg-accent/10 transition"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addChapter}
          className="w-full py-3 rounded-lg border-2 border-dashed border-border text-sub hover:border-accent hover:text-accent transition mb-8"
        >
          ＋ 章を追加
        </button>

        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 py-3 rounded-lg border-2 border-border text-dark font-bold hover:bg-border/30 transition"
          >
            やり直す
          </button>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="flex-1 py-3 rounded-lg text-white font-bold transition disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #c0392b, #96281b)",
            }}
          >
            {checkoutLoading ? "決済ページへ移動中..." : "購入して教科書を生成する（¥300）"}
          </button>
        </div>
      </div>
    </div>
  );
}
