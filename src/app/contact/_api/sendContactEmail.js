/**
 * sendContactEmail.js
 * Reusable API utility — POSTs contact form data to the backend.
 * Returns { success, message } or throws on network error.
 */

const CONTACT_URL = `${process.env.NEXT_PUBLIC_API_URL}/contact`;

/**
 * @param {{ name: string, email: string, subject: string, message: string }} data
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function sendContactEmail(data) {
  const response = await fetch(CONTACT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || 'Failed to send message. Please try again.');
  }

  return json;
}
