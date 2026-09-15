import { Sprout } from "lucide-react";
import { cn } from "./ui/cn";

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <a href="#home" className={cn("flex items-center gap-2", className)} aria-label="Annadata Procure-Connect home">
      <span className={cn("grid h-8 w-8 place-items-center rounded-xl", light ? "bg-lime text-forest" : "bg-forest text-lime")}><Sprout className="h-4 w-4" strokeWidth={2.7} /></span>
      <span className={cn("leading-none", light ? "text-white" : "text-forest")}>
        <span className="block text-[10px] font-bold tracking-tight">Annadata</span>
        <span className="block text-[9px] font-semibold tracking-tight opacity-80">Procure-Connect</span>
      </span>
    </a>
  );
}
