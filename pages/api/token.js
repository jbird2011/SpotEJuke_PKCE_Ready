export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  const cookie = require('cookie');
  const cookies = cookie.parse(req.headers.cookie || '');
  const code_verifier = cookies.code_verifier;

  if (!code_verifier) {
    return res.status(400).json({ error: 'Missing code_verifier' });
  }

  const params = new URLSearchParams();
  params.append('client_id', process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI);
  params.append('code_verifier', code_verifier);

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch token' });
  }
}