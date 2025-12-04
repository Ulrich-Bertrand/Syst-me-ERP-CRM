/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,

  reactStrictMode: true,
  swcMinify: true,
  // Permettre les images depuis les domaines
  images: {
    
    domains: ['images.unsplash.com'],
  },
};

module.exports = nextConfig;
