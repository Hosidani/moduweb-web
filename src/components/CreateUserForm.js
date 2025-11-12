import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { createUser } from '../api/user'; // API file is still named user.js, but endpoints inside are now plural
function CreateUserForm() {
    const [form, setForm] = useState({ userName: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newUser = await createUser(form);
            setMessage('User created: ' + newUser.userName);
            setForm({ userName: '', email: '', password: '' });
        }
        catch (err) {
            if (err instanceof Error) {
                setMessage('Error: ' + err.message);
            }
            else {
                setMessage('An unknown error occurred');
            }
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "userName", className: "block text-sm font-medium text-slate-700 mb-2", children: "Username" }), _jsx("input", { id: "userName", name: "userName", type: "text", value: form.userName, onChange: handleChange, placeholder: "Enter your username", className: "input-field", required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-slate-700 mb-2", children: "Email" }), _jsx("input", { id: "email", name: "email", type: "email", value: form.email, onChange: handleChange, placeholder: "Enter your email", className: "input-field", required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-slate-700 mb-2", children: "Password" }), _jsx("input", { id: "password", name: "password", type: "password", value: form.password, onChange: handleChange, placeholder: "Create a password", className: "input-field", required: true })] }), message && (_jsx("div", { className: `p-3 rounded-lg border ${message.startsWith('Error')
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'bg-green-50 border-green-200 text-green-600'}`, children: _jsx("p", { className: "text-sm", children: message }) })), _jsx("button", { type: "submit", className: "btn-primary w-full", children: "Create Account" }), _jsx("div", { className: "text-center", children: _jsx("a", { href: "/login", className: "text-sm text-slate-600 hover:text-slate-900", children: "Already have an account? Sign in" }) })] }));
}
export default CreateUserForm;
