-- =============================================================================
-- Seed default BetterAuth user accounts (DEVELOPMENT ONLY)
-- Idempotent — skips users that already exist by email.
-- Passwords are hashed at runtime via pgcrypto crypt().
-- =============================================================================

-- Enable pgcrypto for bcrypt password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_user_id TEXT;
  v_now TIMESTAMPTZ := NOW();
BEGIN
  -- 1. Super Admin
  IF NOT EXISTS (SELECT 1 FROM "user" WHERE email = 'superadmin@attaqwa.org') THEN
    v_user_id := encode(gen_random_bytes(24), 'base64');
    INSERT INTO "user" (id, name, email, "emailVerified", role, banned, "createdAt", "updatedAt")
    VALUES (v_user_id, 'Super Admin', 'superadmin@attaqwa.org', true, 'admin', false, v_now, v_now);
    INSERT INTO "account" (id, "userId", "accountId", "providerId", password, "createdAt", "updatedAt")
    VALUES (encode(gen_random_bytes(24), 'base64'), v_user_id, 'superadmin@attaqwa.org', 'credential',
            crypt('SuperAdmin123!', gen_salt('bf', 10)), v_now, v_now);
    RAISE NOTICE '  OK: superadmin@attaqwa.org (admin)';
  ELSE
    RAISE NOTICE '  SKIP: superadmin@attaqwa.org (already exists)';
  END IF;

  -- 2. Masjid Admin
  IF NOT EXISTS (SELECT 1 FROM "user" WHERE email = 'masjidadmin@attaqwa.org') THEN
    v_user_id := encode(gen_random_bytes(24), 'base64');
    INSERT INTO "user" (id, name, email, "emailVerified", role, banned, "createdAt", "updatedAt")
    VALUES (v_user_id, 'Masjid Admin', 'masjidadmin@attaqwa.org', true, 'admin', false, v_now, v_now);
    INSERT INTO "account" (id, "userId", "accountId", "providerId", password, "createdAt", "updatedAt")
    VALUES (encode(gen_random_bytes(24), 'base64'), v_user_id, 'masjidadmin@attaqwa.org', 'credential',
            crypt('MasjidAdmin123!', gen_salt('bf', 10)), v_now, v_now);
    RAISE NOTICE '  OK: masjidadmin@attaqwa.org (admin)';
  ELSE
    RAISE NOTICE '  SKIP: masjidadmin@attaqwa.org (already exists)';
  END IF;

  -- 3. Teacher
  IF NOT EXISTS (SELECT 1 FROM "user" WHERE email = 'teacher@attaqwa.org') THEN
    v_user_id := encode(gen_random_bytes(24), 'base64');
    INSERT INTO "user" (id, name, email, "emailVerified", role, banned, "createdAt", "updatedAt")
    VALUES (v_user_id, 'Sheikh Muhammad', 'teacher@attaqwa.org', true, 'teacher', false, v_now, v_now);
    INSERT INTO "account" (id, "userId", "accountId", "providerId", password, "createdAt", "updatedAt")
    VALUES (encode(gen_random_bytes(24), 'base64'), v_user_id, 'teacher@attaqwa.org', 'credential',
            crypt('Teacher123!', gen_salt('bf', 10)), v_now, v_now);
    RAISE NOTICE '  OK: teacher@attaqwa.org (teacher)';
  ELSE
    RAISE NOTICE '  SKIP: teacher@attaqwa.org (already exists)';
  END IF;

  -- 4. Student
  IF NOT EXISTS (SELECT 1 FROM "user" WHERE email = 'student@attaqwa.org') THEN
    v_user_id := encode(gen_random_bytes(24), 'base64');
    INSERT INTO "user" (id, name, email, "emailVerified", role, banned, "createdAt", "updatedAt")
    VALUES (v_user_id, 'Ahmed Abdullah', 'student@attaqwa.org', true, 'student', false, v_now, v_now);
    INSERT INTO "account" (id, "userId", "accountId", "providerId", password, "createdAt", "updatedAt")
    VALUES (encode(gen_random_bytes(24), 'base64'), v_user_id, 'student@attaqwa.org', 'credential',
            crypt('Student123!', gen_salt('bf', 10)), v_now, v_now);
    RAISE NOTICE '  OK: student@attaqwa.org (student)';
  ELSE
    RAISE NOTICE '  SKIP: student@attaqwa.org (already exists)';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE 'Seed accounts created. See .env.example for default credentials.';
END $$;
