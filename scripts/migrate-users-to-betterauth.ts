/**
 * One-time migration script: Strapi up_users → BetterAuth tables
 *
 * Reads users from Strapi's `up_users` table (joined with `up_roles`),
 * inserts them into BetterAuth's `user` and `account` tables.
 *
 * Strapi bcrypt hashes are copied directly — BetterAuth is configured
 * with a bcrypt verify function that handles them.
 *
 * Usage:
 *   DATABASE_URL=postgresql://... npx tsx scripts/migrate-users-to-betterauth.ts
 */

import pg from "pg";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is required");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: DATABASE_URL });

// Map Strapi role types to BetterAuth roles
const ROLE_MAP: Record<string, string> = {
  admin: "admin",
  authenticated: "user",
  teacher: "teacher",
  student: "student",
  parent: "parent",
};

async function migrate() {
  const client = await pool.connect();

  try {
    // Check if Strapi tables exist
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'up_users'
      ) AS has_up_users
    `);

    if (!tableCheck.rows[0].has_up_users) {
      console.log("No up_users table found. Nothing to migrate.");
      return;
    }

    // Check if BetterAuth tables exist
    const baTableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'user'
      ) AS has_user_table
    `);

    if (!baTableCheck.rows[0].has_user_table) {
      console.error(
        "BetterAuth tables not found. Run `npx @better-auth/cli migrate` first."
      );
      process.exit(1);
    }

    // Fetch all Strapi users with their roles (Strapi v5 uses link table)
    const { rows: strapiUsers } = await client.query(`
      SELECT
        u.id AS strapi_id,
        u.username,
        u.email,
        u.password,
        u.confirmed,
        u.blocked,
        u.created_at,
        u.updated_at,
        r.type AS role_type
      FROM up_users u
      LEFT JOIN up_users_role_lnk rl ON u.id = rl.user_id
      LEFT JOIN up_roles r ON rl.role_id = r.id
      ORDER BY u.id
    `);

    console.log(`Found ${strapiUsers.length} users in Strapi up_users table`);

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    await client.query("BEGIN");

    for (const su of strapiUsers) {
      try {
        // Check if user already exists in BetterAuth by email
        const existing = await client.query(
          `SELECT id FROM "user" WHERE email = $1`,
          [su.email]
        );

        if (existing.rows.length > 0) {
          console.log(`  SKIP: ${su.email} (already exists)`);
          skipped++;
          continue;
        }

        const role = ROLE_MAP[su.role_type] || "user";
        const now = new Date();

        // Insert into BetterAuth user table
        const userResult = await client.query(
          `INSERT INTO "user" (id, name, email, "emailVerified", role, banned, "createdAt", "updatedAt")
           VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7)
           RETURNING id`,
          [
            su.username || su.email.split("@")[0],
            su.email,
            su.confirmed, // emailVerified = Strapi confirmed
            role,
            su.blocked || false,
            su.created_at || now,
            su.updated_at || now,
          ]
        );

        const userId = userResult.rows[0].id;

        // Insert into BetterAuth account table with the existing bcrypt hash
        await client.query(
          `INSERT INTO "account" (id, "userId", "accountId", "providerId", password, "createdAt", "updatedAt")
           VALUES (gen_random_uuid(), $1, $2, 'credential', $3, $4, $5)`,
          [
            userId,
            su.email, // accountId = email for credential provider
            su.password, // Copy bcrypt hash directly
            su.created_at || now,
            su.updated_at || now,
          ]
        );

        console.log(`  OK: ${su.email} → role=${role}, id=${userId}`);
        migrated++;
      } catch (err) {
        console.error(`  ERROR: ${su.email}:`, err);
        errors++;
      }
    }

    await client.query("COMMIT");

    console.log("\n--- Migration Summary ---");
    console.log(`Total Strapi users: ${strapiUsers.length}`);
    console.log(`Migrated: ${migrated}`);
    console.log(`Skipped (already exist): ${skipped}`);
    console.log(`Errors: ${errors}`);

    // Verify counts
    const { rows: countRows } = await client.query(
      `SELECT COUNT(*) as count FROM "user"`
    );
    console.log(
      `BetterAuth user table now has: ${countRows[0].count} users`
    );
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Migration failed, rolled back:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
