/**
 * Content Processor Utility
 * Text processing utilities for Islamic content
 */

/**
 * Clean and format Arabic text
 */
export function cleanArabicText(text: string): string {
  return text
    .trim()
    .replace(/\u064B|\u064C|\u064D|\u064E|\u064F|\u0650|\u0651|\u0652/g, '') // Remove tashkeel
    .replace(/\s+/g, ' ');
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Convert plain text to rich text format
 */
export function toRichText(text: string): string {
  return text
    .split('\n\n')
    .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('\n');
}

/**
 * Extract word count from text
 */
export function wordCount(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Estimate reading time in minutes
 */
export function estimateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const words = wordCount(text);
  return Math.ceil(words / wordsPerMinute);
}
