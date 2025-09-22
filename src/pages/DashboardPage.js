import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../context/AuthContext';
import { getUser, updateUser, deleteUser } from '../api/user';
import { useState, useEffect } from 'react';
const DashboardPage = () => {
    const { user } = useAuth();
    // Use user.id or user.userName depending on your backend
    const userId = user?.id;
    const [userInfo, setUserInfo] = useState(null);
    const [message, setMessage] = useState('');
    useEffect(() => {
        if (userId) {
            getUser(userId)
                .then((info) => setUserInfo(info))
                .catch((err) => setMessage('Failed to load user info: ' + err.message));
        }
    }, [userId]);
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
    return (_jsxs("div", { className: "p-6 space-y-4 bg-gray-100 min-h-screen", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Dashboard" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx("div", { className: "bg-white rounded shadow p-4 border border-gray-300 hover:shadow-lg", children: "Bes\u00F6kare: Kommer snart statistik h\u00E4r." }), _jsx("div", { className: "bg-white rounded shadow p-4 border border-gray-300 hover:shadow-lg", children: "Bokningar: Kommer snart statistik h\u00E4r." }), _jsx("div", { className: "bg-white rounded shadow p-4 border border-gray-300 hover:shadow-lg", children: "K\u00F6p (s\u00E5lda varor): Kommer snart statistik h\u00E4r." }), _jsx("div", { className: "bg-white rounded shadow p-4 border border-gray-300 hover:shadow-lg", children: "Tillg\u00E4ngliga moduler att k\u00F6pa: Kommer snart lista h\u00E4r." }), _jsx("div", { className: "bg-white rounded shadow p-4 border border-gray-300 hover:shadow-lg", children: "Moduler som kunden k\u00F6pte redan: Kommer snart lista h\u00E4r." }), _jsx("div", { className: "bg-white rounded shadow p-4 border border-gray-300 hover:shadow-lg", children: "Betalningar: Kommer snart statistik h\u00E4r." })] }), userInfo && (_jsxs("form", { onSubmit: handleUpdate, children: [_jsx("input", { value: userInfo.userName, onChange: e => setUserInfo({ ...userInfo, userName: e.target.value }), placeholder: "Username" }), _jsx("input", { value: userInfo.email, onChange: e => setUserInfo({ ...userInfo, email: e.target.value }), placeholder: "Email" }), _jsx("button", { type: "submit", children: "Update" }), _jsx("button", { type: "button", onClick: handleDelete, style: { marginLeft: '1rem', color: 'red' }, children: "Delete Account" })] })), message && _jsx("div", { style: { color: message.includes('fail') ? 'red' : 'green' }, children: message })] }));
};
export default DashboardPage;
