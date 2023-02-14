import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';

const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'development',
  base: '/',
  includeAssets: [
    'index.css',
    'icon/light/*.png',
    'icon/dark/32x32.png',
    'fonts/*.woff',
    'fonts/*.woff2',
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
        purpose: 'any maskable',
      },
    ],
  },
  registerType: 'autoUpdate',
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), visualizer()],
});
