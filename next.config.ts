import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  
  // Add trailing slash for GitHub Pages routing
  trailingSlash: true,
  
  // Transpile Three.js for proper R3F compatibility
  transpilePackages: ['three'],
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Disable ESLint during build for testing
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configure asset prefix for GitHub Pages (if deploying to a subdirectory)
  // Uncomment and adjust if deploying to username.github.io/repository-name
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/repository-name' : '',
  
  // Configure base path for GitHub Pages (if deploying to a subdirectory)
  // Uncomment and adjust if deploying to username.github.io/repository-name
  // basePath: process.env.NODE_ENV === 'production' ? '/repository-name' : '',
  
  // Optimize for static generation
  generateEtags: false,
  
  // Webpack configuration for static export compatibility
  webpack: (config, { isServer }) => {
    // Ensure proper handling of React Three Fiber in static export
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    
    return config;
  },
  
  // Experimental features for better static export - temporarily disabled for debugging  
  // experimental: {
  //   // Enable static export optimization
  //   optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'three'],
  // },
};

export default nextConfig;
