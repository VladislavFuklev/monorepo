import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@fintech/ui", "@fintech/interview-data"],
};

export default nextConfig;
