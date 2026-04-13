"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ConsultantCard } from "@/components/dashboard/consultant-card";
import { EmptyState } from "@/components/ui/empty-state";
import { FadeUp } from "@/components/ui/fade-up";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Consultant {
  id: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  specialty: string | null;
  createdAt: string;
}

const specialties = ["All", "Mindfulness", "Nutrition", "Fitness", "Self-Care", "Mental Health"];

export default function ConsultantsPage() {
  const [activeSpecialty, setActiveSpecialty] = useState("All");
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConsultants() {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeSpecialty !== "All") {
        params.set("specialty", activeSpecialty);
      }
      const res = await fetch(`/api/consultants?${params}`);
      if (res.ok) {
        const data = await res.json();
        setConsultants(data.consultants);
      }
      setLoading(false);
    }
    fetchConsultants();
  }, [activeSpecialty]);

  return (
    <>
      <FadeUp>
        <PageHeader
          title="Find a Consultant"
          description="Browse our wellness experts"
        />
      </FadeUp>

      {/* Specialty filter pills */}
      <FadeUp delay={100}>
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {specialties.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSpecialty(s)}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-sm font-dmsans transition-colors",
                activeSpecialty === s
                  ? "bg-rose-600 text-white"
                  : "bg-white/60 text-cream-700 hover:bg-rose-100"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </FadeUp>

      {/* Consultant grid */}
      <FadeUp delay={200}>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-subtle rounded-2xl h-52 animate-pulse" />
            ))}
          </div>
        ) : consultants.length === 0 ? (
          <EmptyState
            icon={<Search size={28} className="text-rose-600" />}
            title="No consultants found"
            description="No consultants match this specialty yet. Try a different filter or check back soon."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {consultants.map((c) => (
              <ConsultantCard
                key={c.id}
                name={c.name}
                avatarUrl={c.avatarUrl}
                specialty={c.specialty}
                bio={c.bio}
              />
            ))}
          </div>
        )}
      </FadeUp>
    </>
  );
}
