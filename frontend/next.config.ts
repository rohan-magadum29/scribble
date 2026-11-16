import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages : ["@scribble/shared"]
};

export default nextConfig;
