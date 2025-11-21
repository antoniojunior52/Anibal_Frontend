import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

// Subcomponente para exibir cada regra de senha (ex: "Mínimo 8 caracteres") com ícone de V ou X
const ValidationItem = ({ isValid, text }) => {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center text-sm"
    >
      {/* Muda a cor do ícone: Verde se válido, Cinza se inválido */}
      <motion.div animate={{ color: isValid ? '#22c55e' : '#6b7280' }}>
        {isValid ? <Check size={16} className="mr-2 flex-shrink-0" /> : <X size={16} className="mr-2 flex-shrink-0" />}
      </motion.div>
      {/* Muda a cor do texto */}
      <motion.span animate={{ color: isValid ? '#1f2937' : '#6b7280' }}>
        {text}
      </motion.span>
    </motion.li>
  );
};

// Componente principal que mostra a força da senha e a lista de requisitos
export default function PasswordStrengthMeter({ validations }) {
  // Conta quantas regras foram cumpridas (true)
  const strength = Object.values(validations).filter(Boolean).length;

  // Define a cor da barra de progresso baseada na pontuação (0 a 5)
  const strengthColors = {
    0: 'bg-gray-200',
    1: 'bg-red-500',
    2: 'bg-red-500',
    3: 'bg-yellow-500',
    4: 'bg-yellow-500',
    5: 'bg-green-500',
  };

  // Define o texto descritivo da força
  const strengthText = {
    0: '',
    1: 'Muito Fraca',
    2: 'Fraca',
    3: 'Razoável',
    4: 'Boa',
    5: 'Forte',
  };

  // Calcula a largura da barra em porcentagem
  const barWidth = `${(strength / 5) * 100}%`;

  return (
    <div className="p-4 bg-gray-50 rounded-md border space-y-3">
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold">Força da Senha</span>
          <span className="text-sm font-bold transition-colors">{strengthText[strength]}</span>
        </div>
        {/* Barra de fundo cinza */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          {/* Barra colorida animada que cresce conforme a força aumenta */}
          <motion.div
            className={`h-2 rounded-full ${strengthColors[strength]}`}
            initial={{ width: 0 }}
            animate={{ width: barWidth }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          />
        </div>
      </div>
      {/* Lista de requisitos de validação */}
      <ul className="space-y-1">
        <AnimatePresence>
          <ValidationItem isValid={validations.minLength} text="Mínimo de 8 caracteres" />
          <ValidationItem isValid={validations.hasUpper} text="Pelo menos uma letra maiúscula" />
          <ValidationItem isValid={validations.hasLower} text="Pelo menos uma letra minúscula" />
          <ValidationItem isValid={validations.hasNumber} text="Pelo menos um número" />
          <ValidationItem isValid={validations.passwordsMatch} text="As senhas coincidem" />
        </AnimatePresence>
      </ul>
    </div>
  );
}