import React, { useState, useEffect } from "react";

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
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);


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
  setOrderConfirmed(true);
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
              {cart.map((item) => (
                <tr key={item.productId} className="border-b border-gray-700">
                  <td className="px-2 py-1">{item.name}</td>
                  <td className="px-2 py-1">{item.quantity}</td>
                  <td className="px-2 py-1">${item.stock}</td>
                  <td className="px-2 py-1">${item.quantity * item.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {orderId && (
            <div className="text-gray-400 mt-1 text-sm">Order ID: {orderId}</div>
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
        {orderConfirmed ? (
          <div className="bg-green-900/80 border border-green-400 rounded-xl p-6 text-green-200 text-center font-bold text-xl mt-4">
            Order confirmed! Thank you for your purchase.<br />
            Order ID: {orderId}<br />
            Amount to pay: ${totalAmount}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none"
              disabled={loading || orderConfirmed}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none"
              disabled={loading || orderConfirmed}
            />
            <textarea
              name="address"
              placeholder="Shipping Address"
              value={form.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none"
              disabled={loading || orderConfirmed}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none"
              disabled={loading || orderConfirmed}
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold shadow-md"
              disabled={loading || orderConfirmed}
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Checkout;
