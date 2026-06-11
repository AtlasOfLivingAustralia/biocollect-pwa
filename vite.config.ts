import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

// PWA Imports
import { VitePWA, type VitePWAOptions } from 'vite-plugin-pwa';
import type { RouteMatchCallback } from 'workbox-core';
import type { RuntimeCaching } from 'workbox-build';

// Prefer localhost
import dns from 'dns';
dns.setDefaultResultOrder('verbatim');

// Helper function for runtime cachine
const getCache = ({
  cacheName,
  urlPattern,
}: {
  cacheName: string;
  urlPattern: string | RegExp | RouteMatchCallback;
}): RuntimeCaching => ({
  urlPattern,
  handler: 'CacheFirst' as const,
  options: {
    cacheName,
    expiration: {
      maxEntries: 500,
      maxAgeSeconds: 60 * 60 * 24 * 7 * 2, // 2 weeks
    },
    cacheableResponse: {
      statuses: [200],
    },
  },
});

const pwaOptions: Partial<VitePWAOptions> = {
  workbox: {
    runtimeCaching: [
      getCache({
        urlPattern: /^https:\/\/biocollect(-dev|-test|-)*.ala.org.au\/document/,
        cacheName: 'biocollect-documents',
      }),
    ],
  },
  includeAssets: ['index.css', 'icon/*.png', 'fonts/*.woff', 'fonts/*.woff2', 'assets/*.png'],
  manifest: {
    name: 'BioCollect',
    short_name: 'BioCollect',
    theme_color: '#e13535',
    background_color: '#212120',
    icons: [
      {
        src: 'icon/192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'icon/256x256.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: 'icon/384x384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: 'icon/512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  registerType: 'autoUpdate',
  injectRegister: 'auto',
  devOptions: {
    enabled: false,
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  base: '/mobile-app',
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    VitePWA(pwaOptions),
  ],
  assetsInclude: ['**/*.lottie'],
  envDir: './config',
  devtools: {
    enabled: false, // Enable for profiling
  },
  resolve: {
    tsconfigPaths: true,
  },
});
