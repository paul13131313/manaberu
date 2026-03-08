"use client";

import { useState } from "react";
import { Level } from "@/types";

interface InputPhaseProps {
  onSubmit: (topic: string, level: Level) => void;
  loading: boolean;
}

const levels: { value: Level; label: string; desc: string }[] = [
  { value: "beginner", label: "初心者", desc: "基礎からやさしく" },
  { value: "intermediate", label: "中級者", desc: "実践的な内容" },
  { value: "advanced", label: "上級者", desc: "専門的に深く" },
];

export default function InputPhase({ onSubmit, loading }: InputPhaseProps) {
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
      </div>
    </div>
  );
}
