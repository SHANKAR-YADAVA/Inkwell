// app/api/posts/[id]/reactions/route.ts
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
    const postId = params.id;

    if (type === 'like') {
      const existingLike = await prisma.like.findUnique({
        where: { userId_postId: { userId: session.user.id, postId } },
      });

      if (existingLike) {
        await prisma.like.delete({
          where: { userId_postId: { userId: session.user.id, postId } },
        });
      } else {
        await prisma.dislike.deleteMany({
          where: { userId: session.user.id, postId },
        });
        await prisma.like.create({
          data: { userId: session.user.id, postId },
        });
      }
    } else if (type === 'dislike') {
      const existingDislike = await prisma.dislike.findUnique({
        where: { userId_postId: { userId: session.user.id, postId } },
      });

      if (existingDislike) {
        await prisma.dislike.delete({
          where: { userId_postId: { userId: session.user.id, postId } },
        });
      } else {
        await prisma.like.deleteMany({
          where: { userId: session.user.id, postId },
        });
        await prisma.dislike.create({
          data: { userId: session.user.id, postId },
        });
      }
    }

    const likesCount = await prisma.like.count({ where: { postId } });
    const dislikesCount = await prisma.dislike.count({ where: { postId } });
    const userLike = await prisma.like.findUnique({
      where: { userId_postId: { userId: session.user.id, postId } },
    });
    const userDislike = await prisma.dislike.findUnique({
      where: { userId_postId: { userId: session.user.id, postId } },
    });

    return NextResponse.json({
      likesCount,
      dislikesCount,
      userLiked: !!userLike,
      userDisliked: !!userDislike,
    });
  } catch (error) {
    console.error('Reaction error:', error);
    return NextResponse.json({ error: 'Failed to process reaction' }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const postId = params.id;

    const likesCount = await prisma.like.count({ where: { postId } });
    const dislikesCount = await prisma.dislike.count({ where: { postId } });

    let userLiked = false;
    let userDisliked = false;

    if (session?.user?.id) {
      const like = await prisma.like.findUnique({
        where: { userId_postId: { userId: session.user.id, postId } },
      });
      userLiked = !!like;

      const dislike = await prisma.dislike.findUnique({
        where: { userId_postId: { userId: session.user.id, postId } },
      });
      userDisliked = !!dislike;
    }

    return NextResponse.json({ likesCount, dislikesCount, userLiked, userDisliked });
  } catch (error) {
    console.error('Get reactions error:', error);
    return NextResponse.json({ error: 'Failed to get reactions' }, { status: 500 });
  }
}
