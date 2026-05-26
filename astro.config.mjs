import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://nasim.ae', // Replace with your actual site URL
  integrations: [sitemap({
    // You can add options here, e.g., filter pages or add custom entries
  })]
});