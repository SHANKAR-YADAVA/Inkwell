// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Providers } from './providers';


export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXTAUTH_URL || 'https://your-domain.vercel.app'
  ),
  title: { default: 'The Inkwell', template: '%s | The Inkwell' },
  description: 'A place for thoughtful writing and ideas.',

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },

  openGraph: {
    siteName: 'The Inkwell',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#261f1a',
                color: '#faf9f6',
                borderRadius: 0,
                fontFamily: 'Lora, serif',
                fontSize: '14px',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
