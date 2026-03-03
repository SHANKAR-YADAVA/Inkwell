'use client';
// components/blog/TagsList.tsx
import Link from 'next/link';

interface TagsListProps {
  tags: string[];
}

export default function TagsList({ tags }: TagsListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/tag/${encodeURIComponent(tag)}`}
          className="inline-block px-3 py-1 text-xs border border-ink-200 bg-white text-ink-600 hover:bg-ink-50 hover:text-ink-900 transition-colors"
          style={{ fontFamily: 'Lora, serif' }}
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}
