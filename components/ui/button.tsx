import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-dmsans font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600/30 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-rose-600 text-white rounded-xl hover:bg-rose-800 px-5 py-2.5",
        secondary:
          "bg-white text-rose-900 border border-rose-400/50 rounded-xl hover:bg-rose-100 px-5 py-2.5",
        ghost: "text-rose-700 hover:bg-rose-200 rounded-xl px-5 py-2.5",
      },
      size: {
        default: "h-10 text-sm",
        sm: "h-8 text-xs px-3 py-1.5",
        lg: "h-12 text-base px-6 py-3",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
