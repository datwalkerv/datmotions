import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Templates and the Player run in the browser, and since export happens
  // client-side via @remotion/web-renderer there is no server-side renderer to
  // keep out of the bundle.
  transpilePackages: ['@datmotions/motion-engine', 'remotion', '@remotion/player'],

  experimental: {
    externalDir: true,
  },
}

export default nextConfig
