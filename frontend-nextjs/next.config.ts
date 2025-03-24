import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
  // webpack: (config) => {
  //   config.resolve.alias.canvas = false;
  //   return config;
  // },
  // experimental: {
  //   turbo: {
  //     resolveAlias: {
  //       canvas: './empty-module.ts',
  //     },
  //   },
  // },
  
};

export default nextConfig;
