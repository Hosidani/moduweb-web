import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../api/user';
import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
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
    return (_jsxs("div", { className: "content-wrapper", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-text-primary", children: "Dashboard" }), _jsxs("p", { className: "text-text-secondary mt-1", children: ["Welcome back, ", user?.userName || 'User'] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: () => navigate('/account/settings'), className: "btn-primary", children: "Account Settings" }), _jsx("button", { onClick: handleDelete, className: "btn-danger", children: "Delete Account" })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsx(StatCard, { title: "Visitors", value: "Coming Soon" }), _jsx(StatCard, { title: "Bookings", value: "Active", highlight: "success", onOpen: () => navigate('/dashboard/bookings') }), _jsx(StatCard, { title: "Sales", value: "Coming Soon" }), _jsx(StatCard, { title: "Available Modules", value: "Coming Soon" }), _jsx(StatCard, { title: "Purchased Modules", value: "Coming Soon" }), _jsx(StatCard, { title: "Payments", value: "Coming Soon" })] }), message && (_jsx("div", { className: message.includes('fail')
                    ? 'alert-danger'
                    : 'alert-success', children: message }))] }));
};
export default DashboardPage;
