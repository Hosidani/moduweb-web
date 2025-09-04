import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
const LoginPage = () => {
    const navigate = useNavigate();
    return (_jsx("div", { className: "p-6 bg-gray-100 min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "bg-white rounded shadow p-8 w-full max-w-md", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Login Page" }), _jsx("p", { className: "mb-6", children: "Please log in to continue." }), _jsx("button", { className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full", children: "Log In" }), _jsx("button", { className: "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full mt-4", onClick: () => navigate('/create-user'), children: "Create User" })] }) }));
};
export default LoginPage;
