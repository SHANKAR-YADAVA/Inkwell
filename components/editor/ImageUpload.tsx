'use client';
// components/editor/ImageUpload.tsx
import { useState, useCallback } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  aspect?: 'cover' | 'avatar';
}

export function ImageUpload({ value, onChange, label = 'Upload Image', folder = 'blog', aspect = 'cover' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      onChange(data.url);
      toast.success('Image uploaded!');
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  }, [folder, onChange]);

  const isAvatar = aspect === 'avatar';

  return (
    <div className={isAvatar ? 'flex items-center gap-4' : 'w-full'}>
      {value ? (
        <div className={`relative ${isAvatar ? 'w-20 h-20 rounded-full overflow-hidden' : 'w-full h-48'} bg-ink-100`}>
          <Image src={value} alt="Uploaded" fill className={`object-cover ${isAvatar ? 'rounded-full' : ''}`} />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 w-5 h-5 bg-ink-900/80 text-white text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            ×
          </button>
        </div>
      ) : (
        <div className={`${isAvatar ? 'w-20 h-20 rounded-full' : 'w-full h-48'} bg-parchment border-2 border-dashed border-ink-200 flex flex-col items-center justify-center hover:border-ink-400 transition-colors`}>
          {uploading ? (
            <div className="text-ink-400 text-sm">Uploading…</div>
          ) : (
            <div className="text-center">
              <div className="text-2xl mb-1 text-ink-300">{isAvatar ? '👤' : '📷'}</div>
              {!isAvatar && <div className="text-xs text-ink-400">Click to upload</div>}
            </div>
          )}
        </div>
      )}

      <label className={`${isAvatar ? '' : 'block mt-2'} cursor-pointer`}>
        <span className="btn-secondary text-xs px-3 py-1.5">
          {uploading ? 'Uploading…' : label}
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          disabled={uploading}
          onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />
      </label>
    </div>
  );
}
