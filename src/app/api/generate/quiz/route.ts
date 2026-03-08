import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(request: Request) {
  const { topic, level, chapters } = await request.json();

  if (!topic || !level || !chapters) {
    return NextResponse.json(
      { error: "topic, level, chapters は必須です" },
      { status: 400 }
    );
  }

  const levelLabel =
    level === "beginner"
      ? "初心者"
      : level === "intermediate"
        ? "中級者"
        : "上級者";

  const chapterList = chapters
    .map((c: { title: string }, i: number) => `第${i + 1}章: ${c.title}`)
    .join("\n");

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `あなたは「${topic}」の教科書の問題集を作成する専門家です。
対象レベル: ${levelLabel}

教科書の構成:
${chapterList}

教科書の全章内容を踏まえ、以下の問題を作成してください:
- 選択式5問（4択、正解インデックス、解説つき）
- 記述式3問（模範解答、採点ポイントつき）

以下のJSON配列形式のみで返してください。説明文やマークダウンのコードブロックは不要です:
[{"id": 1, "type": "multiple_choice", "question": "問題文", "options": ["A", "B", "C", "D"], "correctIndex": 0, "explanation": "解説"}, {"id": 6, "type": "descriptive", "question": "問題文", "sampleAnswer": "模範解答", "explanation": "採点のポイント"}]`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  const cleaned = text.replace(/```json|```/g, "").trim();
  const data = JSON.parse(cleaned);

  return NextResponse.json(data);
}
