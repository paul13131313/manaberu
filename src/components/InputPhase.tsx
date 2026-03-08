"use client";

import { useState } from "react";
import { Level, SavedTextbook } from "@/types";

interface InputPhaseProps {
  onSubmit: (topic: string, level: Level) => void;
  loading: boolean;
  savedTextbooks: SavedTextbook[];
  onLoadTextbook: (textbook: SavedTextbook) => void;
  onDeleteTextbook: (id: string) => void;
}

const levels: { value: Level; label: string; desc: string }[] = [
  { value: "beginner", label: "初心者", desc: "基礎からやさしく" },
  { value: "intermediate", label: "中級者", desc: "実践的な内容" },
  { value: "advanced", label: "上級者", desc: "専門的に深く" },
];

const levelLabels: Record<Level, string> = {
  beginner: "初心者",
  intermediate: "中級者",
  advanced: "上級者",
};

export default function InputPhase({
  onSubmit,
  loading,
  savedTextbooks,
  onLoadTextbook,
  onDeleteTextbook,
}: InputPhaseProps) {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<Level>("beginner");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onSubmit(topic.trim(), level);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-dark font-serif mb-2">
            まなべーる
          </h1>
          <p className="text-sub text-lg">
            知りたい分野を入力するだけで
            <br />
            AI教科書と問題集を自動生成
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-dark mb-2">
              学びたいテーマ
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="例: プロンプトエンジニアリング、コーヒーの淹れ方、写真の構図"
              className="w-full px-4 py-3 rounded-lg border border-border bg-white text-dark placeholder-sub focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-dark mb-3">
              レベル
            </label>
            <div className="grid grid-cols-3 gap-3">
              {levels.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setLevel(l.value)}
                  className={`p-3 rounded-lg border-2 transition text-center ${
                    level === l.value
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-sub"
                  }`}
                  disabled={loading}
                >
                  <div className="font-bold text-dark text-sm">{l.label}</div>
                  <div className="text-xs text-sub mt-1">{l.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!topic.trim() || loading}
            className="w-full py-3 rounded-lg text-white font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #c0392b, #96281b)",
            }}
          >
            {loading ? "目次を生成中..." : "目次を生成する"}
          </button>
        </form>

        {/* 保存済み教科書一覧 */}
        {savedTextbooks.length > 0 && (
          <div className="mt-12">
            <h2 className="text-sm font-bold text-dark mb-4">購入済みの教科書</h2>
            <div className="space-y-3">
              {savedTextbooks.map((tb) => (
                <div
                  key={tb.id}
                  className="flex items-center gap-3 p-4 bg-white rounded-lg border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => onLoadTextbook(tb)}
                      className="text-left w-full"
                    >
                      <div className="font-bold text-dark text-sm truncate">
                        {tb.topic}
                      </div>
                      <div className="text-xs text-sub mt-1">
                        {levelLabels[tb.level]} ・ {tb.chapters.length}章 ・{" "}
                        {new Date(tb.createdAt).toLocaleDateString("ja-JP")}
                      </div>
                    </button>
                  </div>
                  <button
                    onClick={() => onLoadTextbook(tb)}
                    className="px-3 py-1.5 rounded text-xs font-bold text-accent border border-accent/30 hover:bg-accent/10 transition shrink-0"
                  >
                    読む
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("この教科書を削除しますか？")) {
                        onDeleteTextbook(tb.id);
                      }
                    }}
                    className="text-sub hover:text-accent transition text-sm shrink-0"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
