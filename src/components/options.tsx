import { Card } from "./card";
import Option from "./option";

export default function Options() {
  return (
    <Card className="w-full max-w-[250px] flex gap-4 bg-black/80">
      <Option name="Code" />
      <Option name="Preview" />
    </Card>
  );
}
