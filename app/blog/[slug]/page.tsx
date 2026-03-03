// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import type { Metadata } from 'next';
import ReactionButtons from '@/components/blog/ReactionButtons';
import Comments from '@/components/blog/Comments';
import ShareButton from '@/components/blog/ShareButton';
import BookmarkButton from '@/components/blog/BookmarkButton';
import ViewCounter from '@/components/blog/ViewCounter';
import { formatReadingTime } from '@/lib/readingTime';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: { select: { name: true } } },
  });
  if (!post) return { title: 'Not found' };

  return {
    title: post.title,
    description: post.excerpt || undefined,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, published: true },
    include: { 
      author: { select: { id: true, name: true, image: true, bio: true } },
      category: true,
    },
  });

  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-parchment">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Cover image - SMALL AND CENTERED */}
          {post.coverImage && (
            <div className="mb-8">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="w-full h-auto max-h-96 object-contain mx-auto"
              />
            </div>
          )}

          {/* Category */}
          {post.category && (
            <div className="mb-4">
              <Link
                href={`/category/${post.category.slug}`}
                className="inline-block px-3 py-1 text-xs uppercase border-2"
                style={{ 
                  fontFamily: 'Lora, serif',
                  borderColor: post.category.color,
                  color: post.category.color 
                }}
              >
                {post.category.name}
              </Link>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ink-950 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            {post.title}
          </h1>

          {/* Author Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b-2 border-ink-200">
            <div className="flex items-center gap-3">
              {post.author.image ? (
                <img 
                  src={post.author.image} 
                  alt={post.author.name || 'Author'} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-ink-200"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center border-2 border-amber-500 shadow-sm">
                  <span className="text-lg font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {post.author.name?.[0]?.toUpperCase() || 'A'}
                  </span>
                </div>
              )}
              <div>
                <p className="font-semibold text-ink-950" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {post.author.name}
                </p>
                <div className="flex items-center gap-2 text-sm text-ink-500">
                  {post.publishedAt && <time>{formatDate(post.publishedAt)}</time>}
                  {post.readTime && (
                    <>
                      <span>•</span>
                      <span>{formatReadingTime(post.readTime)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="ml-auto">
              <ViewCounter postId={post.id} views={post.views} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-10 pb-8 border-b-2 border-ink-200">
            <ReactionButtons postId={post.id} />
            <BookmarkButton postId={post.id} />
            <ShareButton 
              url={`http://localhost:3000/blog/${post.slug}`}
              title={post.title}
            />
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map(tag => (
                <Link 
                  key={tag} 
                  href={`/?tag=${encodeURIComponent(tag)}`} 
                  className="px-3 py-1 text-sm border border-ink-200 bg-white hover:bg-ink-50"
                  style={{ fontFamily: 'Lora, serif' }}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Content */}
          <div 
            className="prose max-w-none mb-12 text-ink-900"
            style={{ fontFamily: 'Lora, serif' }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Comments */}
          <Comments postId={post.id} />
        </article>
      </main>
      <Footer />
    </>
  );
}