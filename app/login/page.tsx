"use client";

import React, { Suspense, useState, useCallback } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";

type Mode = "login" | "signup";

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const resetForm = useCallback(() => {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
  }, []);

  function switchMode(next: Mode) {
    resetForm();
    setMode(next);
  }

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signup") {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(
        mode === "signup"
          ? "Account created but sign-in failed. Please sign in."
          : "Invalid email or password"
      );
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  function handleGoogle() {
    setGoogleLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  }

  const isLogin = mode === "login";

  return (
    <div className="min-h-screen flex">
      {/* ── Left brand panel (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col justify-between p-12">
        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-rose-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 w-[400px] h-[400px] rounded-full bg-rose-400/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-rose-200/20 blur-2xl" />

        {/* Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-playfair text-2xl font-semibold text-rose-900">
              Aura
            </span>
          </div>
          <p className="text-sm font-dmsans text-cream-700 ml-[52px]">
            Wellness Consulting
          </p>
        </div>

        {/* Center message */}
        <div className="relative z-10 max-w-md">
          <h2 className="font-playfair text-4xl xl:text-5xl font-semibold text-rose-900 leading-tight mb-6">
            Your journey to
            <br />
            <span className="text-rose-600">wellness</span> starts
            <br />
            here.
          </h2>
          <p className="font-dmsans text-cream-700 text-lg leading-relaxed">
            Join a community dedicated to personal growth, mindful living, and
            holistic well-being. Your best self is waiting.
          </p>
        </div>

        {/* Bottom decorative dots */}
        <div className="relative z-10 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-600" />
          <div className="w-2 h-2 rounded-full bg-rose-400" />
          <div className="w-2 h-2 rounded-full bg-rose-200" />
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-[440px]">
          {/* Mobile brand (visible on small screens) */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-playfair text-xl font-semibold text-rose-900">
              Aura
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-playfair text-3xl sm:text-[34px] font-semibold text-rose-900 leading-tight">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 font-dmsans text-cream-700">
              {isLogin
                ? "Sign in to continue your wellness journey"
                : "Start your wellness journey today"}
            </p>
          </div>

          {/* Google Auth */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border border-rose-400/40 bg-white/70 hover:bg-white hover:border-rose-400/60 transition-all duration-200 font-dmsans text-sm font-medium text-rose-900 disabled:opacity-50 disabled:pointer-events-none"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-rose-300 border-t-rose-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-rose-400/25" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-xs font-dmsans text-cream-400 bg-[#FDF6F4]">
                or continue with email
              </span>
            </div>
          </div>

          {/* Email/password form */}
          <form onSubmit={handleCredentials} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-dmsans font-medium text-rose-900 mb-1.5">
                  Full name
                </label>
                <Input
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-dmsans font-medium text-rose-900 mb-1.5">
                Email
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-dmsans font-medium text-rose-900 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={isLogin ? "Enter your password" : "Min. 8 characters"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={isLogin ? undefined : 8}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-400 hover:text-rose-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50/80 border border-red-200/60 px-3.5 py-2.5">
                <p className="text-sm text-red-700 font-dmsans">{error}</p>
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              className="w-full gap-2 mt-2"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                <>
                  {isLogin ? "Sign in" : "Create account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Switch mode */}
          <p className="mt-8 text-center text-sm font-dmsans text-cream-700">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => switchMode(isLogin ? "signup" : "login")}
              className="text-rose-600 hover:text-rose-800 font-medium transition-colors"
            >
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
