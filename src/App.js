import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import BookingPage from "./pages/BookingPage";
import CreateUserPage from "./pages/CreateUserPage";
import BaseLayout from "./components/BaseLayout";
function App() {
    return (_jsx(Router, { children: _jsx(BaseLayout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Homepage, {}) }), "         ", _jsx(Route, { path: "/about", element: _jsx(AboutPage, {}) }), "   ", _jsx(Route, { path: "/privacy", element: _jsx(PrivacyPage, {}) }), " ", _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/create-user", element: _jsx(CreateUserPage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/booking", element: _jsx(BookingPage, {}) })] }) }) }));
}
export default App;
