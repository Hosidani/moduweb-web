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
    <form onSubmit={handleSubmit}>
      <input
        name="userName"
        value={form.userName}
        onChange={handleChange}
        placeholder="Username"
        required
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <button type="submit">Create User</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default CreateUserForm;

// src/api/user.js
// Add a file src/api/user.d.ts:
