import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        
      },
      
    ],
    domains: ["yt3.ggpht.com"],
    
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
