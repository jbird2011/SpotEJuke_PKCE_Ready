import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return; // ✅ wait until router is ready

    async function getToken() {
      const { code, state } = router.query;
      if (!code || !state) return;

      try {
        const res = await axios.post('/api/token', { code, state });
        localStorage.setItem('spotify_access_token', res.data.access_token);
        router.push('/');
      } catch (err) {
        console.error('Error getting token:', err);
      }
    }

    getToken();
  }, [router.isReady]); // ✅ only rerun when router is ready

  return <p>Logging you in…</p>;
}