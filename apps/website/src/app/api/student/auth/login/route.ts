import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@attaqwa/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, studentId, password } = body;

    // Validate input
    if (!password || (!email && !studentId)) {
      return NextResponse.json(
        { error: 'Email/Student ID and password are required' },
        { status: 400 }
      );
    }

    // Find user by email or studentId
    const user = await prisma.user.findFirst({
      where: email 
        ? { email }
        : { studentId },
      include: {
        enrollments: {
          include: {
            course: true
          },
          where: {
            status: 'ACTIVE'
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        studentId: user.studentId,
        name: user.name,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Prepare user data (exclude password)
    const userData = {
      id: user.id,
      email: user.email,
      studentId: user.studentId,
      name: user.name,
      role: user.role,
      enrolledCourses: user.enrollments.map(e => ({
        courseId: e.courseId,
        courseName: e.course.name,
        enrolledAt: e.enrolledAt
      }))
    };

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      token,
      user: userData
    });

    // Set HTTP-only cookie for security
    response.cookies.set({
      name: 'student-auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}