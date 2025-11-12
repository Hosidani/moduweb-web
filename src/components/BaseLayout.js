import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// NavButton component using ModuWeb Design System
const NavButton = ({ children, to, selected, onClick }) => {
    const className = `${selected ? 'nav-link-active' : 'nav-link'} whitespace-nowrap`;
    if (to) {
        return (_jsx(Link, { to: to, className: className, children: children }));
    }
    return (_jsx("button", { onClick: onClick, className: className, children: children }));
};
const BaseLayout = ({ children }) => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
    };
    // Check if current route matches
    const isCurrentRoute = (path) => location.pathname === path;
    return (_jsxs("div", { className: "min-h-screen bg-bg text-text-primary", children: [_jsx("header", { className: "sticky top-0 z-40 bg-bg-card border-b border-border shadow-soft", children: _jsx("div", { className: "page-container !py-0", children: _jsxs("div", { className: "flex items-center justify-between h-16", children: [_jsxs("div", { className: "flex items-center gap-6", children: [_jsx("div", { className: "text-2xl font-bold text-text-primary", children: _jsx(Link, { to: "/", className: "hover:text-brand transition-colors", children: "ModuWeb" }) }), _jsxs("nav", { className: "hidden md:flex items-center gap-1", children: [_jsx(NavButton, { to: "/", selected: isCurrentRoute('/'), children: "Homepage" }), user && (_jsxs(_Fragment, { children: [_jsx(NavButton, { to: "/dashboard", selected: isCurrentRoute('/dashboard'), children: "Dashboard" }), _jsx(NavButton, { to: "/dashboard/bookings", selected: location.pathname.includes('/bookings'), children: "Bookings" }), _jsx(NavButton, { to: "/webshop", selected: isCurrentRoute('/webshop'), children: "Webshop" })] })), _jsx(NavButton, { to: "/about", selected: isCurrentRoute('/about'), children: "About" })] })] }), _jsx("div", { className: "flex items-center gap-4", children: user ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "text-sm text-text-secondary hidden sm:block", children: ["Welcome, ", user.userName] }), _jsx("button", { onClick: handleLogout, className: "btn-secondary text-sm", children: "Logout" })] })) : (_jsx(NavButton, { to: "/login", children: "Login" })) })] }) }) }), _jsx("main", { className: "page-container", children: _jsxs("div", { className: "grid grid-cols-12 gap-8", children: [user && (_jsx("aside", { className: "col-span-12 md:col-span-3", children: _jsxs("div", { className: "sticky top-24", children: [_jsxs("div", { className: "card p-4 space-y-4 fade-in", children: [_jsx("div", { className: "text-sm font-semibold text-text-secondary", children: "App" }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx(Link, { to: "/dashboard", className: `${isCurrentRoute('/dashboard')
                                                            ? 'sidebar-link-active'
                                                            : 'sidebar-link'}`, children: "Dashboard" }), _jsx(Link, { to: "/dashboard/bookings", className: `${location.pathname.includes('/bookings')
                                                            ? 'sidebar-link-active'
                                                            : 'sidebar-link'}`, children: "Booking Manager" }), _jsx(Link, { to: "/webshop", className: `${isCurrentRoute('/webshop')
                                                            ? 'sidebar-link-active'
                                                            : 'sidebar-link'}`, children: "Webshop" }), _jsx(Link, { to: "/containers", className: `${isCurrentRoute('/containers')
                                                            ? 'sidebar-link-active'
                                                            : 'sidebar-link'}`, children: "Containers & Config" }), _jsx(Link, { to: "/account/settings", className: `${isCurrentRoute('/account/settings')
                                                            ? 'sidebar-link-active'
                                                            : 'sidebar-link'}`, children: "Account Settings" })] }), _jsxs("div", { className: "pt-3 border-t border-border", children: [_jsx("div", { className: "text-xs text-text-secondary", children: "Product" }), _jsx("div", { className: "text-sm font-medium text-text-primary mt-2", children: "ModuWeb Platform" })] })] }), _jsx("div", { className: "mt-4 text-sm text-text-secondary", children: "\uD83D\uDCA1 Tips: Each customer runs in their own container with separate DB & YAML config." })] }) })), _jsx("section", { className: user ? "col-span-12 md:col-span-9" : "col-span-12", children: _jsx("div", { className: "slide-up", children: children }) })] }) })] }));
};
export default BaseLayout;
