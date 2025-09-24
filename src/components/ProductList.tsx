import React, { useEffect, useState, useRef } from "react";
import { ProductDto } from "../types/ProductDto";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/productApi";

const initialForm: ProductDto = {
  id: undefined,
  name: "",
  description: "",
  price: 0,
  stock: 0,
  sku: 0,
  images: [],
};

export default function ProductList() {
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
  const filteredProducts = products.filter(
    (p) => !!p.id && typeof p.sku === 'number' && typeof p.price === 'number'
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingIndex !== null) {
        const productToUpdate = filteredProducts[editingIndex];
        if (!productToUpdate.id) throw new Error("Product id is missing");
        await updateProduct(productToUpdate.id, form);
        setProducts((prev) =>
          prev.map((p, i) => (i === editingIndex ? { ...form, id: productToUpdate.id } : p))
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
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEdit = (index: number) => {
    setForm({ ...filteredProducts[index] });
    setEditingIndex(index);
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
      await deleteProduct(productToDelete.id);
      setProducts((prev) => prev.filter((_, i) => i !== index));
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

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
      {/* Left: Add Product & Product List */}
      <div className="md:w-2/3 w-full">
        {/* Add Product Form */}
        <div className="bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h3 className="text-xl font-bold mb-4 text-white">{editingIndex !== null ? "Edit Product" : "Add Product"}</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="flex-1 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                required
                className="flex-1 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                required
                min={0}
                step={0.01}
                className="w-32 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock"
                required
                min={0}
                className="w-32 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="sku"
                type="number"
                value={form.sku}
                onChange={handleChange}
                placeholder="SKU"
                required
                min={0}
                className="w-32 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold"
              >
                {editingIndex !== null ? "Update" : "Add"}
              </button>
              {editingIndex !== null && (
                <button
                  type="button"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded font-bold"
                  onClick={() => { setForm(initialForm); setEditingIndex(null); }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        {/* Product List Table */}
        <h2 className="text-2xl font-bold mb-4 text-white">Product List</h2>
        {error && <div className="mb-4 text-red-400 font-semibold">{error}</div>}
        {loading ? (
          <div className="text-gray-300">Loading products...</div>
        ) : (
          <table className="w-full mb-8 text-sm text-left text-gray-400 border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-gray-800 text-gray-200">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Stock</th>
                <th className="px-4 py-2">SKU</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(({ id, name, description, price, stock, sku }, i) => (
                <tr key={id} className="bg-gray-800 hover:bg-gray-700 rounded-lg">
                  <td className="px-4 py-2 font-semibold text-white">{name}</td>
                  <td className="px-4 py-2">{description}</td>
                  <td className="px-4 py-2">${price}</td>
                  <td className="px-4 py-2">{stock}</td>
                  <td className="px-4 py-2">{sku}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      onClick={() => handleEdit(i)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(i)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Right: Images/Description placeholder for future */}
      <div className="md:w-1/3 w-full flex flex-col gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow min-h-[200px] mb-8 border-2 border-blue-200">
          <h3 className="text-lg font-bold mb-2 text-blue-200">Images</h3>
          {/* Upload button */}
          <div className="mb-4 flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="text-gray-200"
              disabled={uploading}
            />
            {uploading && <span className="text-blue-400">Uploading...</span>}
          </div>
          {/* Big image */}
          <div className="w-full h-64 bg-gray-900 border-2 border-blue-300 rounded flex items-center justify-center text-gray-500 mb-4 overflow-hidden">
            {form.images && form.images.length > 0 ? (
              <img src={form.images[selectedImage]} alt="Selected" className="object-contain h-full w-full" />
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
                className={`h-16 w-16 object-cover rounded border-2 cursor-pointer ${selectedImage === idx ? 'border-blue-500' : 'border-gray-500'}`}
                onClick={() => setSelectedImage(idx)}
              />
            ))}
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow min-h-[200px] border-2 border-green-200">
          <h3 className="text-lg font-bold mb-2 text-green-200">Description/Add to cart (future)</h3>
          <div className="w-full h-40 bg-gray-900 border-2 border-green-300 rounded flex items-center justify-center text-gray-500">
            Product details and add-to-cart here
          </div>
        </div>
      </div>
    </div>
  );
}
