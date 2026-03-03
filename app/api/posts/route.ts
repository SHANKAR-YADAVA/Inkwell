// app/api/posts/route.ts
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createSlug, calculateReadTime } from '@/lib/utils';
import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().optional().default(''),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  published: z.boolean().optional().default(false),
}).refine(data => !data.published || (data.content && data.content.trim().length > 0), {
  message: 'Content is required to publish',
  path: ['content'],
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const tag = searchParams.get('tag');
    const authorId = searchParams.get('authorId');
    const drafts = searchParams.get('drafts') === 'true';

    const session = await getServerSession(authOptions);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (!drafts) where.published = true;
    else if (session?.user?.id) where.authorId = session.user.id;
    if (tag) where.tags = { has: tag };
    if (authorId) where.authorId = authorId;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { id: true, name: true, image: true } } },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({ posts, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = postSchema.parse(body);

    let slug = createSlug(data.title);
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const readTime = calculateReadTime(data.content);
    const post = await prisma.post.create({
      data: {
        ...data,
        slug,
        readTime,
        authorId: session.user.id,
        publishedAt: data.published ? new Date() : null,
      },
      include: { author: { select: { id: true, name: true, image: true } } },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}