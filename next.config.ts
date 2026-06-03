import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Add image from google profile
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
