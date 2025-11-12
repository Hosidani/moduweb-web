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
    <div className="content-wrapper">
      <h2 className="text-2xl font-semibold text-text-primary">Account Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Account Information Section */}
        {userInfo && (
          <div className="md:col-span-2 space-y-4">
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Full name</label>
                <input
                  className="input"
                  value={userInfo.userName}
                  onChange={e => setUserInfo({ ...userInfo, userName: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="input"
                  value={userInfo.email}
                  onChange={e => setUserInfo({ ...userInfo, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Change password</label>
                <input 
                  type="password" 
                  className="input opacity-50"
                  placeholder="New password (coming soon)"
                  disabled
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="submit"
                  className="btn-primary"
                >
                  Save changes
                </button>
                <button 
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Security section */}
        <div className="md:col-span-1">
          <div className="card p-4 space-y-4">
            <h4 className="font-semibold text-text-primary">Security</h4>
            <p className="text-sm text-text-secondary">API keys, 2FA and activity logs will appear here.</p>
            
            {/* Danger Zone */}
            <div className="pt-4 border-t border-border">
              <h4 className="font-semibold text-danger mb-2">⚠️ Danger Zone</h4>
              <p className="text-xs text-text-secondary mb-3">Once you delete your account, there is no going back.</p>
              <button
                onClick={handleDelete}
                className="btn-danger text-sm w-full"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
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

export default AccountSettingsPage;