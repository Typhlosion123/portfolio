import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /pdf\.worker(\.min)?\.js$/,
      type: "asset/resource",
      generator: {
        filename: "static/workers/[hash][ext][query]",
      },
    });

    return config;
  },
};

export default nextConfig;