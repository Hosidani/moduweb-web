import React, { useState } from "react";

export interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  stock: number;
}

export interface CheckoutPageProps {
  cart: CartItem[];
  onSubmit: (buyerInfo: {
    name: string;
    email: string;
    address: string;
    phone: string;
  }) => void;
}


import axios from "axios";

const Checkout: React.FC<CheckoutPageProps> = ({ cart, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: ""
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.trim();
      // 1. Reserve stock
      const reserveRes = await axios.post(
        `${API_BASE_URL}/cart/reserve`,
        {},
        { withCredentials: true }
      );
      if (reserveRes.status !== 200) {
        throw new Error("Stock reservation failed");
      }
      // 2. Proceed to checkout
      const checkoutRes = await axios.post(
        `${API_BASE_URL}/cart/checkout`,
        {
          name: form.name,
          email: form.email,
          address: form.address,
          phone: form.phone
        },
        { withCredentials: true }
      );
      if (checkoutRes.status !== 200) {
        throw new Error("Checkout failed");
      }
      onSubmit(form);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 px-4 flex justify-center">
      <div className="max-w-2xl w-full bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-6">Checkout</h1>
        {/* Cart summary */}
        <div className="mb-6 text-gray-200">
          <h2 className="text-xl font-semibold mb-2">Your Cart</h2>
          {cart.map((item) => (
            <div key={item.productId} className="flex justify-between border-b border-gray-700 py-2">
              <span>{item.name} x {item.quantity}</span>
              <span>Stock: {item.stock}</span>
            </div>
          ))}
          <div className="font-bold mt-2">
            Total Items: {cart.reduce((sum, i) => sum + i.quantity, 0)}
          </div>
        </div>
        {/* Error message */}
        {error && <div className="mb-4 text-red-400 font-semibold">{error}</div>}
        {/* Buyer information form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none"
            disabled={loading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none"
            disabled={loading}
          />
          <textarea
            name="address"
            placeholder="Shipping Address"
            value={form.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none"
            disabled={loading}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold shadow-md"
            disabled={loading}
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
