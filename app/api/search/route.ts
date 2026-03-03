// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');

    if (!query && !category && !tag) {
      return NextResponse.json({ posts: [] });
    }

    const where: any = {
      published: true,
    };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (tag) {
      where.tags = {
        has: tag,
      };
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 20,
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}