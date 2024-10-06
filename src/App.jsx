import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import OrderForm from "./components/OrderForm";
import OrderList from "./components/OrderList";
import OrdersReport from "./components/OrdersReport";
import AddItemForm from "./components/AddItemForm";
import UpdateItemForm from "./components/UpdateItemForm";
import FoodList from "./components/FoodList";
import "./styles/globals.css";

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const fetchItems = async () => {
    try {
      const response = await fetch("https://my-perfume-backend.onrender.com/api/items");
      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = (newItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const updateItem = (updatedItem) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === updatedItem._id ? updatedItem : item
      )
    );
  };

  const removeItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  const getCurrentPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Order Form";
      case "/order":
        return "Order List";
      case "/report":
        return "Orders Report";
      case "/add":
        return "Add Item";
      case "/list":
        return "Food List";
      case "/update":
        return "Update Item";
      default:
        return "Order Management System";
    }
  };

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center text-lg">Error: {error}</div>
    );
  }

  return (
    <div className="p-4">
      {/* Conditionally render the header and nav only if not on the OrderForm */}
      {location.pathname !== "/" && (
        <header>
          <h1 className="text-2xl font-bold">{getCurrentPageTitle()}</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link to="/">Order Form</Link>
              </li>
              <li>
                <Link to="/order">Order List</Link>
              </li>
              <li>
                <Link to="/report">Orders Report</Link>
              </li>
              <li>
                <Link to="/add">Add Item</Link>
              </li>
              <li>
                <Link to="/update">Update Item</Link>
              </li>
              <li>
                <Link to="/list">Food List</Link>
              </li>
            </ul>
          </nav>
        </header>
      )}

      <Routes>
        <Route path="/" element={<OrderForm items={items} />} />
        <Route
          path="/order"
          element={<OrderList items={items} onRemoveItem={removeItem} />}
        />
        <Route path="/report" element={<OrdersReport />} />
        <Route path="/add" element={<AddItemForm onAddItem={addItem} />} />
        <Route path="/list" element={<FoodList items={items} />} />
        <Route
          path="/update"
          element={
            <UpdateItemForm
              items={items}
              onUpdateItem={updateItem}
              onRemoveItem={removeItem}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
