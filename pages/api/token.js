import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const code_verifier = cookies.code_verifier;

  const { code } = req.body;

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    client_id: process.env.SPOTIFY_CLIENT_ID,
    code_verifier
  });

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    res.status(200).json(response.data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
