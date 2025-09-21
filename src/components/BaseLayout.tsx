import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';



const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  console.log('Current user in BaseLayout:', user, JSON.stringify(user));
  const welcomeText = user && user.userName ? `Welcome ${user.userName}` : 'Welcome guest';
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#eee', padding: '1rem', width: '100vw', boxSizing: 'border-box', textAlign: 'center' }}>
        <h1 style={{ color: '#222' }}>Moduweb</h1>
        <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>{welcomeText}</div>
        <nav style={{ display: 'flex', justifyContent: 'flex-start', gap: '1rem' }}>
          <Link to="/">Homepage</Link>
          <Link to="/login">Login</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/booking">Booking</Link>
          <Link to="/about">About Us</Link>
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