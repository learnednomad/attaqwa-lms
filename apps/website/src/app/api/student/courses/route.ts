import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@attaqwa/db';
import { verifyAuth } from '@/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get enrolled courses for the student
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: user.userId,
        status: 'ACTIVE'
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                name: true,
                email: true
              }
            },
            materials: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 5
            },
            announcements: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 3
            },
            assignments: {
              where: {
                isActive: true
              },
              orderBy: {
                dueDate: 'asc'
              },
              include: {
                submissions: {
                  where: {
                    studentId: user.userId
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        enrolledAt: 'desc'
      }
    });

    // Format the response
    const courses = enrollments.map(enrollment => ({
      id: enrollment.course.id,
      code: enrollment.course.code,
      name: enrollment.course.name,
      description: enrollment.course.description,
      instructor: enrollment.course.instructor.name,
      credits: enrollment.course.credits,
      semester: enrollment.course.semester,
      year: enrollment.course.year,
      enrolledAt: enrollment.enrolledAt,
      progress: enrollment.progress,
      grade: enrollment.grade,
      materials: enrollment.course.materials.map(m => ({
        id: m.id,
        title: m.title,
        type: m.type,
        url: m.url
      })),
      announcements: enrollment.course.announcements.map(a => ({
        id: a.id,
        title: a.title,
        content: a.content,
        createdAt: a.createdAt
      })),
      assignments: enrollment.course.assignments.map(a => ({
        id: a.id,
        title: a.title,
        description: a.description,
        dueDate: a.dueDate,
        totalPoints: a.totalPoints,
        submitted: a.submissions.length > 0,
        grade: a.submissions[0]?.grade || null
      })),
      upcomingAssignments: enrollment.course.assignments
        .filter(a => new Date(a.dueDate) > new Date() && a.submissions.length === 0)
        .length
    }));

    return NextResponse.json({
      success: true,
      courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}