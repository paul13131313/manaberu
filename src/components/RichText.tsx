"use client";

interface RichTextProps {
  content: string;
}

export default function RichText({ content }: RichTextProps) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc pl-6 mb-4 space-y-1">
          {listItems.map((item, i) => (
            <li key={i} className="text-dark">{renderInline(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const renderInline = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    const regex = /\*\*(.+?)\*\*|`(.+?)`/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      if (match[1]) {
        parts.push(<strong key={match.index} className="font-bold">{match[1]}</strong>);
      } else if (match[2]) {
        parts.push(
          <code key={match.index} className="bg-border px-1.5 py-0.5 rounded text-sm font-mono">
            {match[2]}
          </code>
        );
      }
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length === 1 ? parts[0] : <>{parts}</>;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("### ")) {
      flushList();
      elements.push(
        <h4 key={i} className="text-lg font-bold text-dark mt-6 mb-2 font-serif">
          {line.slice(4)}
        </h4>
      );
    } else if (line.startsWith("## ")) {
      flushList();
      elements.push(
        <h3 key={i} className="text-xl font-bold text-dark mt-6 mb-3 font-serif">
          {line.slice(3)}
        </h3>
      );
    } else if (line.startsWith("# ")) {
      flushList();
      elements.push(
        <h2 key={i} className="text-2xl font-bold text-dark mt-6 mb-3 font-serif">
          {line.slice(2)}
        </h2>
      );
    } else if (line.match(/^[-*] /)) {
      inList = true;
      listItems.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      elements.push(
        <p key={i} className="text-dark leading-relaxed mb-3">
          {renderInline(line)}
        </p>
      );
    }
  }

  flushList();

  return <div className="rich-text">{elements}</div>;
}
