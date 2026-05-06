import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@fintech/ui", "@fintech/api", "@fintech/types"],
};

export default nextConfig;
