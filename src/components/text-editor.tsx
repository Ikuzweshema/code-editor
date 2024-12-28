import { ChangeEvent } from "react";
import { Textarea } from "../components/textarea.tsx";

interface Props {
  text: string;
  handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}
export default function Editor({ handleChange, text }: Props) {
  return (
    <div className={"flex h-full w-full rounded-md p-3 border-card"}>
      <Textarea
        value={text}
        onChange={handleChange}
        className={"resize-none h-full w-full"}
      />
    </div>
  );
}
