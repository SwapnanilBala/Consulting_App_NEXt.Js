import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const timelineSteps = ["Booked", "Confirmed", "In Progress", "Complete"];

function getActiveStep(status: "upcoming" | "completed" | "cancelled"): number {
  switch (status) {
    case "upcoming": return 1;
    case "completed": return 3;
    case "cancelled": return -1;
  }
}

function SessionTimeline({ status }: { status: "upcoming" | "completed" | "cancelled" }) {
  if (status === "cancelled") {
    return (
      <span className="text-xs font-dmsans font-medium text-cream-400 bg-cream-100 px-3 py-1 rounded-full">
        Cancelled
      </span>
    );
  }

  const activeStep = getActiveStep(status);

  return (
    <div className="hidden sm:flex items-center gap-0">
      {timelineSteps.map((step, i) => (
        <React.Fragment key={step}>
          {/* Dot */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all",
                i < activeStep
                  ? "bg-rose-600"
                  : i === activeStep
                  ? "bg-rose-600 ring-4 ring-rose-600/20"
                  : "bg-cream-200 border border-cream-400"
              )}
            />
            <span
              className={cn(
                "text-[10px] font-dmsans mt-1 whitespace-nowrap",
                i <= activeStep ? "text-rose-900" : "text-cream-400"
              )}
            >
              {step}
            </span>
          </div>
          {/* Connecting line */}
          {i < timelineSteps.length - 1 && (
            <div
              className={cn(
                "h-[2px] w-5 -mt-3",
                i < activeStep ? "bg-rose-600" : "bg-cream-200"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

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
      <SessionTimeline status={status} />
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
