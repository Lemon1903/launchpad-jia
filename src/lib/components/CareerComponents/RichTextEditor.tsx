"use client";

import React, { useEffect, useRef, useState } from "react";

interface RichTextEditorProps {
  text: string;
  setText: (text: string) => void;
  hasError?: boolean;
}

export default function RichTextEditor({ text, setText, hasError }: RichTextEditorProps) {
  const descriptionEditorRef = useRef<HTMLDivElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const formatText = (command: string) => {
    document.execCommand(command, false);
    descriptionEditorRef.current?.focus();
  };

  const handleDescriptionChange = () => {
    if (descriptionEditorRef.current) {
      setText(descriptionEditorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    // Get plain text from clipboard
    const text = e.clipboardData.getData("text/plain");

    // Insert the plain text at cursor position
    document.execCommand("insertText", false, text);

    // Update the state
    handleDescriptionChange();
  };

  // Handle placeholder for contenteditable div
  useEffect(() => {
    const editor = descriptionEditorRef.current;
    if (editor) {
      const handleFocus = () => {
        setIsFocused(true);
        if (editor.innerHTML === "" || editor.innerHTML === "<br>") {
          editor.innerHTML = "";
        }
      };

      const handleBlur = () => {
        setIsFocused(false);
        if (editor.innerHTML === "" || editor.innerHTML === "<br>") {
          editor.innerHTML = "";
        }
      };

      editor.addEventListener("focus", handleFocus);
      editor.addEventListener("blur", handleBlur);

      return () => {
        editor.removeEventListener("focus", handleFocus);
        editor.removeEventListener("blur", handleBlur);
      };
    }
  }, []);

  useEffect(() => {
    if (descriptionEditorRef.current && !descriptionEditorRef.current.innerHTML && text) {
      descriptionEditorRef.current.innerHTML = text;
    }
  }, []);

  return (
    <div
      style={{
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: hasError ? "#f04438" : isFocused ? "#5e39d6" : "#cad1d7",
        borderRadius: "0.5rem",
        overflow: "hidden",
        boxShadow: hasError && isFocused
          ? "0 0 0 3px color-mix(in srgb, #f04438 20%, transparent)"
          : !hasError && isFocused
            ? "0 0 0 3px color-mix(in srgb, #5e39d6 20%, transparent)"
            : undefined,
        transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
      }}
    >
      <div
        ref={descriptionEditorRef}
        contentEditable={true}
        className="form-control"
        onInput={handleDescriptionChange}
        onBlur={handleDescriptionChange}
        onPaste={handlePaste}
        data-placeholder="Enter description"
      ></div>
      {/* Rich Text Editor Toolbar */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          display: "flex",
          gap: "4px",
          flexWrap: "wrap",
          height: "48px",
        }}
      >
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => formatText("bold")}
          title="Bold"
          style={{ padding: "4px 8px", fontSize: 20, color: "#535862" }}
        >
          <i className="la la-bold"></i>
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => formatText("italic")}
          title="Italic"
          style={{ padding: "4px 8px", fontSize: 20, color: "#535862" }}
        >
          <i className="la la-italic"></i>
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => formatText("underline")}
          title="Underline"
          style={{ padding: "4px 8px", fontSize: 20, color: "#535862" }}
        >
          <i className="la la-underline"></i>
        </button>
        {/* Strikethrough */}
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => formatText("strikeThrough")}
          title="Strikethrough"
          style={{ padding: "4px 8px", fontSize: 20, color: "#535862" }}
        >
          <i className="la la-strikethrough"></i>
        </button>

        <div style={{ width: "1px", backgroundColor: "#D5D7DA", margin: "0 4px" }}></div>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => formatText("insertOrderedList")}
          title="Numbered List"
          style={{ padding: "4px 8px", fontSize: 20, color: "#535862" }}
        >
          <i className="la la-list-ol"></i>
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => formatText("insertUnorderedList")}
          title="Bullet List"
          style={{ padding: "4px 8px", fontSize: 20, color: "#535862" }}
        >
          <i className="la la-list-ul"></i>
        </button>
      </div>
      <style jsx>{`
        .form-control {
          height: 300px;
          overflow-y: auto;
          padding: 12px;
          line-height: 1.5;
          position: relative;
          border: none !important;
          border-bottom: 1px solid #cad1d7 !important;
          border-bottom-left-radius: 0px !important;
          border-bottom-right-radius: 0px !important;
        }

        [data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #6c757d;
          pointer-events: none;
          position: absolute;
          top: 12px;
          left: 12px;
        }
      `}</style>
    </div>
  );
}
