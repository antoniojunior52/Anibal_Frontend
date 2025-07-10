// components/ui/FloatingLabelInput.jsx
import React, { useState } from 'react';

const FloatingLabelInput = ({ id, label, type = 'text', value, onChange, required = false, className = '' }) => {
  const [isFocused, setIsFocused] = useState(false);

  // Determine if the label should be "floated" (moved up)
  // For date inputs, the value is often a string even if no date is picked,
  // so we check for actual content or if it's a date type.
  const shouldFloat = isFocused || (value && value.toString().length > 0) || type === 'date';

  return (
    <div className={`relative w-full ${className}`}>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        // Tailwind classes for the input field
        className="block w-full px-3 py-2 mt-1 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-[#4455a3] focus:border-transparent
                   peer transition-all duration-200 ease-in-out"
        placeholder="" // Important for peer-placeholder-shown to work
      />
      <label
        htmlFor={id}
        // Tailwind classes for the floating label
        className={`absolute left-3 text-gray-500 transition-all duration-200 ease-in-out cursor-text
                   ${shouldFloat ? 'top-[-10px] text-xs text-[#4455a3] bg-white px-1' : 'top-2 text-base'}
                   peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[#4455a3] peer-focus:bg-white peer-focus:px-1
                   peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500`}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingLabelInput;
