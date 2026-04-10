import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostCardProps {
  authorName?: string;
  authorInitials?: string;
  authorAvatar?: string;
  content?: string;
  upvotes?: number;
  replies?: number;
  isAnonymous?: boolean;
  className?: string;
}

export function PostCard({
  authorName = "Member",
  authorInitials = "M",
  authorAvatar,
  content = "",
  upvotes = 0,
  replies = 0,
  isAnonymous = false,
  className,
}: PostCardProps) {
  return (
    <Card variant="glass" className={cn("glass-subtle", className)}>
      <div className="flex items-center gap-3 mb-3">
        <Avatar
          src={isAnonymous ? undefined : authorAvatar}
          fallback={isAnonymous ? "A" : authorInitials}
          size={32}
        />
        <span className="font-dmsans text-sm font-medium text-rose-900">
          {isAnonymous ? "Anonymous" : authorName}
        </span>
        {isAnonymous && <Badge variant="muted">Anon</Badge>}
      </div>
      <p className="text-sm font-dmsans text-rose-900/80 mb-4">{content}</p>
      <div className="flex items-center gap-4 text-cream-700">
        <button className="flex items-center gap-1.5 text-xs hover:text-rose-600 transition-colors">
          <ArrowUp size={14} />
          <span>{upvotes}</span>
        </button>
        <button className="flex items-center gap-1.5 text-xs hover:text-rose-600 transition-colors">
          <MessageCircle size={14} />
          <span>{replies}</span>
        </button>
      </div>
    </Card>
  );
}
