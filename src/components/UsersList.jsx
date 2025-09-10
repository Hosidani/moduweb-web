import { useState } from 'react';
import { createUser } from './api/user';

function CreateUserForm() {
  const [form, setForm] = useState({ userName: '', email: '', password: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const newUser = await createUser(form);
      alert('User created: ' + newUser.userName);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="userName" value={form.userName} onChange={handleChange} placeholder="Username" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
      <button type="submit">Create User</button>
    </form>
  );
}

export default CreateUserForm;
