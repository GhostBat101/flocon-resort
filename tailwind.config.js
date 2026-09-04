/**
 * Tailwind Configuration: Design tokens, color palette, and typography mappings for Flocon.
 * Communicates with: globals.css, layout.jsx, and all UI components.
 */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        flocon: {
          white: '#F3F7F9',
          blue: '#D6E4EB',
          silver: '#9EBBC9',
          green: '#2D4A43',
          brown: '#5C4033',
          amber: '#FFB040',
        },
      },
      fontFamily: {
        headline: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
        label: ['"Space Mono"', 'monospace'],
        mono: ['"Space Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
