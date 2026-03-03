'use client';
// components/blog/ViewCounter.tsx
import { useEffect } from 'react';

interface ViewCounterProps {
  postId: string;
  views: number;
}

export default function ViewCounter({ postId, views }: ViewCounterProps) {
  useEffect(() => {
    // Increment view count
    const incrementView = async () => {
      // Check if already viewed in this session
      const viewedPosts = sessionStorage.getItem('viewedPosts');
      const viewedList = viewedPosts ? JSON.parse(viewedPosts) : [];

      if (!viewedList.includes(postId)) {
        try {
          await fetch(`/api/posts/${postId}/view`, {
            method: 'POST',
          });
          viewedList.push(postId);
          sessionStorage.setItem('viewedPosts', JSON.stringify(viewedList));
        } catch (error) {
          console.error('Failed to increment view:', error);
        }
      }
    };

    incrementView();
  }, [postId]);

  return (
    <div className="inline-flex items-center gap-1 text-sm text-ink-500" style={{ fontFamily: 'Lora, serif' }}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      <span>{views.toLocaleString()} views</span>
    </div>
  );
}
