import React from "react";
import AnimatedCard from "./AnimatedCard";

const DashboardCard = ({ icon, title, onClick, color }) => {
  const colorStyles = {
    indigo: {
      border: "border-indigo-500",
      bg: "bg-indigo-100",
      text: "text-indigo-600",
    },
    purple: {
      border: "border-purple-500",
      bg: "bg-purple-100",
      text: "text-purple-600",
    },
    teal: {
      border: "border-teal-500",
      bg: "bg-teal-100",
      text: "text-teal-600",
    },
    pink: {
      border: "border-pink-500",
      bg: "bg-pink-100",
      text: "text-pink-600",
    },
    sky: { border: "border-sky-500", bg: "bg-sky-100", text: "text-sky-600" },
    red: { border: "border-red-500", bg: "bg-red-100", text: "text-red-600" },
    green: {
      border: "border-green-500",
      bg: "bg-green-100",
      text: "text-green-600",
    },
    yellow: {
      border: "border-yellow-500",
      bg: "bg-yellow-100",
      text: "text-yellow-600",
    },
    orange: {
      border: "border-orange-500",
      bg: "bg-orange-100",
      text: "text-orange-600",
    },
    cyan: {
      border: "border-cyan-500",
      bg: "bg-cyan-100",
      text: "text-cyan-600",
    },
    blue: {
        border: "border-[#4455a3]",
        bg: "bg-[#4455a3]/10",
        text: "text-[#4455a3]",
    }
  };
  const styles = colorStyles[color] || colorStyles.blue;
  return (
    <AnimatedCard>
      <div
        onClick={onClick}
        className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer text-center h-full flex flex-col items-center justify-center border-b-4 ${styles.border}`}
      >
        <div className={`flex items-center justify-center h-16 w-16 rounded-full mx-auto mb-4 ${styles.bg} ${styles.text}`}>
          {React.cloneElement(icon, { size: 40 })}
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
    </AnimatedCard>
  );
};

export default DashboardCard;
