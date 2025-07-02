// pages/index.js
import Head from 'next/head';

export default function Home() {
  async function handleLogin() {
    window.location.href = '/api/login';
  }

  async function handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      try {
        const response = await fetch('/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();
        console.log('🔑 Tokens:', data);

        if (data.access_token) {
          alert('✅ Login successful! Access token received.');
        } else {
          console.error('❌ No access_token returned');
        }
      } catch (err) {
        console.error('⚠️ Callback error: Failed to exchange code for tokens', err);
      }
    }
  }

  React.useEffect(() => {
    handleCallback();
  }, []);

  return (
    <>
      <Head>
        <title>SpotEJuke</title>
      </Head>
      <div style={{ textAlign: 'center', marginTop: '10%' }}>
        <h1>🎵 SpotEJuke</h1>
        <button
          onClick={handleLogin}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#1DB954',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Login with Spotify
        </button>
      </div>
    </>
  );
}