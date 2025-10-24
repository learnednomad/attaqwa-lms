/**
 * Backend Connection Test Script
 * Tests connectivity and authentication with Strapi backend
 */

const axios = require('axios');

// Configuration
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@attaqwa.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Test1234!';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function success(msg) {
  console.log(`${colors.green}✅ ${msg}${colors.reset}`);
}

function error(msg) {
  console.log(`${colors.red}❌ ${msg}${colors.reset}`);
}

function info(msg) {
  console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`);
}

function warning(msg) {
  console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`);
}

/**
 * Test 1: Health Check
 */
async function testHealthCheck() {
  try {
    info('Testing health endpoint...');
    const response = await axios.get(`${STRAPI_URL}/_health`);

    if (response.status === 204) {
      success('Strapi server is running');
      return true;
    }
  } catch (err) {
    error('Strapi server is not accessible');
    error(`Error: ${err.message}`);
    return false;
  }
}

/**
 * Test 2: Authentication
 */
async function testAuthentication() {
  try {
    info('Testing authentication...');
    const response = await axios.post(`${STRAPI_URL}/auth/local`, {
      identifier: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    if (response.data.jwt) {
      success('Authentication successful');
      success(`JWT Token: ${response.data.jwt.substring(0, 30)}...`);
      success(`User: ${response.data.user.email} (${response.data.user.role?.name || 'no role'})`);
      return response.data.jwt;
    }
  } catch (err) {
    error('Authentication failed');
    if (err.response) {
      error(`Status: ${err.response.status}`);
      error(`Message: ${err.response.data?.error?.message || 'Unknown error'}`);
    } else {
      error(`Error: ${err.message}`);
    }
    return null;
  }
}

/**
 * Test 3: Content Types
 */
async function testContentTypes(jwt) {
  const contentTypes = [
    'courses',
    'lessons',
    'quizzes',
    'enrollments',
    'achievements',
    'user-achievements',
    'leaderboards',
  ];

  info('Testing content type endpoints...');
  let successCount = 0;

  for (const type of contentTypes) {
    try {
      const response = await axios.get(`${STRAPI_URL}/${type}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (response.status === 200) {
        success(`${type}: ${response.data.data.length} records`);
        successCount++;
      }
    } catch (err) {
      if (err.response?.status === 403) {
        warning(`${type}: Forbidden (check permissions)`);
      } else if (err.response?.status === 404) {
        warning(`${type}: Not found (content type not created yet)`);
      } else {
        error(`${type}: ${err.message}`);
      }
    }
  }

  return successCount;
}

/**
 * Test 4: File Upload Capability
 */
async function testFileUpload(jwt) {
  try {
    info('Testing file upload endpoint...');
    const response = await axios.get(`${STRAPI_URL}/upload/files`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (response.status === 200) {
      success(`File upload available (${response.data.length} files)`);
      return true;
    }
  } catch (err) {
    if (err.response?.status === 403) {
      warning('File upload: Forbidden (check permissions)');
    } else {
      error(`File upload: ${err.message}`);
    }
    return false;
  }
}

/**
 * Test 5: Create Test Course (if permissions allow)
 */
async function testCreateCourse(jwt) {
  try {
    info('Testing course creation...');

    const courseData = {
      data: {
        title: 'Test Course - Connection Test',
        description: 'This is a test course created by the connection test script.',
        category: 'general',
        difficulty: 'beginner',
        ageTier: 'all',
        duration: 60,
        isPublished: false,
      },
    };

    const response = await axios.post(`${STRAPI_URL}/courses`, courseData, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 201 || response.status === 200) {
      success(`Test course created with ID: ${response.data.data.id}`);

      // Clean up: delete the test course
      try {
        await axios.delete(`${STRAPI_URL}/courses/${response.data.data.id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        info('Test course deleted (cleanup)');
      } catch (deleteErr) {
        warning('Could not delete test course');
      }

      return true;
    }
  } catch (err) {
    if (err.response?.status === 403) {
      warning('Course creation: Forbidden (user may not have teacher role)');
    } else if (err.response?.status === 404) {
      warning('Course creation: Content type not found');
    } else {
      error(`Course creation: ${err.response?.data?.error?.message || err.message}`);
    }
    return false;
  }
}

/**
 * Main Test Runner
 */
async function runTests() {
  console.log('\n================================');
  console.log('🔍 Backend Connection Tests');
  console.log('================================\n');

  info(`Testing Strapi at: ${STRAPI_URL}`);
  info(`Using credentials: ${ADMIN_EMAIL}\n`);

  // Test 1: Health Check
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    error('\nServer is not running. Please start Strapi with:');
    console.log('  cd backend && npm run develop\n');
    process.exit(1);
  }
  console.log('');

  // Test 2: Authentication
  const jwt = await testAuthentication();
  if (!jwt) {
    error('\nAuthentication failed. Please check:');
    console.log('  1. Admin user exists (create at http://localhost:1337/admin)');
    console.log('  2. Credentials in .env.local are correct\n');
    process.exit(1);
  }
  console.log('');

  // Test 3: Content Types
  const contentTypeCount = await testContentTypes(jwt);
  console.log('');

  // Test 4: File Upload
  await testFileUpload(jwt);
  console.log('');

  // Test 5: Create Test Course
  await testCreateCourse(jwt);
  console.log('');

  // Summary
  console.log('================================');
  console.log('📊 Test Summary');
  console.log('================================\n');

  if (healthOk && jwt) {
    success('Core functionality: Working');

    if (contentTypeCount > 0) {
      success(`Content types: ${contentTypeCount}/7 accessible`);
    } else {
      warning('Content types: None found (create them in Strapi admin)');
    }

    console.log('\n✨ Backend is ready for development!\n');
    info('Next steps:');
    console.log('  1. Create content types (see BACKEND_SETUP_GUIDE.md)');
    console.log('  2. Configure roles and permissions');
    console.log('  3. Seed sample data\n');
  } else {
    error('Backend is not ready');
    console.log('');
  }
}

// Run tests
runTests().catch((err) => {
  error(`Unexpected error: ${err.message}`);
  process.exit(1);
});
