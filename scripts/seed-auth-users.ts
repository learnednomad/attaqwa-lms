/**
 * Seed default BetterAuth user accounts
 *
 * Creates superadmin, masjid admin, teacher, and student accounts
 * directly in the BetterAuth tables. Idempotent — skips existing emails.
 *
 * Usage:
 *   DATABASE_URL=postgresql://... npx tsx scripts/seed-auth-users.ts
 */

import pg from "pg";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is required");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: DATABASE_URL });

interface SeedUser {
  name: string;
  email: string;
  password: string;
  role: string;
}

const SEED_USERS: SeedUser[] = [
  {
    name: "Super Admin",
    email: "superadmin@attaqwa.org",
    password: "SuperAdmin123!", // placeholder
    role: "admin",
  },
  {
    name: "Masjid Admin",
    email: "masjidadmin@attaqwa.org",
    password: "MasjidAdmin123!", // placeholder
    role: "admin",
  },
  {
    name: "Sheikh Muhammad",
    email: "teacher@attaqwa.org",
    password: "Teacher123!", // placeholder
    role: "teacher",
  },
  {
    name: "Ahmed Abdullah",
    email: "student@attaqwa.org",
    password: "Student123!", // placeholder
    role: "student",
  },
];

function generateId(): string {
  return crypto.randomBytes(24).toString("base64url");
}

async function seed() {
  const client = await pool.connect();

  try {
    // Verify BetterAuth tables exist
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables WHERE table_name = 'user'
      ) AS exists
    `);

    if (!tableCheck.rows[0].exists) {
      console.error("BetterAuth tables not found. Run migrations first.");
      process.exit(1);
    }

    console.log("Seeding default user accounts...\n");

    let created = 0;
    let skipped = 0;

    for (const user of SEED_USERS) {
      // Check if user already exists
      const existing = await client.query(
        `SELECT id FROM "user" WHERE email = $1`,
        [user.email]
      );

      if (existing.rows.length > 0) {
        console.log(`  SKIP: ${user.email} (already exists)`);
        skipped++;
        continue;
      }

      const userId = generateId();
      const accountId = generateId();
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const now = new Date();

      await client.query("BEGIN");

      // Insert user
      await client.query(
        `INSERT INTO "user" (id, name, email, "emailVerified", role, banned, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, true, $4, false, $5, $6)`,
        [userId, user.name, user.email, user.role, now, now]
      );

      // Insert credential account
      await client.query(
        `INSERT INTO "account" (id, "userId", "accountId", "providerId", password, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, 'credential', $4, $5, $6)`,
        [accountId, userId, user.email, hashedPassword, now, now]
      );

      await client.query("COMMIT");

      console.log(`  OK: ${user.email} (${user.role})`);
      created++;
    }

    console.log(`\nDone: ${created} created, ${skipped} skipped.\n`);

    if (created > 0) {
      console.log("Default credentials:");
      console.log("---------------------------------------------");
      for (const user of SEED_USERS) {
        console.log(`  ${user.role.padEnd(10)} ${user.email.padEnd(30)} ${user.password}`);
      }
      console.log("---------------------------------------------");
      console.log("Change these passwords after first login!\n");
    }
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
