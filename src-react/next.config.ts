import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for App Service artifact deployments without running npm install on the host.
  output: "standalone",

  eslint: {
    // ⚠️ WARNING: This allows production builds to successfully complete
    // even if your project has ESLint errors.
    // TODO Fix the damn errors and remove this hack
    ignoreDuringBuilds: true
  },
};

export default nextConfig;
