function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  get DATABASE_URL() {
    return required("DATABASE_URL");
  },
  get UPSTASH_REDIS_REST_URL() {
    return required("UPSTASH_REDIS_REST_URL");
  },
  get UPSTASH_REDIS_REST_TOKEN() {
    return required("UPSTASH_REDIS_REST_TOKEN");
  },
  get ABLY_API_KEY() {
    return required("ABLY_API_KEY");
  },
  get RAZORPAY_KEY_ID() {
    return required("RAZORPAY_KEY_ID");
  },
  get RAZORPAY_KEY_SECRET() {
    return required("RAZORPAY_KEY_SECRET");
  },
} as const;
