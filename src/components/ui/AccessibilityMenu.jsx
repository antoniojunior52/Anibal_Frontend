import React, { useState } from 'react';
import { Contrast, Plus, Minus, Accessibility } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AccessibilityMenu({ toggleContrast, increaseFontSize, decreaseFontSize }) {
  // Estado para controlar se o menu está aberto ou fechado
  const [isOpen, setIsOpen] = useState(false);

  // Função para ativar/desativar o contraste e fechar o menu
  const handleToggleContrast = () => {
    toggleContrast();  // Chama a função de prop para alternar o contraste
    setIsOpen(false);   // Fecha o menu após a ação
  };

  // Função para aumentar o tamanho da fonte e fechar o menu
  const handleIncreaseFontSize = () => {
    increaseFontSize();  // Chama a função de prop para aumentar a fonte
    setIsOpen(false);     // Fecha o menu após a ação
  };

  // Função para diminuir o tamanho da fonte e fechar o menu
  const handleDecreaseFontSize = () => {
    decreaseFontSize();  // Chama a função de prop para diminuir a fonte
    setIsOpen(false);     // Fecha o menu após a ação
  };

  // Definição das animações do menu
  const menuVariants = {
    hidden: { opacity: 0, y: 20 }, // Estado inicial: invisível e deslocado para baixo
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.1 // Anima os botões um após o outro com um pequeno atraso
      }
    }
  };

  // Definição das animações dos itens do menu
  const itemVariants = {
    hidden: { opacity: 0, y: 10 }, // Estado inicial: invisível e deslocado para baixo
    visible: { opacity: 1, y: 0 }   // Estado visível: totalmente opaco e sem deslocamento
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* AnimatePresence gerencia a animação de saída dos elementos quando o menu é fechado */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="flex flex-col items-end gap-3"
            initial="hidden"   // Inicia o menu como escondido
            animate="visible"  // Anima para o estado visível
            exit="hidden"      // Anima para o estado escondido quando o menu fechar
            variants={menuVariants} // Aplica as animações do menu
          >
            {/* Botão de Contraste */}
            <motion.button
              onClick={handleToggleContrast} // Aciona a função de contraste
              title="Ativar Alto Contraste" // Descrição para o botão
              className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-200 transition-colors"
              aria-label="Ativar Alto Contraste" // Acessibilidade: descrição do botão
              variants={itemVariants} // Aplica animação ao item
            >
              <Contrast size={22} />
            </motion.button>

            {/* Botão de Aumentar Fonte */}
            <motion.button
              onClick={handleIncreaseFontSize} // Aciona a função para aumentar a fonte
              title="Aumentar Fonte"
              className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-200 transition-colors"
              aria-label="Aumentar tamanho da fonte"
              variants={itemVariants} // Aplica animação ao item
            >
              <Plus size={22} />
            </motion.button>

            {/* Botão de Diminuir Fonte */}
            <motion.button
              onClick={handleDecreaseFontSize} // Aciona a função para diminuir a fonte
              title="Diminuir Fonte"
              className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-200 transition-colors"
              aria-label="Diminuir tamanho da fonte"
              variants={itemVariants} // Aplica animação ao item
            >
              <Minus size={22} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão Principal para abrir/fechar o menu de acessibilidade */}
      <button
        onClick={() => setIsOpen(!isOpen)} // Alterna o estado do menu (aberto/fechado)
        title="Menu de Acessibilidade" // Descrição para o botão
        className="p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Abrir menu de acessibilidade" // Acessibilidade: descrição do botão
        aria-expanded={isOpen} // Indica se o menu está aberto ou fechado
      >
        <Accessibility size={24} />
      </button>
    </div>
  );
}
