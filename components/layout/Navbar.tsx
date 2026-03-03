'use client';
// components/layout/Navbar.tsx
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import MobileMenu from './MobileMenu';

export function Navbar() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-ink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-xl sm:text-2xl font-bold text-ink-950 hover:text-ink-900 transition-colors"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            The Inkwell
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {session ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-sm text-ink-700 hover:text-ink-950 transition-colors"
                  style={{ fontFamily: 'Lora, serif' }}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/new" 
                  className="px-4 py-2 bg-ink-950 text-white hover:bg-ink-900 transition-colors text-sm font-medium"
                  style={{ fontFamily: 'Lora, serif' }}
                >
                  Write
                </Link>
                
                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 text-sm text-ink-700 hover:text-ink-950 transition-colors"
                  >
                    <div className="w-8 h-8 bg-ink-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-ink-900">
                        {session.user?.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-ink-200 shadow-lg">
                      <div className="p-2 space-y-1">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm hover:bg-ink-50 transition-colors"
                          style={{ fontFamily: 'Lora, serif' }}
                          onClick={() => setDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-sm hover:bg-ink-50 transition-colors"
                          style={{ fontFamily: 'Lora, serif' }}
                          onClick={() => setDropdownOpen(false)}
                        >
                          My Posts
                        </Link>
                        <hr className="border-ink-200 my-1" />
                        <button
                          onClick={() => {
                            signOut();
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-ink-700 hover:bg-ink-50 transition-colors"
                          style={{ fontFamily: 'Lora, serif' }}
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/signin" 
                  className="text-sm text-ink-700 hover:text-ink-950 transition-colors"
                  style={{ fontFamily: 'Lora, serif' }}
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="px-4 py-2 bg-ink-950 text-white hover:bg-ink-900 transition-colors text-sm font-medium"
                  style={{ fontFamily: 'Lora, serif' }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}
