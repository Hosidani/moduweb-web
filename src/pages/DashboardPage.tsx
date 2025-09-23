import { useAuth } from '../context/AuthContext';
import { getUser, updateUser, deleteUser } from '../api/user'; // API file is still named user.js, but endpoints inside are now plural
import { useState, useEffect } from 'react';
import { User } from '../api/user'; // API file is still named user.js, but endpoints inside are now plural

const DashboardPage = () => {
  const { user } = useAuth();
  // Use user.id or user.userName depending on your backend
  const userId = user?.id;
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (userId) {
      getUser(userId)
  .then((info) => setUserInfo(info))
        .catch((err) => setMessage('Failed to load user info: ' + err.message));
    }
  }, [userId]);

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
    <div className="p-6 space-y-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded shadow p-4 border border-gray-300 hover:shadow-lg">
          Besökare: Kommer snart statistik här.
        </div>
        <div className="bg-white rounded shadow p-4 border border-gray-300 hover:shadow-lg">
          Bokningar: Kommer snart statistik här.
        </div>
        <div className="bg-white rounded shadow p-4 border border-gray-300 hover:shadow-lg">
          Köp (sålda varor): Kommer snart statistik här.
        </div>
        <div className="bg-white rounded shadow p-4 border border-gray-300 hover:shadow-lg">
          Tillgängliga moduler att köpa: Kommer snart lista här.
        </div>
        <div className="bg-white rounded shadow p-4 border border-gray-300 hover:shadow-lg">
          Moduler som kunden köpte redan: Kommer snart lista här.
        </div>
        <div className="bg-white rounded shadow p-4 border border-gray-300 hover:shadow-lg">
          Betalningar: Kommer snart statistik här.
        </div>
      </div>
      {userInfo && (
        <form onSubmit={handleUpdate}>
          <input
            value={userInfo.userName}
            onChange={e => setUserInfo({ ...userInfo, userName: e.target.value })}
            placeholder="Username"
          />
          <input
            value={userInfo.email}
            onChange={e => setUserInfo({ ...userInfo, email: e.target.value })}
            placeholder="Email"
          />
          <button type="submit">Update</button>
          <button type="button" onClick={handleDelete} style={{ marginLeft: '1rem', color: 'red' }}>Delete Account</button>
        </form>
      )}
      {message && <div style={{ color: message.includes('fail') ? 'red' : 'green' }}>{message}</div>}
    </div>
  );
};

export default DashboardPage;