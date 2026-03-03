// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import ReactionButtons from '@/components/blog/ReactionButtons';
import Comments from '@/components/blog/Comments';

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
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.coverImage ? [post.coverImage] : [],
      type: 'article',
      authors: post.author.name ? [post.author.name] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, published: true },
    include: { author: { select: { id: true, name: true, image: true, bio: true } } },
  });

  if (!post) notFound();

  // Increment views (fire and forget)
  prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {});

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Cover image */}
        {post.coverImage && (
          <div className="relative h-72 md:h-[480px] w-full">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-paper/80" />
          </div>
        )}

        <article className="max-w-2xl mx-auto px-6 py-12 animate-slide-up">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-6">
              {post.tags.map(tag => (
                <Link key={tag} href={`/?tag=${tag}`} className="tag-pill">{tag}</Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-ink-950 leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 mb-10 pb-8 border-b border-ink-100">
            <div className="flex items-center gap-3">
              {post.author.image ? (
                <Image src={post.author.image} alt={post.author.name || ''} width={40} height={40} className="rounded-full" />
              ) : (
                <div className="w-10 h-10 bg-ink-200 rounded-full flex items-center justify-center font-medium text-ink-700">
                  {post.author.name?.[0] || 'A'}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-ink-800" style={{ fontFamily: 'Lora, serif' }}>{post.author.name}</p>
                <p className="text-xs text-ink-400">{formatDate(post.publishedAt || post.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 ml-auto text-xs text-ink-400">
              {post.readTime && <span>{post.readTime} min read</span>}
              <span>·</span>
              <span>{post.views} views</span>
            </div>
          </div>

          {/* Content */}
          <div
            className="prose-blog"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Reactions */}
          <div className="mt-10 pt-8 border-t border-ink-100">
            <ReactionButtons postId={post.id} />
          </div>

          {/* Comments */}
          <div className="mt-10">
            <Comments postId={post.id} />
          </div>

          {/* Author bio */}
          {post.author.bio && (
            <div className="mt-16 pt-8 border-t border-ink-100 flex items-start gap-4">
              {post.author.image && (
                <Image src={post.author.image} alt={post.author.name || ''} width={52} height={52} className="rounded-full flex-shrink-0" />
              )}
              <div>
                <p className="text-sm font-semibold text-ink-800 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  About {post.author.name}
                </p>
                <p className="text-sm text-ink-600 leading-relaxed" style={{ fontFamily: 'Lora, serif' }}>{post.author.bio}</p>
              </div>
            </div>
          )}

          {/* Back */}
          <div className="mt-12">
            <Link href="/" className="text-sm text-ink-500 hover:text-ink-900 transition-colors" style={{ fontFamily: 'Lora, serif' }}>
              ← Back to all posts
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}