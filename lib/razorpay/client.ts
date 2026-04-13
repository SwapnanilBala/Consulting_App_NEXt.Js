import Razorpay from "razorpay";
import { env } from "@/lib/env";

let instance: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (!instance) {
    instance = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
  }
  return instance;
}
