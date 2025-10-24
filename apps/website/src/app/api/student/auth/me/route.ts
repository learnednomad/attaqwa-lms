import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@attaqwa/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie or authorization header
    const token = request.cookies.get('student-auth-token')?.value ||
      request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token provided' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user from database with updated info
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                instructor: {
                  select: {
                    name: true,
                    email: true
                  }
                }
              }
            }
          },
          where: {
            status: 'ACTIVE'
          }
        },
        submissions: {
          include: {
            assignment: true
          },
          orderBy: {
            submittedAt: 'desc'
          },
          take: 5
        },
        notifications: {
          where: {
            read: false
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare user data
    const userData = {
      id: user.id,
      email: user.email,
      studentId: user.studentId,
      name: user.name,
      role: user.role,
      enrolledCourses: user.enrollments.map(e => ({
        courseId: e.courseId,
        courseName: e.course.name,
        courseCode: e.course.code,
        instructor: e.course.instructor.name,
        enrolledAt: e.enrolledAt,
        progress: e.progress
      })),
      recentSubmissions: user.submissions.map(s => ({
        id: s.id,
        assignmentTitle: s.assignment.title,
        submittedAt: s.submittedAt,
        grade: s.grade,
        status: s.status
      })),
      unreadNotifications: user.notifications.length
    };

    return NextResponse.json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'An error occurred while checking authentication' },
      { status: 500 }
    );
  }
}