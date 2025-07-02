// pages/index.js
import { useEffect, useState } from 'react';
import { parse } from 'cookie';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for access_token cookie
    const cookies = parse(document.cookie || '');
    if (cookies.access_token) {
      setIsLoggedIn(true);
      return;
    }

    // If URL has a ?code= param (user just returned from Spotify), exchange it
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      fetch('/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token) {
            // Save access_token to cookie
            document.cookie = `access_token=${data.access_token}; path=/; max-age=3600`;

            // Clean URL and show logged-in UI
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
    // ✅ Just redirect to the API route
    window.location.href = '/api/login';
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