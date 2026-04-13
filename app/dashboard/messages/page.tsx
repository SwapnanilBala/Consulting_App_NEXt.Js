"use client";

import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar } from "@/components/ui/avatar";
import { MessageBubble } from "@/components/dashboard/message-bubble";
import { TypingIndicator } from "@/components/dashboard/typing-indicator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeUp } from "@/components/ui/fade-up";

interface ConversationStub {
  id: string;
  name: string;
  initials: string;
  lastMessage: string;
  active?: boolean;
}

const placeholderConversations: ConversationStub[] = [
  { id: "1", name: "Sarah M.", initials: "SM", lastMessage: "See you Thursday!", active: true },
  { id: "2", name: "Dr. Rivera", initials: "DR", lastMessage: "Your plan looks great." },
  { id: "3", name: "Aura Support", initials: "AS", lastMessage: "Welcome aboard!" },
];

export default function MessagesPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]">
      <FadeUp>
        <PageHeader title="Messages" description="Your conversations" />
      </FadeUp>

      <FadeUp delay={100}>
      <div className="flex flex-1 gap-0 rounded-2xl overflow-hidden glass min-h-0">
        {/* Conversation list */}
        <div className="hidden sm:flex flex-col w-[300px] border-r border-white/40 overflow-y-auto">
          {placeholderConversations.map((c) => (
            <button
              key={c.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 text-left transition-colors",
                c.active ? "bg-rose-200/40" : "hover:bg-rose-100/40"
              )}
            >
              <Avatar fallback={c.initials} size={36} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-dmsans font-medium text-rose-900 truncate">
                  {c.name}
                </p>
                <p className="text-xs text-cream-700 truncate">{c.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Message thread */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            <MessageBubble content="Hi! Looking forward to our session." timestamp="10:00 AM" />
            <MessageBubble content="Me too! See you Thursday!" timestamp="10:05 AM" isSent />
            <TypingIndicator />
          </div>

          {/* Sticky input bar */}
          <div className="glass-strong p-3 flex items-center gap-3">
            <Input placeholder="Type a message..." className="flex-1" />
            <Button variant="primary" size="icon" className="rounded-full shrink-0">
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
      </FadeUp>
    </div>
  );
}
