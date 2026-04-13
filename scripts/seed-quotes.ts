import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { quotes } from "../lib/db/schema";

const seedQuotes = [
  // ── Wellness ──
  { content: "The greatest wealth is health.", author: "Virgil", category: "Wellness" },
  { content: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn", category: "Wellness" },
  { content: "Happiness is the highest form of health.", author: "Dalai Lama", category: "Wellness" },
  { content: "Nothing can dim the light that shines from within.", author: "Maya Angelou", category: "Wellness" },
  { content: "Self-care is how you take your power back.", author: "Lalah Delia", category: "Wellness" },
  { content: "Mindfulness is a way of befriending ourselves and our experience.", author: "Jon Kabat-Zinn", category: "Wellness" },
  { content: "The present moment is the only moment available to us, and it is the door to all moments.", author: "Thich Nhat Hanh", category: "Wellness" },
  { content: "Self-care is not self-indulgence, it is self-preservation.", author: "Audre Lorde", category: "Wellness" },
  { content: "You yourself, as much as anybody in the entire universe, deserve your love and affection.", author: "Buddha", category: "Wellness" },
  { content: "To keep the body in good health is a duty, otherwise we shall not be able to keep our mind strong and clear.", author: "Buddha", category: "Wellness" },

  // ── Growth ──
  { content: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Growth" },
  { content: "Growth is painful. Change is painful. But nothing is as painful as staying stuck.", author: "Mandy Hale", category: "Growth" },
  { content: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson", category: "Growth" },
  { content: "Be who you are and say what you feel, because those who mind don't matter, and those who matter don't mind.", author: "Bernard M. Baruch", category: "Growth" },
  { content: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn", category: "Growth" },
  { content: "Nothing will work unless you do.", author: "Maya Angelou", category: "Growth" },
  { content: "The secret of getting ahead is getting started.", author: "Mark Twain", category: "Growth" },
  { content: "It is never too late to be what you might have been.", author: "George Eliot", category: "Growth" },

  // ── Nutrition ──
  { content: "Let food be thy medicine and medicine be thy food.", author: "Hippocrates", category: "Nutrition" },
  { content: "The food you eat can be either the safest and most powerful form of medicine or the slowest form of poison.", author: "Ann Wigmore", category: "Nutrition" },
  { content: "One cannot think well, love well, sleep well, if one has not dined well.", author: "Virginia Woolf", category: "Nutrition" },
  { content: "Exercise is king and nutrition is queen. Together you have a kingdom.", author: "Jack LaLanne", category: "Nutrition" },
  { content: "Your diet is a bank account. Good food choices are good investments.", author: "Bethenny Frankel", category: "Nutrition" },

  // ── Movement ──
  { content: "Movement is a medicine for creating change in a person's physical, emotional, and mental states.", author: "Carol Welch", category: "Movement" },
  { content: "The body achieves what the mind believes.", author: "Napoleon Hill", category: "Movement" },
  { content: "Walking is the best possible exercise. Habituate yourself to walk very far.", author: "Thomas Jefferson", category: "Movement" },
  { content: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun", category: "Movement" },
  { content: "If it doesn't challenge you, it won't change you.", author: "Fred DeVito", category: "Movement" },
  { content: "Fitness is not about being better than someone else. It's about being better than you used to be.", author: "Khloe Kardashian", category: "Movement" },

  // ── Rest ──
  { content: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott", category: "Rest" },
  { content: "Rest when you're weary. Refresh and renew yourself, your body, your mind, your spirit.", author: "Ralph Marston", category: "Rest" },
  { content: "The time to relax is when you don't have time for it.", author: "Sydney J. Harris", category: "Rest" },
  { content: "Rest and play are as vital to our health as nutrition and exercise.", author: "Brené Brown", category: "Rest" },
  { content: "Your calm mind is the ultimate weapon against your challenges. So relax.", author: "Bryant McGill", category: "Rest" },
];

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  console.log("Seeding quotes...");
  await db.insert(quotes).values(seedQuotes);
  console.log(`Inserted ${seedQuotes.length} quotes.`);
}

seed().catch(console.error);
