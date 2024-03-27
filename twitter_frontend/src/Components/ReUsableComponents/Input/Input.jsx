import React from "react";
import {Search} from "@chatscope/chat-ui-kit-react";

const Input = ({
  placeholder,
  onChange,
  value,
    name,
  className = " w-full",
  onClear=()=>{},
  disabled = false,
    type='custom',
}) => {
  return (
   type === 'custom' ? <input
      id={"input"}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      className={`p-2 rounded-lg bg-gray-200 my-2 mx-auto ${className}`}
      name={name}
      disabled={disabled}
    />: <Search
        className={`p-2 rounded-lg bg-gray-200 my-2 mx-auto ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onClearClick={onClear}
        disabled={disabled}
    />

  );
};

export default Input;
