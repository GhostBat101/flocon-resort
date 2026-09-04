/** @type {import('tailwindcss').Config} */
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
        display: ['Syne', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
