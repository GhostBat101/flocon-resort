import './globals.css';

export const metadata = {
  title: 'Flocon Resort | Luxury Alpine Sanctuary',
  description: 'An ultra-premium alpine retreat in the French Alps. Experience luxury chalets, private powder slopes, and intimate winter hospitality at Flocon.',
  keywords: ['Flocon', 'Flocon Resort', 'Alpine Chalets', 'French Alps', 'Winter Sanctuary'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#F3F7F9] text-[#1A202C]">
        {children}
      </body>
    </html>
  );
}
