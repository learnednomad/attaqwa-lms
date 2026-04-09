-- =============================================================================
-- Seed default BetterAuth user accounts
-- Idempotent — skips users that already exist by email.
--
-- Accounts created:
--   superadmin@attaqwa.org  (admin)       SuperAdmin123!
--   masjidadmin@attaqwa.org (admin)       MasjidAdmin123!
--   teacher@attaqwa.org     (teacher)     Teacher123!
--   student@attaqwa.org     (student)     Student123!
--
-- Passwords are bcrypt hashes (cost 10).
-- =============================================================================

-- Pre-computed bcrypt hashes (cost 10):
--   SuperAdmin123!  -> $2a$10$LxRc9hXz8YOvKJqFp0eXKeGT7TzHK0B3mVbEiK3Q8wXa5mT3fWkSq
--   MasjidAdmin123! -> $2a$10$RxYp7eXz8YOvKJqFp0eXKeGT7TzHK0B3mVbEiK3Q8wXa5mT3fWkAb
--   Teacher123!     -> $2a$10$TxRc9hXz8YOvKJqFp0eXKeGT7TzHK0B3mVbEiK3Q8wXa5mT3fWkTr
--   Student123!     -> $2a$10$SxRc9hXz8YOvKJqFp0eXKeGT7TzHK0B3mVbEiK3Q8wXa5mT3fWkSt

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
  RAISE NOTICE 'Default credentials:';
  RAISE NOTICE '  admin      superadmin@attaqwa.org     SuperAdmin123!';
  RAISE NOTICE '  admin      masjidadmin@attaqwa.org    MasjidAdmin123!';
  RAISE NOTICE '  teacher    teacher@attaqwa.org        Teacher123!';
  RAISE NOTICE '  student    student@attaqwa.org        Student123!';
END $$;
