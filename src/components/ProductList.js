import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { getProducts, createProduct, updateProduct, deleteProduct, } from "../api/productApi";
// Utility to get unique categories from all products
function getAllCategories(products) {
    const set = new Set();
    products.forEach(p => (p.categories || []).forEach(c => set.add(c)));
    return Array.from(set).sort();
}
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
    // Remove useNavigate, use local state for view switching
    // ...existing code...
    const [checkoutSuccess, setCheckoutSuccess] = useState(false);
    // New state: show checkout info form after checkout
    const [showCheckoutInfo, setShowCheckoutInfo] = useState(false);
    // Cart state: [{ productId, quantity, stock, name }]
    const [cart, setCart] = useState([]);
    // Quantity input for Add to Cart
    const [addQty, setAddQty] = useState(1);
    // Increase quantity in cart
    const handleIncreaseQty = async (item) => {
        if (item.quantity >= item.stock)
            return;
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.trim();
            const res = await axios.post(`${API_BASE_URL}/cart/add`, {
                productId: item.productId,
                quantity: 1 // add one more
            }, { withCredentials: true });
            setCart(res.data);
            console.log('Cart updated from backend:', res.data);
        }
        catch (err) {
            console.error('Failed to increase quantity:', err);
        }
    };
    // Decrease quantity in cart
    const handleDecreaseQty = async (item) => {
        if (item.quantity <= 1) {
            // Remove item from cart
            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.trim();
                const res = await axios.post(`${API_BASE_URL}/cart/remove`, {
                    productId: item.productId
                }, { withCredentials: true });
                setCart(res.data);
                console.log('Cart updated from backend:', res.data);
            }
            catch (err) {
                console.error('Failed to remove item:', err);
            }
        }
        else {
            // Decrease quantity by 1
            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.trim();
                const res = await axios.post(`${API_BASE_URL}/cart/add`, {
                    productId: item.productId,
                    quantity: -1 // decrease by one
                }, { withCredentials: true });
                setCart(res.data);
                console.log('Cart updated from backend:', res.data);
            }
            catch (err) {
                console.error('Failed to decrease quantity:', err);
            }
        }
    };
    // Add to Cart handler
    const handleAddToCart = async (product, quantity) => {
        if (!product.id || typeof product.id !== 'string')
            return;
        const availableStock = product.stock ?? 0;
        const qtyToAdd = Math.max(1, Math.min(quantity, availableStock));
        if (qtyToAdd < 1) {
            console.log(`Cannot add ${product.name}: out of stock.`);
            return;
        }
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.trim();
            const res = await axios.post(`${API_BASE_URL}/cart/add`, {
                productId: product.id,
                quantity: qtyToAdd
            }, { withCredentials: true });
            setCart(res.data); // backend returns updated cart
            console.log('Cart updated from backend:', res.data);
        }
        catch (err) {
            console.error('Failed to add to cart:', err);
        }
    };
    // Add showForm state to control add/edit form visibility
    const [showForm, setShowForm] = useState(false);
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
                // Update by id so we don't rely on filtered index matching the original array
                setProducts((prev) => prev.map((p) => (p.id === productToUpdate.id ? { ...form, id: productToUpdate.id } : p)));
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
            // Close the form after successful add/update
            setShowForm(false);
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
        // Ensure the edit form is visible when clicking Edit
        setShowForm(true);
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
            // Best-effort: attempt to delete all images associated with the product first.
            const imgs = productToDelete.images ?? [];
            if (imgs.length > 0) {
                await Promise.allSettled(imgs.map(async (imgUrl) => {
                    // robust filename extraction
                    let fileName = "";
                    try {
                        const urlObj = new URL(imgUrl);
                        const path = urlObj.pathname || imgUrl;
                        const last = path.split('/').pop() || '';
                        fileName = decodeURIComponent(last.replace(/\/$/, ''));
                    }
                    catch {
                        // fallback for non-standard URLs
                        fileName = decodeURIComponent((imgUrl.split('/').pop() || '').split('?')[0]);
                    }
                    console.log('Deleting product image (best-effort) fileName=', fileName);
                    try {
                        const res = await fetch(`${API_BASE_URL}/image/delete?fileName=${encodeURIComponent(fileName)}`, { method: 'DELETE' });
                        // treat 404 as idempotent success
                        if (!res.ok && res.status !== 404) {
                            const txt = await res.text();
                            throw new Error(txt || 'Failed to delete image');
                        }
                    }
                    catch (e) {
                        // swallow individual image delete errors - we'll continue with product deletion
                        console.warn('Image delete (best-effort) failed for', imgUrl, e);
                    }
                }));
            }
            await deleteProduct(productToDelete.id);
            // Remove by id (safer than index because filteredProducts may be a subset)
            setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
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
    // Delete image from blob storage using backend endpoint
    const handleImageDelete = async (url) => {
        const targetUrl = url ?? form.images?.[selectedImage];
        if (!targetUrl)
            return;
        try {
            // Confirm with the user before deleting
            const ok = window.confirm('Are you sure you want to delete this image?');
            if (!ok)
                return;
            // robust filename extraction: prefer URL parsing, fallback to naive split
            let fileName = "";
            try {
                const urlObj = new URL(targetUrl);
                const path = urlObj.pathname || targetUrl;
                const last = path.split('/').pop() || '';
                fileName = decodeURIComponent(last.replace(/\/$/, ''));
            }
            catch {
                // fallback if targetUrl is not an absolute URL
                fileName = decodeURIComponent((targetUrl.split('/').pop() || '').split('?')[0]);
            }
            console.log('Deleting image fileName=', fileName);
            const res = await fetch(`${API_BASE_URL}/image/delete?fileName=${encodeURIComponent(fileName)}`, {
                method: 'DELETE',
            });
            // treat 404 (not found) as idempotent success
            if (!res.ok && res.status !== 404) {
                const txt = await res.text();
                throw new Error(txt || 'Failed to delete image');
            }
            // Remove the image from form.images
            setForm(prev => {
                const imgs = prev.images ? prev.images.filter(i => i !== targetUrl) : [];
                return { ...prev, images: imgs };
            });
            // adjust selectedImage index
            setSelectedImage(s => Math.max(0, s - 1));
        }
        catch (err) {
            setError(err.message || 'Image delete failed');
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 px-2", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx("h1", { className: "text-4xl font-extrabold text-white mb-8 tracking-tight drop-shadow-lg", children: "Product Management" }), _jsxs("div", { className: "flex flex-col md:flex-row gap-8", children: [_jsxs("div", { className: "md:w-2/3 w-full flex flex-col gap-8", children: [editingIndex === null && (_jsx("button", { className: "bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all duration-150 mb-4", onClick: () => {
                                        setEditingIndex(null);
                                        setForm(initialForm);
                                        setShowForm(true);
                                    }, children: "Add Product" })), showForm && (_jsxs("div", { className: "bg-gray-800/90 p-8 rounded-2xl shadow-xl border border-gray-700 mb-2", children: [_jsx("h3", { className: "text-2xl font-bold mb-6 text-blue-200 tracking-wide flex items-center gap-2", children: editingIndex !== null ? (_jsx("span", { className: "inline-block bg-blue-700/30 px-3 py-1 rounded-full text-blue-300 text-base font-semibold", children: "Edit Product" })) : (_jsx("span", { className: "inline-block bg-green-700/30 px-3 py-1 rounded-full text-green-300 text-base font-semibold", children: "Add Product" })) }), _jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsx("input", { name: "name", value: form.name, onChange: handleChange, placeholder: "Name", required: true, className: "flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm" }), _jsx("input", { name: "description", value: form.description, onChange: handleChange, placeholder: "Description", required: true, className: "flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm" })] }), _jsx("div", { className: "flex flex-col md:flex-row gap-4", children: _jsx("input", { name: "categories", value: form.categories.join(', '), onChange: handleCategoryInput, placeholder: "Categories (comma separated, e.g. Electronics, Home)", required: true, className: "flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm" }) }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsx("input", { name: "price", type: "number", value: form.price, onChange: handleChange, placeholder: "Price", required: true, min: 0, step: 0.01, className: "w-full md:w-32 px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm" }), _jsx("input", { name: "stock", type: "number", value: form.stock, onChange: handleChange, placeholder: "Stock", required: true, min: 0, className: "w-full md:w-32 px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm" }), _jsx("input", { name: "sku", type: "number", value: form.sku, onChange: handleChange, placeholder: "SKU", required: true, min: 0, className: "w-full md:w-32 px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm" })] }), _jsxs("div", { className: "flex gap-3 mt-2", children: [_jsx("button", { type: "submit", className: "bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-bold shadow-md transition-all duration-150", children: editingIndex !== null ? "Update" : "Add" }), _jsx("button", { type: "button", className: "bg-gray-600 hover:bg-gray-700 text-white px-8 py-2 rounded-lg font-bold shadow-md transition-all duration-150", onClick: () => { setForm(initialForm); setEditingIndex(null); setShowForm(false); }, children: "Cancel" })] })] })] })), _jsx("div", { className: "mb-4", children: _jsxs("div", { className: "flex flex-wrap gap-2 items-center", children: [_jsx("span", { className: "text-gray-300 font-semibold mr-2", children: "Filter by Category:" }), allCategories.length === 0 && (_jsx("span", { className: "text-gray-400", children: "No categories available" })), allCategories.map((cat) => (_jsx("button", { type: "button", className: `px-3 py-1 rounded-full border text-sm font-medium transition-all
                      ${selectedCategories.includes(cat)
                                                    ? 'bg-blue-600 text-white border-blue-400 shadow'
                                                    : 'bg-gray-700 text-gray-200 border-gray-500 hover:bg-blue-800 hover:text-white'}`, onClick: () => {
                                                    setSelectedCategories((prev) => prev.includes(cat)
                                                        ? prev.filter((c) => c !== cat)
                                                        : [...prev, cat]);
                                                }, children: cat }, cat))), selectedCategories.length > 0 && (_jsx("button", { type: "button", className: "ml-2 px-2 py-1 rounded bg-gray-600 text-white text-xs border border-gray-400 hover:bg-gray-700", onClick: () => setSelectedCategories([]), children: "Clear" }))] }) }), _jsxs("div", { className: "bg-gray-800/90 p-6 rounded-2xl shadow-xl border border-gray-700", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-white tracking-wide", children: "Product List" }), error && _jsx("div", { className: "mb-4 text-red-400 font-semibold", children: error }), loading ? (_jsx("div", { className: "text-gray-300", children: "Loading products..." })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full mb-4 text-sm text-left text-gray-300 border-separate border-spacing-y-2", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-700 text-gray-200", children: [_jsx("th", { className: "px-4 py-2", children: "Name" }), _jsx("th", { className: "px-4 py-2", children: "Description" }), _jsx("th", { className: "px-4 py-2", children: "Categories" }), _jsx("th", { className: "px-4 py-2", children: "Price" }), _jsx("th", { className: "px-4 py-2", children: "Stock" }), _jsx("th", { className: "px-4 py-2", children: "SKU" }), _jsx("th", { className: "px-4 py-2", children: "Actions" })] }) }), _jsx("tbody", { children: filteredProducts.map(({ id, name, description, categories = [], price, stock, sku }, i) => (_jsxs("tr", { className: "bg-gray-800 hover:bg-blue-900/60 rounded-lg cursor-pointer transition-all duration-100 group", onClick: () => handleRowClick(i), children: [_jsx("td", { className: "px-4 py-2 font-semibold text-white group-hover:text-blue-300 transition-all", children: name }), _jsx("td", { className: "px-4 py-2", children: description }), _jsx("td", { className: "px-4 py-2", children: categories.length === 0 ? (_jsx("span", { className: "text-gray-400 italic", children: "None" })) : (_jsx("div", { className: "flex flex-wrap gap-1", children: categories.map((cat) => (_jsx("span", { className: "bg-blue-700/70 text-blue-100 px-2 py-0.5 rounded-full text-xs font-semibold border border-blue-400", children: cat }, cat))) })) }), _jsxs("td", { className: "px-4 py-2", children: ["$", price] }), _jsx("td", { className: "px-4 py-2", children: stock }), _jsx("td", { className: "px-4 py-2", children: sku }), _jsxs("td", { className: "px-4 py-2 flex gap-2", onClick: e => e.stopPropagation(), children: [_jsx("button", { className: "bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow transition-all", onClick: () => handleEdit(i), children: "Edit" }), _jsx("button", { className: "bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow transition-all", onClick: () => handleDelete(i), children: "Delete" })] })] }, id))) })] }) }))] })] }), _jsxs("div", { className: "md:w-1/3 w-full flex flex-col gap-8", children: [_jsxs("div", { className: "bg-gradient-to-br from-blue-900/80 to-blue-700/60 p-6 rounded-2xl shadow-xl border-2 border-blue-300 min-h-[300px] flex flex-col items-center", children: [_jsx("h3", { className: "text-lg font-bold mb-4 text-blue-100 tracking-wide", children: "Images" }), (editingIndex !== null || form === initialForm) && (_jsxs("div", { className: "mb-4 flex items-center gap-4 w-full justify-center", children: [_jsx("input", { type: "file", accept: "image/*", ref: fileInputRef, onChange: handleImageUpload, className: "text-gray-200 file:bg-blue-700 file:text-white file:rounded file:px-3 file:py-1 file:mr-2 file:border-none", disabled: uploading }), _jsx("button", { type: "button", className: "bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow transition-all", onClick: () => handleImageDelete(), disabled: uploading || !(form.images && form.images.length > 0), children: "Delete Image" }), uploading && _jsx("span", { className: "text-blue-200 animate-pulse", children: "Uploading..." })] })), _jsxs("div", { className: "w-full h-64 bg-gray-900 border-2 border-blue-400 rounded-xl flex items-center justify-center text-gray-400 mb-4 overflow-hidden shadow-lg", children: [(() => { console.log('form.images', form.images); return null; })(), form.images && form.images.length > 0 ? (_jsx("img", { src: form.images[selectedImage], alt: "Selected", className: "object-contain h-full w-full transition-all duration-200" })) : (_jsx("span", { children: "No image selected" }))] }), _jsx("div", { className: "flex gap-2 justify-center", children: form.images && form.images.slice(0, 5).map((img, idx) => (_jsx("img", { src: img, alt: `Thumbnail ${idx + 1}`, className: `h-16 w-16 object-cover rounded-lg border-2 cursor-pointer shadow transition-all duration-150 ${selectedImage === idx ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-500'}`, onClick: () => setSelectedImage(idx) }, img))) })] }), _jsxs("div", { className: "bg-gradient-to-br from-green-900/80 to-green-700/60 p-6 rounded-2xl shadow-xl border-2 border-green-300 min-h-[120px] mb-4", children: [_jsx("h3", { className: "text-lg font-bold mb-2 text-green-100 tracking-wide", children: "Description" }), _jsx("div", { className: "w-full h-24 bg-gray-900 border-2 border-green-400 rounded-xl flex items-center justify-center text-gray-400", children: "Product details here" })] }), _jsxs("div", { className: "bg-gradient-to-br from-yellow-900/80 to-yellow-700/60 p-6 rounded-2xl shadow-xl border-2 border-yellow-300 min-h-[120px]", children: [_jsx("h3", { className: "text-lg font-bold mb-2 text-yellow-100 tracking-wide", children: "Add to cart" }), _jsx("div", { className: "w-full h-24 bg-gray-900 border-2 border-yellow-400 rounded-xl flex flex-col items-center justify-center text-gray-400", children: form && form.id ? (_jsxs("div", { className: "flex flex-col items-center gap-2 w-full", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { htmlFor: "addQty", className: "text-yellow-200 font-semibold", children: "Qty:" }), _jsx("input", { id: "addQty", type: "number", min: 1, max: form.stock ?? 1, value: addQty, onChange: e => setAddQty(Math.max(1, Math.min(Number(e.target.value), form.stock ?? 1))), className: "w-16 px-2 py-1 rounded bg-gray-800 text-yellow-100 border border-yellow-400 text-center", disabled: form.stock === 0 }), _jsxs("span", { className: "text-yellow-300 text-xs", children: ["/ ", form.stock ?? 0, " in stock"] })] }), _jsx("button", { className: "bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-6 py-2 rounded-lg shadow transition-all", onClick: () => handleAddToCart(form, addQty), disabled: form.stock === 0, children: "Add to Cart" })] })) : (_jsx("span", { children: "Select a product to add to cart" })) })] }), _jsxs("div", { className: "mt-2 bg-gray-900/80 rounded-xl p-4 border border-gray-700", children: [_jsx("h3", { className: "text-lg font-bold text-yellow-200 mb-2", children: "Cart" }), showCheckoutInfo ? (_jsxs("div", { className: "bg-gray-800/90 p-8 rounded-2xl shadow-xl border border-gray-700 text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-green-300 mb-4", children: "Checkout Information" }), _jsx("div", { className: "text-gray-200 mb-6", children: "Please enter your contact, payment, and address information below." }), _jsxs("form", { className: "flex flex-col gap-4 max-w-md mx-auto", children: [_jsx("input", { type: "text", placeholder: "Full Name", className: "px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600" }), _jsx("input", { type: "email", placeholder: "Email Address", className: "px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600" }), _jsx("input", { type: "text", placeholder: "Shipping Address", className: "px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600" }), _jsx("input", { type: "text", placeholder: "Payment Details", className: "px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600" }), _jsx("button", { type: "submit", className: "bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow transition-all", children: "Submit Order" })] })] })) : checkoutSuccess ? (_jsx("div", { className: "text-green-400 font-bold text-lg text-center py-6", children: "Order placed! Thank you for your purchase." })) : cart.length === 0 ? (_jsx("div", { className: "text-gray-400", children: "Cart is empty." })) : (_jsxs(_Fragment, { children: [_jsx("ul", { className: "divide-y divide-gray-700", children: cart.map(item => (_jsxs("li", { className: "py-2 flex justify-between items-center", children: [_jsx("span", { className: "text-white", children: item.name }), _jsxs("span", { className: "text-gray-300", children: ["Qty: ", item.quantity, " / Stock: ", item.stock] }), _jsxs("div", { className: "flex gap-2 ml-4", children: [_jsx("button", { className: "bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded", onClick: () => handleDecreaseQty(item), disabled: item.quantity <= 0, children: "-" }), _jsx("button", { className: "bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded", onClick: () => handleIncreaseQty(item), disabled: item.quantity >= item.stock, children: "+" }), _jsx("button", { className: "bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded", onClick: async () => {
                                                                            try {
                                                                                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.trim();
                                                                                const res = await axios.post(`${API_BASE_URL}/cart/remove`, { productId: item.productId }, { withCredentials: true });
                                                                                setCart(res.data);
                                                                                console.log('Cart updated from backend:', res.data);
                                                                            }
                                                                            catch (err) {
                                                                                console.error('Failed to remove item:', err);
                                                                            }
                                                                        }, children: "Remove" })] })] }, item.productId))) }), _jsx("button", { className: "mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow transition-all", onClick: async () => {
                                                        try {
                                                            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.trim();
                                                            const res = await axios.post(`${API_BASE_URL}/cart/reserve`, {}, { withCredentials: true });
                                                            setCheckoutSuccess(true);
                                                            setShowCheckoutInfo(true); // Show checkout info form
                                                            console.log('Reservation response:', res.data);
                                                        }
                                                        catch (err) {
                                                            console.error('Failed to reserve cart:', err);
                                                        }
                                                    }, children: "Checkout" })] }))] })] })] })] }) }));
}
