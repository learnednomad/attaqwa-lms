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
  /**
   * Custom user fields. `requiresPasswordChange` is set to `true` when an
   * admin bulk-imports users with a shared temp password. The student login
   * flow reads this flag and forces a password change before granting
   * access to the rest of the app.
   */
  user: {
    additionalFields: {
      requiresPasswordChange: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false, // not accepted during public signup
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    password: {
      hash: async (password) => {
        return bcrypt.hash(password, 10);
      },
      verify: async ({ hash, password }) => {
        // Reject whitespace-only passwords
        if (!password.trim()) return false;
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
    ...(process.env.BETTER_AUTH_BASE_URL
      ? [process.env.BETTER_AUTH_BASE_URL]
      : ["http://localhost:3003"]),
    // Admin portal always needs access.
    // Read ADMIN_URL (runtime) before NEXT_PUBLIC_ADMIN_URL — the NEXT_PUBLIC_*
    // variant is statically inlined at build time by Next.js, so if the build
    // ran without that arg set, the fallback gets baked in permanently.
    ...(process.env.ADMIN_URL
      ? [process.env.ADMIN_URL]
      : process.env.NEXT_PUBLIC_ADMIN_URL
        ? [process.env.NEXT_PUBLIC_ADMIN_URL]
        : ["http://localhost:3000"]),
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
