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
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100" }), _jsxs("div", { className: "relative bg-white rounded-xl shadow-sm border border-slate-200 p-8 w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-2xl font-semibold text-slate-900 mb-2", children: "Welcome back" }), _jsx("p", { className: "text-slate-600", children: "Please sign in to your account" })] }), _jsxs("form", { className: "space-y-6", onSubmit: (e) => { e.preventDefault(); handleLogin(); }, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "username", className: "block text-sm font-medium text-slate-700 mb-2", children: "Username" }), _jsx("input", { id: "username", type: "text", placeholder: "Enter your username", className: "input-field", value: username, onChange: e => setUsername(e.target.value), required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-slate-700 mb-2", children: "Password" }), _jsx("input", { id: "password", type: "password", placeholder: "Enter your password", className: "input-field", value: password, onChange: e => setPassword(e.target.value), required: true })] }), error && (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-3", children: _jsx("p", { className: "text-sm text-red-600", children: error }) })), _jsx("button", { type: "submit", className: "btn-primary w-full", children: "Sign In" })] }), _jsxs("div", { className: "relative my-6", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-slate-200" }) }), _jsx("div", { className: "relative flex justify-center text-sm", children: _jsx("span", { className: "px-2 bg-white text-slate-500", children: "Don't have an account?" }) })] }), _jsx("button", { type: "button", className: "btn-secondary w-full", onClick: () => navigate('/create-user'), children: "Create Account" })] })] }));
};
export default LoginPage;
