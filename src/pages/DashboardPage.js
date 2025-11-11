import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../api/user';
import { useState, useEffect } from 'react';
const DashboardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const userId = user?.id;
    const [message, setMessage] = useState('');
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
    }, [user, navigate]);
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your account?')) {
            try {
                if (!userId)
                    return;
                await deleteUser(userId);
                setMessage('Account deleted.');
                // Optionally: log out user and redirect
            }
            catch (err) {
                setMessage('Delete failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
            }
        }
    };
    return (_jsxs("div", { className: "bg-gray-50 min-h-screen", children: [_jsxs("div", { className: "px-8 py-6 flex justify-between items-center border-b border-gray-200", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Dashboard" }), _jsxs("p", { className: "text-gray-600 mt-1", children: ["Welcome back, ", user?.userName || 'User'] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => navigate('/account/settings'), className: "bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium", children: "Account Settings" }), _jsx("button", { onClick: handleDelete, className: "bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium", children: "Delete Account" })] })] }), _jsxs("div", { className: "px-8 py-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-6", children: "Overview" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Visitors" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: "Coming Soon" })] }), _jsx("div", { className: "bg-blue-100 p-3 rounded-full", children: _jsx("span", { className: "text-blue-600 text-xl", children: "\uD83D\uDC65" }) })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer hover:bg-blue-50", onClick: () => navigate('/dashboard/bookings'), children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Bookings" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: "Active" })] }), _jsx("div", { className: "bg-green-100 p-3 rounded-full", children: _jsx("span", { className: "text-green-600 text-xl", children: "\uD83D\uDCC5" }) })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Sales" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: "Coming Soon" })] }), _jsx("div", { className: "bg-yellow-100 p-3 rounded-full", children: _jsx("span", { className: "text-yellow-600 text-xl", children: "\uD83D\uDCB0" }) })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Available Modules" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: "Coming Soon" })] }), _jsx("div", { className: "bg-indigo-100 p-3 rounded-full", children: _jsx("span", { className: "text-indigo-600 text-xl", children: "\uD83E\uDDE9" }) })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Purchased Modules" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: "Coming Soon" })] }), _jsx("div", { className: "bg-cyan-100 p-3 rounded-full", children: _jsx("span", { className: "text-cyan-600 text-xl", children: "\u2705" }) })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Payments" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: "Coming Soon" })] }), _jsx("div", { className: "bg-pink-100 p-3 rounded-full", children: _jsx("span", { className: "text-pink-600 text-xl", children: "\uD83D\uDCB3" }) })] }) })] })] }), message && (_jsx("div", { className: "px-8 py-4", children: _jsx("div", { className: `p-4 rounded-lg font-medium ${message.includes('fail')
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-green-100 text-green-800 border border-green-200'}`, children: message }) }))] }));
};
export default DashboardPage;
