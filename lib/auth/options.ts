import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users, accounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .limit(1);

        if (!user || !user.passwordHash) {
          throw new Error("Invalid email or password");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatarUrl,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Upsert user for Google OAuth
        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email!))
          .limit(1);

        let userId: string;

        if (!existingUser) {
          const [newUser] = await db
            .insert(users)
            .values({
              email: user.email!,
              name: user.name ?? "User",
              avatarUrl: user.image,
              emailVerified: new Date(),
            })
            .returning();
          userId = newUser.id;
        } else {
          userId = existingUser.id;
          // Update avatar if not set
          if (!existingUser.avatarUrl && user.image) {
            await db
              .update(users)
              .set({ avatarUrl: user.image, updatedAt: new Date() })
              .where(eq(users.id, existingUser.id));
          }
        }

        // Upsert OAuth account link
        const [existingAccount] = await db
          .select()
          .from(accounts)
          .where(eq(accounts.providerAccountId, account.providerAccountId))
          .limit(1);

        if (!existingAccount) {
          await db.insert(accounts).values({
            userId,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            expiresAt: account.expires_at,
            tokenType: account.token_type,
            scope: account.scope,
            idToken: account.id_token,
          });
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // On initial sign-in, look up the DB user to get the UUID
        const [dbUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email!))
          .limit(1);
        if (dbUser) {
          token.userId = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
