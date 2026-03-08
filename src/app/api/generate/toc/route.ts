import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(request: Request) {
  const { topic, level } = await request.json();

  if (!topic || !level) {
    return NextResponse.json(
      { error: "topic と level は必須です" },
      { status: 400 }
    );
  }

  const levelLabel =
    level === "beginner"
      ? "初心者"
      : level === "intermediate"
        ? "中級者"
        : "上級者";

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `あなたは教科書の構成を設計する専門家です。
テーマ: 「${topic}」
レベル: ${levelLabel}

5〜8章の体系的な目次をJSON形式で作成してください。
各章に chapter(番号), title(章タイトル), summary(30文字以内の概要), sections(3〜5個のセクション名) を含めてください。

以下のJSON形式のみで返してください。説明文やマークダウンは不要です:
{"chapters": [{"chapter": 1, "title": "...", "summary": "...", "sections": ["...", "..."]}]}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  const cleaned = text.replace(/```json|```/g, "").trim();
  const data = JSON.parse(cleaned);

  return NextResponse.json(data);
}
