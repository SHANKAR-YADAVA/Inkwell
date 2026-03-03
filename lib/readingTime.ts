// lib/readingTime.ts

export function calculateReadingTime(text: string): number {
  // Average reading speed is 200-250 words per minute
  // We'll use 225 as a middle ground
  const wordsPerMinute = 225;
  
  // Remove HTML tags for accurate word count
  const plainText = text.replace(/<[^>]*>/g, '');
  
  // Count words
  const words = plainText.trim().split(/\s+/).length;
  
  // Calculate minutes
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return minutes;
}

export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return 'Less than 1 min read';
  if (minutes === 1) return '1 min read';
  return `${minutes} min read`;
}
