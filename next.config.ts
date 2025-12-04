import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kiyapz.s3.eu-central-2.wasabisys.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Disable Next.js dev tools in development
  devIndicators: {
    position: "bottom-right",
  },
};

export default nextConfig;
