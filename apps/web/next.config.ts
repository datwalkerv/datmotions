import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  // __dirname here is the real apps/web directory — bake it into an env var
  // so render-executor can find the Remotion entry point without relying on
  // process.cwd() which gets a webpack-virtual path in RSC context.
  env: {
    REMOTION_ENTRY_POINT: path.join(__dirname, 'src/remotion/index.tsx'),
  },
  // Only transpile packages that run in the browser (Player, templates).
  // Renderer/bundler contain native .node binaries — must NOT be webpack-bundled.
  transpilePackages: ['@datmotions/motion-engine', 'remotion', '@remotion/player'],

  // Keep renderer/bundler as Node.js externals so webpack never touches them.
  serverExternalPackages: [
    '@remotion/renderer',
    '@remotion/bundler',
    '@remotion/compositor-darwin-arm64',
    '@remotion/compositor-linux-x64-gnu',
    '@remotion/compositor-linux-x64-musl',
  ],

  experimental: {
    externalDir: true,
  },

  webpack: (config) => {
    // Prevent webpack from choking on native Node addons included transitively.
    config.module.rules.push({
      test: /\.node$/,
      loader: 'node-loader',
    })
    return config
  },
}

export default nextConfig
