import * as monaco from "monaco-editor";
import { useEffect, useRef } from "react";

interface Props {
  text: string;
  handleChange: (text: string | undefined) => void;
}
export default function TextEditor({ handleChange, text }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current) return;
    monaco.editor.defineTheme("onedark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "", foreground: "abb2bf", background: "282c34" },
        { token: "comment", foreground: "5c6370", fontStyle: "italic" },
        { token: "keyword", foreground: "c678dd" },
        { token: "number", foreground: "d19a66" },
        { token: "string", foreground: "98c379" },
        { token: "operator", foreground: "56b6c2" },
        { token: "function", foreground: "61afef" },
        { token: "type", foreground: "e5c07b" },
      ],
      colors: {
        "editor.foreground": "#abb2bf",
        "editorCursor.foreground": "#528bff",
        "editor.lineHighlightBackground": "#2c313a",
        "editorLineNumber.foreground": "#636d83",
        "editor.selectionBackground": "#3e4451",
        "editor.inactiveSelectionBackground": "#3e4451",
      },
    });
    const editor = monaco.editor.create(editorRef.current!, {
      value: text,
      language: "javascript",
      theme: "onedark",
      "semanticHighlighting.enabled": true,
      automaticLayout: true,
      quickSuggestions: true,
      wordBasedSuggestions: "matchingDocuments",
      suggestOnTriggerCharacters: true,
      parameterHints: {
        enabled: true,
      },
    });
    editor.onDidChangeModelContent(() => {
      handleChange(editor.getValue());
    });

    return () => {
      editor.dispose();
    };
  }, []);
  return (
    <div ref={editorRef} className={"flex h-full w-full rounded-sm"}></div>
  );
}
