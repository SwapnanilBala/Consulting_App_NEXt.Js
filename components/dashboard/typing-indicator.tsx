import React from "react";

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="glass-subtle rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-cream-400 animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-cream-400 animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-cream-400 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
