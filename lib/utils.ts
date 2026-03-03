// lib/utils.ts
import slugify from 'slugify';

export function createSlug(title: string): string {
  return slugify(title, { lower: true, strict: true, trim: true });
}

export function calculateReadTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function truncate(text: string, maxLength: number): string {
  const plain = text.replace(/<[^>]*>/g, '');
  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength).trim() + '…';
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
