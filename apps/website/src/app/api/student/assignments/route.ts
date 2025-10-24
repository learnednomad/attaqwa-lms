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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const status = searchParams.get('status'); // pending, submitted, graded

    // Build where clause
    const whereClause: any = {
      course: {
        enrollments: {
          some: {
            studentId: user.userId,
            status: 'ACTIVE'
          }
        }
      },
      isActive: true
    };

    if (courseId) {
      whereClause.courseId = courseId;
    }

    // Get assignments
    const assignments = await prisma.assignment.findMany({
      where: whereClause,
      include: {
        course: {
          select: {
            name: true,
            code: true
          }
        },
        submissions: {
          where: {
            studentId: user.userId
          },
          include: {
            feedback: true
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    });

    // Filter by status if provided
    let filteredAssignments = assignments;
    if (status === 'pending') {
      filteredAssignments = assignments.filter(a => 
        a.submissions.length === 0 && new Date(a.dueDate) > new Date()
      );
    } else if (status === 'submitted') {
      filteredAssignments = assignments.filter(a => 
        a.submissions.length > 0 && a.submissions[0].grade === null
      );
    } else if (status === 'graded') {
      filteredAssignments = assignments.filter(a => 
        a.submissions.length > 0 && a.submissions[0].grade !== null
      );
    }

    // Format the response
    const formattedAssignments = filteredAssignments.map(assignment => {
      const submission = assignment.submissions[0];
      const now = new Date();
      const dueDate = new Date(assignment.dueDate);
      const isOverdue = dueDate < now && !submission;

      return {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        courseCode: assignment.course.code,
        courseName: assignment.course.name,
        dueDate: assignment.dueDate,
        totalPoints: assignment.totalPoints,
        type: assignment.type,
        instructions: assignment.instructions,
        rubric: assignment.rubric,
        status: submission 
          ? (submission.grade !== null ? 'graded' : 'submitted')
          : (isOverdue ? 'overdue' : 'pending'),
        submission: submission ? {
          id: submission.id,
          submittedAt: submission.submittedAt,
          content: submission.content,
          fileUrl: submission.fileUrl,
          grade: submission.grade,
          feedback: submission.feedback,
          status: submission.status
        } : null,
        isOverdue,
        daysUntilDue: Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      };
    });

    return NextResponse.json({
      success: true,
      assignments: formattedAssignments
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    );
  }
}