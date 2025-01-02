import React from "react";
import { Card } from "./card";
import { cn } from "../lib/utils.ts";

const Terminal = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <Card
        {...props}
        className={cn(className, "rounded-md w-full p-0 overflow-hidden m-0")}
      >
        <div ref={ref} className="w-full h-36 p-0 m-0" />
      </Card>
    );
  }
);
Terminal.displayName = "Terminal";

export { Terminal };
