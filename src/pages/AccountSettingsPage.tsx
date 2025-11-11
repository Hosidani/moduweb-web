import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUser, updateUser, deleteUser } from '../api/user';
import { useState, useEffect } from 'react';
import { User } from '../api/user';

const AccountSettingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id;
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (userId) {
      getUser(userId)
        .then((info) => setUserInfo(info))
        .catch((err) => setMessage('Failed to load user info: ' + err.message));
    }
  }, [user, userId, navigate]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!userId || !userInfo) return;
      await updateUser(userId, userInfo);
      setMessage('User updated successfully!');
    } catch (err) {
      setMessage('Update failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        if (!userId) return;
        await deleteUser(userId);
        setMessage('Account deleted.');
        // Optionally: log out user and redirect
        navigate('/login');
      } catch (err) {
        setMessage('Delete failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="max-w-2xl">
        {/* Account Information Section */}
        {userInfo && (
          <div className="bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-600 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Username</label>
                  <input
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 placeholder-gray-300"
                    style={{ color: 'white !important' }}
                    value={userInfo.userName}
                    onChange={e => setUserInfo({ ...userInfo, userName: e.target.value })}
                    placeholder="Username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 placeholder-gray-300"
                    style={{ color: 'white !important' }}
                    value={userInfo.email}
                    onChange={e => setUserInfo({ ...userInfo, email: e.target.value })}
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Danger Zone */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
          <h2 className="text-xl font-semibold text-red-900 mb-2">Danger Zone</h2>
          <p className="text-gray-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Delete Account
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div className={`mt-4 p-4 rounded-lg font-medium ${
            message.includes('fail') 
              ? 'bg-red-100 text-red-800 border border-red-200' 
              : 'bg-green-100 text-green-800 border border-green-200'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettingsPage;