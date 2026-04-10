import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

export default function BillingPage() {
  return (
    <>
      <PageHeader title="Billing" description="Manage your plan and payments" />

      {/* Plan card */}
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
          <Button variant="primary">Upgrade Plan</Button>
          <Button variant="secondary">Cancel</Button>
        </div>
      </Card>

      {/* Payment method */}
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

      {/* Invoice table */}
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
    </>
  );
}
