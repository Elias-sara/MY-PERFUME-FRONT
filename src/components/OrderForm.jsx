import React, { useState, useEffect, useRef, forwardRef } from "react";
import { Toaster, toast } from "sonner";
import "./OrderForm.css"; // Ensure you have the relevant styles

const initialOrderState = {
  name: "",
  phone: "",
  comments: "",
  items: [],
  total: 0,
};

const OrderForm = forwardRef(({ onAddItem }, ref) => {
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState(initialOrderState);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState({
    name: "",
    phone: "",
    comments: "",
  }); // State for error messages
  const orderFormRef = useRef(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://my-perfume-backend.onrender.com/api/items");
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        const itemsData = await response.json();
        setItems(itemsData);
        console.log(itemsData); // Log the fetched items
      } catch (error) {
        console.error("Failed to fetch items:", error);
        toast.error("Failed to load items.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  const calculateTotal = () => {
    return order.items.reduce(
      (acc, item) => acc + item.item_price * item.quantity,
      0
    );
  };

  useEffect(() => {
    const total = calculateTotal();
    setOrder((prevOrder) => ({ ...prevOrder, total }));
  }, [order.items]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;
    const newMessages = { name: "", phone: "", comments: "" };

    if (!order.name) {
      newMessages.name = "Please enter your name.";
      valid = false;
    }
    if (!order.phone) {
      newMessages.phone = "Please enter your phone number.";
      valid = false;
    }
    if (!order.comments) {
      newMessages.comments = "Please enter your address.";
      valid = false;
    }

    setMessages(newMessages);

    if (!valid || order.items.length === 0) {
      return; // Stop submission if invalid or cart is empty
    }

    const orderToSubmit = {
      ...order,
      items: order.items.map((item) => ({
        food_id: item._id,
        item_name: item.item_name,
        quantity: item.quantity,
        item_price: item.item_price,
      })),
    };

    try {
      const response = await fetch("https://my-perfume-backend.onrender.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderToSubmit),
      });

      if (!response.ok) {
        throw new Error("Failed to submit order");
      }

      const newOrder = await response.json();
      console.log("Order submitted:", newOrder);
      setOrder(initialOrderState);
      toast.success("Order submitted successfully!");
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to submit order.");
    }
  };

  const addToCart = (item) => {
    setOrder((prevOrder) => {
      const existingItemIndex = prevOrder.items.findIndex(
        (i) => i._id === item._id
      );
      if (existingItemIndex > -1) {
        const updatedItems = [...prevOrder.items];
        updatedItems[existingItemIndex].quantity += 1;
        return { ...prevOrder, items: updatedItems };
      } else {
        return {
          ...prevOrder,
          items: [...prevOrder.items, { ...item, quantity: 1 }],
        };
      }
    });
    toast.success(`${item.item_name} added to cart!`);
  };

  const removeItemFromCart = (itemId) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      items: prevOrder.items.filter((item) => item._id !== itemId),
    }));
    toast.success("Item removed from cart!");
  };

  const adjustQuantity = (itemId, increment) => {
    setOrder((prevOrder) => {
      const updatedItems = prevOrder.items.map((item) => {
        if (item._id === itemId) {
          const newQuantity = item.quantity + increment;
          return { ...item, quantity: Math.max(newQuantity, 1) };
        }
        return item;
      });
      return { ...prevOrder, items: updatedItems };
    });
  };

  return (
    <div className="main-container">
      <div className="order-form-container" ref={orderFormRef}>
        <div className="order-form-content">
          <h2>MY PERFUME PURCHASE ORDER</h2>
          {loading ? (
            <p className="loading-message">Loading items...</p>
          ) : (
            <div className="item-list">
              {items.map((item) => (
                <div className="item-card" key={item._id}>
                  <img
                    src={`https://my-perfume-backend.onrender.com/${item.image.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt={item.item_name}
                    className="item-image"
                  />
                  <h3 className="item-name">{item.item_name}</h3>
                  <p className="item-price">
                    {item.item_price.toFixed(2)} Birr
                  </p>
                  <button className="btn" onClick={() => addToCart(item)}>
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="form-cart-card">
            <div className="order-form">
              <form onSubmit={handleSubmit} className="order-form">
                <div className="input-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={order.name}
                    onChange={handleChange}
                    required
                    aria-label="Your Name"
                    className="form-input"
                  />
                  {messages.name && (
                    <span className="error-message">{messages.name}</span>
                  )}
                </div>
                <div className="input-group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone"
                    value={order.phone}
                    onChange={handleChange}
                    required
                    aria-label="Your Phone"
                    className="form-input"
                  />
                  {messages.phone && (
                    <span className="error-message">{messages.phone}</span>
                  )}
                </div>
                <div className="input-group">
                  <textarea
                    name="comments"
                    placeholder="Your Address"
                    value={order.comments}
                    onChange={handleChange}
                    aria-label="Comments"
                    className="form-input"
                  />
                  {messages.comments && (
                    <span className="error-message">{messages.comments}</span>
                  )}
                </div>
              </form>
            </div>

            <div className="cart">
              <h3 className="cart-title">Cart</h3>
              {order.items.length === 0 ? (
                <p className="cart-message">
                  Please add at least one item to the cart.
                </p>
              ) : (
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index} className="cart-item">
                      <span>
                        {item.item_name} - {item.item_price.toFixed(2)} Birr x{" "}
                        {item.quantity}
                      </span>
                      <div className="cart-item-actions">
                        <button
                          className="btn adjust-btn"
                          onClick={() => adjustQuantity(item._id, 1)}
                        >
                          +
                        </button>
                        {item.quantity > 1 ? (
                          <button
                            className="btn adjust-btn"
                            onClick={() => adjustQuantity(item._id, -1)}
                          >
                            -
                          </button>
                        ) : (
                          <button
                            className="btn remove-btn"
                            onClick={() => removeItemFromCart(item._id)}
                          >
                            -
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <h3 className="cart-total">
                Total: {order.total.toFixed(2)} Birr
              </h3>
            </div>
          </div>

          <button
            type="submit"
            className="btn colorful-btn"
            onClick={handleSubmit}
          >
            Submit Order
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
});

export default OrderForm;
