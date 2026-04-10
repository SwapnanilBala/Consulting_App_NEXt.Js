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
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-dmsans transition-colors",
        isActive
          ? "bg-rose-200 text-rose-900 font-medium"
          : "text-cream-700 hover:bg-rose-100"
      )}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}
