// pages/api/token.js

import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code } = req.body;
  const cookies = cookie.parse(req.headers.cookie || '');
  const code_verifier = cookies.code_verifier;

  if (!code || !code_verifier) {
    return res.status(400).json({ error: 'Missing code or code_verifier' });
  }

  try {
    const params = new URLSearchParams({
      client_id: process.env.SPOTIFY_CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      code_verifier,
    });

    const response = await axios.post('https://accounts.spotify.com/api/token', params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, refresh_token, expires_in } = response.data;

    // Store tokens in a secure cookie (or send to frontend, up to you)
    res.status(200).json({
      access_token,
      refresh_token,
      expires_in,
    });
  } catch (error) {
    console.error('Error getting token:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get token' });
  }
}
