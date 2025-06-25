import { generateCodeChallenge, generateCodeVerifier } from '../../utils/pkce';

export default async function handler(req, res) {
  const code_verifier = generateCodeVerifier();
  const code_challenge = await generateCodeChallenge(code_verifier);
  const state = Math.random().toString(36).substring(2, 15);

  res.setHeader('Set-Cookie', `code_verifier=${code_verifier}; Path=/; HttpOnly; SameSite=Lax`);

  const params = new URLSearchParams({
    client_id: process.env.VITE_SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: `${process.env.VERCEL_URL}/auth/callback`,
    code_challenge_method: 'S256',
    code_challenge,
    state,
    scope: 'user-read-private user-read-email'
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}