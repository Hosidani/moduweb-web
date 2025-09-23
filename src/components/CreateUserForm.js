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
    return (_jsxs("form", { onSubmit: handleSubmit, children: [_jsx("input", { name: "userName", value: form.userName, onChange: handleChange, placeholder: "Username", required: true }), _jsx("input", { name: "email", value: form.email, onChange: handleChange, placeholder: "Email", required: true }), _jsx("input", { name: "password", type: "password", value: form.password, onChange: handleChange, placeholder: "Password", required: true }), _jsx("button", { type: "submit", children: "Create User" }), message && _jsx("p", { children: message })] }));
}
export default CreateUserForm;
