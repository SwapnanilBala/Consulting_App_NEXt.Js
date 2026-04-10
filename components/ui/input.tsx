import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex w-full bg-white/70 border border-rose-400/40 rounded-xl h-11 px-4 text-sm font-dmsans text-rose-900 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-rose-600/30 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
