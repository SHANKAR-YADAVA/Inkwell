'use client';
// app/profile/page.tsx
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { ImageUpload } from '@/components/editor/ImageUpload';
import toast from 'react-hot-toast';

interface Profile {
  name: string;
  email: string;
  image: string;
  bio: string;
  website: string;
  twitter: string;
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({ name: '', email: '', image: '', bio: '', website: '', twitter: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin');
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch('/api/profile')
        .then(r => r.json())
        .then(data => {
          setProfile({
            name: data.name || '',
            email: data.email || '',
            image: data.image || '',
            bio: data.bio || '',
            website: data.website || '',
            twitter: data.twitter || '',
          });
          setLoading(false);
        });
    }
  }, [session]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profile.name, bio: profile.bio, website: profile.website, twitter: profile.twitter, image: profile.image }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      await update({ name: profile.name, image: profile.image });
      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

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
      <main className="max-w-2xl mx-auto px-6 py-12 animate-fade-in">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-ink-950" style={{ fontFamily: "'Playfair Display', serif" }}>
            Edit Profile
          </h1>
          <p className="text-ink-500 text-sm mt-1" style={{ fontFamily: 'Lora, serif' }}>
            How readers see you
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Avatar */}
          <div className="bg-white border border-ink-100 p-6">
            <h2 className="text-sm font-semibold text-ink-800 uppercase tracking-wider mb-5" style={{ fontFamily: 'Lora, serif' }}>
              Profile Photo
            </h2>
            <ImageUpload
              value={profile.image}
              onChange={url => setProfile(p => ({ ...p, image: url }))}
              label="Change photo"
              folder="blog/avatars"
              aspect="avatar"
            />
          </div>

          {/* Basic info */}
          <div className="bg-white border border-ink-100 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-ink-800 uppercase tracking-wider" style={{ fontFamily: 'Lora, serif' }}>
              Basic Info
            </h2>

            <div>
              <label className="block text-xs text-ink-500 uppercase tracking-wider mb-2">Display Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                className="input-field"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-ink-500 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                className="input-field bg-ink-50 text-ink-400 cursor-not-allowed"
                disabled
              />
              <p className="text-xs text-ink-400 mt-1" style={{ fontFamily: 'Lora, serif' }}>Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-xs text-ink-500 uppercase tracking-wider mb-2">Bio</label>
              <textarea
                value={profile.bio}
                onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                rows={4}
                maxLength={300}
                className="input-field resize-none"
                placeholder="Tell readers about yourself…"
              />
              <p className="text-xs text-ink-400 mt-1 text-right">{profile.bio.length}/300</p>
            </div>
          </div>

          {/* Links */}
          <div className="bg-white border border-ink-100 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-ink-800 uppercase tracking-wider" style={{ fontFamily: 'Lora, serif' }}>
              Links
            </h2>
            <div>
              <label className="block text-xs text-ink-500 uppercase tracking-wider mb-2">Website</label>
              <input
                type="url"
                value={profile.website}
                onChange={e => setProfile(p => ({ ...p, website: e.target.value }))}
                className="input-field"
                placeholder="https://yoursite.com"
              />
            </div>
            <div>
              <label className="block text-xs text-ink-500 uppercase tracking-wider mb-2">Twitter / X</label>
              <div className="flex">
                <span className="flex items-center px-3 border border-r-0 border-ink-200 bg-parchment text-ink-500 text-sm" style={{ fontFamily: 'Lora, serif' }}>@</span>
                <input
                  type="text"
                  value={profile.twitter}
                  onChange={e => setProfile(p => ({ ...p, twitter: e.target.value }))}
                  className="input-field flex-1"
                  placeholder="username"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => router.push('/dashboard')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
