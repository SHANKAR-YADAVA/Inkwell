'use client';
// components/blog/CategoryBadge.tsx
import Link from 'next/link';

interface CategoryBadgeProps {
  name: string;
  slug: string;
  color?: string;
}

export default function CategoryBadge({ name, slug, color = '#8B7355' }: CategoryBadgeProps) {
  return (
    <Link
      href={`/category/${slug}`}
      className="inline-block px-3 py-1 text-xs uppercase tracking-wider border-2 border-ink-200 bg-white text-ink-800 hover:bg-ink-50 transition-colors"
      style={{ fontFamily: 'Lora, serif', borderColor: color }}
    >
      {name}
    </Link>
  );
}
