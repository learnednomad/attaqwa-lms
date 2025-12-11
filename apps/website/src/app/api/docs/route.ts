import { NextResponse } from 'next/server';
import { MOSQUE_INFO } from '@attaqwa/shared';

/**
 * Comprehensive Documentation API for AttaqwaMasjid LMS
 * Provides complete support documentation for end users
 */

const documentation = {
  meta: {
    title: 'AttaqwaMasjid LMS API Documentation',
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    mosque: MOSQUE_INFO,
    contact: {
      email: MOSQUE_INFO.email,
      schoolEmail: MOSQUE_INFO.schoolEmail,
      phone: MOSQUE_INFO.phone,
    },
  },

  // ============================================================================
  // API ENDPOINTS DOCUMENTATION
  // ============================================================================
  api: {
    authentication: {
      title: 'Authentication',
      description: 'User authentication and session management',
      endpoints: [
        {
          method: 'POST',
          path: '/api/auth/local',
          description: 'Login with email and password',
          body: {
            email: 'user@example.com',
            password: 'password123',
          },
          response: {
            user: {
              id: 'string',
              email: 'string',
              name: 'string',
              role: 'admin | user',
            },
            token: 'string',
          },
          errors: {
            400: 'Invalid credentials',
            401: 'Unauthorized',
            500: 'Server error',
          },
        },
        {
          method: 'POST',
          path: '/api/auth/local/register',
          description: 'Register new user account',
          body: {
            email: 'user@example.com',
            password: 'password123',
            name: 'Full Name',
          },
          response: {
            user: {
              id: 'string',
              email: 'string',
              name: 'string',
              role: 'user',
            },
            token: 'string',
          },
        },
        {
          method: 'POST',
          path: '/api/auth/logout',
          description: 'Logout current user',
          headers: {
            Authorization: 'Bearer {token}',
          },
          response: {
            message: 'Logged out successfully',
          },
        },
        {
          method: 'GET',
          path: '/api/users/me',
          description: 'Get current user profile',
          headers: {
            Authorization: 'Bearer {token}',
          },
          response: {
            user: {
              id: 'string',
              email: 'string',
              name: 'string',
              role: 'string',
            },
          },
        },
      ],
    },

    islamicFeatures: {
      title: 'Islamic Features',
      description: 'Prayer times, Qibla direction, and Islamic calendar',
      endpoints: [
        {
          method: 'GET',
          path: '/api/prayer-times',
          description: 'Get today\'s prayer times',
          queryParams: {
            city: 'Doraville (optional)',
            country: 'USA (optional)',
            method: '2 (optional, calculation method)',
          },
          response: {
            data: {
              date: '2025-01-15',
              hijriDate: '12 Rajab 1446',
              fajr: '6:30 AM',
              dhuhr: '12:45 PM',
              asr: '3:30 PM',
              maghrib: '5:45 PM',
              isha: '7:00 PM',
              sunrise: '7:30 AM',
            },
          },
          example: '/api/prayer-times?city=Doraville&country=USA&method=2',
        },
        {
          method: 'GET',
          path: '/api/islamic/ayah',
          description: 'Get Ayah of the Day (random Quranic verse)',
          response: {
            data: {
              text: 'Arabic text of the ayah',
              translation: 'English translation',
              surah: 'Surah name',
              ayahNumber: 1,
              reference: 'Surah:Ayah',
            },
          },
        },
        {
          method: 'GET',
          path: '/api/islamic/hadith',
          description: 'Get Hadith of the Day (random hadith)',
          response: {
            data: {
              text: 'Arabic text of the hadith',
              translation: 'English translation',
              narrator: 'Companion name',
              collection: 'Hadith collection name',
              reference: 'Book:Number',
            },
          },
        },
      ],
    },

    education: {
      title: 'Educational Content',
      description: 'Courses, lessons, quizzes, and progress tracking',
      endpoints: [
        {
          method: 'GET',
          path: '/api/education-contents',
          description: 'Get educational content (courses, lessons, etc.)',
          queryParams: {
            page: '1 (optional)',
            limit: '10 (optional)',
            ageTier: 'children | youth | adults | all (optional)',
            category: 'quran | hadith | fiqh | seerah (optional)',
          },
          response: {
            data: [
              {
                id: 'string',
                title: 'string',
                description: 'string',
                category: 'string',
                ageTier: 'string',
                difficulty: 'beginner | intermediate | advanced',
                duration: 60,
              },
            ],
            meta: {
              pagination: {
                page: 1,
                pageSize: 10,
                pageCount: 5,
                total: 50,
              },
            },
          },
        },
        {
          method: 'GET',
          path: '/api/quizzes',
          description: 'Get quizzes for Islamic education',
          queryParams: {
            courseId: 'course-id (optional)',
            difficulty: 'easy | medium | hard (optional)',
          },
          response: {
            data: [
              {
                id: 'string',
                title: 'string',
                description: 'string',
                questions: [
                  {
                    question: 'string',
                    type: 'multiple_choice | true_false | fill_blank',
                    options: ['string'],
                    correctAnswer: 'string',
                  },
                ],
                passingScore: 70,
                timeLimit: 30,
              },
            ],
          },
        },
        {
          method: 'GET',
          path: '/api/user-progress',
          description: 'Get user learning progress',
          headers: {
            Authorization: 'Bearer {token}',
          },
          response: {
            data: {
              userId: 'string',
              completedCourses: 5,
              inProgressCourses: 3,
              totalQuizzesPassed: 15,
              averageScore: 85,
              certificates: [
                {
                  courseId: 'string',
                  courseName: 'string',
                  completedDate: 'ISO date',
                  score: 90,
                },
              ],
            },
          },
        },
      ],
    },

    announcements: {
      title: 'Announcements & Events',
      description: 'Mosque announcements, events, and community news',
      endpoints: [
        {
          method: 'GET',
          path: '/api/announcements',
          description: 'Get mosque announcements',
          queryParams: {
            page: '1 (optional)',
            limit: '10 (optional)',
            isActive: 'true | false (optional)',
            isEvent: 'true | false (optional)',
          },
          response: {
            data: [
              {
                id: 'string',
                title: 'string',
                content: 'string',
                type: 'general | urgent | event | ramadan | eid',
                priority: 'low | medium | high',
                isActive: true,
                date: 'ISO date',
              },
            ],
            meta: {
              pagination: {
                page: 1,
                pageSize: 10,
                total: 30,
              },
            },
          },
        },
        {
          method: 'GET',
          path: '/api/events',
          description: 'Get mosque events',
          queryParams: {
            upcoming: 'true | false (optional)',
            limit: '10 (optional)',
          },
          response: {
            data: [
              {
                id: 'string',
                title: 'string',
                description: 'string',
                date: 'ISO date',
                startTime: 'HH:MM AM/PM',
                endTime: 'HH:MM AM/PM',
                location: 'string',
                category: 'lecture | quran | fundraiser | social',
                isActive: true,
              },
            ],
          },
        },
      ],
    },

    health: {
      title: 'System Health',
      description: 'API health check and status monitoring',
      endpoints: [
        {
          method: 'GET',
          path: '/api/health',
          description: 'Check API health status',
          response: {
            status: 'healthy | degraded | down',
            timestamp: 'ISO date',
            uptime: 12345,
            services: {
              database: 'healthy',
              prayerTimes: 'healthy',
              islamicContent: 'healthy',
            },
          },
        },
      ],
    },
  },

  // ============================================================================
  // USER GUIDES
  // ============================================================================
  userGuides: {
    students: {
      title: 'Student Guide',
      description: 'How to use the AttaqwaMasjid LMS as a student',
      sections: [
        {
          title: 'Getting Started',
          content: [
            '1. Create your account using your email and password',
            '2. Complete your profile with age tier (children, youth, adults)',
            '3. Browse available courses in the Education section',
            '4. Enroll in courses that match your age tier and interests',
          ],
        },
        {
          title: 'Taking Courses',
          content: [
            '1. Navigate to Education > Browse to see all available courses',
            '2. Click on a course to view lessons and content',
            '3. Complete lessons in order to track your progress',
            '4. Take quizzes to test your understanding',
            '5. Earn certificates upon course completion',
          ],
        },
        {
          title: 'Islamic Features',
          content: [
            'Prayer Times: Check daily prayer times for your location',
            'Qibla Direction: Find the direction to Mecca for prayer',
            'Islamic Calendar: View important Islamic dates and events',
            'Daily Ayah & Hadith: Learn from daily Quranic verses and Prophetic traditions',
          ],
        },
        {
          title: 'Progress Tracking',
          content: [
            'View your dashboard to see completed courses',
            'Check your quiz scores and certificates',
            'Track your learning streaks and achievements',
            'Set learning goals and monitor progress',
          ],
        },
      ],
    },

    parents: {
      title: 'Parent Guide',
      description: 'How to manage your children\'s Islamic education',
      sections: [
        {
          title: 'Setting Up Family Accounts',
          content: [
            '1. Create your parent account first',
            '2. Add children profiles with appropriate age tiers',
            '3. Set content restrictions based on age appropriateness',
            '4. Enable progress notifications for your email',
          ],
        },
        {
          title: 'Monitoring Progress',
          content: [
            'View all children\'s progress from your parent dashboard',
            'Receive weekly email reports on course completion',
            'Check quiz scores and certificates earned',
            'Review time spent on educational content',
          ],
        },
        {
          title: 'Content Controls',
          content: [
            'Age-tier filtering ensures age-appropriate content',
            'PRESCHOOL (3-5): Basic Islamic concepts, stories',
            'ELEMENTARY (6-10): Quran basics, prayer fundamentals',
            'MIDDLE_SCHOOL (11-13): Islamic history, intermediate fiqh',
            'HIGH_SCHOOL (14-17): Advanced topics, critical thinking',
          ],
        },
      ],
    },

    teachers: {
      title: 'Teacher Guide',
      description: 'How to teach and manage courses on the platform',
      sections: [
        {
          title: 'Creating Courses',
          content: [
            '1. Access the Teacher Dashboard from admin panel',
            '2. Click "Create New Course" and fill in course details',
            '3. Add lessons with text, video, and interactive content',
            '4. Create quizzes to assess student understanding',
            '5. Set appropriate age tier and difficulty level',
          ],
        },
        {
          title: 'Managing Students',
          content: [
            'View enrolled students in each course',
            'Track individual student progress and quiz scores',
            'Provide feedback on submitted assignments',
            'Award certificates for course completion',
          ],
        },
        {
          title: 'Content Guidelines',
          content: [
            'Follow Islamic educational principles',
            'Ensure content is age-appropriate for target tier',
            'Include Quranic references and authentic hadith',
            'Use clear, simple language for younger students',
            'Incorporate multimedia for engaging lessons',
          ],
        },
      ],
    },

    admins: {
      title: 'Administrator Guide',
      description: 'Platform administration and management',
      sections: [
        {
          title: 'User Management',
          content: [
            'Manage user accounts and roles',
            'Approve teacher applications',
            'Handle user support requests',
            'Monitor user activity and engagement',
          ],
        },
        {
          title: 'Content Moderation',
          content: [
            'Review and approve new courses before publishing',
            'Ensure Islamic content authenticity',
            'Monitor announcements and events',
            'Manage community guidelines enforcement',
          ],
        },
        {
          title: 'Prayer Times Management',
          content: [
            'Configure prayer time calculation methods',
            'Set manual overrides when needed',
            'Monitor prayer time API health',
            'Manage fallback systems for reliability',
          ],
        },
      ],
    },
  },

  // ============================================================================
  // ISLAMIC FEATURES DOCUMENTATION
  // ============================================================================
  islamicFeatures: {
    prayerTimes: {
      title: 'Prayer Times System',
      description: 'Accurate prayer times with 5-layer fallback for 99.9% uptime',
      features: [
        '5-Layer Fallback System: Aladhan API → IslamicFinder → Local Calculations → Manual Overrides → Offline Schedules',
        'Automatic location detection based on mosque address',
        'Multiple calculation methods (MWL, ISNA, Egypt, Makkah, Karachi, etc.)',
        'Hijri calendar integration',
        'Prayer time notifications and reminders',
        'Monthly and yearly prayer schedules',
      ],
      calculationMethods: {
        1: 'University of Islamic Sciences, Karachi',
        2: 'Islamic Society of North America (ISNA)',
        3: 'Muslim World League (MWL)',
        4: 'Umm Al-Qura University, Makkah',
        5: 'Egyptian General Authority of Survey',
        7: 'Institute of Geophysics, University of Tehran',
      },
      usage: [
        'Access prayer times from homepage',
        'View weekly/monthly schedules in Calendar section',
        'Enable notifications for prayer time reminders',
        'Customize calculation method in settings',
      ],
    },

    qiblaDirection: {
      title: 'Qibla Direction Finder',
      description: 'Find the direction to Mecca (Kaaba) for prayer',
      features: [
        'GPS-based accurate direction calculation',
        'Visual compass interface',
        'Degrees from North indication',
        'Works offline with last known location',
        'Educational information about the Kaaba',
      ],
      usage: [
        'Navigate to Resources > Qibla Direction',
        'Allow location access for accurate calculation',
        'Use compass to align prayer direction',
        'Reference degrees (e.g., 57° from North)',
      ],
    },

    islamicCalendar: {
      title: 'Islamic Calendar',
      description: 'Hijri calendar with important Islamic dates',
      features: [
        'Hijri to Gregorian date conversion',
        'Important Islamic dates highlighted',
        'Ramadan and Eid date predictions',
        'Monthly view with both calendars',
        'Educational content for Islamic months',
      ],
      importantDates: [
        'Ramadan: 9th month - Month of fasting',
        'Eid al-Fitr: 1st Shawwal - Festival of Breaking the Fast',
        'Eid al-Adha: 10th Dhul Hijjah - Festival of Sacrifice',
        'Ashura: 10th Muharram - Day of Atonement',
        'Mawlid: 12th Rabi al-Awwal - Birth of Prophet Muhammad (PBUH)',
      ],
    },

    education: {
      title: 'Islamic Education System',
      description: 'Comprehensive Islamic learning platform',
      categories: [
        'Quran: Quranic studies, memorization, tajweed',
        'Hadith: Prophetic traditions and their meanings',
        'Fiqh: Islamic jurisprudence and practical rulings',
        'Seerah: Biography of Prophet Muhammad (PBUH)',
        'Aqeedah: Islamic belief and theology',
        'Akhlaq: Islamic character and ethics',
      ],
      ageTiers: [
        'Children (3-5): Basic concepts through stories',
        'Youth (6-17): Age-appropriate Islamic education',
        'Adults (18+): Advanced studies and practical application',
      ],
      features: [
        'Interactive lessons with multimedia content',
        'Quizzes for knowledge assessment',
        'Progress tracking and certificates',
        'Personalized learning paths',
        'Family-safe content filtering',
      ],
    },
  },

  // ============================================================================
  // FREQUENTLY ASKED QUESTIONS
  // ============================================================================
  faq: {
    general: [
      {
        question: 'How do I create an account?',
        answer: 'Click "Register" on the homepage, enter your email, password, and full name. You\'ll receive a confirmation email to activate your account.',
      },
      {
        question: 'Is the platform free to use?',
        answer: 'Yes! All educational content and Islamic features are completely free for the community. The platform is supported by mosque donations.',
      },
      {
        question: 'Can I use the platform on mobile?',
        answer: 'Yes, we have a dedicated mobile app for iOS and Android. The website is also mobile-responsive for browser access.',
      },
      {
        question: 'How do I reset my password?',
        answer: 'Click "Forgot Password" on the login page, enter your email, and follow the reset link sent to your email.',
      },
    ],

    prayerTimes: [
      {
        question: 'Why are the prayer times different from other apps?',
        answer: 'Prayer times depend on calculation method and location. We use ISNA method by default. You can change the method in settings to match your preference.',
      },
      {
        question: 'Can I get notifications for prayer times?',
        answer: 'Yes! Enable notifications in your profile settings and allow browser/app notifications when prompted.',
      },
      {
        question: 'What if the prayer times are incorrect?',
        answer: 'Contact the mosque administration. They can manually override prayer times if needed for local adjustments.',
      },
    ],

    education: [
      {
        question: 'What age is the content suitable for?',
        answer: 'Content is filtered by age tiers: Preschool (3-5), Elementary (6-10), Middle School (11-13), High School (14-17), College (18-22), Adults (23+), and Seniors (65+).',
      },
      {
        question: 'Do I get a certificate after completing a course?',
        answer: 'Yes! You\'ll receive a digital certificate upon completing all lessons and passing quizzes with a score of 70% or higher.',
      },
      {
        question: 'Can parents track their children\'s progress?',
        answer: 'Yes, parent accounts can view all linked children\'s progress, scores, and certificates from the parent dashboard.',
      },
      {
        question: 'Are the Islamic teachings authentic?',
        answer: 'All content is reviewed by qualified Islamic scholars and teachers. We use authentic Quranic references and sahih (authentic) hadith.',
      },
    ],

    technical: [
      {
        question: 'What browsers are supported?',
        answer: 'We support modern browsers: Chrome, Firefox, Safari, and Edge (latest versions). Internet Explorer is not supported.',
      },
      {
        question: 'Why is the website slow?',
        answer: 'Check your internet connection. If the issue persists, contact support. We monitor performance and optimize regularly.',
      },
      {
        question: 'Can I access the platform offline?',
        answer: 'Prayer times and some content are cached for offline access. Full functionality requires internet connection.',
      },
      {
        question: 'How do I report a bug?',
        answer: `Email ${MOSQUE_INFO.schoolEmail} with details: what you were doing, error message, browser/device used, and screenshot if possible.`,
      },
    ],
  },

  // ============================================================================
  // TROUBLESHOOTING
  // ============================================================================
  troubleshooting: {
    authentication: [
      {
        problem: 'Cannot login - "Invalid credentials" error',
        solutions: [
          'Verify email address is correct (check for typos)',
          'Ensure password is correct (passwords are case-sensitive)',
          'Try password reset if you\'ve forgotten it',
          'Clear browser cache and cookies',
          'Check if account is activated (check email for activation link)',
        ],
      },
      {
        problem: 'Not receiving confirmation email',
        solutions: [
          'Check spam/junk folder',
          'Verify email address is spelled correctly',
          'Wait 5-10 minutes for email delivery',
          'Request new confirmation email',
          `Contact support at ${MOSQUE_INFO.schoolEmail}`,
        ],
      },
    ],

    prayerTimes: [
      {
        problem: 'Prayer times not showing',
        solutions: [
          'Check internet connection',
          'Allow location access when prompted',
          'Verify location services are enabled on device',
          'Try manual city selection in settings',
          'Clear browser cache and refresh page',
        ],
      },
      {
        problem: 'Prayer time notifications not working',
        solutions: [
          'Enable notifications in browser/device settings',
          'Allow notifications for the website when prompted',
          'Check notification settings in your profile',
          'Ensure browser is not in Do Not Disturb mode',
          'Try different browser if issue persists',
        ],
      },
    ],

    education: [
      {
        problem: 'Videos not playing',
        solutions: [
          'Check internet connection speed',
          'Update browser to latest version',
          'Disable browser extensions (ad blockers)',
          'Try different browser',
          'Clear browser cache',
        ],
      },
      {
        problem: 'Quiz not submitting',
        solutions: [
          'Ensure all required questions are answered',
          'Check internet connection',
          'Try refreshing page and re-taking quiz',
          'Disable browser extensions that might interfere',
          'Contact teacher if problem persists',
        ],
      },
    ],

    performance: [
      {
        problem: 'Website loading slowly',
        solutions: [
          'Check your internet connection speed',
          'Close other browser tabs',
          'Clear browser cache and cookies',
          'Disable unnecessary browser extensions',
          'Try accessing during off-peak hours',
          'Use mobile app for better performance',
        ],
      },
    ],
  },

  // ============================================================================
  // INTEGRATION GUIDES FOR DEVELOPERS
  // ============================================================================
  integrationGuides: {
    mobileApp: {
      title: 'Mobile App Integration',
      description: 'How to integrate the API with mobile applications',
      authentication: {
        title: 'Authentication Flow',
        steps: [
          '1. POST to /api/auth/local with email and password',
          '2. Store returned JWT token securely (iOS Keychain, Android KeyStore)',
          '3. Include token in Authorization header: "Bearer {token}"',
          '4. Refresh token before expiration (check exp claim)',
          '5. Handle 401 responses by redirecting to login',
        ],
        example: `
// Example: React Native Login
const login = async (email, password) => {
  const response = await fetch('${MOSQUE_INFO.website}/api/auth/local', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const { user, token } = await response.json();
  await SecureStore.setItemAsync('auth_token', token);
  return user;
};
        `,
      },
      prayerTimes: {
        title: 'Prayer Times Integration',
        caching: 'Cache prayer times for 24 hours, refresh daily at Fajr',
        offline: 'Store last 30 days of prayer times for offline access',
        notifications: 'Schedule local notifications based on prayer times',
        example: `
// Example: Fetching Prayer Times
const getPrayerTimes = async () => {
  const response = await fetch('${MOSQUE_INFO.website}/api/prayer-times');
  const { data } = await response.json();

  // Cache for offline access
  await AsyncStorage.setItem('prayer_times', JSON.stringify(data));

  // Schedule notifications
  schedulePrayerNotifications(data);

  return data;
};
        `,
      },
    },

    webIntegration: {
      title: 'Web Integration',
      description: 'Embedding AttaqwaMasjid features on external websites',
      prayerTimesWidget: {
        title: 'Prayer Times Widget',
        description: 'Embed prayer times on your website',
        example: `
<!-- Prayer Times Widget -->
<div id="attaqwa-prayer-times"></div>
<script src="${MOSQUE_INFO.website}/widgets/prayer-times.js"></script>
<script>
  AttaqwaPrayerTimes.init({
    container: '#attaqwa-prayer-times',
    theme: 'light', // or 'dark'
    showHijriDate: true,
    auto refresh: true,
  });
</script>
        `,
      },
      eventsWidget: {
        title: 'Events Widget',
        description: 'Show upcoming mosque events',
        example: `
<!-- Events Widget -->
<div id="attaqwa-events"></div>
<script src="${MOSQUE_INFO.website}/widgets/events.js"></script>
<script>
  AttaqwaEvents.init({
    container: '#attaqwa-events',
    limit: 5,
    upcoming: true,
  });
</script>
        `,
      },
    },
  },

  // ============================================================================
  // BEST PRACTICES
  // ============================================================================
  bestPractices: {
    security: [
      'Never share your password with anyone',
      'Use strong passwords (minimum 8 characters, mix of letters, numbers, symbols)',
      'Enable two-factor authentication when available',
      'Log out from shared devices',
      'Report suspicious activity immediately',
    ],
    privacy: [
      'Review privacy settings in your profile',
      'Control what information is visible to others',
      'Be cautious about sharing personal information in comments',
      'Report inappropriate content or behavior',
    ],
    learning: [
      'Set realistic learning goals and track progress',
      'Complete lessons in order for best understanding',
      'Review material multiple times for retention',
      'Ask questions in course discussions',
      'Practice regularly for better memorization',
    ],
    community: [
      'Treat all community members with respect',
      'Follow Islamic principles of good character (akhlaq)',
      'Help others when you can',
      'Report bugs and suggest improvements',
      'Participate in community events',
    ],
  },

  // ============================================================================
  // SUPPORT CONTACT
  // ============================================================================
  support: {
    title: 'Get Help & Support',
    methods: [
      {
        type: 'Email Support',
        contact: MOSQUE_INFO.schoolEmail,
        description: 'For technical issues, account problems, or general inquiries',
        responseTime: '24-48 hours',
      },
      {
        type: 'Phone Support',
        contact: MOSQUE_INFO.phone,
        description: 'For urgent issues during business hours',
        hours: 'Monday-Friday: 9 AM - 5 PM EST',
      },
      {
        type: 'In-Person Support',
        contact: `${MOSQUE_INFO.address}, ${MOSQUE_INFO.city}, ${MOSQUE_INFO.province} ${MOSQUE_INFO.postalCode}`,
        description: 'Visit the mosque office during prayer times',
        hours: 'After Fajr, Dhuhr, and Maghrib prayers',
      },
      {
        type: 'Social Media',
        contact: `Facebook: ${MOSQUE_INFO.socialMedia.facebook}`,
        description: 'Community announcements and quick questions',
      },
    ],
    beforeContacting: [
      'Check the FAQ section above',
      'Try the troubleshooting steps',
      'Have your account email ready',
      'Describe the issue clearly with screenshots if possible',
      'Include browser/device information',
    ],
  },
};

/**
 * GET /api/docs
 * Returns complete documentation
 *
 * Query parameters:
 * - section: Get a specific documentation section
 * - search: Search documentation content
 * - format: 'json' (default) or 'openapi' for OpenAPI spec
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section');
  const search = searchParams.get('search');
  const format = searchParams.get('format');

  // Return OpenAPI specification
  if (format === 'openapi') {
    return NextResponse.json({
      openApiUrl: '/docs/openapi.yaml',
      swaggerUiUrl: '/api/docs/swagger',
      message: 'OpenAPI specification available at /docs/openapi.yaml',
      version: '1.0.0',
      apiVersion: 'v1',
      endpoints: {
        spec: '/docs/openapi.yaml',
        json: '/api/docs',
        swagger: '/api/docs?format=swagger-config',
      },
    });
  }

  // Return Swagger UI configuration
  if (format === 'swagger-config') {
    return NextResponse.json({
      openapi: '3.1.0',
      info: {
        title: 'At-Taqwa LMS API',
        version: '1.0.0',
        description: 'RESTful API for At-Taqwa Islamic LMS',
      },
      servers: [
        { url: 'http://localhost:3003', description: 'Local Development' },
        { url: 'https://api.masjidattaqwaatlanta.org', description: 'Production' },
      ],
      externalDocs: {
        description: 'Full OpenAPI Specification',
        url: '/docs/openapi.yaml',
      },
    });
  }

  // If specific section requested
  if (section && section in documentation) {
    return NextResponse.json({
      section,
      data: documentation[section as keyof typeof documentation],
    });
  }

  // If search query provided
  if (search) {
    const results = searchDocumentation(search);
    return NextResponse.json({
      query: search,
      results,
      count: results.length,
    });
  }

  // Return complete documentation with OpenAPI link
  return NextResponse.json({
    ...documentation,
    openapi: {
      specUrl: '/docs/openapi.yaml',
      version: '3.1.0',
      apiVersion: 'v1',
    },
  });
}

/**
 * Search documentation for keywords
 */
function searchDocumentation(query: string): any[] {
  const results: any[] = [];
  const lowerQuery = query.toLowerCase();

  // Search in API endpoints
  Object.entries(documentation.api).forEach(([category, data]: [string, any]) => {
    if (data.title?.toLowerCase().includes(lowerQuery) ||
        data.description?.toLowerCase().includes(lowerQuery)) {
      results.push({
        type: 'api',
        category,
        title: data.title,
        description: data.description,
      });
    }

    data.endpoints?.forEach((endpoint: any) => {
      if (endpoint.path.includes(lowerQuery) ||
          endpoint.description?.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'endpoint',
          category,
          endpoint,
        });
      }
    });
  });

  // Search in user guides
  Object.entries(documentation.userGuides).forEach(([role, guide]: [string, any]) => {
    if (guide.title?.toLowerCase().includes(lowerQuery)) {
      results.push({
        type: 'user_guide',
        role,
        guide,
      });
    }
  });

  // Search in FAQ
  Object.entries(documentation.faq).forEach(([category, questions]: [string, any]) => {
    questions.forEach((item: any) => {
      if (item.question?.toLowerCase().includes(lowerQuery) ||
          item.answer?.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'faq',
          category,
          item,
        });
      }
    });
  });

  return results;
}
