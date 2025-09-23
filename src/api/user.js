const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.trim();
export async function getUsers() {
  const response = await fetch(`${API_BASE_URL}/user`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}

export async function createUser(userData) {
  const response = await fetch(`${API_BASE_URL}/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error('Failed to create user');
  return response.json();
}

// GET: api/user/{id}
export async function getUser(id) {
  const response = await fetch(`${API_BASE_URL}/user/${id}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
}

// PUT: api/user/{id}
export async function updateUser(id, userData) {
  const response = await fetch(`${API_BASE_URL}/user/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error('Failed to update user');
  return response.json();
}

// POST: api/user/delete
export async function deleteUser(id) {
  const response = await fetch(`${API_BASE_URL}/user/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) throw new Error('Failed to delete user');
  return response.json();
}