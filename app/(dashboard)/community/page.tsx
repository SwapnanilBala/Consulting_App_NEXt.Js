"use client";

import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { PostCard } from "@/components/dashboard/post-card";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const groups = ["All", "Mindfulness", "Nutrition", "Fitness", "Self-Care"];

export default function CommunityPage() {
  const [activeGroup, setActiveGroup] = React.useState("All");

  return (
    <>
      <PageHeader title="Community" description="Connect with fellow members" />

      {/* Horizontal group pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => setActiveGroup(g)}
            className={cn(
              "shrink-0 px-4 py-2 rounded-full text-sm font-dmsans transition-colors",
              activeGroup === g
                ? "bg-rose-600 text-white"
                : "bg-white/60 text-cream-700 hover:bg-rose-100"
            )}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Post cards */}
      <div className="space-y-4">
        <PostCard
          authorName="Mia Chen"
          authorInitials="MC"
          content="Just completed my 30-day mindfulness challenge! The consistency really made a difference in my daily routine."
          upvotes={12}
          replies={4}
        />
        <PostCard
          authorName="Anonymous"
          authorInitials="A"
          content="Does anyone have tips for maintaining a meditation practice while traveling?"
          upvotes={8}
          replies={6}
          isAnonymous
        />
        <PostCard
          authorName="Jordan Lee"
          authorInitials="JL"
          content="Sharing my morning routine that transformed my energy levels. Would love feedback!"
          upvotes={23}
          replies={11}
        />
      </div>

      {/* FAB */}
      <button className="fixed bottom-24 md:bottom-8 right-6 bg-rose-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-rose-800 transition-colors z-20">
        <Plus size={24} />
      </button>
    </>
  );
}
