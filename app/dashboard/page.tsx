import React from "react";
import { CalendarDays, Clock, Sparkles, Star } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { SessionCard } from "@/components/dashboard/session-card";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { db } from "@/lib/db";
import { quotes } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { FadeUp } from "@/components/ui/fade-up";

export default async function DashboardPage() {
  // Fetch one random quote from the DB
  const [quote] = await db
    .select()
    .from(quotes)
    .orderBy(sql`RANDOM()`)
    .limit(1);

  return (
    <>
      {/* Welcome hero */}
      <FadeUp>
      <Card variant="glass" className="mb-8 p-8">
        <h1 className="font-playfair text-[32px] font-semibold text-rose-900">
          Good morning
        </h1>
        <p className="mt-2 font-dmsans text-cream-700">
          Here&apos;s what&apos;s happening with your wellness journey today.
        </p>
      </Card>
      </FadeUp>

      {/* Stat cards */}
      <FadeUp delay={100}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatCard label="Upcoming Sessions" value="--" icon={CalendarDays} />
        <StatCard label="Hours This Month" value="--" icon={Clock} />
        <StatCard label="Avg. Rating" value="--" icon={Star} />
      </div>
      </FadeUp>

      {/* Upcoming session */}
      <FadeUp delay={200}>
      <PageHeader title="Next Session" />
      <SessionCard className="mb-8" />
      </FadeUp>

      {/* Inspiration — single random quote */}
      <FadeUp delay={300}>
      <PageHeader title="Inspiration" />
      {quote ? (
        <Card variant="glass" className="p-8">
          <div className="flex flex-col items-center text-center gap-4">
            <Badge variant="muted">{quote.category}</Badge>
            <blockquote className="font-playfair text-xl md:text-2xl font-semibold text-rose-900 italic leading-relaxed max-w-2xl">
              &ldquo;{quote.content}&rdquo;
            </blockquote>
            <p className="font-dmsans text-cream-700 text-sm">
              — {quote.author}
            </p>
          </div>
        </Card>
      ) : (
        <Card variant="glass" className="p-8">
          <EmptyState
            icon={<Sparkles size={28} className="text-rose-600" />}
            title="No quotes yet"
            description="Inspirational quotes will appear here once added."
            className="py-8"
          />
        </Card>
      )}
      </FadeUp>
    </>
  );
}
