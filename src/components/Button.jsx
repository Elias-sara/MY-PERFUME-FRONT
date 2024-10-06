// src/components/Button.js
import React from "react";
import "../styles/globals.css"; // Import any necessary CSS for styling

const Button = ({ type, title, onClick }) => {
  return (
    <button type={type} onClick={onClick} className="custom-button">
      {title}
    </button>
  );
};

export default Button;
