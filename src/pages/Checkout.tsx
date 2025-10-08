import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  stock: number;
  price: number;
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

const Checkout: React.FC<CheckoutPageProps> = ({ onSubmit }) => {
  const location = useLocation();
  const [cart] = useState<CartItem[]>(location.state?.cart || []);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: ""
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);



  // Kör checkout automatiskt när sidan visas
  useEffect(() => {
    const doCheckout = async () => {
      setError("");
      setLoading(true);
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.trim();
        console.debug("[Checkout] Automatic checkout...");
        const checkoutRes = await axios.post(
          `${API_BASE_URL}/cart/checkout`,
          {},
          { withCredentials: true }
        );
        console.debug("[Checkout] Checkout response:", checkoutRes);
        if (checkoutRes.status !== 200) {
          throw new Error("Checkout failed");
        }
        setTotalAmount(checkoutRes.data?.totalAmount ?? null);
        setOrderId(checkoutRes.data?.orderId ?? null);
        // setOrderConfirmed(true); // Flytta till betalningsformulär
      } catch (err: any) {
        console.error("[Checkout] Error:", err);
        const errorMsg = err?.response?.data?.error || err.message || "Unknown error";
        setError(errorMsg);
        alert(errorMsg);
      } finally {
        setLoading(false);
        console.debug("[Checkout] Done.");
      }
    };
    doCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // handleSubmit kan nu bara hantera betalningsinfo, inte checkout
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Här kan du lägga logik för betalning, men checkout är redan gjord
    console.debug("[Checkout] Payment submitted", form, cart);
    // Integrera betalningsprovider här
    onSubmit(form);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 px-4 flex justify-center">
      <div className="max-w-2xl w-full bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-6">Checkout</h1>
        {/* Order/Cart summary */}
        <div className="mb-6 text-gray-200">
          <h2 className="text-xl font-semibold mb-2">Order List</h2>
          {/* Product summary table */}
          <table className="w-full text-left mb-2">
            <thead>
              <tr className="bg-gray-700 text-gray-200">
                <th className="px-2 py-1">Product</th>
                <th className="px-2 py-1">Quantity</th>
                <th className="px-2 py-1">Price</th>
                <th className="px-2 py-1">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item: CartItem) => (
                <tr key={item.productId} className="border-b border-gray-700">
                  <td className="px-2 py-1">{item.name}</td>
                  <td className="px-2 py-1">{item.quantity}</td>
                  <td className="px-2 py-1">${item.price}</td>
                  <td className="px-2 py-1">${item.quantity * item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {orderId && (
            <div className="text-gray-400 mt-1 text-sm">Order nummer: {orderId}</div>
          )}
          {totalAmount !== null && (
            <div className="font-bold text-green-400 mt-2 text-lg">
              Amount to pay: ${totalAmount}
            </div>
          )}
        </div>
  {/* Error message (only show if no orderId) */}
  {error && !orderId && <div className="mb-4 text-red-400 font-semibold">{error}</div>}
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
          {/* Payment provider SDK integration goes here */}
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
