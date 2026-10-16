"use client";

import React, { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Eye,
  Edit3,
  HelpCircle,
} from "lucide-react";
import { RichTextRenderer } from "@/components/common/RichTextRenderer";

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  minHeight?: string;
  helpText?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  placeholder = "Write detailed description here...",
  rows = 6,
  minHeight,
  helpText,
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Helper to wrap selected text or insert snippet
  const insertFormatting = (prefix: string, suffix = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);

    let replacement = "";
    if (selected) {
      replacement = `${prefix}${selected}${suffix}`;
    } else {
      replacement = `${prefix}Sample Text${suffix}`;
    }

    const newValue =
      textarea.value.substring(0, start) +
      replacement +
      textarea.value.substring(end);

    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + replacement.length - suffix.length
      );
    }, 50);
  };

  const insertLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);

    let replacement = "";
    if (selected) {
      replacement = selected
        .split("\n")
        .map((line) => `${prefix}${line}`)
        .join("\n");
    } else {
      replacement = `\n${prefix}New Item\n`;
    }

    const newValue =
      textarea.value.substring(0, start) +
      replacement +
      textarea.value.substring(end);

    onChange(newValue);
    setTimeout(() => {
      textarea.focus();
    }, 50);
  };

  const insertLink = () => {
    const url = prompt("Enter web link URL (e.g. https://example.com):", "https://");
    if (!url) return;
    const label = prompt("Enter link label:", "Learn More") || "Link";
    insertFormatting(`[${label}](`, `${url})`);
  };

  const wordCount = (value || "").trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-ceylon-navy">
            {label}
          </label>
          <span className="text-[10px] text-slate-400 font-mono">
            {wordCount} words
          </span>
        </div>
      )}

      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm focus-within:border-ceylon-blue transition-colors">
        {/* Editor Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-slate-50 border-b border-slate-200 text-slate-700">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => insertFormatting("**", "**")}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
              title="Bold (**text**)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("*", "*")}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
              title="Italic (*text*)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-4 bg-slate-300 mx-1" />

            <button
              type="button"
              onClick={() => insertLinePrefix("## ")}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
              title="Heading 2"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertLinePrefix("### ")}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
              title="Heading 3"
            >
              <Heading3 className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-4 bg-slate-300 mx-1" />

            <button
              type="button"
              onClick={() => insertLinePrefix("- ")}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
              title="Bullet List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertLinePrefix("1. ")}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
              title="Numbered List"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-4 bg-slate-300 mx-1" />

            <button
              type="button"
              onClick={insertLink}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
              title="Insert Link"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggle Live Preview */}
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors ${
              isPreview
                ? "bg-ceylon-navy text-white"
                : "bg-white hover:bg-slate-200 text-slate-600 border border-slate-200"
            }`}
          >
            {isPreview ? (
              <>
                <Edit3 className="w-3 h-3" />
                <span>Edit Text</span>
              </>
            ) : (
              <>
                <Eye className="w-3 h-3 text-luxury-gold" />
                <span>Preview</span>
              </>
            )}
          </button>
        </div>

        {/* Text Area or Live Preview */}
        {isPreview ? (
          <div
            style={minHeight ? { minHeight } : undefined}
            className="p-4 bg-slate-50/50 min-h-[140px] max-h-[360px] overflow-y-auto"
          >
            {value.trim() ? (
              <RichTextRenderer content={value} />
            ) : (
              <p className="text-xs text-slate-400 italic">No content written yet. Switch to Edit to write text.</p>
            )}
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={minHeight ? { minHeight } : undefined}
            className="w-full p-3.5 text-xs text-slate-800 leading-relaxed font-sans bg-transparent focus:outline-none resize-y"
          />
        )}
      </div>

      {helpText && (
        <p className="text-[11px] text-slate-400 leading-tight flex items-center gap-1">
          <HelpCircle className="w-3 h-3 shrink-0" />
          <span>{helpText}</span>
        </p>
      )}
    </div>
  );
};

export default RichTextEditor;
