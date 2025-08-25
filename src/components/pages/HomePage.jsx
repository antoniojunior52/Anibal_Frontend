import React from "react";
import {
  FileText,
  Megaphone,
  Users,
  Milestone,
  PartyPopper,
  Camera,
  CalendarDays,
  UtensilsCrossed,
} from "lucide-react";
import PageWrapper from "../ui/PageWrapper";
import HomeCard from "../ui/HomeCard";

const HomePage = ({ navigate }) => { 
  return (
    <PageWrapper>
      <div className="relative bg-gradient-to-br from-[#4455a3] to-[#6a79c1] text-white text-center overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <h2 className="text-5xl font-extrabold tracking-tight sm:text-6xl animate-fade-in-up">
            Bem-vindo ao Portal da Escola Anibal do Prado e Silva!
          </h2>
          <p className="mt-4 text-xl max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
            Sua fonte central de informações, notícias e comunicados importantes.
          </p>
        </div>
        <div className="-mt-16 text-[#f3f4f6]">
          <svg className="w-full h-auto" viewBox="0 0 1440 100" fill="currentColor" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z"></path>
          </svg>
        </div>
      </div>

      <div className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <HomeCard icon={<FileText size={40} />} title="Últimas Notícias" description="Fique por dentro dos eventos." onClick={() => navigate("news")} />
            <HomeCard icon={<Megaphone size={40} />} title="Recados do Dia" description="Avisos e comunicados rápidos." onClick={() => navigate("notices")} />
            <HomeCard icon={<Users size={40} />} title="Nossa Equipe" description="Conheça a diretoria e os professores." onClick={() => navigate("teachers")} />
            <HomeCard icon={<Milestone size={40} />} title="Nossa História" description="Conheça a trajetória da escola." onClick={() => navigate("history")} />
            <HomeCard icon={<PartyPopper size={40} />} title="Próximos Eventos" description="Veja o que vem por aí." onClick={() => navigate("events")} />
            <HomeCard icon={<Camera size={40} />} title="Galeria de Fotos" description="Reviva nossos melhores momentos." onClick={() => navigate("gallery")} />
            <HomeCard icon={<CalendarDays size={40} />} title="Horários de Aulas" description="Consulte os horários das turmas." onClick={() => navigate("schedules")} />
            <HomeCard icon={<UtensilsCrossed size={40} />} title="Cardápio Semanal" description="Confira o cardápio oficial." onClick={() => navigate("menu")} />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default HomePage;