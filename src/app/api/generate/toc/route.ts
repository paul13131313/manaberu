import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: Request) {
  try {
    const { topic, level } = await request.json();

    if (!topic || !level) {
      return NextResponse.json(
        { error: "topic と level は必須です" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY が設定されていません", envKeys: Object.keys(process.env).filter(k => k.includes("ANTHROPIC") || k.includes("STRIPE")).join(", ") },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });

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
  } catch (error) {
    console.error("TOC generation error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
