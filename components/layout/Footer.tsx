'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  const isBlogPage = pathname.startsWith('/blog/');

  return (
    <footer
      className={`border-t border-ink-100 mt-4 ${
        isBlogPage ? 'bg-[#f2ece3]' : 'bg-parchment'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-2">
        <div>
          <p
            className="font-serif text-xl font-bold text-ink-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            The Inkwell
          </p>
          <p
            className="text-sm text-ink-500 mt-1"
            style={{ fontFamily: 'Lora, serif' }}
          >
            A place for thoughtful writing.
          </p>
        </div>

        <div
          className="flex gap-6 text-sm text-ink-500"
          style={{ fontFamily: 'Lora, serif' }}
        >
          <Link href="/" className="hover:text-ink-900 transition-colors">
            Home
          </Link>
          <Link
            href="/dashboard"
            className="hover:text-ink-900 transition-colors"
          >
            Write
          </Link>
        </div>

        <p className="text-xs text-ink-400">
          © {new Date().getFullYear()} The Inkwell
        </p>
      </div>
    </footer>
  );
}