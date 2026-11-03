import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/',              // Jab koi root URL khole (blinkit.vercel.app)
        destination: '/index.html', // Usko public/index.html par bhej do
      },
    ];
  },
};

export default nextConfig;