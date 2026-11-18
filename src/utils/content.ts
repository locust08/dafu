import { getEmDashCollection, getEmDashEntry, type ImageValue } from 'emdash';
import seed from '../../seed/seed.json';

export type Language = 'en' | 'zh';
export type Media = ImageValue;
type Field = string | number | Media | null | undefined;
type Collection = keyof typeof seed.content;
export type Entry = { id: string; data: Record<string, Field> };

const initialEntries = (collection: Collection) =>
  seed.content[collection] as unknown as Entry[];

export async function entries(collection: Collection): Promise<Entry[]> {
  const result = await getEmDashCollection(collection, {
    limit: 100,
    ...(collection === 'restaurants' && { orderBy: { position: 'asc' } }),
  });
  if (!result.error && !result.entries.length) {
    // EmDash imports published seed entries during the initial admin setup.
    const { entry: home } = await getEmDashEntry('pages', 'home');
    return home ? [] : initialEntries(collection);
  }
  if (result.error) console.error('EmDash collection query failed', collection, result.error);
  return result.entries as unknown as Entry[];
}

export async function entry(collection: Collection, slug: string): Promise<Entry | undefined> {
  const result = await getEmDashEntry(collection, slug);
  if (result.entry) return result.entry as unknown as Entry;
  if (result.error) return undefined;
  const { entry: home } = await getEmDashEntry('pages', 'home');
  return home ? undefined : initialEntries(collection).find((entry) => entry.id === slug);
}

export function copy(entry: Entry | undefined, field: string, lang: Language = 'en') {
  const value = (lang === 'zh' && entry?.data[field + '_zh']) || entry?.data[field];
  return typeof value === 'string' ? value : '';
}

export function media(entry: Entry | undefined, field = 'photo'): Media | undefined {
  const value = entry?.data[field];
  return typeof value === 'object' && value?.id ? value : undefined;
}

export function offers(items: Entry[]) {
  const malaysiaNow = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Kuala_Lumpur', dateStyle: 'short' });
  const today = malaysiaNow.format(new Date());
  return items.filter((item) => !copy(item, 'ends') || copy(item, 'ends') >= today);
}

export const localized = (path: string, lang: Language) => (lang === 'zh' ? '/zh' : '') + path;
export const restaurantPath = (id: string) => '/restaurants/' + id;
export const directions = (destination: string) =>
  'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(destination);
