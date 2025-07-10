import React from "react";
import PageWrapper from "../ui/PageWrapper";
import PageTitle from "../ui/PageTitle";
import AnimatedCard from "../ui/AnimatedCard";
import { Megaphone } from "lucide-react";

const NoticesPage = ({ notices }) => {
  const cardColors = [
    "bg-[#fcc841]/30",
    "bg-[#4455a3]/20",
    "bg-[#ec9c30]/20",
  ];
  return (
    <PageWrapper>
      <PageTitle
        title="Recados do Dia"
        subtitle="Avisos e comunicados importantes para a comunidade escolar."
      />
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {notices.length > 0 ? (
            notices.map((notice, index) => (
              <AnimatedCard
                key={notice._id}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`p-6 rounded-lg shadow-lg h-full flex flex-col transform rotate-${
                    (index % 4) - 1.5
                  } hover:scale-105 hover:rotate-0 transition-transform duration-300 ${
                    cardColors[index % cardColors.length]
                  }`}
                >
                  <p className="text-gray-800 flex-grow mb-4 whitespace-pre-wrap break-words">
                    {notice.content}
                  </p>
                  <div className="text-sm text-gray-600 border-t border-gray-400/50 pt-2">
                    <p className="font-semibold">{notice.author}</p>
                    <p className="text-xs">
                      {new Date(notice.createdAt).toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
              </AnimatedCard>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <Megaphone className="h-16 w-16 text-gray-300 mx-auto" />
              <p className="mt-4 text-xl text-gray-500">
                Nenhum recado para hoje.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default NoticesPage;
