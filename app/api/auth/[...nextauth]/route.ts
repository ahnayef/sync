import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && user.email) {
        try {
          const [rows] = await db.execute<RowDataPacket[]>(
            "SELECT * FROM users WHERE email = ?",
            [user.email]
          );

          if (rows.length === 0) {
            // New user, insert into DB
            await db.execute(
              "INSERT INTO users (name, email, avatar_url, role) VALUES (?, ?, ?, 'student')",
              [user.name || "Unknown", user.email, user.image || null]
            );
          } else {
            // Existing user, optionally update avatar and name
            await db.execute(
              "UPDATE users SET name = ?, avatar_url = ? WHERE email = ?",
              [user.name || rows[0].name, user.image || rows[0].avatar_url, user.email]
            );
          }
          return true;
        } catch (error) {
          console.error("Error saving user to DB:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          const [rows] = await db.execute<RowDataPacket[]>(
            "SELECT * FROM users WHERE email = ?",
            [session.user.email]
          );
          if (rows.length > 0) {
            (session.user as any).role = rows[0].role;
            (session.user as any).id = rows[0].id;
          }
        } catch (error) {
          console.error("Error fetching user session:", error);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
