import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
const BaseLayout = ({ children }) => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 flex flex-col", children: [_jsx("header", { className: "bg-white shadow-sm border-b border-gray-200", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex items-center justify-between h-16 w-full", children: [_jsx("div", { className: "flex items-center mr-8", children: _jsx(Link, { to: "/", className: "text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors", children: "ModuWeb" }) }), _jsxs("nav", { className: "hidden md:flex items-center space-x-4 flex-1 justify-center", children: [!user && (_jsx(Link, { to: "/login", className: "text-gray-700 hover:text-blue-600 transition-colors font-medium", children: "Login" })), user && (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/", className: "text-gray-700 hover:text-blue-600 transition-colors font-medium", children: "Homepage" }), _jsx(Link, { to: "/dashboard", className: "text-gray-700 hover:text-blue-600 transition-colors font-medium", children: "Dashboard" }), _jsx(Link, { to: "/dashboard/bookings", className: "text-gray-700 hover:text-blue-600 transition-colors font-medium", children: "Bookings" })] })), _jsx(Link, { to: "/about", className: "text-gray-700 hover:text-blue-600 transition-colors font-medium", children: "About" })] }), _jsx("div", { className: "flex items-center space-x-4 flex-shrink-0 ml-8", children: user && (_jsxs(_Fragment, { children: [_jsxs("span", { className: "text-gray-600 font-medium", children: ["Welcome, ", user.userName] }), _jsx("button", { onClick: handleLogout, className: "text-gray-600 hover:text-red-600 transition-colors font-medium", children: "Logout" })] })) })] }) }) }), _jsx("main", { className: "flex-1", children: children }), _jsx("footer", { className: "bg-white border-t border-gray-200 mt-auto", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: _jsx("div", { className: "flex justify-center", children: _jsx(Link, { to: "/privacy", className: "text-gray-600 hover:text-blue-600 transition-colors", children: "Privacy Policy" }) }) }) })] }));
};
export default BaseLayout;
