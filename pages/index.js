import React from 'react';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', paddingTop: '50px' }}>
      <h1>🎵 SpotEJuke</h1>
      <p>Press below to log in with Spotify</p>
      <a href="/api/login">
        <button style={{ padding: '10px 20px', fontSize: '16px' }}>Login with Spotify</button>
      </a>
    </div>
  );
}