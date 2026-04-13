"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FadeUpProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  children: React.ReactNode;
}

export function FadeUp({ delay = 0, className, children, ...props }: FadeUpProps) {
  return (
    <div
      className={cn("animate-fade-up", className)}
      style={{ animationDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
}
