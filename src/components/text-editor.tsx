import Editor from "@monaco-editor/react";

interface Props {
  text: string;
  handleChange: (text: string | undefined) => void;
}
export default function TextEditor({ handleChange, text }: Props) {
  return (
    <div className={"flex h-full w-full rounded-sm"}>
      <Editor
        defaultLanguage="javascript"
        onChange={handleChange}
        defaultValue={text}
        className="w-full h-full"
        theme="vs-dark"

      />
    </div>
  );
}
