"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-sub mb-1">
        <span>
          {current} / {total} 章
        </span>
        <span>{percent}%</span>
      </div>
      <div className="w-full h-3 bg-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percent}%`,
            background: "linear-gradient(90deg, #c0392b, #e74c3c)",
          }}
        />
      </div>
    </div>
  );
}
