// components/blog/PostCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { formatReadingTime } from '@/lib/readingTime';

interface PostCardProps {
  featured?: boolean;
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    coverImage?: string | null;
    publishedAt?: Date | string | null;
    readTime?: number | null;
    views?: number;
    tags?: string[];
    author: {
      name?: string | null;
      image?: string | null;
    };
    category?: {
      name: string;
      slug: string;
      color: string;
    } | null;
    _count?: {
      likes?: number;
      dislikes?: number;
      comments?: number;
    };
  };
}

export function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <article className={`group flex ${featured ? 'flex-row h-64 md:h-80' : 'flex-col h-full'} bg-white border border-ink-100 hover:border-ink-300 hover:shadow-md transition-all duration-300`}>
      {/* Cover Image */}
      {post.coverImage && (
        <Link href={`/blog/${post.slug}`} className={`block overflow-hidden bg-ink-100 flex-shrink-0 ${featured ? 'w-1/2 h-64 md:h-80' : 'aspect-video sm:aspect-[16/10]'}`}>
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      )}

      <div className="flex flex-col flex-1 p-4 sm:p-6">
        {/* Category Badge */}
        {post.category && (
          <Link
            href={`/category/${post.category.slug}`}
            className="inline-block w-fit px-2 py-1 mb-3 text-xs uppercase tracking-wider border"
            style={{ 
              fontFamily: 'Lora, serif',
              borderColor: post.category.color,
              color: post.category.color
            }}
          >
            {post.category.name}
          </Link>
        )}

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-ink-950 mb-3 line-clamp-2 group-hover:text-ink-700 transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm sm:text-base text-ink-600 mb-4 line-clamp-3 flex-1" style={{ fontFamily: 'Lora, serif' }}>
            {post.excerpt}
          </p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map(tag => (
              <Link
                key={tag}
                href={`/?tag=${encodeURIComponent(tag)}`}
                className="text-xs px-2 py-1 bg-ink-50 text-ink-600 hover:bg-ink-100 transition-colors"
                style={{ fontFamily: 'Lora, serif' }}
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between pt-4 border-t border-ink-100 text-xs sm:text-sm text-ink-500">
          <div className="flex items-center gap-2">
            {post.author.image ? (
              <img
                src={post.author.image}
                alt={post.author.name || 'Author'}
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
              />
            ) : (
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-ink-200 rounded-full flex-shrink-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-ink-700">
                  {post.author.name?.[0]?.toUpperCase() || 'A'}
                </span>
              </div>
            )}
            <div className="flex flex-col leading-tight">
              <span className="font-medium truncate max-w-[100px] sm:max-w-none">{post.author.name}</span>
              {post.readTime && (
                <span className="text-xs text-ink-400">{formatReadingTime(post.readTime)}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            {post._count && (<>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                  </svg>
                  <span>{post._count.likes ?? 0}</span>
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" />
                  </svg>
                  <span>{post._count.dislikes ?? 0}</span>
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{post._count.comments ?? 0}</span>
                </span>
              </>)}
          </div>
        </div>
      </div>
    </article>
  );
}