// src/components/Cart.js
import React from "react";
import "../styles/globals.css"; // Ensure your CSS file includes styles for the cart

const Cart = ({ cartItems, onRemove, onCheckout }) => {
  const calculateTotal = () => {
    return cartItems.reduce(
      (acc, item) => acc + (item.item_price || 0) * (item.quantity || 1),
      0
    );
  };

  return (
    <div className="cart-card">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in the cart.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.food_id}>
                <span>
                  {item.item_name} - $
                  {item.item_price ? item.item_price.toFixed(2) : "0.00"} x{" "}
                  {item.quantity || 1}
                </span>
                <button onClick={() => onRemove(item)}>Remove</button>
              </li>
            ))}
          </ul>
          <h3>Total: ${calculateTotal().toFixed(2)}</h3>
          <button onClick={onCheckout} className="checkout-button">
            Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
