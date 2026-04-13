import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const userName = session?.user?.name ?? "Welcome";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        userName={userName}
        userInitials={userInitials}
        userAvatar={session?.user?.image ?? undefined}
        userId={session?.user?.id}
      />
      <main className="flex-1 md:ml-60 p-6 md:p-8 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  );
}
