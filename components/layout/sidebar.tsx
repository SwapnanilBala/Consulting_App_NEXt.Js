"use client";

import React from "react";
import {
  Home,
  CalendarDays,
  MessageCircle,
  Users,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { NavItem } from "./nav-item";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/sessions", label: "My Sessions", icon: CalendarDays },
  { href: "/dashboard/messages", label: "Messages", icon: MessageCircle },
  { href: "/dashboard/community", label: "Community", icon: Users },
  { href: "/dashboard/inspiration", label: "Inspiration", icon: Sparkles },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

interface SidebarProps {
  userName?: string;
  userInitials?: string;
  userAvatar?: string;
}

export function Sidebar({
  userName = "Welcome",
  userInitials = "U",
  userAvatar,
}: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 glass p-5 z-30">
        <div className="flex items-center justify-between px-3 pb-6">
          <span className="font-playfair text-2xl font-semibold text-rose-900 dark:text-rose-200">
            Aura
          </span>
          <ThemeToggle />
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>

        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-rose-100/50">
          <Avatar
            src={userAvatar}
            fallback={userInitials}
            size={36}
          />
          <span className="text-sm font-dmsans font-medium text-rose-900 truncate">
            {userName}
          </span>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-strong z-30 flex items-center justify-around px-2 py-2 safe-area-bottom">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-2 py-1 text-cream-700"
            >
              <Icon size={20} />
              <span className="text-[10px] font-dmsans">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </>
  );
}
