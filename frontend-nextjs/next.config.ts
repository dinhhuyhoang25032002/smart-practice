import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
