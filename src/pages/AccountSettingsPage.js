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
    return (_jsxs("div", { className: "content-wrapper", children: [_jsx("h2", { className: "text-2xl font-semibold text-text-primary", children: "Account Settings" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [userInfo && (_jsx("div", { className: "md:col-span-2 space-y-4", children: _jsxs("form", { onSubmit: handleUpdate, className: "space-y-4", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Full name" }), _jsx("input", { className: "input", value: userInfo.userName, onChange: e => setUserInfo({ ...userInfo, userName: e.target.value }), placeholder: "Enter your full name" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Email" }), _jsx("input", { type: "email", className: "input", value: userInfo.email, onChange: e => setUserInfo({ ...userInfo, email: e.target.value }), placeholder: "Enter your email" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Change password" }), _jsx("input", { type: "password", className: "input opacity-50", placeholder: "New password (coming soon)", disabled: true })] }), _jsxs("div", { className: "pt-4 flex gap-3", children: [_jsx("button", { type: "submit", className: "btn-primary", children: "Save changes" }), _jsx("button", { type: "button", onClick: () => navigate('/dashboard'), className: "btn-secondary", children: "Cancel" })] })] }) })), _jsx("div", { className: "md:col-span-1", children: _jsxs("div", { className: "card p-4 space-y-4", children: [_jsx("h4", { className: "font-semibold text-text-primary", children: "Security" }), _jsx("p", { className: "text-sm text-text-secondary", children: "API keys, 2FA and activity logs will appear here." }), _jsxs("div", { className: "pt-4 border-t border-border", children: [_jsx("h4", { className: "font-semibold text-danger mb-2", children: "\u26A0\uFE0F Danger Zone" }), _jsx("p", { className: "text-xs text-text-secondary mb-3", children: "Once you delete your account, there is no going back." }), _jsx("button", { onClick: handleDelete, className: "btn-danger text-sm w-full", children: "Delete Account" })] })] }) })] }), message && (_jsx("div", { className: message.includes('fail')
                    ? 'alert-danger'
                    : 'alert-success', children: message }))] }));
};
export default AccountSettingsPage;
