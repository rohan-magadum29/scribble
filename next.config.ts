import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins : [process.env.CLIENT_URL!]
};

export default nextConfig;
