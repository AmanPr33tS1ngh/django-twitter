import React from "react";
import { Search } from "@chatscope/chat-ui-kit-react";

const Input = ({
  placeholder,
  onChange,
  value,
  name,
  className = " w-full",
  onClear = () => {},
  disabled = false,
  viewType = "custom",
  type = "text",
}) => {
  return viewType === "custom" ? (
    <input
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      className={`p-2 rounded-lg bg-gray-200 my-2 mx-auto ${className}`}
      name={name}
      type={type}
      disabled={disabled}
    />
  ) : (
    <Search
      className={`p-2 rounded-lg bg-gray-200 my-2 mx-auto ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type={type}
      onClearClick={onClear}
      disabled={disabled}
    />
  );
};

export default Input;
