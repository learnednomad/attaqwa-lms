import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/middleware/auth';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

const mockQuizzes = [
  {
    documentId: 'quiz-001',
    title: 'Fiqh of Salah - Fundamentals',
    description: 'Test your knowledge of the basic rulings of Salah.',
    is_published: true,
    time_limit: 20,
    passing_score: 70,
    lesson: { documentId: 'lesson-001', title: 'Pillars of Salah' },
    questions: [
      { id: 'q1', text: 'How many rak\'ahs are in Fajr?', type: 'multiple_choice' },
      { id: 'q2', text: 'What is the first pillar of Salah?', type: 'multiple_choice' },
    ],
    createdAt: new Date('2024-12-01').toISOString(),
    updatedAt: new Date('2024-12-10').toISOString(),
  },
  {
    documentId: 'quiz-002',
    title: 'Seerah - Meccan Period',
    description: 'Quiz on the Prophet\'s life during the Meccan period.',
    is_published: true,
    time_limit: 30,
    passing_score: 60,
    lesson: { documentId: 'lesson-002', title: 'Early Revelations' },
    questions: [
      { id: 'q3', text: 'In which cave did the first revelation occur?', type: 'multiple_choice' },
      { id: 'q4', text: 'Who was the first person to accept Islam?', type: 'multiple_choice' },
      { id: 'q5', text: 'What year did the Hijra take place?', type: 'short_answer' },
    ],
    createdAt: new Date('2024-11-20').toISOString(),
    updatedAt: new Date('2024-12-05').toISOString(),
  },
  {
    documentId: 'quiz-003',
    title: 'Arabic Grammar - Verb Conjugation',
    description: 'Practice identifying and conjugating Arabic verbs.',
    is_published: true,
    time_limit: 25,
    passing_score: 65,
    lesson: { documentId: 'lesson-003', title: 'Past Tense Verbs' },
    questions: [
      { id: 'q6', text: 'Conjugate the verb "kataba" for feminine plural.', type: 'short_answer' },
    ],
    createdAt: new Date('2024-11-15').toISOString(),
    updatedAt: new Date('2024-12-01').toISOString(),
  },
];

/**
 * GET /api/v1/quizzes
 * Proxy to Strapi with v1 versioned response format, falls back to mock data
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Build Strapi query params
    const strapiParams = new URLSearchParams();

    // Pagination
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '25';
    strapiParams.set('pagination[page]', page);
    strapiParams.set('pagination[pageSize]', pageSize);

    // Filters
    const lessonId = searchParams.get('lesson');
    const courseId = searchParams.get('course');

    if (lessonId) strapiParams.set('filters[lesson][documentId][$eq]', lessonId);
    if (courseId) strapiParams.set('filters[lesson][course][documentId][$eq]', courseId);

    // Published filter - use boolean instead of string
    strapiParams.set('filters[is_published][$eq]', 'true');

    // Sorting
    const sort = searchParams.get('sort') || 'createdAt:desc';
    strapiParams.set('sort', sort);

    // Populate relations
    const populate = searchParams.get('populate') || 'lesson,questions';
    strapiParams.set('populate', populate);

    // Fetch from Strapi (correct endpoint: /api/quizzes, not /api/v1/quizzes)
    const response = await fetch(`${STRAPI_URL}/api/quizzes?${strapiParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Strapi error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      data: data.data,
      meta: {
        ...data.meta,
        version: 'v1',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching quizzes from Strapi, using fallback data:', error);

    // Fallback to mock data
    const pageNum = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const pageSizeNum = parseInt(request.nextUrl.searchParams.get('pageSize') || '25');
    const start = (pageNum - 1) * pageSizeNum;
    const paginated = mockQuizzes.slice(start, start + pageSizeNum);

    return NextResponse.json({
      data: paginated,
      meta: {
        pagination: {
          page: pageNum,
          pageSize: pageSizeNum,
          pageCount: Math.ceil(mockQuizzes.length / pageSizeNum),
          total: mockQuizzes.length,
        },
        version: 'v1',
        source: 'fallback',
        timestamp: new Date().toISOString(),
      },
    });
  }
}

/**
 * POST /api/v1/quizzes
 * Create a new quiz (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // SECURITY: Verify authentication and role
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: { status: 401, message: 'Authentication required' } },
        { status: 401 }
      );
    }
    if (!['ADMIN', 'TEACHER', 'admin', 'teacher'].includes(user.role)) {
      return NextResponse.json(
        { error: { status: 403, message: 'Insufficient permissions' } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const authHeader = request.headers.get('authorization');

    // Correct endpoint: /api/quizzes
    const response = await fetch(`${STRAPI_URL}/api/quizzes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify({ data: body }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json(
      {
        data: data.data,
        meta: {
          version: 'v1',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'InternalServerError',
          message: 'Failed to create quiz',
        },
      },
      { status: 500 }
    );
  }
}
