import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
const BaseLayout = ({ children }) => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const welcomeText = user && user.userName ? `Welcome ${user.userName}` : 'Welcome guest';
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
    };
    return (_jsxs("div", { style: { minHeight: '100vh', display: 'flex', flexDirection: 'column' }, children: [_jsxs("header", { style: { background: '#eee', padding: '1rem', width: '100vw', boxSizing: 'border-box', textAlign: 'center' }, children: [_jsx("h1", { style: { color: '#222' }, children: "Moduweb" }), _jsx("div", { style: { marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }, children: welcomeText }), _jsxs("nav", { style: { display: 'flex', justifyContent: 'flex-start', gap: '1rem' }, children: [!user && _jsx(Link, { to: "/login", children: "Login" }), user && _jsx(Link, { to: "/", children: "Homepage" }), user && _jsx(Link, { to: "/dashboard", children: "Dashboard" }), user && _jsx(Link, { to: "/booking", children: "Booking" }), _jsx(Link, { to: "/about", children: "About Us" }), user && (_jsx("button", { onClick: handleLogout, style: { marginLeft: '1rem', color: 'red', background: 'none', border: 'none', cursor: 'pointer' }, children: "Logout" }))] })] }), _jsx("main", { style: { flex: 1, padding: '1rem' }, children: children }), _jsx("footer", { style: { background: '#eee', padding: '1rem', textAlign: 'center', width: '100vw', boxSizing: 'border-box' }, children: _jsx("nav", { children: _jsx(Link, { to: "/privacy", children: "Privacy" }) }) })] }));
};
export default BaseLayout;
