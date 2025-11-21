import React from "react";
import AnimatedCard from "./AnimatedCard";

// Cartão animado usado na página inicial (Home)
// Exibe um ícone, título e descrição, e responde ao clique
const HomeCard = ({ icon, title, description, onClick }) => (
  // Envolve o conteúdo em um componente de animação
  <AnimatedCard>
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer text-center h-full flex flex-col items-center justify-center"
    >
      {/* Círculo colorido de fundo para o ícone */}
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#4455a3]/10 text-[#4455a3] mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  </AnimatedCard>
);

export default HomeCard;