import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUser, updateUser, deleteUser } from '../api/user';
import { useState, useEffect } from 'react';
const AccountSettingsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const userId = user?.id;
    const [userInfo, setUserInfo] = useState(null);
    const [message, setMessage] = useState('');
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (userId) {
            getUser(userId)
                .then((info) => setUserInfo(info))
                .catch((err) => setMessage('Failed to load user info: ' + err.message));
        }
    }, [user, userId, navigate]);
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            if (!userId || !userInfo)
                return;
            await updateUser(userId, userInfo);
            setMessage('User updated successfully!');
        }
        catch (err) {
            setMessage('Update failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                if (!userId)
                    return;
                await deleteUser(userId);
                setMessage('Account deleted.');
                // Optionally: log out user and redirect
                navigate('/login');
            }
            catch (err) {
                setMessage('Delete failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
            }
        }
    };
    return (_jsxs("div", { className: "p-8 bg-gray-50 min-h-screen", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Account Settings" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Manage your account information and preferences" })] }), _jsx("button", { onClick: () => navigate('/dashboard'), className: "bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium", children: "Back to Dashboard" })] }), _jsxs("div", { className: "max-w-2xl", children: [userInfo && (_jsxs("div", { className: "bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-600 mb-6", children: [_jsx("h2", { className: "text-xl font-semibold text-white mb-4", children: "Account Information" }), _jsxs("form", { onSubmit: handleUpdate, className: "space-y-4", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-white mb-2", children: "Username" }), _jsx("input", { className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 placeholder-gray-300", style: { color: 'white !important' }, value: userInfo.userName, onChange: e => setUserInfo({ ...userInfo, userName: e.target.value }), placeholder: "Username" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-white mb-2", children: "Email" }), _jsx("input", { type: "email", className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 placeholder-gray-300", style: { color: 'white !important' }, value: userInfo.email, onChange: e => setUserInfo({ ...userInfo, email: e.target.value }), placeholder: "Email" })] })] }), _jsx("div", { className: "flex gap-3 pt-4", children: _jsx("button", { type: "submit", className: "bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium", children: "Save Changes" }) })] })] })), _jsxs("div", { className: "bg-white rounded-xl shadow-sm p-6 border border-red-200", children: [_jsx("h2", { className: "text-xl font-semibold text-red-900 mb-2", children: "Danger Zone" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Once you delete your account, there is no going back. Please be certain." }), _jsx("button", { onClick: handleDelete, className: "bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium", children: "Delete Account" })] }), message && (_jsx("div", { className: `mt-4 p-4 rounded-lg font-medium ${message.includes('fail')
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-green-100 text-green-800 border border-green-200'}`, children: message }))] })] }));
};
export default AccountSettingsPage;
