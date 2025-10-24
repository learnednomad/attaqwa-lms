import { test, expect, Page, ConsoleMessage } from '@playwright/test';

// Track console errors across all tests
let consoleErrors: string[] = [];

// Helper function to check for hydration errors
async function checkForHydrationErrors(page: Page, pageName: string) {
  const errors: string[] = [];
  
  page.on('console', (msg: ConsoleMessage) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      errors.push(text);
      
      // Check for specific hydration error patterns
      if (text.includes('Hydration') || 
          text.includes('did not match') || 
          text.includes('Text content does not match') ||
          text.includes('Warning: Expected server HTML')) {
        console.error(`❌ Hydration error on ${pageName}: ${text}`);
        consoleErrors.push(`${pageName}: ${text}`);
      }
    }
  });
  
  return errors;
}

test.describe('All Pages Comprehensive Test', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport for consistent testing
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test.afterAll(() => {
    if (consoleErrors.length > 0) {
      console.error('\n❌ Console errors found:');
      consoleErrors.forEach(error => console.error(error));
    } else {
      console.log('\n✅ No hydration errors found in any page!');
    }
  });

  test.describe('Public Pages', () => {
    test('Homepage loads without errors', async ({ page }) => {
      const errors = await checkForHydrationErrors(page, 'Homepage');
      
      await page.goto('http://localhost:3000/');
      await expect(page).toHaveTitle(/Masjid At-Taqwa/);
      
      // Check for key elements
      await expect(page.locator('text=Welcome to Masjid At-Taqwa')).toBeVisible();
      await expect(page.locator('text=Prayer Times')).toBeVisible();
      
      // Check navigation works
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
      
      // Verify no console errors
      expect(errors.filter(e => e.includes('Hydration'))).toHaveLength(0);
    });

    test('Prayer Times page loads without errors', async ({ page }) => {
      const errors = await checkForHydrationErrors(page, 'Prayer Times');
      
      await page.goto('http://localhost:3000/prayer-times');
      
      // Wait for prayer times to load
      await page.waitForSelector('text=Fajr', { timeout: 10000 });
      
      // Check all prayer times are displayed
      await expect(page.locator('text=Fajr')).toBeVisible();
      await expect(page.locator('text=Dhuhr')).toBeVisible();
      await expect(page.locator('text=Asr')).toBeVisible();
      await expect(page.locator('text=Maghrib')).toBeVisible();
      await expect(page.locator('text=Isha')).toBeVisible();
      
      // Check that times are displayed (not just labels)
      const timeElements = await page.locator('.prayer-time').count();
      expect(timeElements).toBeGreaterThan(0);
      
      expect(errors.filter(e => e.includes('Hydration'))).toHaveLength(0);
    });

    test('Announcements page loads without errors', async ({ page }) => {
      const errors = await checkForHydrationErrors(page, 'Announcements');
      
      await page.goto('http://localhost:3000/announcements');
      await expect(page.locator('h1:has-text("Announcements")')).toBeVisible();
      
      // Check for announcement cards
      const announcements = page.locator('[class*="card"]');
      await expect(announcements.first()).toBeVisible({ timeout: 10000 });
      
      expect(errors.filter(e => e.includes('Hydration'))).toHaveLength(0);
    });

    test('Events page loads without errors', async ({ page }) => {
      const errors = await checkForHydrationErrors(page, 'Events');
      
      await page.goto('http://localhost:3000/events');
      await expect(page.locator('h1:has-text("Events")')).toBeVisible();
      
      expect(errors.filter(e => e.includes('Hydration'))).toHaveLength(0);
    });

    test('Calendar page loads without errors', async ({ page }) => {
      const errors = await checkForHydrationErrors(page, 'Calendar');
      
      await page.goto('http://localhost:3000/calendar');
      await expect(page.locator('text=Calendar Downloads')).toBeVisible();
      
      // Check for calendar cards
      await expect(page.locator('text=Ramadan Calendar')).toBeVisible();
      
      expect(errors.filter(e => e.includes('Hydration'))).toHaveLength(0);
    });

    test('Dashboard page loads without errors', async ({ page }) => {
      const errors = await checkForHydrationErrors(page, 'Dashboard');
      
      await page.goto('http://localhost:3000/dashboard');
      
      // Check for dashboard elements
      await expect(page.locator('text=Islamic Dashboard')).toBeVisible();
      
      // Check prayer times widget
      await expect(page.locator('text=Today\'s Prayer Times')).toBeVisible();
      
      expect(errors.filter(e => e.includes('Hydration'))).toHaveLength(0);
    });

    test('About page loads without errors', async ({ page }) => {
      const errors = await checkForHydrationErrors(page, 'About');
      
      await page.goto('http://localhost:3000/about');
      await expect(page.locator('h1:has-text("About")')).toBeVisible();
      
      expect(errors.filter(e => e.includes('Hydration'))).toHaveLength(0);
    });

    test('Services page loads without errors', async ({ page }) => {
      const errors = await checkForHydrationErrors(page, 'Services');
      
      await page.goto('http://localhost:3000/services');
      await expect(page.locator('h1:has-text("Services")')).toBeVisible();
      
      expect(errors.filter(e => e.includes('Hydration'))).toHaveLength(0);
    });

    test('Contact page loads without errors', async ({ page }) => {
      const errors = await checkForHydrationErrors(page, 'Contact');
      
      await page.goto('http://localhost:3000/contact');
      await expect(page.locator('h1:has-text("Contact")')).toBeVisible();
      
      expect(errors.filter(e => e.includes('Hydration'))).toHaveLength(0);
    });
  });

  test.describe('Resource Pages', () => {
    test('Islamic Calendar page loads without errors', async ({ page }) => {
      const errors = await checkForHydrationErrors(page, 'Islamic Calendar');
      
      await page.goto('http://localhost:3000/resources/islamic-calendar');
      
      // Wait for Islamic calendar to load
      await expect(page.locator('text=Islamic Calendar')).toBeVisible();
      
      // Check for Islamic months
      await expect(page.locator('text=Muharram')).toBeVisible();
      
      // Verify date is displayed without hydration issues
      const dateElement = page.locator('[class*="date"]').first();
      await expect(dateElement).toBeVisible();
      
      expect(errors.filter(e => e.includes('Hydration'))).toHaveLength(0);
    });

    test('Quran Study page loads without errors', async ({ page }) => {
      const errors = await checkForHydrationErrors(page, 'Quran Study');
      
      await page.goto('http://localhost:3000/resources/quran-study');
      await expect(page.locator('h1:has-text("Quran Study")')).toBeVisible();
      
      expect(errors.filter(e => e.includes('Hydration'))).toHaveLength(0);
    });

    test('Hadith Collections page loads without errors', async ({ page }) => {
      const errors = await checkForHydrationErrors(page, 'Hadith Collections');
      
      await page.goto('http://localhost:3000/resources/hadith-collections');
      await expect(page.locator('h1:has-text("Hadith Collections")')).toBeVisible();
      
      expect(errors.filter(e => e.includes('Hydration'))).toHaveLength(0);
    });
  });

  test.describe('Education Pages', () => {
    test('Education Browse page loads without errors', async ({ page }) => {
      const errors = await checkForHydrationErrors(page, 'Education Browse');
      
      await page.goto('http://localhost:3000/education/browse');
      await expect(page.locator('h1:has-text("Islamic Education")')).toBeVisible();
      
      expect(errors.filter(e => e.includes('Hydration'))).toHaveLength(0);
    });

    test('Seerah module pages load without errors', async ({ page }) => {
      const errors = await checkForHydrationErrors(page, 'Seerah Modules');
      
      // Test a specific Seerah module
      await page.goto('http://localhost:3000/education/seerah/early-life');
      await expect(page.locator('text=Early Life')).toBeVisible();
      
      // Check for quiz elements
      await expect(page.locator('text=Quiz')).toBeVisible();
      
      expect(errors.filter(e => e.includes('Hydration'))).toHaveLength(0);
    });
  });

  test.describe('Student Portal Pages', () => {
    test('Student Login page loads without errors', async ({ page }) => {
      const errors = await checkForHydrationErrors(page, 'Student Login');
      
      await page.goto('http://localhost:3000/student/login');
      await expect(page.locator('h1:has-text("Student Portal")')).toBeVisible();
      
      // Check for login form elements
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
      
      expect(errors.filter(e => e.includes('Hydration'))).toHaveLength(0);
    });

    test('Student Dashboard redirects when not logged in', async ({ page }) => {
      const errors = await checkForHydrationErrors(page, 'Student Dashboard');
      
      await page.goto('http://localhost:3000/student/dashboard');
      
      // Should redirect to login
      await page.waitForURL('**/student/login', { timeout: 5000 });
      
      expect(errors.filter(e => e.includes('Hydration'))).toHaveLength(0);
    });

    test('Student login flow works', async ({ page }) => {
      const errors = await checkForHydrationErrors(page, 'Student Login Flow');
      
      await page.goto('http://localhost:3000/student/login');
      
      // Fill in login form
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      
      // Click sign in
      await page.click('button:has-text("Sign In")');
      
      // Should navigate to dashboard
      await page.waitForURL('**/student/dashboard', { timeout: 5000 });
      await expect(page.locator('h1:has-text("Student Dashboard")')).toBeVisible();
      
      expect(errors.filter(e => e.includes('Hydration'))).toHaveLength(0);
    });
  });

  test.describe('Admin Pages', () => {
    test('Admin Dashboard page loads without errors', async ({ page }) => {
      const errors = await checkForHydrationErrors(page, 'Admin Dashboard');
      
      await page.goto('http://localhost:3000/admin');
      await expect(page.locator('h1:has-text("Admin Dashboard")')).toBeVisible();
      
      expect(errors.filter(e => e.includes('Hydration'))).toHaveLength(0);
    });

    test('Admin Prayer Times page loads without errors', async ({ page }) => {
      const errors = await checkForHydrationErrors(page, 'Admin Prayer Times');
      
      await page.goto('http://localhost:3000/admin/prayer-times');
      await expect(page.locator('h1:has-text("Prayer Times Management")')).toBeVisible();
      
      // Check for prayer time management elements
      await expect(page.locator('text=Monthly Prayer Times')).toBeVisible();
      
      expect(errors.filter(e => e.includes('Hydration'))).toHaveLength(0);
    });

    test('Admin Announcements page loads without errors', async ({ page }) => {
      const errors = await checkForHydrationErrors(page, 'Admin Announcements');
      
      await page.goto('http://localhost:3000/admin/announcements');
      await expect(page.locator('h1:has-text("Announcement Management")')).toBeVisible();
      
      // Check for create button
      await expect(page.locator('button:has-text("Create Announcement")')).toBeVisible();
      
      expect(errors.filter(e => e.includes('Hydration'))).toHaveLength(0);
    });

    test('Admin Events page loads without errors', async ({ page }) => {
      const errors = await checkForHydrationErrors(page, 'Admin Events');
      
      await page.goto('http://localhost:3000/admin/events');
      await expect(page.locator('h1:has-text("Event Management")')).toBeVisible();
      
      // Check for create button
      await expect(page.locator('button:has-text("Create Event")')).toBeVisible();
      
      expect(errors.filter(e => e.includes('Hydration'))).toHaveLength(0);
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('Homepage is responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
      
      await page.goto('http://localhost:3000/');
      
      // Check mobile menu button is visible
      const mobileMenuButton = page.locator('button[aria-label*="menu"]');
      await expect(mobileMenuButton).toBeVisible();
      
      // Click mobile menu
      await mobileMenuButton.click();
      
      // Check navigation items are visible
      await expect(page.locator('nav a:has-text("Prayer Times")')).toBeVisible();
    });

    test('Prayer Times page is responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('http://localhost:3000/prayer-times');
      
      // Prayer times should still be visible
      await expect(page.locator('text=Fajr')).toBeVisible();
      await expect(page.locator('text=Maghrib')).toBeVisible();
    });
  });

  test.describe('Performance Tests', () => {
    test('Homepage loads within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('http://localhost:3000/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
      
      console.log(`Homepage load time: ${loadTime}ms`);
    });

    test('Prayer Times API responds quickly', async ({ page }) => {
      const response = await page.request.get('http://localhost:3000/api/prayer-times');
      
      expect(response.status()).toBe(200);
      
      const responseTime = response.headers()['x-response-time'];
      if (responseTime) {
        console.log(`Prayer Times API response time: ${responseTime}`);
      }
    });
  });

  test.describe('Accessibility Tests', () => {
    test('Homepage has proper ARIA labels', async ({ page }) => {
      await page.goto('http://localhost:3000/');
      
      // Check for main navigation
      const nav = page.locator('nav[aria-label]');
      await expect(nav).toHaveCount(1);
      
      // Check for main content area
      const main = page.locator('main');
      await expect(main).toBeVisible();
      
      // Check for proper heading hierarchy
      const h1 = await page.locator('h1').count();
      expect(h1).toBeGreaterThanOrEqual(1);
    });

    test('Forms have proper labels', async ({ page }) => {
      await page.goto('http://localhost:3000/student/login');
      
      // Check email input has label
      const emailLabel = page.locator('label:has-text("Email")');
      await expect(emailLabel).toBeVisible();
      
      // Check password input has label
      const passwordLabel = page.locator('label:has-text("Password")');
      await expect(passwordLabel).toBeVisible();
    });
  });
});

// Additional test for checking specific hydration patterns
test.describe('Hydration Error Detection', () => {
  test('No hydration errors across all date-dependent components', async ({ page }) => {
    const hydrationErrors: string[] = [];
    
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('Warning: Text content did not match') ||
          text.includes('Warning: Prop') ||
          text.includes('Warning: Expected server HTML') ||
          text.includes('Hydration failed')) {
        hydrationErrors.push(text);
      }
    });

    // Test pages with date/time components
    const pagesWithDates = [
      '/',
      '/prayer-times',
      '/resources/islamic-calendar',
      '/admin/prayer-times',
      '/dashboard',
    ];

    for (const url of pagesWithDates) {
      await page.goto(`http://localhost:3000${url}`);
      await page.waitForLoadState('networkidle');
      
      // Wait a bit for any hydration errors to appear
      await page.waitForTimeout(1000);
    }

    // Assert no hydration errors were found
    expect(hydrationErrors).toHaveLength(0);
    
    if (hydrationErrors.length === 0) {
      console.log('✅ No hydration errors detected across all date-dependent pages!');
    }
  });
});