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

const Checkout: React.FC<CheckoutPageProps> = ({ cart, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
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
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none"
          />
          <textarea
            name="address"
            placeholder="Shipping Address"
            value={form.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold shadow-md"
          >
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
