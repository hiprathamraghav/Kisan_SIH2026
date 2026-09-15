import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

declare module "next-auth" {
  interface User {
    role: "KISAN" | "ADMIN";
    referenceId: string;
    permissions: string[];
  }
  interface Session {
    user: {
      id: string;
      role: "KISAN" | "ADMIN";
      referenceId: string;
      permissions: string[];
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      id: "kisan-credentials",
      name: "Kisan",
      credentials: { identifier: {}, password: {} },
      async authorize(credentials) {
        const identifier = String(credentials.identifier || "").trim();
        const password = String(credentials.password || "");
        const kisan = await prisma.kisan.findFirst({
          where: {
            isActive: true,
            OR: [
              { phoneNumber: identifier },
              { kisanId: identifier.toUpperCase() },
            ],
          },
        });
        if (!kisan || !(await bcrypt.compare(password, kisan.passwordHash)))
          return null;
        return {
          id: kisan.id,
          name: kisan.name,
          role: "KISAN",
          referenceId: kisan.kisanId,
          permissions: [],
        };
      },
    }),
    Credentials({
      id: "admin-credentials",
      name: "Admin",
      credentials: { identifier: {}, password: {} },
      async authorize(credentials) {
        const identifier = String(credentials.identifier || "").trim();
        const password = String(credentials.password || "");
        const admin = await prisma.admin.findFirst({
          where: {
            OR: [
              { phoneNumber: identifier },
              { adminId: identifier.toUpperCase() },
            ],
          },
        });
        if (!admin || !(await bcrypt.compare(password, admin.passwordHash)))
          return null;
        return {
          id: admin.id,
          name: admin.name,
          role: "ADMIN",
          referenceId: admin.adminId,
          permissions: admin.permissions,
        };
      },
    }),
  ],
  pages: { signIn: "/auth/kisan/login" },
  callbacks: {
    jwt({ token, user }) {
      const mutableToken = token as typeof token & {
        role?: "KISAN" | "ADMIN";
        referenceId?: string;
        permissions?: string[];
      };
      if (user) {
        mutableToken.role = user.role;
        mutableToken.referenceId = user.referenceId;
        mutableToken.permissions = user.permissions;
      }
      return token;
    },
    session({ session, token }) {
      const authToken = token as typeof token & {
        role?: "KISAN" | "ADMIN";
        referenceId?: string;
        permissions?: string[];
      };
      if (session.user && authToken.role && authToken.referenceId) {
        session.user.id = token.sub!;
        session.user.role = authToken.role;
        session.user.referenceId = authToken.referenceId;
        session.user.permissions = authToken.permissions || [];
      }
      return session;
    },
  },
});
