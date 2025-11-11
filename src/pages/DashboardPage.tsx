import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../api/user';
import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id;
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        if (!userId) return;
        await deleteUser(userId);
        setMessage('Account deleted.');
        // Optionally: log out user and redirect
      } catch (err) {
        setMessage('Delete failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
      }
    }
  };

  return (
    <div className="content-wrapper">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary mt-1">Welcome back, {user?.userName || 'User'}</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/account/settings')}
            className="btn-primary"
          >
            Account Settings
          </button>
          <button 
            onClick={handleDelete}
            className="btn-danger"
          >
            Delete Account
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Visitors" 
          value="Coming Soon" 
        />
        <StatCard 
          title="Bookings" 
          value="Active" 
          highlight="success" 
          onOpen={() => navigate('/dashboard/bookings')} 
        />
        <StatCard 
          title="Sales" 
          value="Coming Soon" 
        />
        <StatCard 
          title="Available Modules" 
          value="Coming Soon" 
        />
        <StatCard 
          title="Purchased Modules" 
          value="Coming Soon" 
        />
        <StatCard 
          title="Payments" 
          value="Coming Soon" 
        />
      </div>

      {/* Messages */}
      {message && (
        <div className={
          message.includes('fail') 
            ? 'alert-danger' 
            : 'alert-success'
        }>
          {message}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;