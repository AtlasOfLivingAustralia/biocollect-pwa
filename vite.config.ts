import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// PWA Imports
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import { RouteMatchCallback } from 'workbox-core';
import { RuntimeCaching } from 'workbox-build';

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
  base: '/',
  workbox: {
    runtimeCaching: [
      getCache({
        urlPattern: /^https:\/\/biocollect(-dev|-test|-)*.ala.org.au\/document/,
        cacheName: 'biocollect-documents',
      }),
    ],
  },
  includeAssets: [
    'index.css',
    'icon/light/*.png',
    'icon/dark/32x32.png',
    'fonts/*.woff',
    'fonts/*.woff2',
    'assets/*.png',
  ],
  manifest: {
    name: 'BioCollect',
    short_name: 'BioCollect',
    theme_color: '#e13535',
    background_color: '#212120',
    icons: [
      {
        src: 'icon/light/192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'icon/light/256x256.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: 'icon/light/384x384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: 'icon/light/512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  registerType: 'autoUpdate',
};

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), tsconfigPaths(), visualizer() as any, VitePWA(pwaOptions)],
  envDir: './config',
});
