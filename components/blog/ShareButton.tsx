'use client';
// components/blog/ShareButton.tsx
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ShareButtonProps {
  url: string;
  title: string;
}

export default function ShareButton({ url, title }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
      setIsOpen(false);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const share = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 border-2 border-ink-200 bg-white text-ink-700 hover:border-ink-300 hover:bg-ink-50 transition-all"
        style={{ fontFamily: 'Lora, serif' }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span className="hidden sm:inline text-sm font-medium">Share</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-ink-200 shadow-lg z-10">
          <div className="p-2 space-y-1">
            <button
              onClick={() => share('twitter')}
              className="w-full px-3 py-2 text-left text-sm hover:bg-ink-50 transition-colors flex items-center gap-2"
              style={{ fontFamily: 'Lora, serif' }}
            >
              <span>𝕏</span> Twitter
            </button>
            <button
              onClick={() => share('facebook')}
              className="w-full px-3 py-2 text-left text-sm hover:bg-ink-50 transition-colors flex items-center gap-2"
              style={{ fontFamily: 'Lora, serif' }}
            >
              <span>f</span> Facebook
            </button>
            <button
              onClick={() => share('linkedin')}
              className="w-full px-3 py-2 text-left text-sm hover:bg-ink-50 transition-colors flex items-center gap-2"
              style={{ fontFamily: 'Lora, serif' }}
            >
              <span>in</span> LinkedIn
            </button>
            <button
              onClick={() => share('reddit')}
              className="w-full px-3 py-2 text-left text-sm hover:bg-ink-50 transition-colors flex items-center gap-2"
              style={{ fontFamily: 'Lora, serif' }}
            >
              <span>↗</span> Reddit
            </button>
            <hr className="border-ink-200 my-1" />
            <button
              onClick={copyToClipboard}
              className="w-full px-3 py-2 text-left text-sm hover:bg-ink-50 transition-colors flex items-center gap-2"
              style={{ fontFamily: 'Lora, serif' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
