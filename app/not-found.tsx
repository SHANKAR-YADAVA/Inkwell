// app/not-found.tsx
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <p className="text-8xl font-bold text-ink-200 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>404</p>
        <h1 className="text-3xl font-bold text-ink-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Page not found</h1>
        <p className="text-ink-500 mb-8" style={{ fontFamily: 'Lora, serif' }}>The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/" className="btn-primary">← Back to home</Link>
      </div>
    </>
  );
}
