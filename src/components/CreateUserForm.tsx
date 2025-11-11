import { useState } from 'react';
import { createUser } from '../api/user'; // API file is still named user.js, but endpoints inside are now plural

function CreateUserForm() {
  const [form, setForm] = useState({ userName: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newUser = await createUser(form);
      setMessage('User created: ' + newUser.userName);
      setForm({ userName: '', email: '', password: '' });
    } catch (err) {
      if (err instanceof Error) {
        setMessage('Error: ' + err.message);
      } else {
        setMessage('An unknown error occurred');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="userName" className="block text-sm font-medium text-slate-700 mb-2">
          Username
        </label>
        <input
          id="userName"
          name="userName"
          type="text"
          value={form.userName}
          onChange={handleChange}
          placeholder="Enter your username"
          className="input-field"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="input-field"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Create a password"
          className="input-field"
          required
        />
      </div>

      {message && (
        <div className={`p-3 rounded-lg border ${
          message.startsWith('Error') 
            ? 'bg-red-50 border-red-200 text-red-600' 
            : 'bg-green-50 border-green-200 text-green-600'
        }`}>
          <p className="text-sm">{message}</p>
        </div>
      )}

      <button type="submit" className="btn-primary w-full">
        Create Account
      </button>

      <div className="text-center">
        <a href="/login" className="text-sm text-slate-600 hover:text-slate-900">
          Already have an account? Sign in
        </a>
      </div>
    </form>
  );
}

export default CreateUserForm;

// src/api/user.js
// Add a file src/api/user.d.ts:
