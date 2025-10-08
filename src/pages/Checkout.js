import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
const Checkout = ({ onSubmit }) => {
    const location = useLocation();
    const [cart] = useState(location.state?.cart || []);
    const [form, setForm] = useState({
        name: "",
        email: "",
        address: "",
        phone: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalAmount, setTotalAmount] = useState(null);
    const [orderId, setOrderId] = useState(null);
    // Kör checkout automatiskt när sidan visas
    useEffect(() => {
        const doCheckout = async () => {
            setError("");
            setLoading(true);
            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.trim();
                console.debug("[Checkout] Automatic checkout...");
                const checkoutRes = await axios.post(`${API_BASE_URL}/cart/checkout`, {}, { withCredentials: true });
                console.debug("[Checkout] Checkout response:", checkoutRes);
                if (checkoutRes.status !== 200) {
                    throw new Error("Checkout failed");
                }
                setTotalAmount(checkoutRes.data?.totalAmount ?? null);
                setOrderId(checkoutRes.data?.orderId ?? null);
                // setOrderConfirmed(true); // Flytta till betalningsformulär
            }
            catch (err) {
                console.error("[Checkout] Error:", err);
                const errorMsg = err?.response?.data?.error || err.message || "Unknown error";
                setError(errorMsg);
                alert(errorMsg);
            }
            finally {
                setLoading(false);
                console.debug("[Checkout] Done.");
            }
        };
        doCheckout();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };
    // handleSubmit kan nu bara hantera betalningsinfo, inte checkout
    const handleSubmit = (e) => {
        e.preventDefault();
        // Här kan du lägga logik för betalning, men checkout är redan gjord
        console.debug("[Checkout] Payment submitted", form, cart);
        // Integrera betalningsprovider här
        onSubmit(form);
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 px-4 flex justify-center", children: _jsxs("div", { className: "max-w-2xl w-full bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700", children: [_jsx("h1", { className: "text-3xl font-bold text-white mb-6", children: "Checkout" }), _jsxs("div", { className: "mb-6 text-gray-200", children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: "Order List" }), _jsxs("table", { className: "w-full text-left mb-2", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-700 text-gray-200", children: [_jsx("th", { className: "px-2 py-1", children: "Product" }), _jsx("th", { className: "px-2 py-1", children: "Quantity" }), _jsx("th", { className: "px-2 py-1", children: "Price" }), _jsx("th", { className: "px-2 py-1", children: "Subtotal" })] }) }), _jsx("tbody", { children: cart.map((item) => (_jsxs("tr", { className: "border-b border-gray-700", children: [_jsx("td", { className: "px-2 py-1", children: item.name }), _jsx("td", { className: "px-2 py-1", children: item.quantity }), _jsxs("td", { className: "px-2 py-1", children: ["$", item.price] }), _jsxs("td", { className: "px-2 py-1", children: ["$", item.quantity * item.price] })] }, item.productId))) })] }), orderId && (_jsxs("div", { className: "text-gray-400 mt-1 text-sm", children: ["Order nummer: ", orderId] })), totalAmount !== null && (_jsxs("div", { className: "font-bold text-green-400 mt-2 text-lg", children: ["Amount to pay: $", totalAmount] }))] }), error && !orderId && _jsx("div", { className: "mb-4 text-red-400 font-semibold", children: error }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "text", name: "name", placeholder: "Full Name", value: form.name, onChange: handleChange, required: true, className: "w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none", disabled: loading }), _jsx("input", { type: "email", name: "email", placeholder: "Email", value: form.email, onChange: handleChange, required: true, className: "w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none", disabled: loading }), _jsx("textarea", { name: "address", placeholder: "Shipping Address", value: form.address, onChange: handleChange, required: true, className: "w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none", disabled: loading }), _jsx("input", { type: "tel", name: "phone", placeholder: "Phone Number", value: form.phone, onChange: handleChange, className: "w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none", disabled: loading }), _jsx("button", { type: "submit", className: "w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold shadow-md", disabled: loading, children: loading ? "Processing..." : "Proceed to Payment" })] })] }) }));
};
export default Checkout;
