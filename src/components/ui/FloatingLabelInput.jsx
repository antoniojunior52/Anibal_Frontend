import React, { useState } from 'react';

// Input onde o texto do rótulo (label) "flutua" para cima quando o campo é focado
const FloatingLabelInput = ({ id, label, type = 'text', value, onChange, required = false, className = '' }) => {
  const [isFocused, setIsFocused] = useState(false);

  // Verifica se o label deve ficar "flutuando" (no topo).
  // Isso acontece se: o campo está focado, OU tem algum texto digitado, OU é um campo de data.
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
        // placeholder vazio é necessário para o seletor CSS :placeholder-shown funcionar
        className="block w-full px-3 py-2 mt-1 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-[#4455a3] focus:border-transparent
                   peer transition-all duration-200 ease-in-out"
        placeholder="" 
      />
      <label
        htmlFor={id}
        // Aplica classes condicionais: se 'shouldFloat' for true, joga o label para cima e diminui a fonte
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