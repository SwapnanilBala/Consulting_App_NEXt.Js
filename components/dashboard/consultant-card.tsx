import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConsultantCardProps {
  name: string;
  avatarUrl?: string | null;
  specialty?: string | null;
  bio?: string | null;
  onMessage?: () => void;
  className?: string;
}

export function ConsultantCard({
  name,
  avatarUrl,
  specialty,
  bio,
  onMessage,
  className,
}: ConsultantCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card variant="glass" className={cn("flex flex-col", className)}>
      <div className="flex items-start gap-4 mb-4">
        <Avatar src={avatarUrl ?? undefined} fallback={initials} size={52} />
        <div className="flex-1 min-w-0">
          <h3 className="font-dmsans font-medium text-rose-900 truncate">
            {name}
          </h3>
          {specialty && (
            <Badge variant="default" className="mt-1">
              {specialty}
            </Badge>
          )}
        </div>
      </div>
      {bio && (
        <p className="text-sm font-dmsans text-cream-700 line-clamp-3 mb-4 flex-1">
          {bio}
        </p>
      )}
      {!bio && (
        <p className="text-sm font-dmsans text-cream-400 italic mb-4 flex-1">
          No bio available
        </p>
      )}
      <div className="flex gap-2">
        <Button variant="primary" size="sm" className="flex-1" onClick={onMessage}>
          Message
        </Button>
      </div>
    </Card>
  );
}
