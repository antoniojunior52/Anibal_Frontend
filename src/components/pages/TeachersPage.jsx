import React, { useState } from "react";
import PageWrapper from "../ui/PageWrapper";
import PageTitle from "../ui/PageTitle";
import AnimatedCard from "../ui/AnimatedCard";
import { API_URL } from "../../App"; 

// Página da Equipe Escolar (Diretoria e Professores)
const TeachersPage = ({ team }) => {
  const [selectedProfile, setSelectedProfile] = useState(null); // Perfil selecionado para o modal
  
  // Separa a Diretora dos demais professores para destaque
  const director = team.find((p) => p.role === "Diretora");
  const teachers = team.filter((p) => p.role !== "Diretora");
  
  return (
    <PageWrapper>
      <PageTitle
        title="Nossa Equipe"
        subtitle="Conheça a liderança e os educadores dedicados da nossa escola."
      />
      <div className="container mx-auto px-4 pb-12">
        {/* Seção de Destaque para a Diretoria */}
        {director && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Diretoria
            </h2>
            <AnimatedCard>
              <div
                onClick={() => setSelectedProfile(director)}
                className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-2xl text-center hover:shadow-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer border-t-4 border-[#4455a3]"
              >
                <img
                  src={`${API_URL}${director.photo}`}
                  alt={director.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-[#fcc841] object-cover"
                />
                <h3 className="text-2xl font-semibold text-gray-900">
                  {director.name}
                </h3>
                <p className="text-[#4455a3] font-bold text-lg mt-1">
                  {director.role}
                </p>
              </div>
            </AnimatedCard>
          </div>
        )}
        
        {/* Grade de Professores */}
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 pt-8 border-t">
            Corpo Docente
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {teachers.map((teacher) => (
              <AnimatedCard key={teacher._id}>
                <div
                  onClick={() => setSelectedProfile(teacher)}
                  className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full"
                >
                  <img
                    src={`${API_URL}${teacher.photo}`}
                    alt={teacher.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-[#4455a3]/50 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {teacher.name}
                  </h3>
                  <p className="text-[#4455a3] text-sm">
                    {teacher.subjects.join(", ")}
                  </p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
        
        {/* Modal de Detalhes do Perfil (Bio e Informações) */}
        {selectedProfile && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProfile(null)}
          >
            <div
              className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProfile(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
              >
                &times;
              </button>
              <div className="text-center">
                <img
                  src={`${API_URL}${selectedProfile.photo}`}
                  alt={selectedProfile.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-[#4455a3] object-cover"
                />
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedProfile.name}
                </h2>
                <p className="text-[#4455a3] font-semibold mt-1">
                  {selectedProfile.role ||
                    selectedProfile.subjects.join(" / ")}
                </p>
                <p className="text-gray-600 mt-6 text-left leading-relaxed">
                  {selectedProfile.bio}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default TeachersPage;