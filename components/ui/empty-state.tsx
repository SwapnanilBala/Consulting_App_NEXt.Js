import React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6", className)}>
      <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="font-playfair text-xl font-semibold text-rose-900 mb-2 text-center">
        {title}
      </h3>
      <p className="font-dmsans text-sm text-cream-700 mb-6 text-center max-w-xs">
        {description}
      </p>
      {action}
    </div>
  );
}
