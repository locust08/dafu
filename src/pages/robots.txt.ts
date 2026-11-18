import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ url }) => new Response(
  'User-agent: *\nDisallow: /_emdash/\nSitemap: ' + new URL('/sitemap.xml', url.origin).href + '\n',
  { headers: { 'content-type': 'text/plain; charset=utf-8' } },
);
