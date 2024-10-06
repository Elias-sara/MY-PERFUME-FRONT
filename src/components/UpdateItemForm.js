import React, { useState, useEffect } from "react";
import './UpdateItemForm.css'; // Ensure the path is correct

const UpdateItemForm = ({ onUpdateItem, onRemoveItem }) => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemImage, setItemImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("https://my-perfume-backend.onrender.com/api/items");
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      setErrorMessage("Error fetching items. Please try again.");
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setItemName(item.item_name);
    setItemPrice(item.item_price);
    setItemImage(null); // Reset image selection
    setErrorMessage(""); // Reset error message
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!itemName || !itemPrice || itemPrice <= 0) {
      setErrorMessage("Please fill in all fields with valid values");
      return;
    }

    const formData = new FormData();
    formData.append("item_name", itemName);
    formData.append("item_price", parseFloat(itemPrice));
    if (itemImage) {
      formData.append("image", itemImage);
    }

    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch(
        `https://my-perfume-backend.onrender.com/api/items/${selectedItem._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update item");
      }

      const updatedData = await response.json();
      onUpdateItem(updatedData);
      resetForm();
      fetchItems(); // Refresh the item list
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!selectedItem) return;

    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch(
        `https://my-perfume-backend.onrender.com/api/items/${selectedItem._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      onRemoveItem(selectedItem._id);
      resetForm();
      fetchItems(); // Refresh the item list
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedItem(null);
    setItemName("");
    setItemPrice("");
    setItemImage(null);
    setErrorMessage("");
  };

  return (
    <div className="update-item-container">
      <h2>Update Item</h2>
      {loading && <p>Loading items...</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <ul>
        {items.map((item) => (
          <li
            key={item._id}
            onClick={() => handleSelectItem(item)}
            style={{
              cursor: "pointer",
              fontWeight: selectedItem?._id === item._id ? "bold" : "normal",
              backgroundColor:
                selectedItem?._id === item._id ? "#f0f0f0" : "transparent",
            }}
          >
            {item.item_name} - ${item.item_price.toFixed(2)}
          </li>
        ))}
      </ul>

      {selectedItem && (
        <form onSubmit={handleUpdate}>
          <div>
            <label>Item Name:</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>
          <div>
            <label>Item Price:</label>
            <input
              type="number"
              step="0.01"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
            />
          </div>
          <div>
            <label>Item Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setItemImage(e.target.files[0])}
            />
          </div>
          <button type="submit">Update Item</button>
          <button type="button" onClick={handleRemove}>
            Remove Item
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateItemForm;
