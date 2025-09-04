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