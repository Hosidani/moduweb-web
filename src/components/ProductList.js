import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from "react";
// Utility to get unique categories from all products
function getAllCategories(products) {
    const set = new Set();
    products.forEach(p => (p.categories || []).forEach(c => set.add(c)));
    return Array.from(set).sort();
}
import { getProducts, createProduct, updateProduct, deleteProduct, } from "../api/productApi";
const initialForm = {
    id: undefined,
    name: "",
    description: "",
    price: 0,
    stock: 0,
    sku: 0,
    images: [],
    categories: [],
};
export default function ProductList() {
    // Category filter state (must be inside component)
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingIndex, setEditingIndex] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    // Fetch products only once on mount
    useEffect(() => {
        setLoading(true);
        getProducts()
            .then((data) => {
            setProducts(data);
            setLoading(false);
        })
            .catch((e) => {
            setError(e.message);
            setLoading(false);
        });
    }, []);
    // Only show products with a valid id and product identifier (e.g., has sku and price)
    let filteredProducts = products.filter((p) => !!p.id && typeof p.sku === 'number' && typeof p.price === 'number');
    // Filter by selected categories if any
    if (selectedCategories.length > 0) {
        filteredProducts = filteredProducts.filter(p => p.categories && selectedCategories.every(cat => p.categories.includes(cat)));
    }
    // All unique categories for filter UI
    const allCategories = getAllCategories(products);
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm({
            ...form,
            [name]: type === "number" ? Number(value) : value,
        });
    };
    // Handle category input (comma-separated, tag style)
    const handleCategoryInput = (e) => {
        const value = e.target.value;
        // Split by comma, trim, remove empty
        const categories = value.split(',').map(c => c.trim()).filter(Boolean);
        setForm({ ...form, categories });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingIndex !== null) {
                const productToUpdate = filteredProducts[editingIndex];
                if (!productToUpdate.id)
                    throw new Error("Product id is missing");
                await updateProduct(productToUpdate.id, form);
                setProducts((prev) => prev.map((p, i) => (i === editingIndex ? { ...form, id: productToUpdate.id } : p)));
                setEditingIndex(null);
            }
            else {
                await createProduct(form);
                // Reload products from backend to get correct id
                setLoading(true);
                getProducts()
                    .then((data) => {
                    setProducts(data);
                    setLoading(false);
                })
                    .catch((e) => {
                    setError(e.message);
                    setLoading(false);
                });
            }
            setForm(initialForm);
            setError("");
        }
        catch (e) {
            setError(e.message);
        }
    };
    const handleEdit = (index) => {
        const product = filteredProducts[index];
        setForm({ ...product, images: product.images ?? [] });
        setEditingIndex(index);
        setSelectedImage(0);
    };
    // When a row is clicked, show its images in the gallery (but do not enter edit mode)
    const handleRowClick = (index) => {
        const product = filteredProducts[index];
        setForm({ ...product, images: product.images ?? [] });
        setEditingIndex(null);
        setSelectedImage(0);
    };
    const handleDelete = async (index) => {
        const productToDelete = filteredProducts[index];
        if (!productToDelete.id) {
            setError("Product id is missing");
            return;
        }
        const confirmed = window.confirm(`Are you sure you want to delete the product: "${productToDelete.name}"?`);
        if (!confirmed)
            return;
        try {
            await deleteProduct(productToDelete.id);
            setProducts((prev) => prev.filter((_, i) => i !== index));
        }
        catch (e) {
            setError(e.message);
        }
    };
    // Images state (uploaded + demo)
    const [selectedImage, setSelectedImage] = useState(0);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    // Upload image to backend (Azure Blob)
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.trim();
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            // Use /image/upload (API_BASE_URL already includes /api)
            const res = await fetch(`${API_BASE_URL}/image/upload`, {
                method: "POST",
                body: formData,
            });
            if (!res.ok)
                throw new Error("Image upload failed");
            const data = await res.json();
            setForm((prev) => ({
                ...prev,
                images: [data.url, ...(prev.images || [])],
            }));
            setSelectedImage(0);
        }
        catch (err) {
            setError(err.message || "Image upload failed");
        }
        finally {
            setUploading(false);
            if (fileInputRef.current)
                fileInputRef.current.value = "";
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 px-2", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx("h1", { className: "text-4xl font-extrabold text-white mb-8 tracking-tight drop-shadow-lg", children: "Product Management" }), _jsxs("div", { className: "flex flex-col md:flex-row gap-8", children: [_jsxs("div", { className: "md:w-2/3 w-full flex flex-col gap-8", children: [_jsxs("div", { className: "bg-gray-800/90 p-8 rounded-2xl shadow-xl border border-gray-700 mb-2", children: [_jsx("h3", { className: "text-2xl font-bold mb-6 text-blue-200 tracking-wide flex items-center gap-2", children: editingIndex !== null ? (_jsx("span", { className: "inline-block bg-blue-700/30 px-3 py-1 rounded-full text-blue-300 text-base font-semibold", children: "Edit Product" })) : (_jsx("span", { className: "inline-block bg-green-700/30 px-3 py-1 rounded-full text-white-200 text-base font-semibold", children: "Add Product" })) }), _jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsx("input", { name: "name", value: form.name, onChange: handleChange, placeholder: "Name", required: true, className: "flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm" }), _jsx("input", { name: "description", value: form.description, onChange: handleChange, placeholder: "Description", required: true, className: "flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm" })] }), _jsx("div", { className: "flex flex-col md:flex-row gap-4", children: _jsx("input", { name: "categories", value: form.categories.join(', '), onChange: handleCategoryInput, placeholder: "Categories (comma separated, e.g. Electronics, Home)", required: true, className: "flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm" }) }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsx("input", { name: "price", type: "number", value: form.price, onChange: handleChange, placeholder: "Price", required: true, min: 0, step: 0.01, className: "w-full md:w-32 px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm" }), _jsx("input", { name: "stock", type: "number", value: form.stock, onChange: handleChange, placeholder: "Stock", required: true, min: 0, className: "w-full md:w-32 px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm" }), _jsx("input", { name: "sku", type: "number", value: form.sku, onChange: handleChange, placeholder: "SKU", required: true, min: 0, className: "w-full md:w-32 px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm" })] }), _jsxs("div", { className: "flex gap-3 mt-2", children: [_jsx("button", { type: "submit", className: "bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-bold shadow-md transition-all duration-150", children: editingIndex !== null ? "Update" : "Add" }), editingIndex !== null && (_jsx("button", { type: "button", className: "bg-gray-600 hover:bg-gray-700 text-white px-8 py-2 rounded-lg font-bold shadow-md transition-all duration-150", onClick: () => { setForm(initialForm); setEditingIndex(null); }, children: "Cancel" }))] })] })] }), _jsx("div", { className: "mb-4", children: _jsxs("div", { className: "flex flex-wrap gap-2 items-center", children: [_jsx("span", { className: "text-gray-300 font-semibold mr-2", children: "Filter by Category:" }), allCategories.length === 0 && (_jsx("span", { className: "text-gray-400", children: "No categories available" })), allCategories.map((cat) => (_jsx("button", { type: "button", className: `px-3 py-1 rounded-full border text-sm font-medium transition-all
                      ${selectedCategories.includes(cat)
                                                    ? 'bg-blue-600 text-white border-blue-400 shadow'
                                                    : 'bg-gray-700 text-gray-200 border-gray-500 hover:bg-blue-800 hover:text-white'}`, onClick: () => {
                                                    setSelectedCategories((prev) => prev.includes(cat)
                                                        ? prev.filter((c) => c !== cat)
                                                        : [...prev, cat]);
                                                }, children: cat }, cat))), selectedCategories.length > 0 && (_jsx("button", { type: "button", className: "ml-2 px-2 py-1 rounded bg-gray-600 text-white text-xs border border-gray-400 hover:bg-gray-700", onClick: () => setSelectedCategories([]), children: "Clear" }))] }) }), _jsxs("div", { className: "bg-gray-800/90 p-6 rounded-2xl shadow-xl border border-gray-700", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-white tracking-wide", children: "Product List" }), error && _jsx("div", { className: "mb-4 text-red-400 font-semibold", children: error }), loading ? (_jsx("div", { className: "text-gray-300", children: "Loading products..." })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full mb-4 text-sm text-left text-gray-300 border-separate border-spacing-y-2", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-700 text-gray-200", children: [_jsx("th", { className: "px-4 py-2", children: "Name" }), _jsx("th", { className: "px-4 py-2", children: "Description" }), _jsx("th", { className: "px-4 py-2", children: "Categories" }), _jsx("th", { className: "px-4 py-2", children: "Price" }), _jsx("th", { className: "px-4 py-2", children: "Stock" }), _jsx("th", { className: "px-4 py-2", children: "SKU" }), _jsx("th", { className: "px-4 py-2", children: "Actions" })] }) }), _jsx("tbody", { children: filteredProducts.map(({ id, name, description, categories = [], price, stock, sku }, i) => (_jsxs("tr", { className: "bg-gray-800 hover:bg-blue-900/60 rounded-lg cursor-pointer transition-all duration-100 group", onClick: () => handleRowClick(i), children: [_jsx("td", { className: "px-4 py-2 font-semibold text-white group-hover:text-blue-300 transition-all", children: name }), _jsx("td", { className: "px-4 py-2", children: description }), _jsx("td", { className: "px-4 py-2", children: categories.length === 0 ? (_jsx("span", { className: "text-gray-400 italic", children: "None" })) : (_jsx("div", { className: "flex flex-wrap gap-1", children: categories.map((cat) => (_jsx("span", { className: "bg-blue-700/70 text-blue-100 px-2 py-0.5 rounded-full text-xs font-semibold border border-blue-400", children: cat }, cat))) })) }), _jsxs("td", { className: "px-4 py-2", children: ["$", price] }), _jsx("td", { className: "px-4 py-2", children: stock }), _jsx("td", { className: "px-4 py-2", children: sku }), _jsxs("td", { className: "px-4 py-2 flex gap-2", onClick: e => e.stopPropagation(), children: [_jsx("button", { className: "bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow transition-all", onClick: () => handleEdit(i), children: "Edit" }), _jsx("button", { className: "bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow transition-all", onClick: () => handleDelete(i), children: "Delete" })] })] }, id))) })] }) }))] })] }), _jsxs("div", { className: "md:w-1/3 w-full flex flex-col gap-8", children: [_jsxs("div", { className: "bg-gradient-to-br from-blue-900/80 to-blue-700/60 p-6 rounded-2xl shadow-xl border-2 border-blue-300 min-h-[300px] flex flex-col items-center", children: [_jsx("h3", { className: "text-lg font-bold mb-4 text-blue-100 tracking-wide", children: "Images" }), (editingIndex !== null || form === initialForm) && (_jsxs("div", { className: "mb-4 flex items-center gap-4 w-full justify-center", children: [_jsx("input", { type: "file", accept: "image/*", ref: fileInputRef, onChange: handleImageUpload, className: "text-gray-200 file:bg-blue-700 file:text-white file:rounded file:px-3 file:py-1 file:mr-2 file:border-none", disabled: uploading }), uploading && _jsx("span", { className: "text-blue-200 animate-pulse", children: "Uploading..." })] })), _jsxs("div", { className: "w-full h-64 bg-gray-900 border-2 border-blue-400 rounded-xl flex items-center justify-center text-gray-400 mb-4 overflow-hidden shadow-lg", children: [(() => { console.log('form.images', form.images); return null; })(), form.images && form.images.length > 0 ? (_jsx("img", { src: form.images[selectedImage], alt: "Selected", className: "object-contain h-full w-full transition-all duration-200" })) : (_jsx("span", { children: "No image selected" }))] }), _jsx("div", { className: "flex gap-2 justify-center", children: form.images && form.images.slice(0, 5).map((img, idx) => (_jsx("img", { src: img, alt: `Thumbnail ${idx + 1}`, className: `h-16 w-16 object-cover rounded-lg border-2 cursor-pointer shadow transition-all duration-150 ${selectedImage === idx ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-500'}`, onClick: () => setSelectedImage(idx) }, img))) })] }), _jsxs("div", { className: "bg-gradient-to-br from-green-900/80 to-green-700/60 p-6 rounded-2xl shadow-xl border-2 border-green-300 min-h-[200px]", children: [_jsx("h3", { className: "text-lg font-bold mb-2 text-green-100 tracking-wide", children: "Description/Add to cart (future)" }), _jsx("div", { className: "w-full h-40 bg-gray-900 border-2 border-green-400 rounded-xl flex items-center justify-center text-gray-400", children: "Product details and add-to-cart here" })] })] })] })] }) }));
}
