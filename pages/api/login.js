import { generateCodeChallenge, generateCodeVerifier } from '../../utils/pkce';

export default async function handler(req, res) {
  console.log('✅ Vercel Environment Check:');
  console.log('SPOTIFY_CLIENT_ID:', process.env.SPOTIFY_CLIENT_ID);
  console.log('SPOTIFY_REDIRECT_URI:', process.env.SPOTIFY_REDIRECT_URI);

  const code_verifier = generateCodeVerifier();
  const code_challenge = await generateCodeChallenge(code_verifier);
  const state = Math.random().toString(36).substring(2, 15);

  // Store the code_verifier securely in a cookie
  res.setHeader(
    'Set-Cookie',
    `code_verifier=${code_verifier}; Path=/; HttpOnly; SameSite=Lax`
  );

  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge,
    state,
    scope: 'user-read-private user-read-email'
  });

  // One-time DEBUG line to confirm final redirect value:
  console.log('🧪 DEBUG: Redirect URI param value:', params.get('redirect_uri'));

  // Final authorization URL
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  console.log('🔗 FINAL SPOTIFY URL:', spotifyAuthUrl);

  res.redirect(spotifyAuthUrl);
}
