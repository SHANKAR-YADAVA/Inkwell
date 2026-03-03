'use client';
// components/blog/BookmarkButton.tsx
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface BookmarkButtonProps {
  postId: string;
}

export default function BookmarkButton({ postId }: BookmarkButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      checkBookmark();
    }
  }, [postId, session]);

  const checkBookmark = async () => {
    try {
      const bookmarks = localStorage.getItem(`bookmarks_${session?.user?.id}`);
      if (bookmarks) {
        const bookmarkList = JSON.parse(bookmarks);
        setIsBookmarked(bookmarkList.includes(postId));
      }
    } catch (error) {
      console.error('Failed to check bookmark:', error);
    }
  };

  const toggleBookmark = async () => {
    if (status === 'unauthenticated') {
      toast.error('Please sign in to bookmark posts');
      router.push('/auth/signin');
      return;
    }

    setLoading(true);
    try {
      const key = `bookmarks_${session?.user?.id}`;
      const bookmarks = localStorage.getItem(key);
      let bookmarkList: string[] = bookmarks ? JSON.parse(bookmarks) : [];

      if (isBookmarked) {
        bookmarkList = bookmarkList.filter(id => id !== postId);
        toast.success('Removed from bookmarks');
      } else {
        bookmarkList.push(postId);
        toast.success('Added to bookmarks');
      }

      localStorage.setItem(key, JSON.stringify(bookmarkList));
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      toast.error('Failed to update bookmark');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 border-2 transition-all ${
        isBookmarked
          ? 'bg-ink-100 text-ink-900 border-ink-300'
          : 'bg-white text-ink-700 border-ink-200 hover:border-ink-300'
      } disabled:opacity-50`}
      style={{ fontFamily: 'Lora, serif' }}
    >
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5"
        fill={isBookmarked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      <span className="hidden sm:inline text-sm font-medium">
        {isBookmarked ? 'Saved' : 'Save'}
      </span>
    </button>
  );
}
