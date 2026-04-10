import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface SessionCardProps {
  consultantName?: string;
  consultantAvatar?: string;
  consultantInitials?: string;
  date?: string;
  time?: string;
  status?: "upcoming" | "completed" | "cancelled";
  className?: string;
}

export function SessionCard({
  consultantName = "Consultant",
  consultantAvatar,
  consultantInitials = "C",
  date = "TBD",
  time = "",
  status = "upcoming",
  className,
}: SessionCardProps) {
  const statusBadge = {
    upcoming: { label: "Upcoming", variant: "default" as const },
    completed: { label: "Completed", variant: "success" as const },
    cancelled: { label: "Cancelled", variant: "muted" as const },
  }[status];

  return (
    <Card variant="glass" className={cn("flex items-center gap-4", className)}>
      <Avatar
        src={consultantAvatar}
        fallback={consultantInitials}
        size={44}
      />
      <div className="flex-1 min-w-0">
        <p className="font-dmsans font-medium text-rose-900 truncate">
          {consultantName}
        </p>
        <p className="text-sm text-cream-700">
          {date}
          {time && ` · ${time}`}
        </p>
      </div>
      <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
      {status === "upcoming" && (
        <div className="flex gap-2">
          <Button variant="primary" size="sm">
            Join
          </Button>
          <Button variant="secondary" size="sm">
            Reschedule
          </Button>
        </div>
      )}
    </Card>
  );
}
