// app/page.tsx
import { prisma } from '@/lib/prisma';
import { PostCard } from '@/components/blog/PostCard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import SearchBar from '@/components/blog/SearchBar';
import Link from 'next/link';

export const revalidate = 60;

export default async function HomePage({
  searchParams,
}: {
  searchParams: { tag?: string; page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const tag = searchParams.tag;
  const limit = 9;
  const skip = (page - 1) * limit;

  const where: any = { published: true };
  if (tag) where.tags = { has: tag };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, image: true } },
        _count: { select: { likes: true, dislikes: true, comments: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  // Get all tags for filter
  const allPosts = await prisma.post.findMany({
    where: { published: true },
    select: { tags: true },
  });
  const tagCounts: Record<string, number> = {};
  allPosts.forEach(p => p.tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  const popularTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([t]) => t);

  const totalPages = Math.ceil(total / limit);
  const [featured, ...rest] = posts;

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        {!tag && page === 1 && (
          <div className="text-center mb-16 animate-fade-in">
            <p className="text-ink-500 text-sm tracking-widest uppercase mb-3" style={{ fontFamily: 'Lora, serif' }}>Welcome to</p>
            <h1 className="text-5xl md:text-7xl font-bold text-ink-950 mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
              The Inkwell
            </h1>
            <p className="text-ink-600 text-lg max-w-md mx-auto mb-8" style={{ fontFamily: 'Lora, serif' }}>
              A curated space for thoughtful writing, deep ideas, and honest stories.
            </p>
            {/* Search Bar */}
            <SearchBar />
          </div>
        )}

        {/* Tag filter */}
        {popularTags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-10">
            <Link
              href="/"
              className={`tag-pill ${!tag ? 'bg-ink-900 text-paper' : ''}`}
            >
              All
            </Link>
            {popularTags.map(t => (
              <Link
                key={t}
                href={`/?tag=${t}`}
                className={`tag-pill ${tag === t ? 'bg-ink-900 text-paper' : ''}`}
              >
                {t}
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">✍️</p>
            <h2 className="text-2xl font-bold text-ink-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              No posts yet
            </h2>
            <p className="text-ink-500 mb-6">Be the first to share your story.</p>
            <Link href="/auth/signup" className="btn-primary">Start writing</Link>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && !tag && page === 1 && (
              <div className="mb-10">
                <PostCard post={featured as any} featured />
              </div>
            )}

            {/* Post grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {(tag || page > 1 ? posts : rest).map(post => (
                <PostCard key={post.id} post={post as any} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-16">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Link
                    key={p}
                    href={`/?page=${p}${tag ? `&tag=${tag}` : ''}`}
                    className={`w-9 h-9 flex items-center justify-center text-sm border transition-colors ${
                      p === page
                        ? 'bg-ink-900 text-paper border-ink-900'
                        : 'border-ink-200 text-ink-600 hover:border-ink-500'
                    }`}
                  >
                    {p}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}