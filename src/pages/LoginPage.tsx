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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100"></div>
      
      {/* Login card */}
      <div className="relative bg-white rounded-xl shadow-sm border border-slate-200 p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-600">Please sign in to your account</p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              className="input-field"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="input-field"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">Don't have an account?</span>
          </div>
        </div>

        {/* Create account button */}
        <button
          type="button"
          className="btn-secondary w-full"
          onClick={() => navigate('/create-user')}
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default LoginPage;