"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />,
  error: <AlertCircle size={16} className="text-red-500 shrink-0" />,
  info: <Info size={16} className="text-rose-600 shrink-0" />,
};

const bgColors: Record<ToastType, string> = {
  success: "border-emerald-400/40 bg-emerald-50",
  error: "border-red-400/40 bg-red-50",
  info: "border-rose-400/40 bg-white",
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm animate-toast-in min-w-[280px] max-w-[400px]",
        bgColors[toast.type]
      )}
    >
      {icons[toast.type]}
      <p className="flex-1 text-sm font-dmsans text-rose-900">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-cream-700 hover:text-rose-900 transition-colors shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}
