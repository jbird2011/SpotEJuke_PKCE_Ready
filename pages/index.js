import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const cookieString = document.cookie;
    const token = cookieString
      .split('; ')
      .find((row) => row.startsWith('access_token='));

    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎵 SpotEJuke</h1>
      {isLoggedIn ? (
        <p style={styles.message}>Welcome back! You’re logged in. 🎉</p>
      ) : (
        <button style={styles.button} onClick={handleLogin}>
          Login with Spotify
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontFamily: 'sans-serif',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  message: {
    fontSize: '1.2rem',
    color: 'green',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    cursor: 'pointer',
    backgroundColor: '#1DB954',
    color: 'white',
  },
};