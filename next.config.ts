import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias.fs = false; // ⛔ disable fs for pdf-parse test code
    return config;
  },
};


export default nextConfig;
