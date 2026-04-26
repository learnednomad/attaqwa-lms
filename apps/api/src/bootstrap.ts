/**
 * Strapi Bootstrap
 *
 * Runs on every server start, in any NODE_ENV. Responsibilities:
 *   1. Seed the Strapi super-admin (idempotent; refuses defaults in prod).
 *   2. Configure public + authenticated API permissions.
 *   3. Ensure a full-access admin API token exists.
 *
 * Content seeding (courses, lessons, quizzes) lives in
 * `scripts/seed/seed-bootstrap.ts` and is run as a separate step in CI / manual
 * dev setup. Production deploys never auto-seed test content.
 */

type SeedAdminConfig = { firstname: string; lastname: string; email: string; password: string };

const DEV_SEED_ADMIN_DEFAULTS: SeedAdminConfig = {
  firstname: 'Super',
  lastname: 'Admin',
  email: 'superadmin@attaqwa.org',
  password: 'SuperAdmin123!',
};

/**
 * Resolve seed admin credentials. In production, SEED_ADMIN_EMAIL and
 * SEED_ADMIN_PASSWORD are required — we refuse to seed with hardcoded
 * defaults. In dev/staging, env vars win; otherwise fall back to the
 * documented dev defaults for local convenience.
 */
function resolveSeedAdminConfig(): SeedAdminConfig | null {
  const envEmail = process.env.SEED_ADMIN_EMAIL?.trim();
  const envPassword = process.env.SEED_ADMIN_PASSWORD;
  const isProd = process.env.NODE_ENV === 'production';

  if (envEmail && envPassword) {
    return {
      firstname: process.env.SEED_ADMIN_FIRSTNAME?.trim() || 'Super',
      lastname: process.env.SEED_ADMIN_LASTNAME?.trim() || 'Admin',
      email: envEmail,
      password: envPassword,
    };
  }

  if (isProd) {
    console.error(
      '❌ SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required in production. ' +
        'Skipping admin seed — register via Strapi /admin on first visit instead.'
    );
    return null;
  }

  console.warn(
    '⚠️  SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD not set — using dev defaults. ' +
      'Set these env vars for staging/prod deployments.'
  );
  return { ...DEV_SEED_ADMIN_DEFAULTS };
}

/**
 * Seed the Strapi admin user if none exists (idempotent).
 * Also repairs corrupted admin rows that have no role linkage.
 */
async function seedStrapiAdmin(strapi: any) {
  try {
    const roleService = strapi.service('admin::role');
    const superAdminRole = await roleService.getSuperAdmin();

    if (!superAdminRole) {
      console.error('   ✗ Super Admin role not found, cannot seed admin');
      return;
    }

    const existingAdmins = await strapi.db.query('admin::user').findMany({ limit: 10, populate: ['roles'] });

    if (existingAdmins && existingAdmins.length > 0) {
      const healthyAdmin = existingAdmins.find(
        (admin: any) => admin.roles && admin.roles.length > 0
      );

      if (healthyAdmin) {
        console.log('👤 Strapi admin already exists, skipping seed');
        return;
      }

      console.log('👤 Found corrupted admin rows (no role linkage), cleaning up...');
      for (const admin of existingAdmins) {
        await strapi.db.query('admin::user').delete({ where: { id: admin.id } });
      }
    }

    const seedAdmin = resolveSeedAdminConfig();
    if (!seedAdmin) return;

    console.log('👤 Creating Strapi admin...');

    const hashedPassword = await strapi.service('admin::auth').hashPassword(seedAdmin.password);

    await strapi.db.query('admin::user').create({
      data: {
        ...seedAdmin,
        password: hashedPassword,
        registrationToken: null,
        isActive: true,
        roles: [superAdminRole.id],
      },
    });

    console.log(`✅ Strapi admin created: ${seedAdmin.email}`);
  } catch (error: any) {
    console.error('❌ Strapi admin seeding error:', error.message);
  }
}

/**
 * Main bootstrap function
 */
export default async ({ strapi }: { strapi: any }) => {
  console.log('\n🔧 Running bootstrap configuration...');

  try {
    // Seed Strapi admin user on every boot (idempotent — skips when a healthy
    // admin exists). Production safety lives inside seedStrapiAdmin itself:
    // it refuses to seed with defaults unless SEED_ADMIN_EMAIL +
    // SEED_ADMIN_PASSWORD are explicitly provided.
    await seedStrapiAdmin(strapi);
    // Configure API permissions for public and authenticated roles
    // Strapi v5: permissions are linked to roles via up_permissions_role_lnk
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });
    const authenticatedRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'authenticated' } });

    if (publicRole) {
      console.log('📝 Configuring API permissions...');

      // Public role: read-only access for public-facing content ONLY
      // User-specific data (enrollments, progress, achievements, streaks) is
      // NOT public — it is accessed via session-verified server routes.
      const publicPermissions = [
        { controller: 'course', actions: ['find', 'findOne'] },
        { controller: 'lesson', actions: ['find', 'findOne'] },
        { controller: 'quiz', actions: ['find', 'findOne'] },
        { controller: 'achievement', actions: ['find', 'findOne'] },
        { controller: 'leaderboard', actions: ['find', 'findOne'] },
        { controller: 'announcement', actions: ['find', 'findOne'] },
        { controller: 'event', actions: ['find', 'findOne'] },
        { controller: 'iqamah-schedule', actions: ['find', 'findOne'] },
      ];

      // Authenticated role: CRUD for admin operations via API token.
      // DELETE is restricted to admin-managed content only. The admin app
      // uses a full-access API token which bypasses these role permissions,
      // so these mainly gate direct Strapi API access.
      const authenticatedPermissions = [
        { controller: 'course', actions: ['find', 'findOne', 'create', 'update'] },
        { controller: 'lesson', actions: ['find', 'findOne', 'create', 'update'] },
        { controller: 'quiz', actions: ['find', 'findOne', 'create', 'update'] },
        { controller: 'achievement', actions: ['find', 'findOne', 'create', 'update'] },
        { controller: 'course-enrollment', actions: ['find', 'findOne', 'create', 'update'] },
        { controller: 'user-progress', actions: ['find', 'findOne', 'create', 'update'] },
        { controller: 'user-achievement', actions: ['find', 'findOne', 'create'] },
        { controller: 'streak', actions: ['find', 'findOne', 'create'] },
        { controller: 'leaderboard', actions: ['find', 'findOne', 'create'] },
        { controller: 'moderation-queue', actions: ['find', 'findOne', 'create', 'update'] },
        { controller: 'announcement', actions: ['find', 'findOne', 'create', 'update'] },
        { controller: 'event', actions: ['find', 'findOne', 'create', 'update'] },
        { controller: 'iqamah-schedule', actions: ['find', 'findOne', 'create', 'update'] },
        { controller: 'prayer-time-override', actions: ['find', 'findOne', 'create', 'update'] },
        { controller: 'itikaf-registration', actions: ['find', 'findOne', 'create', 'update'] },
        { controller: 'appeal', actions: ['find', 'findOne', 'update'] },
      ];

      // Helper: ensure a permission exists and is linked to a role (Strapi v5 compatible)
      async function ensurePermission(roleId: number, actionName: string) {
        const knex = strapi.db.connection;

        // Check if permission row exists
        let permission = await knex('up_permissions')
          .where({ action: actionName })
          .first();

        if (!permission) {
          // Create the permission row
          const [inserted] = await knex('up_permissions')
            .insert({
              action: actionName,
              created_at: new Date(),
              updated_at: new Date(),
            })
            .returning('id');
          permission = { id: typeof inserted === 'object' ? inserted.id : inserted };
        }

        // Check if link to role exists
        const link = await knex('up_permissions_role_lnk')
          .where({ permission_id: permission.id, role_id: roleId })
          .first();

        if (!link) {
          await knex('up_permissions_role_lnk').insert({
            permission_id: permission.id,
            role_id: roleId,
          });
        }
      }

      // Apply public permissions
      for (const { controller, actions } of publicPermissions) {
        for (const action of actions) {
          try {
            await ensurePermission(publicRole.id, `api::${controller}.${controller}.${action}`);
          } catch (error) {
            console.error(`   ✗ Failed: public ${controller}.${action}:`, error.message);
          }
        }
      }
      console.log('✅ Public permissions configured (read-only)');

      // Apply authenticated permissions (for API token access from admin app)
      if (authenticatedRole) {
        for (const { controller, actions } of authenticatedPermissions) {
          for (const action of actions) {
            try {
              await ensurePermission(authenticatedRole.id, `api::${controller}.${controller}.${action}`);
            } catch (error) {
              console.error(`   ✗ Failed: authenticated ${controller}.${action}:`, error.message);
            }
          }
        }
        console.log('✅ Authenticated permissions configured (full CRUD)');
      }
    }

    // Ensure a full-access API token exists for admin app server-to-server calls
    try {
      const apiTokenService = strapi.service('admin::api-token');
      const existingTokens = await apiTokenService.list();
      const hasFullAccess = existingTokens.some((t: any) => t.type === 'full-access');

      if (!hasFullAccess) {
        const token = await apiTokenService.create({
          name: 'Admin Full Access',
          description: 'Full access token for admin app (auto-generated)',
          type: 'full-access',
          lifespan: null, // never expires
        });
        console.log(`🔑 API token created: ${token.accessKey}`);
        console.log('   Set STRAPI_API_TOKEN in your .env to this value');
      } else {
        console.log('🔑 Full-access API token already exists');
      }
    } catch (error) {
      console.error('   ✗ Failed to create API token:', error.message);
    }

    // Log available content types
    const contentTypes = Object.keys(strapi.contentTypes).filter(key =>
      key.startsWith('api::')
    );
    console.log(`📚 Available content types: ${contentTypes.length}`);

    // Content seed (courses / lessons / quizzes) lives in
    // `scripts/seed/seed-bootstrap.ts`. Run it manually after first boot:
    //   pnpm --filter api seed:bootstrap
    // CI runs it as a workflow step. Production never auto-seeds test content.

    console.log('\n✅ Bootstrap complete\n');
  } catch (error) {
    console.error('❌ Bootstrap error:', error);
  }
};
