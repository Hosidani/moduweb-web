export async function loginUser({ username, password }) {
  const response = await fetch('https://localhost:5083/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName: username, password }),
  });
  if (!response.ok) throw new Error('Login failed');
  const data = await response.json();
  return { username: data.userName }; // or adjust to match your backend response
}