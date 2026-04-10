import React from "react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  content?: string;
  timestamp?: string;
  isSent?: boolean;
  className?: string;
}

export function MessageBubble({
  content = "",
  timestamp = "",
  isSent = false,
  className,
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex",
        isSent ? "justify-end" : "justify-start",
        className
      )}
    >
      <div
        className={cn(
          "max-w-[75%] px-4 py-2.5 text-sm font-dmsans",
          isSent
            ? "bg-rose-600 text-white rounded-2xl rounded-tr-sm"
            : "glass-subtle rounded-2xl rounded-tl-sm text-rose-900"
        )}
      >
        <p>{content}</p>
        {timestamp && (
          <p
            className={cn(
              "text-[10px] mt-1",
              isSent ? "text-white/70" : "text-cream-400"
            )}
          >
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}
