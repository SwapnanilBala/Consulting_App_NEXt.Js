"use client";

import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ContentCard } from "@/components/dashboard/content-card";
import { cn } from "@/lib/utils";

const categories = ["All", "Wellness", "Growth", "Nutrition", "Movement", "Rest"];

export default function InspirationPage() {
  const [activeCategory, setActiveCategory] = React.useState("All");

  return (
    <>
      <PageHeader
        title="Inspiration"
        description="Curated content for your wellness journey"
      />

      {/* Category pills filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={cn(
              "shrink-0 px-4 py-2 rounded-full text-sm font-dmsans transition-colors",
              activeCategory === c
                ? "bg-rose-600 text-white"
                : "bg-white/60 text-cream-700 hover:bg-rose-100"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* 2-up content card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <ContentCard
          title="Morning Mindfulness"
          excerpt="Start your day with intention and clarity through guided practices."
          category="Wellness"
        />
        <ContentCard
          title="Building Resilience"
          excerpt="Strategies for navigating change with grace and inner strength."
          category="Growth"
        />
        <ContentCard
          title="Nourishing from Within"
          excerpt="How mindful eating can transform your relationship with food."
          category="Nutrition"
        />
        <ContentCard
          title="The Art of Rest"
          excerpt="Why rest isn't laziness — and how to reclaim restorative downtime."
          category="Rest"
        />
      </div>
    </>
  );
}
