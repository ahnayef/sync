import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2";

import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        
        try {
          const [rows] = await db.execute<RowDataPacket[]>(
            "SELECT * FROM users WHERE email = ?",
            [credentials.email]
          );

          const user = rows[0];
          if (!user || !user.password_hash) return null;

          const isValid = await bcrypt.compare(credentials.password, user.password_hash);
          if (!isValid) return null;

          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            image: user.avatar_url,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // If they just logged in, 'user' is present.
        token.id = user.id;
      }

      // When update() is called from the client
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.email) token.email = session.email;
        // Allow client to refresh hasSelectedCourses after saving courses
        if (typeof session.hasSelectedCourses === "boolean") {
          token.hasSelectedCourses = session.hasSelectedCourses;
        }
      }

      if (token.email) {
        try {
          const [rows] = await db.execute<RowDataPacket[]>(
            "SELECT id, role, name, email FROM users WHERE email = ?",
            [String(token.email)]
          );
          if (rows.length > 0) {
            token.role = rows[0].role;
            token.id = rows[0].id;
            token.name = rows[0].name;
            token.email = rows[0].email;

            // Check if this student has any selected courses
            if (rows[0].role === "student") {
              const [courseRows] = await db.execute<RowDataPacket[]>(
                "SELECT 1 FROM student_courses WHERE student_id = ? LIMIT 1",
                [rows[0].id]
              );
              token.hasSelectedCourses = courseRows.length > 0;
            } else {
              // Admins/moderators don't need course selection
              token.hasSelectedCourses = true;
            }
          }
        } catch (error) {
          console.error("Error fetching user for jwt by email:", error);
        }
      } else if (token.id) {
        try {
          const [rows] = await db.execute<RowDataPacket[]>(
            "SELECT id, role, name, email FROM users WHERE id = ?",
            [String(token.id)]
          );
          if (rows.length > 0) {
            token.role = rows[0].role;
            token.id = rows[0].id;
            token.name = rows[0].name;
            token.email = rows[0].email;

            // Check if this student has any selected courses
            if (rows[0].role === "student") {
              const [courseRows] = await db.execute<RowDataPacket[]>(
                "SELECT 1 FROM student_courses WHERE student_id = ? LIMIT 1",
                [rows[0].id]
              );
              token.hasSelectedCourses = courseRows.length > 0;
            } else {
              // Admins/moderators don't need course selection
              token.hasSelectedCourses = true;
            }
          }
        } catch (error) {
          console.error("Error fetching user for jwt by id:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).hasSelectedCourses = token.hasSelectedCourses;
        session.user.name = token.name;
        session.user.email = token.email;
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
