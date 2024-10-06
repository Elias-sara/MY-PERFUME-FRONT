// src/components/Card.js
import React from "react";
import "../styles/globals.css"; // Make sure this includes updated styles for horizontal card
import Button from "./Button"; // Assuming you have a Button component for the Add to Cart button

function Card({ food, onAdd }) {
  if (!food) {
    return <div className="card">Loading...</div>;
  }

  return (
    <div className="card-horizontal">
      <img
        src={food.image}
        alt={food.title || "No image"}
        className="food-image-horizontal"
      />
      <div className="card-content">
        <h3 className="food-title">{food.title || "Item name unavailable"}</h3>
        <p className="food-price">
          Price: ${food.price ? food.price.toFixed(2) : "N/A"}
        </p>
        <Button type="add" title="Add to Cart" onClick={() => onAdd(food)} />
      </div>
    </div>
  );
}

export default Card;
