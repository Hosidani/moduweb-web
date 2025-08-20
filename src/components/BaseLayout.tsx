import React from 'react';
import { Link } from 'react-router-dom';

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <header style={{ background: '#eee', padding: '1rem' }}>
      <h1>Header</h1>
      <nav>
        <Link to="/login">Login</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/booking">Booking</Link>
      </nav>
    </header>
    <main style={{ flex: 1, padding: '1rem' }}>
      {children}
    </main>
    <footer style={{ background: '#eee', padding: '1rem', textAlign: 'center' }}>
      Footer
    </footer>
  </div>
);

export default BaseLayout;