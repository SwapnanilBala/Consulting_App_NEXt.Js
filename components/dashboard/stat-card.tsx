import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, className }: StatCardProps) {
  return (
    <Card variant="stat" className={cn("flex items-center gap-4", className)}>
      {Icon && (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-200/60">
          <Icon size={18} className="text-rose-600" />
        </div>
      )}
      <div>
        <p className="text-sm font-dmsans text-cream-700 dark:text-cream-200">{label}</p>
        <p className="text-2xl font-playfair font-semibold text-rose-900 dark:text-rose-100">
          {value}
        </p>
      </div>
    </Card>
  );
}
