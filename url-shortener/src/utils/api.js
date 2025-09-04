import { logEvent } from './logger';
import { generateShortcode } from './shortcodeGenerator';

const usedShortcodes = new Set();
const urlStore = new Map(); // Stores { shortcode: { originalUrl, expiresAt, clicks } }

export async function shortenUrlApi({ url, validity, shortcode }) {
  logEvent(`shortenUrlApi called with url=${url}, validity=${validity}, shortcode=${shortcode || 'auto'}`);

  // Validate uniqueness or generate shortcode
  let code = shortcode || generateShortcode();
  if (usedShortcodes.has(code)) {
    throw new Error('Shortcode already exists.');
  }
  usedShortcodes.add(code);

  // Calculate expiration time
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + (parseInt(validity) || 30));

  // Store data
  urlStore.set(code, { originalUrl: url, expiresAt, clicks: 0 });

  const response = { shortcode: code, originalUrl: url, expiresAt: expiresAt.toISOString() };

  logEvent(`shortenUrlApi response: ${JSON.stringify(response)}`);

  return response;
}

export async function getUrlByShortcode(shortcode) {
  logEvent(`getUrlByShortcode called with shortcode=${shortcode}`);

  const data = urlStore.get(shortcode);

  if (!data) {
    logEvent(`No URL found for shortcode=${shortcode}`);
    return null;
  }

  // Check expiry
  if (new Date() > data.expiresAt) {
    urlStore.delete(shortcode);
    usedShortcodes.delete(shortcode);
    logEvent(`Shortcode expired: ${shortcode}`);
    return null;
  }

  // Increment clicks count
  data.clicks++;
  urlStore.set(shortcode, data);

  logEvent(`Redirecting to URL: ${data.originalUrl}`);

  return data;
}

export function getAllUrls() {
  // Return all URLs as array
  const urls = [];
  for (const [shortcode, data] of urlStore.entries()) {
    urls.push({ shortcode, ...data, expiresAt: data.expiresAt.toISOString() });
  }
  return urls;
}
