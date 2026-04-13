"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ContentCard } from "@/components/dashboard/content-card";
import { ContentCardSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Quote {
  id: string;
  content: string;
  author: string;
  category: string;
  imageUrl: string | null;
}

const categories = ["All", "Wellness", "Growth", "Nutrition", "Movement", "Rest"];

export default function InspirationPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuotes() {
      setLoading(true);
      const params = new URLSearchParams({ random: "true", limit: "20" });
      if (activeCategory !== "All") {
        params.set("category", activeCategory);
      }
      const res = await fetch(`/api/quotes?${params}`);
      if (res.ok) {
        const data = await res.json();
        setQuotes(data.quotes);
      }
      setLoading(false);
    }
    fetchQuotes();
  }, [activeCategory]);

  return (
    <>
      <PageHeader
        title="Inspiration"
        description="Curated wisdom for your wellness journey"
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

      {/* Content grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <ContentCardSkeleton key={i} />
          ))}
        </div>
      ) : quotes.length === 0 ? (
        <p className="text-center text-cream-700 font-dmsans py-12">
          No quotes found. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {quotes.map((q) => (
            <ContentCard
              key={q.id}
              title={`"${q.content}"`}
              excerpt={`— ${q.author}`}
              category={q.category}
              imageUrl={q.imageUrl ?? undefined}
            />
          ))}
        </div>
      )}
    </>
  );
}
