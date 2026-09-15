import { type HTMLAttributes } from "react";
import { cn } from "./cn";

export function Badge({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em]", className)} {...props} />;
}
