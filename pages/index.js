// pages/index.js
import { useEffect, useState } from 'react';
import { parse } from 'cookie';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check cookie for access_token
    const cookies = parse(document.cookie || '');
    if (cookies.access_token) {
      setIsLoggedIn(true);
      return;
    }

    // If redirected from Spotify with code, exchange for access token
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      fetch('/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token) {
            // Set access_token as cookie
            document.cookie = `access_token=${data.access_token}; path=/; max-age=3600`;

            // Clean URL and reload page
            window.history.replaceState({}, document.title, '/');
            setIsLoggedIn(true);
          }
        })
        .catch((err) => {
          console.error('Token exchange failed:', err);
        });
    }
  }, []);

  const login = () => {
    const codeVerifier = generateRandomString(64);
    const codeChallenge = base64URLEncode(sha256(codeVerifier));
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
    const scope = 'user-read-private user-read-email';

    // Save code_verifier as cookie
    document.cookie = `code_verifier=${codeVerifier}; path=/; max-age=300`;

    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge_method=S256&code_challenge=${codeChallenge}`;

    window.location.href = authUrl;
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h1>🎵 SpotEJuke</h1>
      {isLoggedIn ? (
        <p>You're logged in! 🎉</p>
      ) : (
        <button
          onClick={login}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#1DB954',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Login with Spotify
        </button>
      )}
    </div>
  );
}

// --- Helper Functions ---

function generateRandomString(length) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const values = window.crypto.getRandomValues(new Uint8Array(length));
  for (let i = 0; i < values.length; i++) {
    result += charset[values[i] % charset.length];
  }
  return result;
}

function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest('SHA-256', data).then((hash) => {
    return new Uint8Array(hash);
  });
}

function base64URLEncode(bytes) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}