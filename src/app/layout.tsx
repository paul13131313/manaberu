import type { Metadata } from "next";
import { Noto_Serif_JP, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif_JP({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const notoSans = Noto_Sans_JP({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://manaberu.vercel.app"),
  title: "まなべーる | AI教科書＆問題集ジェネレーター",
  description:
    "知りたい分野を入力するだけでAI教科書と問題集のセットを自動生成するWebアプリ",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "まなべーる | AI教科書＆問題集ジェネレーター",
    description:
      "知りたい分野を入力するだけでAI教科書と問題集のセットを自動生成",
    images: [{ url: "/ogp.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "まなべーる | AI教科書＆問題集ジェネレーター",
    description:
      "知りたい分野を入力するだけでAI教科書と問題集のセットを自動生成",
    images: ["/ogp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/icon-180.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${notoSerif.variable} ${notoSans.variable} antialiased bg-bg text-dark`}
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {children}
      </body>
    </html>
  );
}
