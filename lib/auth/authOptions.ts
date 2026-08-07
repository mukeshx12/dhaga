import "server-only";

import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyOtp } from "@/lib/otp/verifyOtp";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "email-password",
      name: "Email and Password",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;
        if (!email || !password) throw new Error("Email and password are required.");
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.password || !(await bcrypt.compare(password, user.password))) throw new Error("Invalid email or password.");
        if (user.accountStatus !== "ACTIVE") throw new Error("This account has been suspended.");
        return { id: user.id, name: user.name, email: user.email, phone: user.phone };
      },
    }),
    CredentialsProvider({
      id: "phone-otp",
      name: "Phone OTP",
      credentials: {
        phone: { label: "Phone", type: "text" }, otp: { label: "OTP", type: "text" },
        challenge: { label: "OTP challenge", type: "text" }, action: { label: "Action", type: "text" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        const phone = credentials?.phone?.replace(/\s+/g, "").trim();
        const otp = credentials?.otp?.trim();
        const challenge = credentials?.challenge?.trim();
        const registering = credentials?.action?.trim() === "register";
        const registrationName = credentials?.name?.trim();
        if (!phone || !otp || !challenge) throw new Error("Phone number, OTP and verification challenge are required.");
        if (!/^\+91\d{10}$/.test(phone)) throw new Error("Enter a valid Indian phone number.");
        if (registering && (!registrationName || registrationName.length < 2)) throw new Error("Please enter your full name.");
        const user = await prisma.user.findUnique({ where: { phone } });
        if (registering && user) throw new Error("An account already exists with this phone number. Please login.");
        if (!registering && !user) throw new Error("No account exists with this phone number. Please register first.");
        if (user?.accountStatus !== undefined && user.accountStatus !== "ACTIVE") throw new Error("This account has been suspended.");
        if (!(await verifyOtp(phone, otp, challenge))) throw new Error("Invalid or expired OTP.");
        const authenticatedUser = user ?? await prisma.user.create({ data: { name: registrationName, phone } });
        return { id: authenticatedUser.id, name: authenticatedUser.name, email: authenticatedUser.email, phone: authenticatedUser.phone };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  jwt: { maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      if (token.id) {
        const current = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { name: true, email: true, phone: true, accountStatus: true },
        });
        token.accountActive = current?.accountStatus === "ACTIVE";
        token.name = current?.name ?? null;
        token.email = current?.email ?? null;
        token.phone = current?.phone ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.accountActive) {
        session.user.id = token.id as string;
        session.user.name = token.name ?? null;
        session.user.email = token.email ?? null;
        session.user.phone = (token.phone as string | null) ?? null;
      } else if (session.user) {
        session.user.id = "";
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};
