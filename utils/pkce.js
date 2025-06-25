export function generateCodeVerifier() {
  const array = new Uint32Array(56 / 2);
  return Array.from(array, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
}

export async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}