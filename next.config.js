/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dependable-guineapig-641.convex.cloud", // Replace with your actual Convex deployment domain
        pathname: "/api/storage/**",
      },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
