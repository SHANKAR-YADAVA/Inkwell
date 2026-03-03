// app/search/page.tsx
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PostCard } from '@/components/blog/PostCard';
import SearchBar from '@/components/blog/SearchBar';
import { prisma } from '@/lib/prisma';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; tag?: string };
}) {
  const { q, category, tag } = searchParams;

  let posts: any[] = [];
  let searchTitle = '';

  if (q || category || tag) {
    const where: any = { published: true };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { excerpt: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
      ];
      searchTitle = `Search results for "${q}"`;
    }

    if (category) {
      where.category = { slug: category };
      searchTitle = `Posts in category: ${category}`;
    }

    if (tag) {
      where.tags = { has: tag };
      searchTitle = `Posts tagged with: ${tag}`;
    }

    posts = await prisma.post.findMany({
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
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 20,
    });
  }

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-ink-950 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Search Articles
          </h1>
          <SearchBar />
        </div>

        {searchTitle && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-ink-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              {searchTitle}
            </h2>
            <p className="text-ink-600 mt-2" style={{ fontFamily: 'Lora, serif' }}>
              {posts.length} {posts.length === 1 ? 'result' : 'results'} found
            </p>
          </div>
        )}

        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (q || category || tag) ? (
          <div className="text-center py-16 bg-ink-50 border-2 border-ink-100">
            <p className="text-ink-600 text-lg" style={{ fontFamily: 'Lora, serif' }}>
              No articles found. Try different keywords.
            </p>
          </div>
        ) : (
          <div className="text-center py-16 bg-ink-50 border-2 border-ink-100">
            <p className="text-ink-600 text-lg" style={{ fontFamily: 'Lora, serif' }}>
              Enter a search term to find articles.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
