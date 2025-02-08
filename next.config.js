/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "undici": false, // Prevents Firebase from using Node.js-only undici
    };
    return config;
  },
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "undici": false,
    };
    return config;
  },
};

module.exports = {
  webpack: (config) => {
    config.resolve.fallback = { util: require.resolve("util/") };
    return config;
  },
};

module.exports = nextConfig;