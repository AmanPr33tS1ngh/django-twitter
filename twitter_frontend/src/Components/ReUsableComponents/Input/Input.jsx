import React from "react";
import "./Input.css";

const Input = ({
  placeholder,
  onChange,
  value,
  className = "",
  name,
  disabled = false,
}) => {
  return (
    <input
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      className={className}
      id="input"
      name={name}
      disabled={disabled}
    />
  );
};

export default Input;
