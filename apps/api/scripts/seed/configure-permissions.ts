/**
 * Configure Strapi API Permissions
 * Enables public API access for content seeding
 *
 * Run this first before running the content seeder
 */

const STRAPI_URL = 'http://localhost:1337';

async function configurePermissions() {
  console.log('🔐 Configuring Strapi API permissions...\n');

  try {
    // Test connection
    console.log('🔗 Testing Strapi connection...');
    const healthCheck = await fetch(`${STRAPI_URL}/_health`);
    if (!healthCheck.ok) {
      throw new Error('Strapi is not running. Please start it with: npm run dev');
    }
    console.log('✅ Strapi is running\n');

    console.log('📝 Instructions to enable API permissions:\n');
    console.log('Since Strapi v5 requires manual permission configuration for security,');
    console.log('please follow these steps:\n');

    console.log('1. Open Strapi Admin: http://localhost:1337/admin');
    console.log('2. Go to: Settings → Users & Permissions → Roles → Public');
    console.log('3. Enable these permissions:\n');

    console.log('   For COURSE:');
    console.log('   ✓ find');
    console.log('   ✓ findOne');
    console.log('   ✓ create\n');

    console.log('   For LESSON:');
    console.log('   ✓ find');
    console.log('   ✓ findOne');
    console.log('   ✓ create\n');

    console.log('   For QUIZ:');
    console.log('   ✓ find');
    console.log('   ✓ findOne');
    console.log('   ✓ create\n');

    console.log('4. Click "Save" at the top right');
    console.log('5. Run the seeder: pnpm run seed:api\n');

    console.log('⚠️  Note: These permissions are for development only!');
    console.log('   In production, use authenticated endpoints with proper access control.\n');

    // Alternative: Provide a bootstrap file approach
    console.log('\n💡 Alternative Approach:');
    console.log('Create a file: apps/api/src/bootstrap.ts with permission configuration');
    console.log('This will auto-configure permissions on Strapi startup.\n');

  } catch (error: any) {
    console.error('\n❌ Configuration check failed:', error.message);
    throw error;
  }
}

configurePermissions()
  .then(() => {
    console.log('✅ Please follow the instructions above to enable permissions');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });
