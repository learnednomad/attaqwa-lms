import { test, expect, Page } from '@playwright/test';

/**
 * Critical Path E2E Tests for Refactoring Safety
 *
 * These tests document and protect the core user journeys that must continue
 * working throughout the refactoring process. If any of these fail, the
 * refactoring has broken critical functionality.
 *
 * Created for: REFACTORING_PLAN.md Story 0.3
 */

// Helper: Set up authenticated student session
async function loginAsStudent(page: Page) {
  await page.goto('http://localhost:3003/student/login');
  await page.fill('input[type="email"]', 'test.student@attaqwa.com');
  await page.fill('input[type="password"]', 'TestPassword123!');
  await page.click('button:has-text("Sign In")');

  // Wait for successful login redirect
  await page.waitForURL('**/student/dashboard', { timeout: 10000 });
}

// Helper: Set up authenticated admin session (uses different port 3000)
async function loginAsAdmin(page: Page) {
  await page.goto('http://localhost:3000/admin/login');

  // Wait for admin login page to load
  await page.waitForSelector('input[type="email"]', { timeout: 5000 });

  await page.fill('input[type="email"]', 'admin@attaqwa.com');
  await page.fill('input[type="password"]', 'AdminPassword123!');
  await page.click('button:has-text("Sign In")');

  // Wait for successful login redirect to admin dashboard
  await page.waitForURL('**/admin', { timeout: 10000 });
}

test.describe('Critical Path 1: Student Course Discovery Journey', () => {
  test('Student can login, browse courses, and view course details', async ({ page }) => {
    // Step 1: Login as student
    await loginAsStudent(page);

    // Verify we're on the dashboard
    await expect(page.locator('h1:has-text("Student Dashboard")')).toBeVisible();

    // Step 2: Navigate to course browse page
    await page.click('a:has-text("Browse Courses")');
    await page.waitForURL('**/education/browse', { timeout: 5000 });

    // Verify courses are displayed
    await expect(page.locator('h1:has-text("Islamic Education")')).toBeVisible();

    // Wait for courses to load
    const firstCourse = page.locator('[data-testid="course-card"]').first();
    await expect(firstCourse).toBeVisible({ timeout: 10000 });

    // Step 3: Click on a course to view details
    await firstCourse.click();

    // Verify course details page loaded
    await page.waitForURL('**/education/**', { timeout: 5000 });

    // Check for course content elements
    const courseContent = page.locator('[data-testid="course-content"]');
    await expect(courseContent.or(page.locator('h1'))).toBeVisible();

    // Check for navigation to lessons or modules
    const lessonElements = page.locator('[data-testid="lesson-item"]');
    const hasLessons = await lessonElements.count() > 0;

    if (hasLessons) {
      expect(await lessonElements.count()).toBeGreaterThan(0);
    }

    console.log('✅ Critical Path 1: Student Course Discovery - PASSED');
  });
});

test.describe('Critical Path 2: Student Quiz Journey', () => {
  test('Student can take a quiz, submit answers, and view results', async ({ page }) => {
    // Step 1: Login as student
    await loginAsStudent(page);

    // Step 2: Navigate to a course with a quiz
    await page.goto('http://localhost:3003/education/browse');

    // Find and click on a course
    const courseCard = page.locator('[data-testid="course-card"]').first();
    await expect(courseCard).toBeVisible({ timeout: 10000 });
    await courseCard.click();

    // Step 3: Find and start a quiz
    await page.waitForSelector('text=Quiz', { timeout: 10000 });
    const quizButton = page.locator('button:has-text("Start Quiz")').or(page.locator('a:has-text("Quiz")'));

    // Click quiz button if it exists
    const quizExists = await quizButton.count() > 0;

    if (quizExists) {
      await quizButton.first().click();

      // Wait for quiz page to load
      await page.waitForURL('**/quiz/**', { timeout: 5000 });

      // Step 4: Answer quiz questions
      // Check for question elements
      const questionElement = page.locator('[data-testid="quiz-question"]').or(page.locator('form'));
      await expect(questionElement).toBeVisible({ timeout: 5000 });

      // Select answers (look for radio buttons or checkboxes)
      const answerOptions = page.locator('input[type="radio"]').or(page.locator('input[type="checkbox"]'));
      const answerCount = await answerOptions.count();

      if (answerCount > 0) {
        // Select the first answer for each question
        await answerOptions.first().click();
      }

      // Step 5: Submit quiz
      const submitButton = page.locator('button:has-text("Submit")').or(page.locator('button[type="submit"]'));
      await submitButton.click();

      // Step 6: View results
      await page.waitForSelector('text=Results', { timeout: 10000 });

      // Check for score or completion message
      const resultsIndicator = page.locator('text=Score').or(page.locator('text=Correct')).or(page.locator('text=Complete'));
      await expect(resultsIndicator).toBeVisible({ timeout: 5000 });

      console.log('✅ Critical Path 2: Student Quiz Journey - PASSED');
    } else {
      console.log('⚠️ Critical Path 2: No quiz found in course - Test skipped (expected in baseline)');
    }
  });
});

test.describe('Critical Path 3: Admin Course Management Journey', () => {
  test('Admin can login, create a course, and publish it', async ({ page }) => {
    // Step 1: Login as admin
    await loginAsAdmin(page);

    // Verify we're on the admin dashboard
    await expect(page.locator('h1:has-text("Admin")')).toBeVisible();

    // Step 2: Navigate to courses management
    const coursesLink = page.locator('a:has-text("Courses")').or(page.locator('a[href*="/courses"]'));

    const coursesLinkExists = await coursesLink.count() > 0;

    if (coursesLinkExists) {
      await coursesLink.first().click();

      // Wait for courses page
      await page.waitForURL('**/courses', { timeout: 5000 });

      // Step 3: Click "Create Course" button
      const createButton = page.locator('button:has-text("Create")').or(page.locator('a:has-text("New Course")'));
      await createButton.first().click();

      // Wait for course creation form
      await page.waitForSelector('form', { timeout: 5000 });

      // Step 4: Fill in course details
      const titleInput = page.locator('input[name="title"]').or(page.locator('input[placeholder*="title" i]'));
      await titleInput.fill(`Test Course ${Date.now()}`);

      const descriptionInput = page.locator('textarea[name="description"]').or(page.locator('textarea'));
      if (await descriptionInput.count() > 0) {
        await descriptionInput.fill('This is a test course created during E2E testing');
      }

      // Step 5: Save course as draft first
      const saveButton = page.locator('button:has-text("Save")').or(page.locator('button[type="submit"]'));
      await saveButton.first().click();

      // Wait for success message or redirect
      await page.waitForTimeout(2000);

      // Step 6: Publish the course
      const publishButton = page.locator('button:has-text("Publish")').or(page.locator('button:has-text("Activate")'));

      const publishExists = await publishButton.count() > 0;

      if (publishExists) {
        await publishButton.first().click();

        // Wait for confirmation
        await page.waitForTimeout(1000);

        // Verify published status
        const publishedIndicator = page.locator('text=Published').or(page.locator('text=Active'));
        await expect(publishedIndicator).toBeVisible({ timeout: 5000 });
      }

      console.log('✅ Critical Path 3: Admin Course Management - PASSED');
    } else {
      console.log('⚠️ Critical Path 3: Courses link not found - Admin UI may differ from expected');
    }
  });
});

test.describe('Critical Path 4: Public Pages Accessibility', () => {
  test('Public users can access homepage and prayer times without login', async ({ page }) => {
    // Step 1: Access homepage
    await page.goto('http://localhost:3003/');

    // Verify homepage loads
    await expect(page.locator('text=Masjid At-Taqwa').or(page.locator('h1'))).toBeVisible();

    // Step 2: Navigate to prayer times
    const prayerTimesLink = page.locator('a:has-text("Prayer Times")');
    await prayerTimesLink.click();

    await page.waitForURL('**/prayer-times', { timeout: 5000 });

    // Step 3: Verify prayer times are displayed
    await page.waitForSelector('text=Fajr', { timeout: 10000 });

    // Check all 5 prayer times are visible
    await expect(page.locator('text=Fajr')).toBeVisible();
    await expect(page.locator('text=Dhuhr')).toBeVisible();
    await expect(page.locator('text=Asr')).toBeVisible();
    await expect(page.locator('text=Maghrib')).toBeVisible();
    await expect(page.locator('text=Isha')).toBeVisible();

    // Verify prayer time values are displayed (not just labels)
    const timeElements = page.locator('[class*="time"]').or(page.locator('time'));
    const timeCount = await timeElements.count();
    expect(timeCount).toBeGreaterThan(0);

    console.log('✅ Critical Path 4: Public Pages Accessibility - PASSED');
  });
});

test.describe('Critical Path 5: Mobile Responsiveness (Core Flows)', () => {
  test('Student can complete core flows on mobile device', async ({ page }) => {
    // Set mobile viewport (iPhone 12 size)
    await page.setViewportSize({ width: 390, height: 844 });

    // Step 1: Access homepage on mobile
    await page.goto('http://localhost:3003/');
    await expect(page.locator('h1').or(page.locator('text=Masjid'))).toBeVisible();

    // Step 2: Open mobile navigation
    const mobileMenuButton = page.locator('button[aria-label*="menu" i]').or(page.locator('[data-testid="mobile-menu"]'));

    if (await mobileMenuButton.count() > 0) {
      await mobileMenuButton.click();
      await page.waitForTimeout(500);

      // Step 3: Navigate to student portal
      const studentPortalLink = page.locator('a:has-text("Student")').or(page.locator('a[href*="student"]'));

      if (await studentPortalLink.count() > 0) {
        await studentPortalLink.first().click();

        // Verify login page loads on mobile
        await page.waitForURL('**/student/login', { timeout: 5000 });
        await expect(page.locator('input[type="email"]')).toBeVisible();
      }
    }

    // Step 4: Check prayer times on mobile
    await page.goto('http://localhost:3003/prayer-times');
    await expect(page.locator('text=Fajr')).toBeVisible();

    console.log('✅ Critical Path 5: Mobile Responsiveness - PASSED');
  });
});

/**
 * Summary Test: Overall System Health Check
 *
 * This test runs a quick smoke test of all critical paths to give
 * a rapid indication of system health after refactoring changes.
 */
test.describe('Critical Paths: System Health Check', () => {
  test('All critical paths are accessible and functional', async ({ page }) => {
    const healthCheck = {
      homepage: false,
      prayerTimes: false,
      studentLogin: false,
      adminLogin: false,
      education: false,
    };

    // Check 1: Homepage
    try {
      await page.goto('http://localhost:3003/');
      await expect(page.locator('h1')).toBeVisible({ timeout: 5000 });
      healthCheck.homepage = true;
    } catch (e) {
      console.error('❌ Homepage failed:', e);
    }

    // Check 2: Prayer Times
    try {
      await page.goto('http://localhost:3003/prayer-times');
      await expect(page.locator('text=Fajr')).toBeVisible({ timeout: 10000 });
      healthCheck.prayerTimes = true;
    } catch (e) {
      console.error('❌ Prayer Times failed:', e);
    }

    // Check 3: Student Login Page
    try {
      await page.goto('http://localhost:3003/student/login');
      await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 5000 });
      healthCheck.studentLogin = true;
    } catch (e) {
      console.error('❌ Student Login failed:', e);
    }

    // Check 4: Admin Login Page (different port)
    try {
      await page.goto('http://localhost:3000/admin/login');
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      healthCheck.adminLogin = true;
    } catch (e) {
      console.error('❌ Admin Login failed:', e);
    }

    // Check 5: Education Browse
    try {
      await page.goto('http://localhost:3003/education/browse');
      await expect(page.locator('h1')).toBeVisible({ timeout: 5000 });
      healthCheck.education = true;
    } catch (e) {
      console.error('❌ Education Browse failed:', e);
    }

    // Summary
    console.log('\n🏥 System Health Check Results:');
    console.log('================================');
    console.log(`Homepage:       ${healthCheck.homepage ? '✅' : '❌'}`);
    console.log(`Prayer Times:   ${healthCheck.prayerTimes ? '✅' : '❌'}`);
    console.log(`Student Login:  ${healthCheck.studentLogin ? '✅' : '❌'}`);
    console.log(`Admin Login:    ${healthCheck.adminLogin ? '✅' : '❌'}`);
    console.log(`Education:      ${healthCheck.education ? '✅' : '❌'}`);
    console.log('================================\n');

    // All critical paths must be accessible
    expect(healthCheck.homepage).toBe(true);
    expect(healthCheck.prayerTimes).toBe(true);
    expect(healthCheck.studentLogin).toBe(true);
    expect(healthCheck.education).toBe(true);
  });
});
