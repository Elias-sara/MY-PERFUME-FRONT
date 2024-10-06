import React from "react";
import './FoodList.css'; // Ensure the path is correct


const FoodList = ({ items, onAdd }) => {
  return (
    <div className="food-list">
      <h3>Available Items</h3>
      <div className="card-container">
        {items.map((item) => (
          <div className="card" key={item._id}>
            <img
              src={`https://my-perfume-backend.onrender.com/${item.image}`} // Ensure this path is correct
              alt={item.item_name}
              className="card-image"
            />
            <div className="card-content">
              <h4>{item.item_name}</h4>
              <p>Price: ${item.item_price.toFixed(2)}</p>
              <button
                className="add-to-cart-button"
                onClick={() => onAdd(item)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodList;
