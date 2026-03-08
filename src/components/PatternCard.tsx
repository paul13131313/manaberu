"use client";

interface PatternCardProps {
  title: string;
  description: string;
}

export default function PatternCard({ title, description }: PatternCardProps) {
  return (
    <div
      className="border-l-4 rounded-r-lg p-4 my-4"
      style={{
        borderColor: "#c0392b",
        background: "linear-gradient(135deg, #faf8f0, #f5f0e1)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-accent text-sm font-bold">
          ★ ベストプラクティス
        </span>
      </div>
      <h4 className="font-bold text-dark mb-1">{title}</h4>
      <p className="text-sm text-sub">{description}</p>
    </div>
  );
}
