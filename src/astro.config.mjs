import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    output: 'static',
    i18n: {
        defaultLocale: 'ar',
        locales: ['en', 'ar'],
        routing: {
            prefixDefaultLocale: false,
        },
    },
});
