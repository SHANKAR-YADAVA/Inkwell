'use client';
// app/dashboard/edit/[id]/page.tsx
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/layout/Navbar';
import { RichEditor } from '@/components/editor/RichEditor';
import { ImageUpload } from '@/components/editor/ImageUpload';
import TagSelector from '@/components/blog/TagSelector';
import toast from 'react-hot-toast';

export default function EditPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin');
  }, [status, router]);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(r => r.json())
      .then(data => {
        setPost(data);
        setTitle(data.title || '');
        setContent(data.content || '');
        setExcerpt(data.excerpt || '');
        setCoverImage(data.coverImage || '');
        setTags(data.tags || []);
        setLoading(false);
      })
      .catch(() => { toast.error('Failed to load post'); router.push('/dashboard'); });
  }, [id]);

  const handleSave = useCallback(async (publish?: boolean) => {
    if (!title.trim()) return toast.error('Title is required');
    setSaving(true);

    const payload: any = { title, content, excerpt, coverImage, tags };
    if (publish !== undefined) payload.published = publish;

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error((await res.json()).error);
      const updated = await res.json();
      setPost(updated);

      if (publish === true) {
        toast.success('Published! 🎉');
        router.push(`/blog/${updated.slug}`);
      } else if (publish === false) {
        toast.success('Moved to drafts');
      } else {
        toast.success('Changes saved');
      }
    } catch (err: any) {
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }, [title, content, excerpt, coverImage, tags, id, router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="text-ink-400 text-sm">Loading…</span>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-10 animate-fade-in">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => router.push('/dashboard')} className="btn-ghost text-sm">← Dashboard</button>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-2 py-1 ${post?.published ? 'bg-green-100 text-green-700' : 'bg-ink-100 text-ink-600'}`} style={{ fontFamily: 'Lora, serif' }}>
              {post?.published ? 'Published' : 'Draft'}
            </span>
            <button onClick={() => handleSave()} disabled={saving} className="btn-secondary text-sm">
              {saving ? 'Saving…' : 'Save'}
            </button>
            {post?.published ? (
              <button onClick={() => handleSave(false)} disabled={saving} className="btn-secondary text-sm">
                Unpublish
              </button>
            ) : (
              <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary text-sm">
                Publish →
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <textarea
          value={title}
          onChange={e => setTitle(e.target.value)}
          rows={2}
          className="w-full text-4xl font-bold text-ink-950 bg-transparent border-none outline-none resize-none mb-6 placeholder:text-ink-200 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        />

        {/* Excerpt */}
        <textarea
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          placeholder="Excerpt (optional)…"
          rows={2}
          className="w-full text-ink-500 bg-transparent border-none outline-none resize-none mb-6 text-base placeholder:text-ink-200"
          style={{ fontFamily: 'Lora, serif' }}
        />

        {/* Cover image */}
        <div className="mb-8">
          <p className="text-xs text-ink-500 uppercase tracking-wider mb-3">Cover Image</p>
          <ImageUpload value={coverImage} onChange={setCoverImage} label="Change cover" folder="blog/covers" />
        </div>

        {/* Editor */}
        <div className="mb-8">
          <RichEditor content={content} onChange={setContent} />
        </div>

        {/* Tags */}
        <div className="mb-8">
          <TagSelector selectedTags={tags} onChange={setTags} />
        </div>

        <div className="flex justify-between pt-6 border-t border-ink-100">
          {post?.published ? (
            <a href={`/blog/${post.slug}`} target="_blank" rel="noopener" className="btn-ghost text-sm">
              View live →
            </a>
          ) : <div />}
          <div className="flex gap-3">
            <button onClick={() => handleSave()} disabled={saving} className="btn-primary">
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
