'use client';
// app/dashboard/page.tsx
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  publishedAt: string | null;
  views: number;
  readTime: number | null;
  tags: string[];
  coverImage: string | null;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'published' | 'drafts'>('published');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin');
  }, [status, router]);

  useEffect(() => {
    if (session) {
      setLoading(true);
      fetch(`/api/posts?authorId=${session.user.id}&drafts=true&limit=50`)
        .then(r => r.json())
        .then(data => { setPosts(data.posts || []); setLoading(false); });
    }
  }, [session]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    setDeleting(id);
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setPosts(p => p.filter(post => post.id !== id));
      toast.success('Post deleted');
    } else {
      toast.error('Failed to delete');
    }
    setDeleting(null);
  };

  const togglePublish = async (post: Post) => {
    const res = await fetch(`/api/posts/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !post.published }),
    });
    if (res.ok) {
      const updated = await res.json();
      setPosts(p => p.map(pp => pp.id === post.id ? updated : pp));
      toast.success(updated.published ? 'Published!' : 'Moved to drafts');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-ink-400 text-sm" style={{ fontFamily: 'Lora, serif' }}>Loading your posts…</div>
        </div>
      </>
    );
  }

  const filtered = posts.filter(p => tab === 'published' ? p.published : !p.published);
  const publishedCount = posts.filter(p => p.published).length;
  const draftCount = posts.filter(p => !p.published).length;

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-ink-950" style={{ fontFamily: "'Playfair Display', serif" }}>
              Your Writing
            </h1>
            <p className="text-sm text-ink-500 mt-1" style={{ fontFamily: 'Lora, serif' }}>
              {publishedCount} published · {draftCount} {draftCount === 1 ? 'draft' : 'drafts'}
            </p>
          </div>
          <Link href="/dashboard/new" className="btn-primary">
            + New Post
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Posts', value: posts.length },
            { label: 'Published', value: publishedCount },
            { label: 'Total Views', value: posts.reduce((a, p) => a + p.views, 0).toLocaleString() },
          ].map(stat => (
            <div key={stat.label} className="bg-white border border-ink-100 p-5 text-center">
              <p className="text-2xl font-bold text-ink-950" style={{ fontFamily: "'Playfair Display', serif" }}>{stat.value}</p>
              <p className="text-xs text-ink-500 mt-1 uppercase tracking-wider" style={{ fontFamily: 'Lora, serif' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-ink-100 mb-6">
          {(['published', 'drafts'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm capitalize transition-colors border-b-2 -mb-px ${
                tab === t ? 'border-ink-900 text-ink-900 font-medium' : 'border-transparent text-ink-500 hover:text-ink-700'
              }`}
              style={{ fontFamily: 'Lora, serif' }}
            >
              {t} ({t === 'published' ? publishedCount : draftCount})
            </button>
          ))}
        </div>

        {/* Posts */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">{tab === 'published' ? '📖' : '📝'}</p>
            <p className="text-ink-500" style={{ fontFamily: 'Lora, serif' }}>
              {tab === 'published' ? 'No published posts yet.' : 'No drafts saved yet.'}
            </p>
            <Link href="/dashboard/new" className="btn-primary mt-5 inline-flex">Start writing</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(post => (
              <div key={post.id} className="bg-white border border-ink-100 hover:border-ink-300 transition-colors p-5 flex items-center gap-4">
                {post.coverImage && (
                  <div className="relative w-16 h-16 flex-shrink-0 hidden sm:block">
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-ink-900 truncate" style={{ fontFamily: "'Playfair Display', serif" }}>{post.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-ink-400" style={{ fontFamily: 'Lora, serif' }}>
                    <span>{formatDate(post.createdAt)}</span>
                    {post.readTime && <span>· {post.readTime} min read</span>}
                    {post.published && <span>· {post.views} views</span>}
                    {post.tags.slice(0, 2).map(t => <span key={t} className="tag-pill">{t}</span>)}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/dashboard/edit/${post.id}`} className="btn-ghost text-xs px-3 py-1.5">Edit</Link>
                  {post.published && (
                    <Link href={`/blog/${post.slug}`} target="_blank" className="btn-ghost text-xs px-3 py-1.5">View →</Link>
                  )}
                  <button
                    onClick={() => togglePublish(post)}
                    className={`text-xs px-3 py-1.5 border transition-colors ${
                      post.published
                        ? 'border-ink-200 text-ink-600 hover:border-ink-400'
                        : 'border-green-200 text-green-700 hover:bg-green-50'
                    }`}
                  >
                    {post.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deleting === post.id}
                    className="text-xs px-2 py-1.5 text-red-400 hover:text-red-600 transition-colors"
                  >
                    {deleting === post.id ? '…' : '✕'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
