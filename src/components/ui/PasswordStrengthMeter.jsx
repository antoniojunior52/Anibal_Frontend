
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

// Subcomponente para cada item da lista
const ValidationItem = ({ isValid, text }) => {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center text-sm"
    >
      <motion.div animate={{ color: isValid ? '#22c55e' : '#6b7280' }}>
        {isValid ? <Check size={16} className="mr-2 flex-shrink-0" /> : <X size={16} className="mr-2 flex-shrink-0" />}
      </motion.div>
      <motion.span animate={{ color: isValid ? '#1f2937' : '#6b7280' }}>
        {text}
      </motion.span>
    </motion.li>
  );
};

export default function PasswordStrengthMeter({ validations }) {
  const strength = Object.values(validations).filter(Boolean).length;

  const strengthColors = {
    0: 'bg-gray-200',
    1: 'bg-red-500',
    2: 'bg-red-500',
    3: 'bg-yellow-500',
    4: 'bg-yellow-500',
    5: 'bg-green-500',
  };

  const strengthText = {
    0: '',
    1: 'Muito Fraca',
    2: 'Fraca',
    3: 'Razoável',
    4: 'Boa',
    5: 'Forte',
  };

  const barWidth = `${(strength / 5) * 100}%`;

  return (
    <div className="p-4 bg-gray-50 rounded-md border space-y-3">
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold">Força da Senha</span>
          <span className="text-sm font-bold transition-colors">{strengthText[strength]}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${strengthColors[strength]}`}
            initial={{ width: 0 }}
            animate={{ width: barWidth }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          />
        </div>
      </div>
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