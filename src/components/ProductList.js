import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct, } from "../api/productApi";
const initialForm = {
    id: undefined,
    name: "",
    description: "",
    price: 0,
    stock: 0,
    sku: 0,
    images: [],
};
export default function ProductList() {
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
    const filteredProducts = products.filter((p) => !!p.id && typeof p.sku === 'number' && typeof p.price === 'number');
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm({
            ...form,
            [name]: type === "number" ? Number(value) : value,
        });
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
        setForm({ ...filteredProducts[index] });
        setEditingIndex(index);
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
    return (_jsxs("div", { className: "flex flex-col md:flex-row gap-8 max-w-7xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg", children: [_jsxs("div", { className: "md:w-2/3 w-full", children: [_jsxs("div", { className: "bg-gray-800 p-6 rounded-lg shadow mb-8", children: [_jsx("h3", { className: "text-xl font-bold mb-4 text-white", children: editingIndex !== null ? "Edit Product" : "Add Product" }), _jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex gap-4", children: [_jsx("input", { name: "name", value: form.name, onChange: handleChange, placeholder: "Name", required: true, className: "flex-1 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("input", { name: "description", value: form.description, onChange: handleChange, placeholder: "Description", required: true, className: "flex-1 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { className: "flex gap-4", children: [_jsx("input", { name: "price", type: "number", value: form.price, onChange: handleChange, placeholder: "Price", required: true, min: 0, step: 0.01, className: "w-32 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("input", { name: "stock", type: "number", value: form.stock, onChange: handleChange, placeholder: "Stock", required: true, min: 0, className: "w-32 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("input", { name: "sku", type: "number", value: form.sku, onChange: handleChange, placeholder: "SKU", required: true, min: 0, className: "w-32 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { className: "flex gap-2 mt-2", children: [_jsx("button", { type: "submit", className: "bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold", children: editingIndex !== null ? "Update" : "Add" }), editingIndex !== null && (_jsx("button", { type: "button", className: "bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded font-bold", onClick: () => { setForm(initialForm); setEditingIndex(null); }, children: "Cancel" }))] })] })] }), _jsx("h2", { className: "text-2xl font-bold mb-4 text-white", children: "Product List" }), error && _jsx("div", { className: "mb-4 text-red-400 font-semibold", children: error }), loading ? (_jsx("div", { className: "text-gray-300", children: "Loading products..." })) : (_jsxs("table", { className: "w-full mb-8 text-sm text-left text-gray-400 border-separate border-spacing-y-2", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-800 text-gray-200", children: [_jsx("th", { className: "px-4 py-2", children: "Name" }), _jsx("th", { className: "px-4 py-2", children: "Description" }), _jsx("th", { className: "px-4 py-2", children: "Price" }), _jsx("th", { className: "px-4 py-2", children: "Stock" }), _jsx("th", { className: "px-4 py-2", children: "SKU" }), _jsx("th", { className: "px-4 py-2", children: "Actions" })] }) }), _jsx("tbody", { children: filteredProducts.map(({ id, name, description, price, stock, sku }, i) => (_jsxs("tr", { className: "bg-gray-800 hover:bg-gray-700 rounded-lg", children: [_jsx("td", { className: "px-4 py-2 font-semibold text-white", children: name }), _jsx("td", { className: "px-4 py-2", children: description }), _jsxs("td", { className: "px-4 py-2", children: ["$", price] }), _jsx("td", { className: "px-4 py-2", children: stock }), _jsx("td", { className: "px-4 py-2", children: sku }), _jsxs("td", { className: "px-4 py-2 flex gap-2", children: [_jsx("button", { className: "bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded", onClick: () => handleEdit(i), children: "Edit" }), _jsx("button", { className: "bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded", onClick: () => handleDelete(i), children: "Delete" })] })] }, id))) })] }))] }), _jsxs("div", { className: "md:w-1/3 w-full flex flex-col gap-8", children: [_jsxs("div", { className: "bg-gray-800 p-6 rounded-lg shadow min-h-[200px] mb-8 border-2 border-blue-200", children: [_jsx("h3", { className: "text-lg font-bold mb-2 text-blue-200", children: "Images" }), _jsxs("div", { className: "mb-4 flex items-center gap-4", children: [_jsx("input", { type: "file", accept: "image/*", ref: fileInputRef, onChange: handleImageUpload, className: "text-gray-200", disabled: uploading }), uploading && _jsx("span", { className: "text-blue-400", children: "Uploading..." })] }), _jsx("div", { className: "w-full h-64 bg-gray-900 border-2 border-blue-300 rounded flex items-center justify-center text-gray-500 mb-4 overflow-hidden", children: form.images && form.images.length > 0 ? (_jsx("img", { src: form.images[selectedImage], alt: "Selected", className: "object-contain h-full w-full" })) : (_jsx("span", { children: "No image selected" })) }), _jsx("div", { className: "flex gap-2 justify-center", children: form.images && form.images.slice(0, 5).map((img, idx) => (_jsx("img", { src: img, alt: `Thumbnail ${idx + 1}`, className: `h-16 w-16 object-cover rounded border-2 cursor-pointer ${selectedImage === idx ? 'border-blue-500' : 'border-gray-500'}`, onClick: () => setSelectedImage(idx) }, img))) })] }), _jsxs("div", { className: "bg-gray-800 p-6 rounded-lg shadow min-h-[200px] border-2 border-green-200", children: [_jsx("h3", { className: "text-lg font-bold mb-2 text-green-200", children: "Description/Add to cart (future)" }), _jsx("div", { className: "w-full h-40 bg-gray-900 border-2 border-green-300 rounded flex items-center justify-center text-gray-500", children: "Product details and add-to-cart here" })] })] })] }));
}
