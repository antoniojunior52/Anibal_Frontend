import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, placeholder = "Pesquisar...", id }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="relative flex items-center w-full max-w-xs" role="search">
      <input
        type="text"
        id={id}
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-[#4455a3] focus:border-transparent
                   text-gray-800 placeholder-gray-400"
        aria-label={placeholder}
      />
      <span
        className="absolute left-0 pl-3 text-gray-400"
        aria-hidden="true"
      >
        <Search size={20} />
      </span>
    </div>
  );
};

export default SearchBar;