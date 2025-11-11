import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import { loginUser } from '../api/login';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      const loginResult = await loginUser({ username, password });
      console.log('User returned from loginUser:', loginResult);
      // Fetch full user object using username (or userName)
      const fullUser = await getUserByUsername(loginResult.username);
      setUser(fullUser ?? null);
      localStorage.setItem('user', JSON.stringify(fullUser));
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed');
    }
  };

  // Helper to fetch user by username (since your backend expects id, you need a getUserByUsername API)
  async function getUserByUsername(username: string) {
    // Fetch all users and find by username (inefficient, but works if no direct endpoint)
  const { getUsers } = await import('../api/user'); // API file is still named user.js, but endpoints inside are now plural
    const users = await getUsers();
    return users.find((u: any) => u.userName === username);
  }

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">Login Page</h2>
        <p className="mb-6 text-gray-700 text-center">Please log in to continue.</p>
        <input
          type="text"
          placeholder="Username"
          className="mb-4 p-3 border rounded-lg w-full bg-gray-700 placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          style={{ color: 'white !important' }}
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-6 p-3 border rounded-lg w-full bg-gray-700 placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          style={{ color: 'white !important' }}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 w-full font-medium transition-colors"
          onClick={handleLogin}
        >
          Log In
        </button>
        <button
          className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 w-full mt-4 font-medium transition-colors"
          onClick={() => navigate('/create-user')}
        >
          Create User
        </button>
        {error && <div className="text-red-600 mt-4 text-center font-medium">{error}</div>}
      </div>
    </div>
  );
};

export default LoginPage;