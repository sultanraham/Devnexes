import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'
function expressDevApiPlugin() {
  return {
    name: 'express-dev-api-plugin',
    async configureServer(server) {
      const { default: apiApp } = await import('./api/index.js')
      server.middlewares.use('/api', apiApp)
    }
  }
}

export default defineConfig({
  server: {
    allowedHosts: ['unadorned-crinkle-coach.ngrok-free.dev', 'josphine-prelumbar-relatedly.ngrok-free.dev'],
  },
  plugins: [
    expressDevApiPlugin(),
    react(),
    // Gzip for all text assets
    compression({ algorithm: 'gzip', ext: '.gz', threshold: 1024 }),
    // Brotli (better compression, supported by most CDNs/hosts)
    compression({ algorithm: 'brotliCompress', ext: '.br', threshold: 1024 }),
  ],

  build: {
    // Raise the chunk warning threshold (framer-motion is large by design)
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Manual chunk splitting — keeps vendor libs separate so browsers
        // can cache them independently of your app code
        manualChunks: (id) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) return 'vendor-react'
          if (id.includes('node_modules/framer-motion')) return 'vendor-motion'
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/react-icons')) return 'vendor-icons'
        },
        // Deterministic file names with content hash for long-term caching
        chunkFileNames:  'assets/js/[name]-[hash].js',
        entryFileNames:  'assets/js/[name]-[hash].js',
        assetFileNames:  'assets/[ext]/[name]-[hash].[ext]',
      },
    },

    // Inline assets smaller than 4 KB as base64 (saves round-trips)
    assetsInlineLimit: 4096,

    // Target modern browsers — smaller output, no legacy polyfills
    target: 'es2020',

    // Source maps only in dev; strip them in production
    sourcemap: false,

    // Minifier (Vite 8 uses Oxc by default — no esbuild needed)
    minify: 'oxc',
  },

  // Pre-bundle heavy deps so the dev server starts faster
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'react-router-dom'],
  },
})
