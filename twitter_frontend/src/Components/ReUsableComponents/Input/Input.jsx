import React from "react";

const Input = ({
  placeholder,
  onChange,
  value,
  className = " w-full",
  name,
  disabled = false,
}) => {
  return (
    <input
      id={"input"}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      className={`p-2 rounded-lg bg-gray-200 my-2 mx-auto ${className}`}
      name={name}
      disabled={disabled}
    />
  );
};

export default Input;
