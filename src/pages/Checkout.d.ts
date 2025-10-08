import React from "react";
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
declare const Checkout: React.FC<CheckoutPageProps>;
export default Checkout;
