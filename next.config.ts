import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/app',
        destination: '/app/resumes',
        permanent: true,
      },
    ]
  },
  transpilePackages: ['@mdxeditor/editor'],
  // Empty turbopack config to silence the warning
  turbopack: {},
  webpack: (config) => {
    // Support for MDXEditor ESM modules
    config.experiments = { ...config.experiments, topLevelAwait: true }
    return config
  }
};

export default nextConfig;
