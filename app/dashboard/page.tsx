import React from "react";
import { CalendarDays, Clock, Star } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { SessionCard } from "@/components/dashboard/session-card";
import { ContentCard } from "@/components/dashboard/content-card";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <>
      {/* Welcome hero */}
      <Card variant="glass" className="mb-8 p-8">
        <h1 className="font-playfair text-[32px] font-semibold text-rose-900">
          Good morning
        </h1>
        <p className="mt-2 font-dmsans text-cream-700">
          Here&apos;s what&apos;s happening with your wellness journey today.
        </p>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard label="Upcoming Sessions" value="--" icon={CalendarDays} />
        <StatCard label="Hours This Month" value="--" icon={Clock} />
        <StatCard label="Avg. Rating" value="--" icon={Star} />
      </div>

      {/* Upcoming session */}
      <PageHeader title="Next Session" />
      <SessionCard className="mb-8" />

      {/* Inspiration grid */}
      <PageHeader title="Inspiration" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <ContentCard
          title="Morning Mindfulness"
          excerpt="Start your day with intention and clarity."
          category="Wellness"
        />
        <ContentCard
          title="Building Resilience"
          excerpt="Strategies for navigating change with grace."
          category="Growth"
        />
      </div>
    </>
  );
}
