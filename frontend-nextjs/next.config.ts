import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  server: {
    port: 3101,
    host: "0.0.0.0", // Quan trọng cho Docker
  },
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
};

export default nextConfig;
