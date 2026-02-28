/** For card thumbnails, use smaller Unsplash width to improve LCP and reduce payload. */
export function thumbnailUrl(url: string, width = 400): string {
  if (!url || !url.includes('images.unsplash.com')) return url;
  try {
    const u = new URL(url);
    u.searchParams.set('w', String(width));
    u.searchParams.set('q', '75');
    return u.toString();
  } catch {
    return url;
  }
}
