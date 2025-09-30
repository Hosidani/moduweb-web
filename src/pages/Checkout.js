import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import axios from "axios";
const Checkout = ({ cart, onSubmit }) => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        address: "",
        phone: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.trim();
            // 1. Reserve stock
            const reserveRes = await axios.post(`${API_BASE_URL}/cart/reserve`, {}, { withCredentials: true });
            if (reserveRes.status !== 200) {
                throw new Error("Stock reservation failed");
            }
            // 2. Proceed to checkout
            const checkoutRes = await axios.post(`${API_BASE_URL}/cart/checkout`, {
                name: form.name,
                email: form.email,
                address: form.address,
                phone: form.phone
            }, { withCredentials: true });
            if (checkoutRes.status !== 200) {
                throw new Error("Checkout failed");
            }
            onSubmit(form);
        }
        catch (err) {
            setError(err?.response?.data?.message || err.message || "Unknown error");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 px-4 flex justify-center", children: _jsxs("div", { className: "max-w-2xl w-full bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700", children: [_jsx("h1", { className: "text-3xl font-bold text-white mb-6", children: "Checkout" }), _jsxs("div", { className: "mb-6 text-gray-200", children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: "Your Cart" }), cart.map((item) => (_jsxs("div", { className: "flex justify-between border-b border-gray-700 py-2", children: [_jsxs("span", { children: [item.name, " x ", item.quantity] }), _jsxs("span", { children: ["Stock: ", item.stock] })] }, item.productId))), _jsxs("div", { className: "font-bold mt-2", children: ["Total Items: ", cart.reduce((sum, i) => sum + i.quantity, 0)] })] }), error && _jsx("div", { className: "mb-4 text-red-400 font-semibold", children: error }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "text", name: "name", placeholder: "Full Name", value: form.name, onChange: handleChange, required: true, className: "w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none", disabled: loading }), _jsx("input", { type: "email", name: "email", placeholder: "Email", value: form.email, onChange: handleChange, required: true, className: "w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none", disabled: loading }), _jsx("textarea", { name: "address", placeholder: "Shipping Address", value: form.address, onChange: handleChange, required: true, className: "w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none", disabled: loading }), _jsx("input", { type: "tel", name: "phone", placeholder: "Phone Number", value: form.phone, onChange: handleChange, className: "w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none", disabled: loading }), _jsx("button", { type: "submit", className: "w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold shadow-md", disabled: loading, children: loading ? "Processing..." : "Proceed to Payment" })] })] }) }));
};
export default Checkout;
