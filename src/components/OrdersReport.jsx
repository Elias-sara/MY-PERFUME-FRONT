import React, { useEffect, useState } from "react";
import "./OrdersReport.css"; // Import the CSS file
import Pagination from "./Pagination"; // Import the Pagination component

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

function OrdersReport() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ name: "", date: "" });
  const [sortConfig, setSortConfig] = useState({
    key: "total",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://my-perfume-backend.onrender.com/api/orders");
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredOrders = orders.filter((order) => {
    const matchesName = order.name
      .toLowerCase()
      .includes(filters.name.toLowerCase());
    const matchesDate = filters.date
      ? order.createdAt.startsWith(filters.date) // Compare raw date strings
      : true;
    return matchesName && matchesDate;
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortConfig.direction === "asc") {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    } else {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
  });

  const currentOrders = sortedOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);

  const exportToCSV = () => {
    const csvRows = [];
    const headers = [
      "ID",
      "Name",
      "Phone",
      "Total",
      "Date",
      "Time",
      "Comments",
      "Item ID",
      "Item Name",
      "Qty",
      "Price",
    ];
    csvRows.push(headers.join(","));

    // Use filteredOrders to include only filtered data in the export
    const ordersToExport =
      filters.name || filters.date ? filteredOrders : orders;

    ordersToExport.forEach((order) => {
      order.items.forEach((item) => {
        const row = [
          order._id,
          order.name,
          order.phone,
          order.total.toFixed(2),
          formatDate(order.createdAt),
          formatTime(order.createdAt),
          order.comments,
          item.food_id,
          item.item_name,
          item.quantity,
          item.item_price.toFixed(2),
        ];
        csvRows.push(row.join(","));
      });
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "orders_report.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="orders-report-container">
      <h2 className="report-title">Orders Report</h2>
      <h3 className="total-sales">
        Total Sales: $
        {orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
      </h3>

      <div className="filter-container">
        <input
          type="text"
          name="name"
          placeholder="Filter by Name"
          value={filters.name}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          className="filter-input"
        />
      </div>

      <div className="report-table-container">
        <table className="orders-report-table">
          <thead>
            <tr>
              <th>No</th>
              <th onClick={() => requestSort("_id")}>ID</th>
              <th onClick={() => requestSort("name")}>Name</th>
              <th onClick={() => requestSort("phone")}>Phone</th>
              <th onClick={() => requestSort("total")}>Total</th>
              <th onClick={() => requestSort("createdAt")}>Date</th>
              <th onClick={() => requestSort("createdAt")}>Time</th>
              <th>Comments</th>
              <th>Item ID</th>
              <th>Item Name</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, index) => (
              <React.Fragment key={order._id}>
                <tr>
                  <td>{(currentPage - 1) * ordersPerPage + index + 1}</td>
                  <td>{order._id}</td>
                  <td>{order.name}</td>
                  <td>{order.phone}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{formatTime(order.createdAt)}</td>
                  <td>{order.comments}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                {order.items.map((item) => (
                  <tr key={item.food_id}>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{item.food_id}</td>
                    <td>{item.item_name}</td>
                    <td>{item.quantity}</td>
                    <td>${item.item_price.toFixed(2)}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      <button onClick={exportToCSV} className="export-button">
        Export to CSV
      </button>
    </div>
  );
}

export default OrdersReport;
