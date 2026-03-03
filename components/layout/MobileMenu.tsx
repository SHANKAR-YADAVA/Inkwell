'use client';
// components/layout/MobileMenu.tsx
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();

  useEffect(() => { setMounted(true); }, []);

  const closeMenu = () => setIsOpen(false);

  const menuContent = isOpen ? (
    <>
      <div
        className="fixed inset-0 bg-ink-950/50 z-50 lg:hidden"
        onClick={closeMenu}
      />
      <div className="fixed top-0 right-0 bottom-0 w-64 bg-white border-l-2 border-ink-200 z-50 lg:hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-ink-200">
          <Link
            href="/"
            className="text-xl font-bold text-ink-950"
            style={{ fontFamily: "'Playfair Display', serif" }}
            onClick={closeMenu}
          >
            The Inkwell
          </Link>
          <button onClick={closeMenu} className="p-2 text-ink-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {session ? (
              <>
                <Link href="/dashboard" className="block px-4 py-3 text-ink-900 hover:bg-ink-50 transition-colors" style={{ fontFamily: 'Lora, serif' }} onClick={closeMenu}>Dashboard</Link>
                <Link href="/dashboard/new" className="block px-4 py-3 text-ink-900 hover:bg-ink-50 transition-colors" style={{ fontFamily: 'Lora, serif' }} onClick={closeMenu}>Write</Link>
                <Link href="/profile" className="block px-4 py-3 text-ink-900 hover:bg-ink-50 transition-colors" style={{ fontFamily: 'Lora, serif' }} onClick={closeMenu}>Profile</Link>
                <hr className="my-4 border-ink-200" />
                <button
                  onClick={() => { signOut(); closeMenu(); }}
                  className="w-full text-left px-4 py-3 text-ink-700 hover:bg-ink-50 transition-colors"
                  style={{ fontFamily: 'Lora, serif' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="block px-4 py-3 text-ink-900 hover:bg-ink-50 transition-colors" style={{ fontFamily: 'Lora, serif' }} onClick={closeMenu}>Sign In</Link>
                <Link href="/auth/signup" className="block px-4 py-3 bg-ink-950 text-white text-center hover:bg-ink-900 transition-colors" style={{ fontFamily: 'Lora, serif' }} onClick={closeMenu}>Get Started</Link>
              </>
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-ink-200">
          <p className="text-xs text-ink-500 text-center" style={{ fontFamily: 'Lora, serif' }}>© 2025 The Inkwell</p>
        </div>
      </div>
    </>
  ) : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 text-ink-900 hover:text-ink-950"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      {mounted && createPortal(menuContent, document.body)}
    </>
  );
}