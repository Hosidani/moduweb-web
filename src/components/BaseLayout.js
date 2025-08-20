import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
const BaseLayout = ({ children }) => (_jsxs("div", { style: { minHeight: '100vh', display: 'flex', flexDirection: 'column' }, children: [_jsxs("header", { style: { background: '#eee', padding: '1rem' }, children: [_jsx("h1", { children: "Header" }), _jsxs("nav", { children: [_jsx(Link, { to: "/login", children: "Login" }), _jsx(Link, { to: "/dashboard", children: "Dashboard" }), _jsx(Link, { to: "/booking", children: "Booking" })] })] }), _jsx("main", { style: { flex: 1, padding: '1rem' }, children: children }), _jsx("footer", { style: { background: '#eee', padding: '1rem', textAlign: 'center' }, children: "Footer" })] }));
export default BaseLayout;
