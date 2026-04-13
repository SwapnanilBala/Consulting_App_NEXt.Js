"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Signup is handled by the unified auth portal at /login
export default function SignupRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login?mode=signup");
  }, [router]);

  return null;
}
