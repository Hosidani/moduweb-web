import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
const BaseLayout = ({ children }) => {
    const { user } = useAuth();
    console.log('Current user in BaseLayout:', user, JSON.stringify(user));
    const welcomeText = user && user.userName ? `Welcome ${user.userName}` : 'Welcome guest';
    return (_jsxs("div", { style: { minHeight: '100vh', display: 'flex', flexDirection: 'column' }, children: [_jsxs("header", { style: { background: '#eee', padding: '1rem', width: '100vw', boxSizing: 'border-box', textAlign: 'center' }, children: [_jsx("h1", { children: "Moduweb" }), _jsx("div", { style: { marginBottom: '0.5rem', fontWeight: 'bold' }, children: welcomeText }), _jsxs("nav", { style: { display: 'flex', justifyContent: 'flex-start', gap: '1rem' }, children: [_jsx(Link, { to: "/", children: "Homepage" }), _jsx(Link, { to: "/login", children: "Login" }), _jsx(Link, { to: "/dashboard", children: "Dashboard" }), _jsx(Link, { to: "/booking", children: "Booking" }), _jsx(Link, { to: "/about", children: "About Us" })] })] }), _jsx("main", { style: { flex: 1, padding: '1rem' }, children: children }), _jsx("footer", { style: { background: '#eee', padding: '1rem', textAlign: 'center', width: '100vw', boxSizing: 'border-box' }, children: _jsx("nav", { children: _jsx(Link, { to: "/privacy", children: "Privacy" }) }) })] }));
};
export default BaseLayout;
