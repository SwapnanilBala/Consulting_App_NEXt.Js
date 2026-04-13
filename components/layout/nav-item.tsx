"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function NavItem({ href, label, icon: Icon }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-dmsans transition-all duration-200",
        isActive
          ? "bg-rose-200/60 text-rose-900 font-medium shadow-[0_0_12px_rgba(212,83,126,0.12)]"
          : "text-cream-700 hover:bg-rose-100"
      )}
    >
      {isActive && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full"
          style={{ background: "linear-gradient(to bottom, #E8A4B8, #D4537E)" }}
        />
      )}
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}
