// src/components/ui/AccessibilityMenu.js

import React, { useState } from 'react';
import { Contrast, Plus, Minus, Accessibility } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AccessibilityMenu({ toggleContrast, increaseFontSize, decreaseFontSize }) {
  // Estado para controlar se o menu está aberto ou fechado
  const [isOpen, setIsOpen] = useState(false);

  // Funções de acessibilidade que também fecham o menu após a ação
  const handleToggleContrast = () => {
    toggleContrast();
    setIsOpen(false);
  };

  const handleIncreaseFontSize = () => {
    increaseFontSize();
    setIsOpen(false);
  };

  const handleDecreaseFontSize = () => {
    decreaseFontSize();
    setIsOpen(false);
  };

  const menuVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.1 // Anima os botões um após o outro
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* AnimatePresence gerencia a animação de saída dos elementos */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="flex flex-col items-end gap-3"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
          >
            {/* Botão de Contraste */}
            <motion.button
              onClick={handleToggleContrast}
              title="Ativar Alto Contraste"
              className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-200 transition-colors"
              aria-label="Ativar Alto Contraste"
              variants={itemVariants}
            >
              <Contrast size={22} />
            </motion.button>

            {/* Botão de Aumentar Fonte */}
            <motion.button
              onClick={handleIncreaseFontSize}
              title="Aumentar Fonte"
              className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-200 transition-colors"
              aria-label="Aumentar tamanho da fonte"
              variants={itemVariants}
            >
              <Plus size={22} />
            </motion.button>

            {/* Botão de Diminuir Fonte */}
            <motion.button
              onClick={handleDecreaseFontSize}
              title="Diminuir Fonte"
              className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-200 transition-colors"
              aria-label="Diminuir tamanho da fonte"
              variants={itemVariants}
            >
              <Minus size={22} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão Principal para abrir/fechar o menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Menu de Acessibilidade"
        className="p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Abrir menu de acessibilidade"
        aria-expanded={isOpen}
      >
        <Accessibility size={24} />
      </button>
    </div>
  );
}