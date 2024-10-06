import React, { useEffect, useState } from "react";
import "./orderList.css";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedDate, setSelectedDate] = useState(""); // New state for date filtering

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://my-perfume-backend.onrender.com/api/orders");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched orders:", data); // Log fetched data
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const matchesName = order.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDate = selectedDate
        ? order.createdAt.startsWith(selectedDate) // Compare raw date strings
        : true;
      return matchesName && matchesDate;
    });
    setFilteredOrders(filtered);
  }, [searchTerm, selectedDate, orders]);

  const handleSort = () => {
    const sorted = [...filteredOrders].sort((a, b) => {
      return sortOrder === "asc" ? a.total - b.total : b.total - a.total;
    });
    setFilteredOrders(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleRemove = async (orderId) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this order?"
    );
    if (confirmRemove) {
      try {
        const response = await fetch(
          `https://my-perfume-backend.onrender.com/api/orders/${orderId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to remove the order");
        }

        // Remove the order from the local state
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
        setFilteredOrders((prevFiltered) =>
          prevFiltered.filter((order) => order._id !== orderId)
        );

        alert("Order removed successfully!");
      } catch (error) {
        console.error("Error removing order:", error);
        alert("Failed to remove the order.");
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="order-list-container">
      <h2>Order List</h2>
      <div className="order-search">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button className="custom-sort-button" onClick={handleSort}>
          Sort by Total {sortOrder === "asc" ? "↑" : "↓"}
        </button>
      </div>
      <div className="table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>No</th>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Total</th>
              <th>Date</th>
              <th>Time</th>
              <th>Comments</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, index) => (
                <React.Fragment key={order._id}>
                  <tr>
                    <td>{index + 1}</td>
                    <td>{order._id}</td>
                    <td>{order.name}</td>
                    <td>{order.phone}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{formatTime(order.createdAt)}</td>
                    <td>{order.comments}</td>
                    <td>
                      <button
                        className="remove-button"
                        onClick={() => handleRemove(order._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                  {order.items.map((item, itemIndex) => (
                    <tr key={item.food_id}>
                      <td colSpan="8" style={{ textAlign: "left" }}>
                        <strong>{item.item_name}</strong> - Qty: {item.quantity}{" "}
                        - Price: ${item.item_price.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderList;
