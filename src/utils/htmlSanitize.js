/**
 * Decodes HTML entities from a string (e.g. from Open Trivia DB).
 * Uses the browser's native DOM parser so all standard entities are handled.
 * Does NOT render any HTML tags — returns plain text only.
 *
 * @param {string} html - Raw string potentially containing HTML entities.
 * @returns {string} Decoded plain-text string.
 */
export function decodeHtmlEntities(html) {
  if (!html || typeof html !== 'string') return '';

  // Use a textarea element — the browser decodes entities but strips all tags.
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}
