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
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const whereClause: any = {
      userId: user.userId
    };

    if (unreadOnly) {
      whereClause.read = false;
    }

    // Get notifications
    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    // Get total count
    const totalCount = await prisma.notification.count({
      where: whereClause
    });

    // Get unread count
    const unreadCount = await prisma.notification.count({
      where: {
        userId: user.userId,
        read: false
      }
    });

    return NextResponse.json({
      success: true,
      notifications,
      totalCount,
      unreadCount,
      hasMore: offset + notifications.length < totalCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// Mark notification as read
export async function PATCH(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notificationId, markAllRead } = body;

    if (markAllRead) {
      // Mark all notifications as read
      await prisma.notification.updateMany({
        where: {
          userId: user.userId,
          read: false
        },
        data: {
          read: true
        }
      });

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } else if (notificationId) {
      // Mark single notification as read
      const notification = await prisma.notification.update({
        where: {
          id: notificationId,
          userId: user.userId
        },
        data: {
          read: true
        }
      });

      return NextResponse.json({
        success: true,
        notification
      });
    } else {
      return NextResponse.json(
        { error: 'No notification ID provided' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}