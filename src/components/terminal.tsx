import React from "react";
import { Card } from "./card";
import { cn } from "../lib/utils.ts";

const Terminal = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        {...props}
        className={cn(className, "rounded-md border")}
      />
    );
  }
);
Terminal.displayName = "Terminal";

export { Terminal };
