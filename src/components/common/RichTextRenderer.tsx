import React from "react";

interface RichTextRendererProps {
  content?: string | null;
  className?: string;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({
  content,
  className = "text-luxury-charcoal/80 leading-relaxed font-light text-sm sm:text-base space-y-4",
}) => {
  if (!content) return null;

  // Split by double line breaks or process paragraphs & markdown-like elements
  const blocks = content.split(/\n\s*\n/);

  return (
    <div className={className}>
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Heading 2 (e.g. "## Heading" or "Heading\n---")
        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={idx}
              className="font-serif text-xl sm:text-2xl font-normal text-luxury-forest tracking-tight pt-3 pb-1"
            >
              {renderInline(trimmed.replace(/^##\s+/, ""))}
            </h2>
          );
        }

        // Heading 3 (e.g. "### Heading")
        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={idx}
              className="font-serif text-lg sm:text-xl font-medium text-luxury-forest tracking-tight pt-2"
            >
              {renderInline(trimmed.replace(/^###\s+/, ""))}
            </h3>
          );
        }

        // Bullet List (starts with "- " or "* " or "• ")
        const lines = trimmed.split("\n");
        const isBulletList = lines.every(
          (line) =>
            line.trim().startsWith("- ") ||
            line.trim().startsWith("* ") ||
            line.trim().startsWith("• ")
        );

        if (isBulletList) {
          return (
            <ul key={idx} className="space-y-2 list-none pl-1">
              {lines.map((line, lIdx) => {
                const itemText = line.trim().replace(/^[-*•]\s+/, "");
                return (
                  <li key={lIdx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold shrink-0 mt-2" />
                    <span>{renderInline(itemText)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Numbered List (starts with "1. ", "2. ")
        const isNumberedList = lines.every((line) => /^\d+\.\s+/.test(line.trim()));
        if (isNumberedList) {
          return (
            <ol key={idx} className="space-y-2 list-decimal list-inside pl-1 marker:text-luxury-gold marker:font-semibold">
              {lines.map((line, lIdx) => {
                const itemText = line.trim().replace(/^\d+\.\s+/, "");
                return <li key={lIdx}>{renderInline(itemText)}</li>;
              })}
            </ol>
          );
        }

        // Standard Paragraph
        return (
          <p key={idx} className="whitespace-pre-line">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

// Safe inline formatting: bold (**text**), italic (*text*), and links ([label](url))
function renderInline(text: string): React.ReactNode[] {
  // Regex to match **bold**, *italic*, and [link](url)
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-luxury-forest">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic text-luxury-charcoal">
          {part.slice(1, -1)}
        </em>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-luxury-forest underline decoration-luxury-gold underline-offset-4 hover:text-luxury-gold transition-colors font-medium"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

export default RichTextRenderer;
