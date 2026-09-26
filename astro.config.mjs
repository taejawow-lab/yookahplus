import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// 사이트별 환경 변수에서 site URL 읽음 (자동 셋업 스크립트가 .env 자동 생성)
const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://yookahplus.org';

// Category archives with fewer than three public posts render noindex.
// Keep those routes out of the sitemap without weakening the noindex gate.
const NOINDEX_CATEGORY_PATHS = new Set([
  '/category/건강·안전/',
  '/category/건강·응급/',
  '/category/디지털-안전/',
  '/category/발달/',
  '/category/수유/',
  '/category/신생아-건강/',
  '/category/양육·환경/',
  '/category/유아-건강/',
  '/category/육아-안전/',
  '/category/초등육아/',
]);

export default defineConfig({
  site: SITE_URL,
  integrations: [
    tailwind({
      applyBaseStyles: false, // global.css에서 직접 베이스 스타일 작성
    }),
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(page);
        const decodedPathname = decodeURIComponent(pathname);
        return !pathname.startsWith('/tags/') && pathname !== '/search/' && !pathname.startsWith('/posts/page/') && !NOINDEX_CATEGORY_PATHS.has(decodedPathname);
      },
    }),
    mdx(),
  ],
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
