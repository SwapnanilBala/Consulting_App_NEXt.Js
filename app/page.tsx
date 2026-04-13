import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export default async function Home() {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch {
    // Auth not configured or session fetch failed — send to login
    redirect("/login");
  }

  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
