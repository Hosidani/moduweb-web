import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import Checkout from "./pages/Checkout";
import Homepage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import BookingPage from "./pages/BookingPage";
import CreateUserPage from "./pages/CreateUserPage";
import ProductPage from "./pages/ProductPage";
import Product from "./pages/Product";
import BaseLayout from "./components/BaseLayout";
console.log('API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
function App() {
    return (_jsx(Router, { children: _jsx(BaseLayout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Homepage, {}) }), "         ", _jsx(Route, { path: "/about", element: _jsx(AboutPage, {}) }), "   ", _jsx(Route, { path: "/privacy", element: _jsx(PrivacyPage, {}) }), " ", _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/create-user", element: _jsx(CreateUserPage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/booking", element: _jsx(BookingPage, {}) }), _jsx(Route, { path: "/product", element: _jsx(ProductPage, {}) }), _jsx(Route, { path: "/products", element: _jsx(Product, {}) }), _jsx(Route, { path: "/product-list", element: _jsx(ProductList, {}) }), _jsx(Route, { path: "/product/checkout", element: _jsx(Checkout, { cart: [], onSubmit: () => { } }) })] }) }) }));
}
export default App;
