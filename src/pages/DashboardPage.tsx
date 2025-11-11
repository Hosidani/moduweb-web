import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../api/user';
import { useState, useEffect } from 'react';

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
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="px-8 py-6 flex justify-between items-center border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.userName || 'User'}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/account/settings')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Account Settings
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-8 py-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Visitors</p>
                <p className="text-2xl font-bold text-gray-900">Coming Soon</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer hover:bg-blue-50"
            onClick={() => navigate('/dashboard/bookings')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bookings</p>
                <p className="text-2xl font-bold text-green-600">Active</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-green-600 text-xl">📅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sales</p>
                <p className="text-2xl font-bold text-gray-900">Coming Soon</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <span className="text-yellow-600 text-xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Modules</p>
                <p className="text-2xl font-bold text-gray-900">Coming Soon</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <span className="text-indigo-600 text-xl">🧩</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Purchased Modules</p>
                <p className="text-2xl font-bold text-gray-900">Coming Soon</p>
              </div>
              <div className="bg-cyan-100 p-3 rounded-full">
                <span className="text-cyan-600 text-xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Payments</p>
                <p className="text-2xl font-bold text-gray-900">Coming Soon</p>
              </div>
              <div className="bg-pink-100 p-3 rounded-full">
                <span className="text-pink-600 text-xl">💳</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="px-8 py-4">
          <div className={`p-4 rounded-lg font-medium ${
            message.includes('fail') 
              ? 'bg-red-100 text-red-800 border border-red-200' 
              : 'bg-green-100 text-green-800 border border-green-200'
          }`}>
            {message}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;