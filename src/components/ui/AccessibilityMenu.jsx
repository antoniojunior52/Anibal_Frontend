// src/components/ui/AccessibilityMenu.js

import React from 'react';
import { Contrast, Plus, Minus } from 'lucide-react';

export default function AccessibilityMenu({ toggleContrast, increaseFontSize, decreaseFontSize }) {
  return (
    <div className="fixed bottom-20 right-6 z-50 flex items-center gap-2 p-2 bg-white rounded-lg shadow-lg border">
      <button 
        onClick={toggleContrast} 
        title="Ativar Alto Contraste" 
        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Ativar Alto Contraste"
      >
        <Contrast size={20} />
      </button>
      <div className="h-6 border-l mx-1"></div>
      <button 
        onClick={increaseFontSize} 
        title="Aumentar Fonte" 
        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Aumentar tamanho da fonte"
      >
        <Plus size={20} />
      </button>
      <button 
        onClick={decreaseFontSize} 
        title="Diminuir Fonte" 
        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Diminuir tamanho da fonte"
      >
        <Minus size={20} />
      </button>
    </div>
  );
}