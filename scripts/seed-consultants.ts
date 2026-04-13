import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "../lib/db/schema";

const consultants = [
  {
    email: "sarah.mitchell@aura.com",
    name: "Sarah Mitchell",
    role: "consultant",
    specialty: "Mindfulness",
    bio: "Certified mindfulness practitioner with 10 years of experience helping clients find inner peace and clarity through meditation and breathwork.",
  },
  {
    email: "dr.rivera@aura.com",
    name: "Dr. James Rivera",
    role: "consultant",
    specialty: "Mental Health",
    bio: "Licensed psychologist specializing in cognitive behavioral therapy, stress management, and emotional resilience building.",
  },
  {
    email: "priya.sharma@aura.com",
    name: "Priya Sharma",
    role: "consultant",
    specialty: "Nutrition",
    bio: "Registered dietitian passionate about holistic nutrition and plant-based wellness. Helping clients build sustainable eating habits.",
  },
  {
    email: "mike.chen@aura.com",
    name: "Mike Chen",
    role: "consultant",
    specialty: "Fitness",
    bio: "Personal trainer and movement coach focused on functional fitness, mobility, and building strength for everyday life.",
  },
  {
    email: "emma.taylor@aura.com",
    name: "Emma Taylor",
    role: "consultant",
    specialty: "Self-Care",
    bio: "Life coach and self-care advocate helping clients design personalized wellness routines that stick.",
  },
  {
    email: "dr.anika.patel@aura.com",
    name: "Dr. Anika Patel",
    role: "consultant",
    specialty: "Mindfulness",
    bio: "Neuroscience researcher turned wellness consultant, bridging the gap between science and mindfulness practice.",
  },
];

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  console.log("Seeding consultants...");
  for (const c of consultants) {
    await db.insert(users).values(c).onConflictDoNothing();
  }
  console.log(`Seeded ${consultants.length} consultants.`);
}

seed().catch(console.error);
