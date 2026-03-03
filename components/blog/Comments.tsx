'use client';
// components/blog/Comments.tsx
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface CommentsProps {
  postId: string;
}

function Avatar({ src, name }: { src?: string | null; name?: string | null }) {
  return src ? (
    <img
      src={src}
      alt={name || 'User'}
      className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
    />
  ) : (
    <div
      className="w-10 h-10 rounded-full flex-shrink-0 bg-ink-200 flex items-center justify-center text-ink-700 font-semibold text-sm"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      {name?.[0]?.toUpperCase() || 'U'}
    </div>
  );
}

function CommentItem({ comment, onDelete, currentUserId }: any) {
  const { status } = useSession();
  const router = useRouter();
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchReactions(); }, [comment.id]);

  const fetchReactions = async () => {
    try {
      const res = await fetch(`/api/comments/${comment.id}/reactions`);
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
      const res = await fetch(`/api/comments/${comment.id}/reactions`, {
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
    <div className="p-4 bg-white border border-ink-100 hover:border-ink-200 transition-colors">
      <div className="flex gap-3 items-start">
        <Avatar src={comment.user.image} name={comment.user.name} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold text-ink-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                {comment.user.name || 'Anonymous'}
              </p>
              <p className="text-xs text-ink-500" style={{ fontFamily: 'Lora, serif' }}>
                {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            {currentUserId === comment.user.id && (
              <button onClick={() => onDelete(comment.id)} className="text-xs text-ink-500 hover:text-ink-900 underline" style={{ fontFamily: 'Lora, serif' }}>
                Delete
              </button>
            )}
          </div>
          <p className="text-ink-700 leading-relaxed mb-3" style={{ fontFamily: 'Lora, serif' }}>
            {comment.content}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => handleReaction('like')} disabled={loading}
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs border transition-colors ${userLiked ? 'bg-ink-900 text-white border-ink-900' : 'bg-white text-ink-600 border-ink-200 hover:border-ink-300'} disabled:opacity-50`}
              style={{ fontFamily: 'Lora, serif' }}>
              <svg className="w-3 h-3" fill={userLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
              </svg>
              <span>{likesCount}</span>
            </button>
            <button onClick={() => handleReaction('dislike')} disabled={loading}
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs border transition-colors ${userDisliked ? 'bg-ink-900 text-white border-ink-900' : 'bg-white text-ink-600 border-ink-200 hover:border-ink-300'} disabled:opacity-50`}
              style={{ fontFamily: 'Lora, serif' }}>
              <svg className="w-3 h-3" fill={userDisliked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" />
              </svg>
              <span>{dislikesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Comments({ postId }: CommentsProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchComments(); }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'unauthenticated') {
      toast.error('Please sign in to comment');
      router.push('/auth/signin');
      return;
    }
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });
      if (res.ok) {
        const comment = await res.json();
        setComments([comment, ...comments]);
        setNewComment('');
        toast.success('Comment posted!');
      }
    } catch (error) {
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;
    try {
      const res = await fetch(`/api/posts/${postId}/comments?commentId=${commentId}`, { method: 'DELETE' });
      if (res.ok) {
        setComments(comments.filter(c => c.id !== commentId));
        toast.success('Comment deleted');
      }
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-ink-950 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
        Comments ({comments.length})
      </h3>

      {status === 'authenticated' ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3 items-start">
            <Avatar src={session?.user?.image} name={session?.user?.name} />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-4 py-3 border-2 border-ink-200 bg-white text-ink-900 placeholder-ink-400 focus:outline-none focus:border-ink-400 resize-none"
                style={{ fontFamily: 'Lora, serif' }}
                rows={3}
                disabled={submitting}
              />
              <div className="flex justify-end mt-2">
                <button type="submit" disabled={submitting || !newComment.trim()}
                  className="px-6 py-2 bg-ink-950 text-white hover:bg-ink-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Lora, serif' }}>
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-6 bg-ink-50 border-2 border-ink-200 text-center">
          <p className="text-ink-600 mb-3" style={{ fontFamily: 'Lora, serif' }}>Sign in to join the conversation</p>
          <button onClick={() => router.push('/auth/signin')} className="px-6 py-2 bg-ink-950 text-white hover:bg-ink-900 transition-colors" style={{ fontFamily: 'Lora, serif' }}>
            Sign In
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-ink-300 border-t-ink-900"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-ink-50">
          <p className="text-ink-500" style={{ fontFamily: 'Lora, serif' }}>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} onDelete={handleDelete} currentUserId={session?.user?.id} />
          ))}
        </div>
      )}
    </div>
  );
}