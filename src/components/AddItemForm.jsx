// src/components/AddItemForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AddItemForm.css'; // Ensure the path is correct

const AddItemForm = ({ onAddItem }) => {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemImage, setItemImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!itemName || !itemPrice || !itemImage) {
      alert("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("item_name", itemName);
    formData.append("item_price", parseFloat(itemPrice));
    formData.append("image", itemImage);

    console.log("Form Data:", {
      item_name: itemName,
      item_price: parseFloat(itemPrice),
      image: itemImage,
    });

    try {
      const response = await fetch("https://my-perfume-backend.onrender.com/api/items", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add item");
      }

      const newItem = await response.json();
      onAddItem(newItem);

      // Redirect back to the order form
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-item-form">
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
      <button type="submit">Add Item</button>
    </form>
  );
};

export default AddItemForm;
