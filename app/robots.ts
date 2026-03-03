// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://yoursite.com';
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/dashboard/', '/profile/', '/api/'] },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
