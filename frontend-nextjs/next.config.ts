import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "http",
        hostname: `${process.env.NEXT_PUBLIC_HOST_SERVER}`,
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/arduino/:path*",
        destination: "http://localhost:3001/v1/api/arduino/:path*",
      },
      {
        source: "/v1/api/arduino/:path*",
        destination: "http://localhost:3001/v1/api/arduino/:path*",
      },
    ];
  },
};

export default nextConfig;
