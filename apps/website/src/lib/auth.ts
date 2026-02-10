import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { expo } from "@better-auth/expo";
import { nextCookies } from "better-auth/next-js";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_BASE_URL || "http://localhost:3003",
  database: pool,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    password: {
      hash: async (password) => {
        return bcrypt.hash(password, 10);
      },
      verify: async ({ hash, password }) => {
        // Handles both bcrypt (migrated from Strapi) and new registrations
        if (hash.startsWith("$2a$") || hash.startsWith("$2b$")) {
          return bcrypt.compare(password, hash);
        }
        // Non-bcrypt hash — should not happen with this config,
        // but return false to be safe
        return false;
      },
    },
  },
  session: {
    expiresIn: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // refresh every 1 day
  },
  trustedOrigins: [
    "AttaqwaMasjid://",
    ...(process.env.NODE_ENV === "development"
      ? ["exp://", "exp://**", "exp://192.168.*.*:*/**"]
      : []),
  ],
  plugins: [
    admin({
      defaultRole: "user",
    }),
    expo(),
    nextCookies(), // MUST be last
  ],
});

export type Session = typeof auth.$Infer.Session;
