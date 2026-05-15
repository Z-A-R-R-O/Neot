"use client";

import { useRef, useState, useEffect, type KeyboardEvent } from "react";

interface InlineEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}

export function InlineEditor({ value, onChange, className = "", placeholder = "", multiline = false }: InlineEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    if (!editing) {
      setInternalValue(value);
    }
  }, [value, editing]);

  function handleDoubleClick() {
    setEditing(true);
    setTimeout(() => {
      ref.current?.focus();
      const sel = window.getSelection();
      if (sel && ref.current) {
        sel.selectAllChildren(ref.current);
      }
    }, 0);
  }

  function handleBlur() {
    setEditing(false);
    const text = ref.current?.textContent ?? "";
    if (text !== value) {
      onChange(text);
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      ref.current?.blur();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setInternalValue(value);
      ref.current!.textContent = value;
      ref.current?.blur();
    }
  }

  return (
    <div
      ref={ref}
      contentEditable={editing}
      suppressContentEditableWarning
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onInput={() => {
        const text = ref.current?.textContent ?? "";
        setInternalValue(text);
        if (editing) {
          onChange(text);
        }
      }}
      data-placeholder={placeholder}
      className={`${className} ${
        editing
          ? "outline-dashed outline-1 outline-primary-500/50 cursor-text"
          : "cursor-pointer hover:outline-dotted hover:outline-1 hover:outline-primary-500/30"
      }`}
      style={{ whiteSpace: multiline ? "pre-wrap" : "nowrap" }}
    >
      {internalValue || placeholder}
    </div>
  );
}
