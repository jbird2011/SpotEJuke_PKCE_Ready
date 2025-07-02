// pages/api/login.js
import { generateCodeChallenge, generateCodeVerifier } from '../../utils/pkce';

export default async function handler(req, res) {
  // 🧪 Log basic environment variables
  console.log('✅ Vercel Environment Check:');
  console.log('SPOTIFY_CLIENT_ID:', process.env.SPOTIFY_CLIENT_ID);
  console.log('SPOTIFY_REDIRECT_URI:', process.env.SPOTIFY_REDIRECT_URI);

  // 🛠 Generate PKCE code verifier and challenge
  const code_verifier = generateCodeVerifier();
  const code_challenge = await generateCodeChallenge(code_verifier);
  const state = Math.random().toString(36).substring(2, 15);

  // ✅ Log the generated PKCE values
  console.log('🔑 code_verifier (to be stored in cookie):', code_verifier);
  console.log('🔐 code_challenge (sent to Spotify):', code_challenge);
  console.log('🌀 state param:', state);

  // 🍪 Store code_verifier in a secure cookie
  res.setHeader(
    'Set-Cookie',
    `code_verifier=${code_verifier}; Path=/; HttpOnly; SameSite=Lax`
  );
  console.log('🍪 Set-Cookie header sent to browser.');

  // 🔗 Build the Spotify authorization URL
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge,
    state,
    scope: 'user-read-private user-read-email'
  });

  // 🧪 Log full redirect URL before sending
  console.log('🧪 DEBUG: Redirect URI param value:', params.get('redirect_uri'));
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  console.log('🔗 FINAL SPOTIFY URL:', spotifyAuthUrl);

  // 🚀 Redirect the user to Spotify
  res.redirect(spotifyAuthUrl);
}
