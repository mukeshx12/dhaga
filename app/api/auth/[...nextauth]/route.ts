// import NextAuth from "next-auth";
// import { authOptions } from "@/lib/auth/authOptions";

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };

import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { verifyOtp } from "@/lib/otp/verifyOtp";

export const authOptions: NextAuthOptions = {
  providers: [
    /*
     * EMAIL + PASSWORD LOGIN
     */
    CredentialsProvider({
      id: "email-password",
      name: "Email and Password",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        try {
          const email = credentials?.email
            ?.toLowerCase()
            .trim();

          const password = credentials?.password;

          if (!email || !password) {
            throw new Error(
              "Email and password are required."
            );
          }

          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (!user || !user.password) {
            throw new Error(
              "Invalid email or password."
            );
          }

          if (user.accountStatus === "SUSPENDED") {
            throw new Error("This account has been suspended.");
          }

          const passwordMatches = await bcrypt.compare(
            password,
            user.password
          );

          if (!passwordMatches) {
            throw new Error(
              "Invalid email or password."
            );
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
          };
        } catch (error) {
          console.error(
            "Email authorization error:",
            error
          );

          throw error;
        }
      },
    }),

    /*
     * PHONE + OTP LOGIN
     */
    CredentialsProvider({
      id: "phone-otp",
      name: "Phone OTP",

      credentials: {
        phone: {
          label: "Phone",
          type: "text",
        },
        otp: {
          label: "OTP",
          type: "text",
        },
        challenge: {
          label: "OTP challenge",
          type: "text",
        },
      },

      async authorize(credentials) {
        try {
          const phone = credentials?.phone
            ?.replace(/\s+/g, "")
            .trim();

          const otp = credentials?.otp?.trim();
          const challenge = credentials?.challenge?.trim();

          if (!phone || !otp || !challenge) {
            throw new Error(
              "Phone number, OTP and verification challenge are required."
            );
          }

          if (!/^\+91\d{10}$/.test(phone)) {
            throw new Error(
              "Enter a valid Indian phone number."
            );
          }

          /*
           * Login must only find an existing user.
           * It must never create a new account.
           */
          const user = await prisma.user.findUnique({
            where: {
              phone,
            },
          });

          if (!user) {
            throw new Error(
              "No account exists with this phone number. Please register first."
            );
          }

          if (user.accountStatus === "SUSPENDED") {
            throw new Error("This account has been suspended.");
          }

          /*
           * Verify the OTP through 2Factor.
           */
          const otpIsValid = await verifyOtp(
            phone,
            otp,
            challenge
          );

          if (!otpIsValid) {
            throw new Error(
              "Invalid or expired OTP."
            );
          }

          /*
           * Returning a user tells NextAuth
           * that authentication succeeded.
           */
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
          };
        } catch (error) {
          console.error(
            "Phone authorization error:",
            error
          );

          throw error;
        }
      },
    }),
  ],

  /*
   * Credentials authentication uses JWT sessions.
   * This keeps the user logged in after OTP verification.
   */
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    /*
     * Runs when the JWT is created or refreshed.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;

        token.name = user.name;
        token.email = user.email;

        token.phone =
          "phone" in user
            ? user.phone
            : null;
      }

      return token;
    },

    /*
     * Sends selected token information
     * to useSession() and getServerSession().
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id =
          token.id as string;

        session.user.name =
          token.name ?? null;

        session.user.email =
          token.email ?? null;

        session.user.phone =
          (token.phone as string | null) ??
          null;
      }

      return session;
    },

    /*
     * Allows normal redirects within the same app.
     */
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (
        new URL(url).origin === baseUrl
      ) {
        return url;
      }

      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export {
  handler as GET,
  handler as POST,
};
