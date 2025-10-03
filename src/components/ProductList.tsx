import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ProductDto } from "../types/ProductDto";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/productApi";

// Utility to get unique categories from all products
function getAllCategories(products: ProductDto[]): string[] {
  const set = new Set<string>();
  products.forEach(p => (p.categories || []).forEach(c => set.add(c)));
  return Array.from(set).sort();
}

const initialForm: ProductDto = {
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
  const navigate = useNavigate();
  // Remove useNavigate, use local state for view switching
  // ...existing code...
  // ...existing code...
  // Cart state: [{ productId, quantity, stock, name }]
  const [cart, setCart] = useState<{ productId: string, quantity: number, stock: number, name: string }[]>([]);
  // Quantity input for Add to Cart
  const [addQty, setAddQty] = useState(1);

  // Increase quantity in cart
  const handleIncreaseQty = async (item: { productId: string, quantity: number, stock: number, name: string }) => {
    if (item.quantity >= item.stock) return;
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.trim();
      const res = await axios.post(
        `${API_BASE_URL}/cart/add`,
        {
          productId: item.productId,
          quantity: 1 // add one more
        },
        { withCredentials: true }
      );
      setCart(res.data);
      console.log('Cart updated from backend:', res.data);
    } catch (err) {
      console.error('Failed to increase quantity:', err);
    }
  };

  // Decrease quantity in cart
  const handleDecreaseQty = async (item: { productId: string, quantity: number, stock: number, name: string }) => {
    if (item.quantity <= 1) {
      // Remove item from cart
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.trim();
        const res = await axios.post(
          `${API_BASE_URL}/cart/remove`,
          {
            productId: item.productId
          },
          { withCredentials: true }
        );
        setCart(res.data);
        console.log('Cart updated from backend:', res.data);
      } catch (err) {
        console.error('Failed to remove item:', err);
      }
    } else {
      // Decrease quantity by 1
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.trim();
        const res = await axios.post(
          `${API_BASE_URL}/cart/add`,
          {
            productId: item.productId,
            quantity: -1 // decrease by one
          },
          { withCredentials: true }
        );
        setCart(res.data);
        console.log('Cart updated from backend:', res.data);
      } catch (err) {
        console.error('Failed to decrease quantity:', err);
      }
    }
  };

  // Add to Cart handler
  const handleAddToCart = async (product: ProductDto, quantity: number) => {
    if (!product.id || typeof product.id !== 'string') return;
    const availableStock = product.stock ?? 0;
    const qtyToAdd = Math.max(1, Math.min(quantity, availableStock));
    if (qtyToAdd < 1) {
      console.log(`Cannot add ${product.name}: out of stock.`);
      return;
    }
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.trim();
      const res = await axios.post(
        `${API_BASE_URL}/cart/add`,
        {
          productId: product.id,
          quantity: qtyToAdd
        },
        { withCredentials: true }
      );
      setCart(res.data); // backend returns updated cart
      console.log('Cart updated from backend:', res.data);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };
  // Add showForm state to control add/edit form visibility
  const [showForm, setShowForm] = useState(false);
  // Category filter state (must be inside component)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [form, setForm] = useState<ProductDto>(initialForm);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

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
  let filteredProducts = products.filter(
    (p) => !!p.id && typeof p.sku === 'number' && typeof p.price === 'number'
  );
  // Filter by selected categories if any
  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter(p =>
      p.categories && selectedCategories.every(cat => p.categories.includes(cat))
    );
  }
  // All unique categories for filter UI
  const allCategories = getAllCategories(products);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  // Handle category input (comma-separated, tag style)
  const handleCategoryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Split by comma, trim, remove empty
    const categories = value.split(',').map(c => c.trim()).filter(Boolean);
    setForm({ ...form, categories });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingIndex !== null) {
        const productToUpdate = filteredProducts[editingIndex];
        if (!productToUpdate.id) throw new Error("Product id is missing");
        await updateProduct(productToUpdate.id, form);
        // Update by id so we don't rely on filtered index matching the original array
        setProducts((prev) =>
          prev.map((p) => (p.id === productToUpdate.id ? { ...form, id: productToUpdate.id } : p))
        );
        setEditingIndex(null);
      } else {
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
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEdit = (index: number) => {
    const product = filteredProducts[index];
    setForm({ ...product, images: product.images ?? [] });
    setEditingIndex(index);
    setSelectedImage(0);
    // Ensure the edit form is visible when clicking Edit
    setShowForm(true);
  };

  // When a row is clicked, show its images in the gallery (but do not enter edit mode)
  const handleRowClick = (index: number) => {
    const product = filteredProducts[index];
    setForm({ ...product, images: product.images ?? [] });
    setEditingIndex(null);
    setSelectedImage(0);
  };

  const handleDelete = async (index: number) => {
    const productToDelete = filteredProducts[index];
    if (!productToDelete.id) {
      setError("Product id is missing");
      return;
    }
    const confirmed = window.confirm(`Are you sure you want to delete the product: "${productToDelete.name}"?`);
    if (!confirmed) return;
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
          } catch {
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
          } catch (e) {
            // swallow individual image delete errors - we'll continue with product deletion
            console.warn('Image delete (best-effort) failed for', imgUrl, e);
          }
        }));
      }

      await deleteProduct(productToDelete.id);
      // Remove by id (safer than index because filteredProducts may be a subset)
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
    } catch (e: any) {
      setError(e.message);
    }
  };

  // Images state (uploaded + demo)
  const [selectedImage, setSelectedImage] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload image to backend (Azure Blob)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.trim();
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
  // Use /image/upload (API_BASE_URL already includes /api)
  const res = await fetch(`${API_BASE_URL}/image/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Image upload failed");
      const data = await res.json();
      setForm((prev) => ({
        ...prev,
        images: [data.url, ...(prev.images || [])],
      }));
      setSelectedImage(0);
    } catch (err: any) {
      setError(err.message || "Image upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Delete image from blob storage using backend endpoint
  const handleImageDelete = async (url?: string) => {
    const targetUrl = url ?? form.images?.[selectedImage];
    if (!targetUrl) return;
    try {
      // Confirm with the user before deleting
      const ok = window.confirm('Are you sure you want to delete this image?');
      if (!ok) return;
      // robust filename extraction: prefer URL parsing, fallback to naive split
      let fileName = "";
      try {
        const urlObj = new URL(targetUrl);
        const path = urlObj.pathname || targetUrl;
        const last = path.split('/').pop() || '';
        fileName = decodeURIComponent(last.replace(/\/$/, ''));
      } catch {
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
        return { ...prev, images: imgs } as ProductDto;
      });
      // adjust selectedImage index
      setSelectedImage(s => Math.max(0, s - 1));
    } catch (err: any) {
      setError(err.message || 'Image delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 px-2">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-8 tracking-tight drop-shadow-lg">Product Management</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Add Product & Product List */}
          <div className="md:w-2/3 w-full flex flex-col gap-8">
            {/* Add Product Button at top */}
            {editingIndex === null && (
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all duration-150 mb-4"
                onClick={() => {
                  setEditingIndex(null);
                  setForm(initialForm);
                  setShowForm(true);
                }}
              >
                Add Product
              </button>
            )}
            {/* Add Product Form (only show when showForm is true) */}
            {showForm && (
              <div className="bg-gray-800/90 p-8 rounded-2xl shadow-xl border border-gray-700 mb-2">
                <h3 className="text-2xl font-bold mb-6 text-blue-200 tracking-wide flex items-center gap-2">
                  {editingIndex !== null ? (
                    <span className="inline-block bg-blue-700/30 px-3 py-1 rounded-full text-blue-300 text-base font-semibold">Edit Product</span>
                  ) : (
                    <span className="inline-block bg-green-700/30 px-3 py-1 rounded-full text-green-300 text-base font-semibold">Add Product</span>
                  )}
                </h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Name"
                      required
                      className="flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                    />
                    <input
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Description"
                      required
                      className="flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <input
                      name="categories"
                      value={form.categories.join(', ')}
                      onChange={handleCategoryInput}
                      placeholder="Categories (comma separated, e.g. Electronics, Home)"
                      required
                      className="flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <input
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="Price"
                      required
                      min={0}
                      step={0.01}
                      className="w-full md:w-32 px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                    />
                    <input
                      name="stock"
                      type="number"
                      value={form.stock}
                      onChange={handleChange}
                      placeholder="Stock"
                      required
                      min={0}
                      className="w-full md:w-32 px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                    />
                    <input
                      name="sku"
                      type="number"
                      value={form.sku}
                      onChange={handleChange}
                      placeholder="SKU"
                      required
                      min={0}
                      className="w-full md:w-32 px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                    />
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-bold shadow-md transition-all duration-150"
                    >
                      {editingIndex !== null ? "Update" : "Add"}
                    </button>
                    <button
                      type="button"
                      className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-2 rounded-lg font-bold shadow-md transition-all duration-150"
                      onClick={() => { setForm(initialForm); setEditingIndex(null); setShowForm(false); }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            {/* Category Filter UI */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-gray-300 font-semibold mr-2">Filter by Category:</span>
                {allCategories.length === 0 && (
                  <span className="text-gray-400">No categories available</span>
                )}
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`px-3 py-1 rounded-full border text-sm font-medium transition-all
                      ${selectedCategories.includes(cat)
                        ? 'bg-blue-600 text-white border-blue-400 shadow'
                        : 'bg-gray-700 text-gray-200 border-gray-500 hover:bg-blue-800 hover:text-white'}`}
                    onClick={() => {
                      setSelectedCategories((prev) =>
                        prev.includes(cat)
                          ? prev.filter((c) => c !== cat)
                          : [...prev, cat]
                      );
                    }}
                  >
                    {cat}
                  </button>
                ))}
                {selectedCategories.length > 0 && (
                  <button
                    type="button"
                    className="ml-2 px-2 py-1 rounded bg-gray-600 text-white text-xs border border-gray-400 hover:bg-gray-700"
                    onClick={() => setSelectedCategories([])}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            {/* Product List Table */}
            <div className="bg-gray-800/90 p-6 rounded-2xl shadow-xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-white tracking-wide">Product List</h2>
              {error && <div className="mb-4 text-red-400 font-semibold">{error}</div>}
              {loading ? (
                <div className="text-gray-300">Loading products...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full mb-4 text-sm text-left text-gray-300 border-separate border-spacing-y-2">
                    <thead>
                      <tr className="bg-gray-700 text-gray-200">
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Description</th>
                        <th className="px-4 py-2">Categories</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2">Stock</th>
                        <th className="px-4 py-2">SKU</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(({ id, name, description, categories = [], price, stock, sku }, i) => (
                        <tr
                          key={id}
                          className="bg-gray-800 hover:bg-blue-900/60 rounded-lg cursor-pointer transition-all duration-100 group"
                          onClick={() => handleRowClick(i)}
                        >
                          <td className="px-4 py-2 font-semibold text-white group-hover:text-blue-300 transition-all">{name}</td>
                          <td className="px-4 py-2">{description}</td>
                          <td className="px-4 py-2">
                            {categories.length === 0 ? (
                              <span className="text-gray-400 italic">None</span>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {categories.map((cat) => (
                                  <span key={cat} className="bg-blue-700/70 text-blue-100 px-2 py-0.5 rounded-full text-xs font-semibold border border-blue-400">
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-2">${price}</td>
                          <td className="px-4 py-2">{stock}</td>
                          <td className="px-4 py-2">{sku}</td>
                          <td className="px-4 py-2 flex gap-2" onClick={e => e.stopPropagation()}>
                            <button
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow transition-all"
                              onClick={() => handleEdit(i)}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow transition-all"
                              onClick={() => handleDelete(i)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          {/* Right: Images/Description placeholder for future */}
          <div className="md:w-1/3 w-full flex flex-col gap-8">
            <div className="bg-gradient-to-br from-blue-900/80 to-blue-700/60 p-6 rounded-2xl shadow-xl border-2 border-blue-300 min-h-[300px] flex flex-col items-center">
              <h3 className="text-lg font-bold mb-4 text-blue-100 tracking-wide">Images</h3>
              {/* Upload button (only show when adding or editing) */}
              {(editingIndex !== null || form === initialForm) && (
                <div className="mb-4 flex items-center gap-4 w-full justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="text-gray-200 file:bg-blue-700 file:text-white file:rounded file:px-3 file:py-1 file:mr-2 file:border-none"
                    disabled={uploading}
                  />
                  <button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow transition-all"
                    onClick={() => handleImageDelete()}
                    disabled={uploading || !(form.images && form.images.length > 0)}
                  >
                    Delete Image
                  </button>
                  {uploading && <span className="text-blue-200 animate-pulse">Uploading...</span>}
                </div>
              )}
              {/* Big image */}
              <div className="w-full h-64 bg-gray-900 border-2 border-blue-400 rounded-xl flex items-center justify-center text-gray-400 mb-4 overflow-hidden shadow-lg">
                {(() => { console.log('form.images', form.images); return null; })()}
                {form.images && form.images.length > 0 ? (
                  <img src={form.images[selectedImage]} alt="Selected" className="object-contain h-full w-full transition-all duration-200" />
                ) : (
                  <span>No image selected</span>
                )}
              </div>
              {/* Thumbnails */}
              <div className="flex gap-2 justify-center">
                {form.images && form.images.slice(0, 5).map((img, idx) => (
                  <img
                    key={img}
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className={`h-16 w-16 object-cover rounded-lg border-2 cursor-pointer shadow transition-all duration-150 ${selectedImage === idx ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-500'}`}
                    onClick={() => setSelectedImage(idx)}
                  />
                ))}
              </div>
            </div>
            {/* Description window */}
            <div className="bg-gradient-to-br from-green-900/80 to-green-700/60 p-6 rounded-2xl shadow-xl border-2 border-green-300 min-h-[120px] mb-4">
              <h3 className="text-lg font-bold mb-2 text-green-100 tracking-wide">Description</h3>
              <div className="w-full h-24 bg-gray-900 border-2 border-green-400 rounded-xl flex items-center justify-center text-gray-400">
                Product details here
              </div>
            </div>
            {/* Add to cart window */}
            <div className="bg-gradient-to-br from-yellow-900/80 to-yellow-700/60 p-6 rounded-2xl shadow-xl border-2 border-yellow-300 min-h-[120px]">
              <h3 className="text-lg font-bold mb-2 text-yellow-100 tracking-wide">Add to cart</h3>
              <div className="w-full h-24 bg-gray-900 border-2 border-yellow-400 rounded-xl flex flex-col items-center justify-center text-gray-400">
                {/* Add to Cart button for selected product (if any) */}
                {form && form.id ? (
                  <div className="flex flex-col items-center gap-2 w-full">
                    <div className="flex items-center gap-2">
                      <label htmlFor="addQty" className="text-yellow-200 font-semibold">Qty:</label>
                      <input
                        id="addQty"
                        type="number"
                        min={1}
                        max={form.stock ?? 1}
                        value={addQty}
                        onChange={e => setAddQty(Math.max(1, Math.min(Number(e.target.value), form.stock ?? 1)))}
                        className="w-16 px-2 py-1 rounded bg-gray-800 text-yellow-100 border border-yellow-400 text-center"
                        disabled={form.stock === 0}
                      />
                      <span className="text-yellow-300 text-xs">/ {form.stock ?? 0} in stock</span>
                    </div>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-6 py-2 rounded-lg shadow transition-all"
                      onClick={() => handleAddToCart(form, addQty)}
                      disabled={form.stock === 0}
                    >
                      Add to Cart
                    </button>
                  </div>
                ) : (
                  <span>Select a product to add to cart</span>
                )}
              </div>
            </div>

            {/* Cart List */}
            <div className="mt-2 bg-gray-900/80 rounded-xl p-4 border border-gray-700">
              <h3 className="text-lg font-bold text-yellow-200 mb-2">Cart</h3>
              {/* Show cart or 'Cart is empty' */}
              {cart.length === 0 ? (
                <div className="text-gray-400">Cart is empty.</div>
              ) : (
                <>
                  <ul className="divide-y divide-gray-700">
                    {cart.map(item => (
                      <li key={item.productId} className="py-2 flex justify-between items-center">
                        <span className="text-white">{item.name}</span>
                        <span className="text-gray-300">Qty: {item.quantity} / Stock: {item.stock}</span>
                        <div className="flex gap-2 ml-4">
                          <button
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded"
                            onClick={() => handleDecreaseQty(item)}
                            disabled={item.quantity <= 0}
                          >-</button>
                          <button
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded"
                            onClick={() => handleIncreaseQty(item)}
                            disabled={item.quantity >= item.stock}
                          >+</button>
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                            onClick={async () => {
                              try {
                                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.trim();
                                const res = await axios.post(
                                  `${API_BASE_URL}/cart/remove`,
                                  { productId: item.productId },
                                  { withCredentials: true }
                                );
                                setCart(res.data);
                                console.log('Cart updated from backend:', res.data);
                              } catch (err) {
                                console.error('Failed to remove item:', err);
                              }
                            }}
                          >Remove</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {/* Single Checkout button for the whole cart */}
                  <button
                    className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow transition-all"
                    onClick={async () => {
                      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.trim();
                      try {
                        console.debug("[Cart] Reserving stock before checkout...");
                        const reserveRes = await axios.post(
                          `${API_BASE_URL}/cart/reserve`,
                          {},
                          { withCredentials: true }
                        );
                        console.debug("[Cart] Reserve response:", reserveRes);
                        if (reserveRes.status !== 200) {
                          console.error("[Cart] Stock reservation failed", reserveRes);
                          throw new Error("Stock reservation failed");
                        }
                        console.debug("[Cart] Stock reserved successfully, navigating to checkout.");
                        navigate("/product/checkout");
                      } catch (err) {
                        const error = err as any;
                        console.error("[Cart] Error reserving stock:", error);
                        alert(error?.response?.data?.message || error?.message || "Unknown error");
                      }
                    }}
                  >Checkout</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
