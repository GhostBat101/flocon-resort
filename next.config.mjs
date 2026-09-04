/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repo = 'flocon-resort';

const nextConfig = {
  output: 'export',
  basePath: isProd ? '/flocon-resort' : '',
  assetPrefix: isProd ? '/flocon-resort/' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
