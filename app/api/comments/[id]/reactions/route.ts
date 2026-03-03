// app/api/comments/[id]/reactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type } = await req.json();
    const commentId = params.id;

    if (type === 'like') {
      const existingLike = await prisma.commentLike.findUnique({
        where: { userId_commentId: { userId: session.user.id, commentId } },
      });

      if (existingLike) {
        await prisma.commentLike.delete({
          where: { userId_commentId: { userId: session.user.id, commentId } },
        });
      } else {
        await prisma.commentDislike.deleteMany({
          where: { userId: session.user.id, commentId },
        });
        await prisma.commentLike.create({
          data: { userId: session.user.id, commentId },
        });
      }
    } else if (type === 'dislike') {
      const existingDislike = await prisma.commentDislike.findUnique({
        where: { userId_commentId: { userId: session.user.id, commentId } },
      });

      if (existingDislike) {
        await prisma.commentDislike.delete({
          where: { userId_commentId: { userId: session.user.id, commentId } },
        });
      } else {
        await prisma.commentLike.deleteMany({
          where: { userId: session.user.id, commentId },
        });
        await prisma.commentDislike.create({
          data: { userId: session.user.id, commentId },
        });
      }
    }

    const likesCount = await prisma.commentLike.count({ where: { commentId } });
    const dislikesCount = await prisma.commentDislike.count({ where: { commentId } });
    const userLike = await prisma.commentLike.findUnique({
      where: { userId_commentId: { userId: session.user.id, commentId } },
    });
    const userDislike = await prisma.commentDislike.findUnique({
      where: { userId_commentId: { userId: session.user.id, commentId } },
    });

    return NextResponse.json({
      likesCount,
      dislikesCount,
      userLiked: !!userLike,
      userDisliked: !!userDislike,
    });
  } catch (error) {
    console.error('Comment reaction error:', error);
    return NextResponse.json({ error: 'Failed to process reaction' }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const commentId = params.id;

    const likesCount = await prisma.commentLike.count({ where: { commentId } });
    const dislikesCount = await prisma.commentDislike.count({ where: { commentId } });

    let userLiked = false;
    let userDisliked = false;

    if (session?.user?.id) {
      const like = await prisma.commentLike.findUnique({
        where: { userId_commentId: { userId: session.user.id, commentId } },
      });
      userLiked = !!like;

      const dislike = await prisma.commentDislike.findUnique({
        where: { userId_commentId: { userId: session.user.id, commentId } },
      });
      userDisliked = !!dislike;
    }

    return NextResponse.json({ likesCount, dislikesCount, userLiked, userDisliked });
  } catch (error) {
    console.error('Get comment reactions error:', error);
    return NextResponse.json({ error: 'Failed to get reactions' }, { status: 500 });
  }
}
