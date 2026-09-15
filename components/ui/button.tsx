import { type ButtonHTMLAttributes, forwardRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "./cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "dark" | "ghost";
  arrow?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", arrow, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-lime/70 disabled:pointer-events-none",
        {
          "bg-white text-forest hover:-translate-y-0.5 hover:bg-lime": variant === "primary",
          "border border-white/60 bg-white/5 text-white hover:bg-white hover:text-forest": variant === "outline",
          "bg-forest text-white hover:-translate-y-0.5 hover:bg-leaf": variant === "dark",
          "text-forest hover:bg-forest/5": variant === "ghost",
        },
        className,
      )}
      {...props}
    >
      {children}
      {arrow && <ArrowUpRight className="h-4 w-4" strokeWidth={2.4} />}
    </button>
  ),
);
Button.displayName = "Button";
