'use client';
// app/dashboard/new/page.tsx
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/layout/Navbar';
import { RichEditor } from '@/components/editor/RichEditor';
import { ImageUpload } from '@/components/editor/ImageUpload';
import TagSelector from '@/components/blog/TagSelector';
import toast from 'react-hot-toast';

const AUTOSAVE_DELAY = 3000;

export default function NewPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin');
  }, [status, router]);

  const saveDraft = useCallback(async (publish = false) => {
    if (!title.trim()) {
      toast.error('Please add a title before saving');
      return;
    }
    if (publish && (!content.trim() || content === '<p></p>')) {
      toast.error('Content is required to publish');
      return;
    }

    setSaving(true);

    try {
      const payload = { title, content, excerpt, coverImage, tags, published: publish };

      let res: Response;
      if (draftId) {
        res = await fetch(`/api/posts/${draftId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Save failed');
      }

      const post = await res.json();
      if (!draftId) setDraftId(post.id);
      setLastSaved(new Date());

      if (publish) {
        toast.success('Published! 🎉');
        router.push(`/blog/${post.slug}`);
      } else {
        toast.success('Draft saved');
      }
    } catch (err: any) {
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }, [title, content, excerpt, coverImage, tags, draftId, router]);

  // Autosave on change
  useEffect(() => {
    if (!title.trim()) return;
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    const timer = setTimeout(() => saveDraft(false), AUTOSAVE_DELAY);
    setAutoSaveTimer(timer);
    return () => clearTimeout(timer);
  }, [title, content, excerpt, coverImage, tags, saveDraft]);

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-10 animate-fade-in">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => router.push('/dashboard')} className="btn-ghost text-sm">
            ← Dashboard
          </button>
          <div className="flex items-center gap-3">
            {(lastSaved || saving) && (
              <span className="text-xs text-ink-400" style={{ fontFamily: 'Lora, serif' }}>
                {saving ? 'Saving…' : `Saved ${lastSaved?.toLocaleTimeString()}`}
              </span>
            )}
            <button onClick={() => saveDraft(false)} disabled={saving} className="btn-secondary text-sm">
              Save Draft
            </button>
            <button onClick={() => saveDraft(true)} disabled={saving} className="btn-primary text-sm">
              Publish →
            </button>
          </div>
        </div>

        {/* Title */}
        <textarea
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Your story begins with a title…"
          rows={2}
          className="w-full text-4xl font-bold text-ink-950 bg-transparent border-none outline-none resize-none mb-6 placeholder:text-ink-200 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        />

        {/* Excerpt */}
        <textarea
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          placeholder="Add a brief excerpt (optional)…"
          rows={2}
          className="w-full text-ink-500 bg-transparent border-none outline-none resize-none mb-6 text-base placeholder:text-ink-200"
          style={{ fontFamily: 'Lora, serif' }}
        />

        {/* Cover image */}
        <div className="mb-8">
          <p className="text-xs text-ink-500 uppercase tracking-wider mb-3" style={{ fontFamily: 'Lora, serif' }}>Cover Image</p>
          <ImageUpload value={coverImage} onChange={setCoverImage} label="Upload cover" folder="blog/covers" />
        </div>

        {/* Editor */}
        <div className="mb-8">
          <RichEditor content={content} onChange={setContent} placeholder="Tell your story…" />
        </div>

        {/* Tags */}
        <div className="mb-8">
          <TagSelector selectedTags={tags} onChange={setTags} />
        </div>

        {/* Bottom actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-ink-100">
          <button onClick={() => saveDraft(false)} disabled={saving} className="btn-secondary">
            Save as Draft
          </button>
          <button onClick={() => saveDraft(true)} disabled={saving} className="btn-primary">
            Publish Post →
          </button>
        </div>
      </main>
    </>
  );
}