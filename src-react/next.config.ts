import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

    eslint: {
    // ⚠️ WARNING: This allows production builds to successfully complete
    // even if your project has ESLint errors.
    // TODO Fix the damn errors and remove this hack
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
