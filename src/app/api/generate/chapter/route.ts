import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(request: Request) {
  const { topic, level, chapter } = await request.json();

  if (!topic || !level || !chapter) {
    return NextResponse.json(
      { error: "topic, level, chapter は必須です" },
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
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `あなたは「${topic}」の教科書を執筆する専門家です。
対象レベル: ${levelLabel}

第${chapter.chapter}章「${chapter.title}」を執筆してください。
セクション構成: ${chapter.sections.join("、")}

要件:
- 本文はマークダウン形式で800〜1200文字
- 具体例を必ず含める
- ${levelLabel}にとって分かりやすい表現を使う
- ベストプラクティスを2〜3個抽出
- 要点を3〜5個抽出

以下のJSON形式のみで返してください。説明文やマークダウンのコードブロックは不要です:
{"title": "章タイトル", "content": "マークダウン形式の本文", "bestPractices": [{"title": "パターン名", "description": "説明"}], "keyPoints": ["要点1", "要点2", "要点3"]}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  const cleaned = text.replace(/```json|```/g, "").trim();
  const data = JSON.parse(cleaned);

  return NextResponse.json(data);
}
