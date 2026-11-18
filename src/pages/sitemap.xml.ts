import type { APIRoute } from 'astro';
import { entries, offers, restaurantPath } from '../utils/content';

const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export const GET: APIRoute = async ({ url }) => {
  const [restaurants, updates] = await Promise.all([entries('restaurants'), entries('news')]);
  const paths = ['/', '/about', '/restaurants', '/news', '/locations',
    ...restaurants.map(({ id }) => restaurantPath(id)),
    ...offers(updates).map(({ id }) => '/news/' + id)];
  const urls = paths.flatMap((path) => [path, '/zh' + path])
    .map((path) => '<url><loc>' + escape(new URL(path, url.origin).href) + '</loc></url>');
  return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls.join('') + '</urlset>', {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
};
