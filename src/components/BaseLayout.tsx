import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';



const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const welcomeText = user && user.userName ? `Welcome ${user.userName}` : 'Welcome guest';

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#eee', padding: '1rem', width: '100vw', boxSizing: 'border-box', textAlign: 'center' }}>
        <h1 style={{ color: '#222' }}>Moduweb</h1>
        <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>{welcomeText}</div>
        <nav style={{ display: 'flex', justifyContent: 'flex-start', gap: '1rem' }}>
          {!user && <Link to="/login">Login</Link>}
          {user && <Link to="/">Homepage</Link>}
          {user && <Link to="/dashboard">Dashboard</Link>}
          {user && <Link to="/booking">Booking</Link>}
          <Link to="/about">About Us</Link>
          {user && (
            <button onClick={handleLogout} style={{ marginLeft: '1rem', color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button>
          )}
        </nav>
      </header>
      <main style={{ flex: 1, padding: '1rem' }}>
        {children}
      </main>
      <footer style={{ background: '#eee', padding: '1rem', textAlign: 'center', width: '100vw', boxSizing: 'border-box' }}>
        <nav>
          <Link to="/privacy">Privacy</Link>
        </nav>
      </footer>
    </div>
  );
};

export default BaseLayout;