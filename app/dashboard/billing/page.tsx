"use client";

import React, { useState, useCallback } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, X, MapPin, IndianRupee } from "lucide-react";
import { FadeUp } from "@/components/ui/fade-up";
import { useToast } from "@/components/ui/toast";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { email?: string; name?: string };
  theme?: { color?: string };
  handler: (response: RazorpayResponse) => void;
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

const plans = [
  {
    id: "starter",
    name: "Starter",
    priceINR: 499,
    features: ["5 sessions / month", "Email support", "Community access"],
  },
  {
    id: "wellness_pro",
    name: "Wellness Pro",
    priceINR: 1499,
    features: [
      "Unlimited sessions",
      "Priority booking",
      "Community access",
      "Direct messaging",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceINR: 4999,
    features: [
      "Everything in Pro",
      "Dedicated consultant",
      "Custom reports",
      "Team accounts",
    ],
  },
];

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function BillingPage() {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUpgrade = useCallback(async (planId: string, amountINR: number) => {
    setLoading(planId);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast("Failed to load Razorpay. Please check your connection and try again.", "error");
        return;
      }

      const res = await fetch("/api/billing/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, amount: amountINR }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast(err.error ?? "Could not create order. Try again.", "error");
        return;
      }

      const { orderId, key, currency, amount } = await res.json();

      const options: RazorpayOptions = {
        key,
        amount,
        currency,
        name: "Consulting App",
        description: `${plans.find((p) => p.id === planId)?.name} Plan`,
        order_id: orderId,
        theme: { color: "#D4537E" },
        handler: async (response: RazorpayResponse) => {
          const verifyRes = await fetch("/api/billing/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              plan: planId,
            }),
          });

          if (verifyRes.ok) {
            setShowUpgrade(false);
            window.location.reload();
          } else {
            toast("Payment verification failed. Contact support.", "error");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(null);
    }
  }, [toast]);

  return (
    <>
      <FadeUp>
        <PageHeader title="Billing" description="Manage your plan and payments" />
      </FadeUp>

      {/* Plan card */}
      <FadeUp delay={100}>
      <Card variant="glass" className="glass-strong mb-6 p-8">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="success" className="mb-3">
              Active
            </Badge>
            <h2 className="font-playfair text-2xl font-semibold text-rose-900">
              Wellness Pro
            </h2>
            <p className="text-sm font-dmsans text-cream-700 mt-1">
              Unlimited sessions &middot; Priority booking &middot; Community access
            </p>
          </div>
          <div className="text-right">
            <p className="font-playfair text-3xl font-semibold text-rose-900">
              --
            </p>
            <p className="text-sm text-cream-700">/month</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="primary" onClick={() => setShowUpgrade(true)}>
            Upgrade Plan
          </Button>
          <Button variant="secondary">Cancel</Button>
        </div>
      </Card>
      </FadeUp>

      {/* Upgrade modal */}
      {showUpgrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl mx-4 rounded-2xl bg-cream-50 border border-rose-400/30 shadow-xl p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowUpgrade(false)}
              className="absolute top-4 right-4 text-cream-700 hover:text-rose-900 transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="font-playfair text-2xl font-semibold text-rose-900 mb-2">
              Choose a Plan
            </h2>

            {/* India-only notice */}
            <div className="flex items-center gap-2 rounded-xl bg-rose-100 border border-rose-400/30 px-4 py-3 mb-6">
              <MapPin size={16} className="text-rose-600 shrink-0" />
              <p className="text-sm font-dmsans text-rose-900">
                Payments are currently available for <strong>India</strong> only.
                We accept UPI, cards, net banking &amp; wallets via Razorpay.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-xl border p-5 transition-all ${
                    plan.popular
                      ? "border-rose-600 bg-white shadow-md"
                      : "border-rose-400/30 bg-white/60"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-2.5 left-4 bg-rose-600 text-white text-[10px] font-dmsans font-medium px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                  <h3 className="font-playfair text-lg font-semibold text-rose-900">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-2 mb-4">
                    <IndianRupee size={16} className="text-rose-900" />
                    <span className="font-playfair text-2xl font-semibold text-rose-900">
                      {plan.priceINR}
                    </span>
                    <span className="text-xs text-cream-700">/month</span>
                  </div>
                  <ul className="flex-1 space-y-2 mb-5">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="text-xs font-dmsans text-cream-700 flex items-start gap-1.5"
                      >
                        <span className="text-rose-600 mt-0.5">&#10003;</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.popular ? "primary" : "secondary"}
                    size="sm"
                    className="w-full"
                    disabled={loading === plan.id}
                    onClick={() => handleUpgrade(plan.id, plan.priceINR)}
                  >
                    {loading === plan.id ? "Processing…" : "Select"}
                  </Button>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-cream-700 text-center mt-5">
              Secured by Razorpay &middot; Prices in INR &middot; Cancel anytime
            </p>
          </div>
        </div>
      )}

      {/* Payment method */}
      <FadeUp delay={200}>
        <h2 className="font-playfair text-xl font-semibold text-rose-900 mb-4">
          Payment Method
        </h2>
        <Card variant="default" className="flex items-center gap-4 mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-200/60">
            <CreditCard size={18} className="text-rose-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-dmsans font-medium text-rose-900">
              &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; ----
            </p>
            <p className="text-xs text-cream-700">Expires --/--</p>
          </div>
          <Button variant="ghost" size="sm">
            Update
          </Button>
        </Card>
      </FadeUp>

      {/* Invoice table */}
      <FadeUp delay={300}>
        <h2 className="font-playfair text-xl font-semibold text-rose-900 mb-4">
          Invoices
        </h2>
        <Card variant="default" className="overflow-hidden p-0">
          <table className="w-full text-sm font-dmsans">
            <thead>
              <tr className="border-b border-rose-400/20">
                <th className="text-left px-5 py-3 text-cream-700 font-medium">
                  Date
                </th>
                <th className="text-left px-5 py-3 text-cream-700 font-medium">
                  Description
                </th>
                <th className="text-left px-5 py-3 text-cream-700 font-medium">
                  Amount
                </th>
                <th className="text-right px-5 py-3 text-cream-700 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b border-rose-400/10 last:border-0">
                  <td className="px-5 py-3 text-rose-900">--</td>
                  <td className="px-5 py-3 text-rose-900">Wellness Pro — Monthly</td>
                  <td className="px-5 py-3 text-rose-900">--</td>
                  <td className="px-5 py-3 text-right">
                    <Badge variant="success">Paid</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </FadeUp>
    </>
  );
}
