"use client";

import { useState, useEffect } from "react";
import {
  Phase,
  Level,
  ChapterOutline,
  ChapterContent,
  QuizQuestion,
  SavedTextbook,
} from "@/types";
import InputPhase from "@/components/InputPhase";
import TocReview from "@/components/TocReview";
import GeneratingPhase from "@/components/GeneratingPhase";
import TextbookReader from "@/components/TextbookReader";
import QuizPhase from "@/components/QuizPhase";
import ResultsPhase from "@/components/ResultsPhase";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("input");
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<Level>("beginner");
  const [tocLoading, setTocLoading] = useState(false);
  const [chapters, setChapters] = useState<ChapterOutline[]>([]);
  const [chapterContents, setChapterContents] = useState<ChapterContent[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [generatingChapter, setGeneratingChapter] = useState(0);
  const [generatingTitle, setGeneratingTitle] = useState("");
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<
    Record<number, number | string>
  >({});
  const [savedTextbooks, setSavedTextbooks] = useState<SavedTextbook[]>([]);

  // Load saved textbooks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("manaberu_textbooks");
    if (saved) {
      setSavedTextbooks(JSON.parse(saved));
    }
  }, []);

  const saveTextbook = (
    t: string,
    l: Level,
    contents: ChapterContent[],
    quiz: QuizQuestion[]
  ) => {
    const textbook: SavedTextbook = {
      id: Date.now().toString(),
      topic: t,
      level: l,
      chapters: contents,
      questions: quiz,
      createdAt: new Date().toISOString(),
    };
    const updated = [textbook, ...savedTextbooks];
    setSavedTextbooks(updated);
    localStorage.setItem("manaberu_textbooks", JSON.stringify(updated));
  };

  const loadTextbook = (textbook: SavedTextbook) => {
    setTopic(textbook.topic);
    setLevel(textbook.level);
    setChapterContents(textbook.chapters);
    setQuestions(textbook.questions);
    setPhase("textbook");
  };

  const deleteTextbook = (id: string) => {
    const updated = savedTextbooks.filter((t) => t.id !== id);
    setSavedTextbooks(updated);
    localStorage.setItem("manaberu_textbooks", JSON.stringify(updated));
  };

  // Handle Stripe checkout return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const canceled = params.get("canceled");

    if (canceled) {
      // Restore TOC data from sessionStorage
      const saved = sessionStorage.getItem("manaberu_toc");
      if (saved) {
        const { topic: t, level: l, chapters: ch } = JSON.parse(saved);
        setTopic(t);
        setLevel(l);
        setChapters(ch);
        setPhase("toc-review");
      }
      window.history.replaceState({}, "", "/");
      return;
    }

    if (sessionId) {
      // Verify payment and start generation
      window.history.replaceState({}, "", "/");
      verifyAndGenerate(sessionId);
    }
  }, []);

  const verifyAndGenerate = async (sessionId: string) => {
    const verifyRes = await fetch("/api/checkout/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    const verifyData = await verifyRes.json();

    if (!verifyData.paid) {
      setPhase("input");
      return;
    }

    // Restore TOC data from sessionStorage
    const saved = sessionStorage.getItem("manaberu_toc");
    if (!saved) {
      setPhase("input");
      return;
    }

    const { topic: t, level: l, chapters: ch } = JSON.parse(saved);
    sessionStorage.removeItem("manaberu_toc");

    setTopic(t);
    setLevel(l);
    setChapters(ch);

    // Start generation
    await startGeneration(t, l, ch);
  };

  const startGeneration = async (
    t: string,
    l: Level,
    approved: ChapterOutline[]
  ) => {
    setPhase("generating");

    const contents: ChapterContent[] = [];

    for (let i = 0; i < approved.length; i++) {
      setGeneratingChapter(i + 1);
      setGeneratingTitle(approved[i].title);

      const res = await fetch("/api/generate/chapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: t,
          level: l,
          chapter: approved[i],
        }),
      });
      const data = await res.json();
      contents.push(data);
    }

    setChapterContents(contents);

    // Generate quiz
    setIsGeneratingQuiz(true);
    const quizRes = await fetch("/api/generate/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: t,
        level: l,
        chapters: approved.map((c) => ({ title: c.title })),
      }),
    });
    const quizData = await quizRes.json();
    setQuestions(quizData);
    setIsGeneratingQuiz(false);

    // 自動保存
    saveTextbook(t, l, contents, quizData);

    setPhase("textbook");
  };

  const handleInputSubmit = async (t: string, l: Level) => {
    setTopic(t);
    setLevel(l);
    setTocLoading(true);

    try {
      const res = await fetch("/api/generate/toc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: t, level: l }),
      });
      const data = await res.json();
      if (!res.ok || !data.chapters) {
        throw new Error(data.error || "目次の生成に失敗しました");
      }
      setChapters(data.chapters);
      setPhase("toc-review");
    } catch (error) {
      alert(`エラー: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setTocLoading(false);
    }
  };

  const handleTocApprove = async (approved: ChapterOutline[]) => {
    setChapters(approved);
    await startGeneration(topic, level, approved);
  };

  const handleQuizSubmit = (answers: Record<number, number | string>) => {
    setQuizAnswers(answers);
    setPhase("results");
  };

  const handleReset = () => {
    setPhase("input");
    setTopic("");
    setLevel("beginner");
    setChapters([]);
    setChapterContents([]);
    setQuestions([]);
    setQuizAnswers({});
  };

  switch (phase) {
    case "input":
      return (
        <InputPhase
          onSubmit={handleInputSubmit}
          loading={tocLoading}
          savedTextbooks={savedTextbooks}
          onLoadTextbook={loadTextbook}
          onDeleteTextbook={deleteTextbook}
        />
      );

    case "toc-review":
      return (
        <TocReview
          chapters={chapters}
          topic={topic}
          level={level}
          onApprove={handleTocApprove}
          onBack={() => setPhase("input")}
        />
      );

    case "generating":
      return (
        <GeneratingPhase
          currentChapter={generatingChapter}
          totalChapters={chapters.length}
          chapterTitle={generatingTitle}
          isGeneratingQuiz={isGeneratingQuiz}
        />
      );

    case "textbook":
      return (
        <TextbookReader
          chapters={chapterContents}
          topic={topic}
          level={level}
          onGoToQuiz={() => setPhase("quiz")}
        />
      );

    case "quiz":
      return <QuizPhase questions={questions} onSubmit={handleQuizSubmit} />;

    case "results":
      return (
        <ResultsPhase
          questions={questions}
          answers={quizAnswers}
          onBackToTextbook={() => setPhase("textbook")}
          onNewTextbook={handleReset}
        />
      );
  }
}
