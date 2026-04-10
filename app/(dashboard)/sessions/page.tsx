import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { SessionCard } from "@/components/dashboard/session-card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function SessionsPage() {
  return (
    <>
      <PageHeader title="My Sessions" description="Manage your upcoming and past sessions">
        <Button variant="primary">Book Session</Button>
      </PageHeader>

      {/* Upcoming sessions */}
      <h2 className="font-playfair text-xl font-semibold text-rose-900 mb-4">
        Upcoming
      </h2>
      <div className="space-y-4 mb-8">
        <SessionCard
          consultantName="Sarah Mitchell"
          consultantInitials="SM"
          date="Thursday, Apr 10"
          time="2:00 PM"
          status="upcoming"
        />
        <SessionCard
          consultantName="Dr. Rivera"
          consultantInitials="DR"
          date="Monday, Apr 14"
          time="10:00 AM"
          status="upcoming"
        />
      </div>

      {/* Past sessions — collapsed */}
      <button className="flex items-center gap-2 text-cream-700 hover:text-rose-900 transition-colors mb-4">
        <h2 className="font-playfair text-xl font-semibold">Past Sessions</h2>
        <ChevronDown size={18} />
      </button>
      <div className="space-y-4 opacity-70">
        <SessionCard
          consultantName="Sarah Mitchell"
          consultantInitials="SM"
          date="March 28"
          time="2:00 PM"
          status="completed"
        />
        <SessionCard
          consultantName="Dr. Rivera"
          consultantInitials="DR"
          date="March 20"
          time="10:00 AM"
          status="completed"
        />
      </div>
    </>
  );
}
