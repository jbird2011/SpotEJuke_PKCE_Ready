// pages/auth/callback.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) {
        console.error('No code found in URL');
        return;
      }

      try {
        const response = await fetch('/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) throw new Error('Failed to exchange code for tokens');

        const data = await response.json();
        console.log('✅ Tokens:', data);

        // Redirect or do something with the token
        router.push('/');
      } catch (err) {
        console.error('❌ Callback error:', err.message);
      }
    }

    handleCallback();
  }, [router]);

  return <p>Logging you in…</p>; 
}
