/**
 * RootLayout: Base HTML shell, metadata, and GlobalProvider state wrapper for Flocon Resort.
 * Communicates with: globals.css and useGlobalStore.jsx.
 */

import './globals.css';
import { GlobalProvider } from '@/store/useGlobalStore';

export const metadata = {
  title: 'Flocon Resort | Luxury Alpine Sanctuary',
  description: 'An ultra-premium alpine retreat in the French Alps. Experience luxury chalets, private powder slopes, and intimate winter hospitality at Flocon.',
  keywords: ['Flocon', 'Flocon Resort', 'Alpine Chalets', 'French Alps', 'Winter Sanctuary'],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased min-h-screen bg-[#F3F7F9] text-[#1A202C]">
        <GlobalProvider>{children}</GlobalProvider>
      </body>
    </html>
  );
}
