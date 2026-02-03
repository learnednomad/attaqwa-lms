/**
 * User Account Seeder
 * Creates test user accounts for all platforms
 *
 * USAGE:
 * 1. Make sure Strapi is running: npm run dev
 * 2. Create your first admin account at http://localhost:1337/admin
 * 3. Run: pnpm run seed:users
 */

const STRAPI_URL = 'http://localhost:1337';

interface TestUser {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'instructor' | 'admin';
}

const TEST_USERS: TestUser[] = [
  {
    username: 'student1',
    email: 'student1@attaqwa.test',
    password: 'Student123!',
    firstName: 'Ahmed',
    lastName: 'Abdullah',
    role: 'student'
  },
  {
    username: 'student2',
    email: 'student2@attaqwa.test',
    password: 'Student123!',
    firstName: 'Fatima',
    lastName: 'Hassan',
    role: 'student'
  },
  {
    username: 'student3',
    email: 'student3@attaqwa.test',
    password: 'Student123!',
    firstName: 'Omar',
    lastName: 'Ibrahim',
    role: 'student'
  },
  {
    username: 'instructor1',
    email: 'instructor1@attaqwa.test',
    password: 'Instructor123!',
    firstName: 'Sheikh',
    lastName: 'Muhammad',
    role: 'instructor'
  },
  {
    username: 'admin1',
    email: 'admin@attaqwa.test',
    password: 'Admin123!',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  }
];

async function seedUsers() {
  console.log('🚀 Starting user account seeding...\n');
  console.log('⚠️  Make sure Strapi is running and you have created an admin account\n');

  try {
    // Test connection
    console.log('🔗 Testing Strapi connection...');
    const healthCheck = await fetch(`${STRAPI_URL}/_health`);
    if (!healthCheck.ok) {
      throw new Error('Strapi is not running. Please start it with: npm run dev');
    }
    console.log('✅ Strapi is running\n');

    // Create users
    console.log('👥 Creating test user accounts...\n');
    let created = 0;

    for (const user of TEST_USERS) {
      try {
        // Register user via Strapi's auth endpoint
        const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: user.username,
            email: user.email,
            password: user.password,
          })
        });

        if (response.ok) {
          const result: any = await response.json();
          created++;
          console.log(`✓ Created: ${user.username} (${user.email}) - ${user.role}`);
          console.log(`  Password: ${user.password}`);
        } else {
          const error: any = await response.json();
          if (error.error?.message?.includes('already taken')) {
            console.log(`ℹ️  Skipped: ${user.username} (already exists)`);
          } else {
            console.error(`✗ Failed: ${user.username} - ${error.error?.message || 'Unknown error'}`);
          }
        }
      } catch (error: any) {
        console.error(`✗ Error creating ${user.username}:`, error.message);
      }
    }

    // Summary
    console.log('\n📊 User Account Summary:');
    console.log(`   Created: ${created} new users`);
    console.log(`   Skipped: ${TEST_USERS.length - created} existing users\n`);

    console.log('📝 Test Account Credentials:\n');
    console.log('┌─────────────┬────────────────────────────┬─────────────────┬────────────┐');
    console.log('│ Role        │ Email                      │ Username        │ Password   │');
    console.log('├─────────────┼────────────────────────────┼─────────────────┼────────────┤');
    TEST_USERS.forEach(user => {
      const role = user.role.padEnd(11);
      const email = user.email.padEnd(26);
      const username = user.username.padEnd(15);
      const password = user.password.padEnd(10);
      console.log(`│ ${role} │ ${email} │ ${username} │ ${password} │`);
    });
    console.log('└─────────────┴────────────────────────────┴─────────────────┴────────────┘\n');

    console.log('✅ User seeding complete!');
    console.log('\n🔐 You can now log in with any of these accounts:\n');
    console.log('   Website: http://localhost:3003');
    console.log('   Admin: http://localhost:3001');
    console.log('   API: http://localhost:1337\n');

  } catch (error: any) {
    console.error('\n❌ User seeding failed:', error.message);
    console.error('\nMake sure:');
    console.error('  1. Strapi is running: npm run dev');
    console.error('  2. You have created an admin account at http://localhost:1337/admin');
    console.error('  3. Database is accessible');
    throw error;
  }
}

// Run the seeding
seedUsers()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error);
    process.exit(1);
  });
