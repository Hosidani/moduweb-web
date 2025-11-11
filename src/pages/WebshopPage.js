import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const WebshopPage = () => {
    const [products, setProducts] = useState([
        { id: 1, title: "Starter Kit", price: 29, stock: 12 },
        { id: 2, title: "Pro Module", price: 79, stock: 3 },
    ]);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState(0);
    const addProduct = () => {
        if (!title)
            return;
        setProducts([...products, {
                id: Date.now(),
                title,
                price: Number(price),
                stock: 10
            }]);
        setTitle("");
        setPrice(0);
    };
    const deleteProduct = (id) => {
        setProducts(products.filter(p => p.id !== id));
    };
    return (_jsxs("div", { className: "content-wrapper", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-2xl font-semibold text-text-primary", children: "Webshop Manager" }), _jsxs("div", { className: "text-sm text-text-secondary", children: ["Orders: ", _jsx("span", { className: "font-medium", children: "12" }), " \u2022 Revenue: ", _jsx("span", { className: "font-medium text-success", children: "$3,240" })] })] }), _jsxs("div", { className: "flex flex-col lg:flex-row gap-6", children: [_jsxs("div", { className: "flex-1 card p-6", children: [_jsx("h3", { className: "font-semibold text-text-primary mb-4", children: "Products" }), _jsx("div", { className: "space-y-3", children: products.map((p) => (_jsxs("div", { className: "flex items-center justify-between p-4 bg-bg rounded-lg border border-border hover:shadow-soft transition-shadow", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium text-text-primary", children: p.title }), _jsxs("div", { className: "text-xs text-text-secondary", children: [_jsxs("span", { className: "font-medium text-success", children: ["$", p.price] }), " \u2022 ", p.stock, " in stock"] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: "btn-secondary text-sm", children: "Edit" }), _jsx("button", { onClick: () => deleteProduct(p.id), className: "btn-danger text-sm", children: "Delete" })] })] }, p.id))) }), _jsxs("div", { className: "mt-6 border-t border-border pt-4", children: [_jsx("h4", { className: "font-medium text-text-primary mb-3", children: "Add product" }), _jsxs("div", { className: "flex gap-3", children: [_jsx("input", { value: title, onChange: e => setTitle(e.target.value), placeholder: "Product title", className: "input flex-1" }), _jsx("input", { value: price, onChange: e => setPrice(Number(e.target.value)), placeholder: "Price", type: "number", className: "input w-32" }), _jsx("button", { onClick: addProduct, className: "btn-primary", children: "Add" })] })] })] }), _jsxs("div", { className: "w-full lg:w-80 card p-6", children: [_jsx("h3", { className: "font-semibold text-text-primary", children: "\uD83D\uDCCA Quick Analytics" }), _jsxs("div", { className: "mt-4 space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-text-secondary", children: "Sales last 7 days:" }), _jsx("span", { className: "font-semibold text-success", children: "$1,200" })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-text-secondary", children: "Top product:" }), _jsx("span", { className: "font-medium text-text-primary", children: products[0]?.title })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-text-secondary", children: "Total products:" }), _jsx("span", { className: "font-medium text-text-primary", children: products.length })] })] })] })] })] }));
};
export default WebshopPage;
