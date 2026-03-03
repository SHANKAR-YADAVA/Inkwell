'use client';
// components/blog/RelatedPosts.tsx
import Link from 'next/link';
import { formatReadingTime } from '@/lib/readingTime';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  readTime: number | null;
  author: {
    name: string | null;
    image: string | null;
  };
}

interface RelatedPostsProps {
  posts: Post[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="mt-16 border-t-2 border-ink-200 pt-12">
      <h3 className="text-2xl sm:text-3xl font-bold text-ink-950 mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
        Related Articles
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group block bg-white border border-ink-100 hover:border-ink-300 transition-all duration-200"
          >
            {post.coverImage && (
              <div className="aspect-video w-full overflow-hidden bg-ink-100">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-4">
              <h4 className="font-bold text-ink-950 mb-2 line-clamp-2 group-hover:text-ink-700 transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                {post.title}
              </h4>
              {post.excerpt && (
                <p className="text-sm text-ink-600 line-clamp-2 mb-3" style={{ fontFamily: 'Lora, serif' }}>
                  {post.excerpt}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-ink-500">
                <span>{post.author.name}</span>
                {post.readTime && (
                  <>
                    <span>•</span>
                    <span>{formatReadingTime(post.readTime)}</span>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
