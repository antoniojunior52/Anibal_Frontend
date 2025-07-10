// components/ui/SearchBar.jsx
import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, placeholder = "Pesquisar...", id }) => { // Adicionado 'id' nas props
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Chamar a função de pesquisa com o termo atual instantaneamente
  };

  // Removido handleSubmit e o botão de submit, pois a pesquisa é instantânea
  return (
    <div className="relative flex items-center w-full max-w-xs" role="search">
      <input
        type="text"
        id={id} // Usar o id passado para o input
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-[#4455a3] focus:border-transparent
                   text-gray-800 placeholder-gray-400"
        aria-label={placeholder}
      />
      <span // Alterado de button para span, pois não há ação de submit
        className="absolute left-0 pl-3 text-gray-400"
        aria-hidden="true" // Ocultar do leitor de tela, pois é apenas decorativo
      >
        <Search size={20} />
      </span>
    </div>
  );
};

export default SearchBar;
