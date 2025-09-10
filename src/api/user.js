export async function getUsers() {
  const response = await fetch('https://localhost:5083/api/Users');
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}

export async function createUser(userData) {
  const response = await fetch('https://localhost:5083/api/Users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error('Failed to create user');
  return response.json();
}

// GET: api/users/{id}
export async function getUser(id) {
  const response = await fetch(`https://localhost:5083/api/Users/${id}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
}

// PUT: api/users/{id}
export async function updateUser(id, userData) {
  const response = await fetch(`https://localhost:5083/api/Users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error('Failed to update user');
  return response.json();
}

// POST: api/users/delete
export async function deleteUser(id) {
  const response = await fetch('https://localhost:5083/api/Users/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) throw new Error('Failed to delete user');
  return response.json();
}