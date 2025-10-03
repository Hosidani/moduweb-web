import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
        }
        catch (err) {
            setError('Login failed');
        }
    };
    // Helper to fetch user by username (since your backend expects id, you need a getUserByUsername API)
    async function getUserByUsername(username) {
        // Fetch all users and find by username (inefficient, but works if no direct endpoint)
        const { getUsers } = await import('../api/user'); // API file is still named user.js, but endpoints inside are now plural
        const users = await getUsers();
        return users.find((u) => u.userName === username);
    }
    return (_jsx("div", { className: "p-6 bg-gray-100 min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "bg-white rounded shadow p-8 w-full max-w-md", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Login Page" }), _jsx("p", { className: "mb-6", children: "Please log in to continue." }), _jsx("input", { type: "text", placeholder: "Username", className: "mb-4 p-2 border rounded w-full", value: username, onChange: e => setUsername(e.target.value) }), _jsx("input", { type: "password", placeholder: "Password", className: "mb-6 p-2 border rounded w-full", value: password, onChange: e => setPassword(e.target.value) }), _jsx("button", { className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full", onClick: handleLogin, children: "Log In" }), _jsx("button", { className: "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full mt-4", onClick: () => navigate('/create-user'), children: "Create User" }), error && _jsx("div", { className: "text-red-600 mt-2", children: error })] }) }));
};
export default LoginPage;
