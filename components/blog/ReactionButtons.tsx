'use client';
// components/blog/ReactionButtons.tsx
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface ReactionButtonsProps {
  postId: string;
}

export default function ReactionButtons({ postId }: ReactionButtonsProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReactions();
  }, [postId]);

  const fetchReactions = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/reactions`);
      const data = await res.json();
      setLikesCount(data.likesCount);
      setDislikesCount(data.dislikesCount);
      setUserLiked(data.userLiked);
      setUserDisliked(data.userDisliked);
    } catch (error) {
      console.error('Failed to fetch reactions:', error);
    }
  };

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (status === 'unauthenticated') {
      toast.error('Please sign in to react');
      router.push('/auth/signin');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setLikesCount(data.likesCount);
        setDislikesCount(data.dislikesCount);
        setUserLiked(data.userLiked);
        setUserDisliked(data.userDisliked);
      }
    } catch (error) {
      toast.error('Failed to update reaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => handleReaction('like')}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-4 py-2 border-2 transition-all duration-200 ${
          userLiked
            ? 'bg-ink-950 text-white border-ink-950'
            : 'bg-white text-ink-700 border-ink-200 hover:border-ink-300 hover:bg-ink-50'
        } disabled:opacity-50`}
        style={{ fontFamily: 'Lora, serif' }}
      >
        <svg
          className="w-5 h-5"
          fill={userLiked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
        </svg>
        <span className="font-medium text-sm">{likesCount}</span>
      </button>

      <button
        onClick={() => handleReaction('dislike')}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-4 py-2 border-2 transition-all duration-200 ${
          userDisliked
            ? 'bg-ink-950 text-white border-ink-950'
            : 'bg-white text-ink-700 border-ink-200 hover:border-ink-300 hover:bg-ink-50'
        } disabled:opacity-50`}
        style={{ fontFamily: 'Lora, serif' }}
      >
        <svg
          className="w-5 h-5"
          fill={userDisliked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" />
        </svg>
        <span className="font-medium text-sm">{dislikesCount}</span>
      </button>
    </div>
  );
}
