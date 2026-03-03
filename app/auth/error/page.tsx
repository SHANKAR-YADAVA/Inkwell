'use client';
// app/auth/error/page.tsx
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Configuration: 'Server configuration error. Please contact support.',
    AccessDenied: 'Access denied. You do not have permission to sign in.',
    Verification: 'The verification link has expired or already been used.',
    Default: 'An error occurred during authentication.',
  };

  const message = errorMessages[error || ''] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <Link href="/" className="text-3xl font-bold text-ink-950" style={{ fontFamily: "'Playfair Display', serif" }}>
          The Inkwell
        </Link>
        <div className="bg-white border border-ink-100 p-8 mt-8">
          <p className="text-2xl mb-3">⚠️</p>
          <h1 className="text-xl font-bold text-ink-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Authentication Error
          </h1>
          <p className="text-sm text-ink-500 mb-6" style={{ fontFamily: 'Lora, serif' }}>{message}</p>
          <Link href="/auth/signin" className="btn-primary w-full justify-center">
            Try again
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  );
}
