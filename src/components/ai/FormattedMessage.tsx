'use client';

import React from 'react';

interface FormattedMessageProps {
  content: string;
}

export default function FormattedMessage({ content }: FormattedMessageProps) {
  // Strip any accidental action tokens
  const cleanContent = content.replace(/<<<ACTION:[\s\S]*?>>>/g, '').trim();

  // Split into lines/paragraphs
  const lines = cleanContent.split('\n');

  const renderedElements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: React.ReactNode[] } | null = null;

  const flushList = () => {
    if (!currentList) return;
    if (currentList.type === 'ul') {
      renderedElements.push(
        <ul key={`list-${renderedElements.length}`} className="my-2 space-y-1.5 pl-4 list-disc marker:text-zinc-500">
          {currentList.items.map((item, i) => (
            <li key={i} className="leading-relaxed text-zinc-300">
              {item}
            </li>
          ))}
        </ul>
      );
    } else {
      renderedElements.push(
        <ol key={`list-${renderedElements.length}`} className="my-2 space-y-1.5 pl-4 list-decimal marker:text-zinc-500 font-mono text-[11px]">
          {currentList.items.map((item, i) => (
            <li key={i} className="leading-relaxed text-zinc-300">
              {item}
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  const parseInline = (text: string): React.ReactNode => {
    // Process bold (**text**), currency (₹...), and italic (*text*)
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    while (remaining.length > 0) {
      // Bold match
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      // Italic match (single asterisk not followed by another)
      const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);

      let firstMatchIndex = -1;
      let matchType: 'bold' | 'italic' | null = null;
      let matchedText = '';
      let innerText = '';

      if (boldMatch && boldMatch.index !== undefined) {
        firstMatchIndex = boldMatch.index;
        matchType = 'bold';
        matchedText = boldMatch[0];
        innerText = boldMatch[1];
      }

      if (
        italicMatch &&
        italicMatch.index !== undefined &&
        (firstMatchIndex === -1 || italicMatch.index < firstMatchIndex)
      ) {
        firstMatchIndex = italicMatch.index;
        matchType = 'italic';
        matchedText = italicMatch[0];
        innerText = italicMatch[1];
      }

      if (firstMatchIndex === -1 || !matchType) {
        // No more styles, format currency highlights
        parts.push(highlightCurrency(remaining, keyIdx++));
        break;
      }

      // Add text before match
      if (firstMatchIndex > 0) {
        parts.push(highlightCurrency(remaining.substring(0, firstMatchIndex), keyIdx++));
      }

      // Add styled element
      if (matchType === 'bold') {
        parts.push(
          <strong key={`b-${keyIdx++}`} className="font-semibold text-white tracking-tight">
            {highlightCurrency(innerText, keyIdx++)}
          </strong>
        );
      } else if (matchType === 'italic') {
        parts.push(
          <em key={`i-${keyIdx++}`} className="italic text-zinc-400">
            {highlightCurrency(innerText, keyIdx++)}
          </em>
        );
      }

      remaining = remaining.substring(firstMatchIndex + matchedText.length);
    }

    return parts;
  };

  const highlightCurrency = (text: string, baseKey: number): React.ReactNode => {
    // Look for ₹[0-9,.]+
    const regex = /(₹\s?[\d,]+(?:\.\d+)?)/g;
    const segments = text.split(regex);
    if (segments.length === 1) return text;

    return segments.map((seg, i) => {
      if (seg.match(regex)) {
        return (
          <span key={`curr-${baseKey}-${i}`} className="font-mono font-medium text-white tabular-nums">
            {seg}
          </span>
        );
      }
      return seg;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushList();
      continue;
    }

    // Check for bullet list (* item or - item or • item)
    const bulletMatch = line.match(/^[\*\-•]\s+(.*)$/);
    if (bulletMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(parseInline(bulletMatch[1]));
      continue;
    }

    // Check for numbered list (1. item, 2. item)
    const numberMatch = line.match(/^\d+[\.\)]\s+(.*)$/);
    if (numberMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(parseInline(numberMatch[1]));
      continue;
    }

    // Regular line, flush any active list
    flushList();

    // Check for heading (### or ##)
    if (line.startsWith('### ')) {
      renderedElements.push(
        <h4 key={`h4-${i}`} className="text-xs font-semibold text-white mt-3 mb-1 tracking-tight">
          {parseInline(line.replace('### ', ''))}
        </h4>
      );
    } else if (line.startsWith('## ')) {
      renderedElements.push(
        <h3 key={`h3-${i}`} className="text-sm font-semibold text-white mt-3.5 mb-1.5 tracking-tight">
          {parseInline(line.replace('## ', ''))}
        </h3>
      );
    } else {
      renderedElements.push(
        <p key={`p-${i}`} className="leading-relaxed text-zinc-300 my-1">
          {parseInline(line)}
        </p>
      );
    }
  }

  flushList();

  return <div className="space-y-1 text-xs leading-relaxed select-text">{renderedElements}</div>;
}
