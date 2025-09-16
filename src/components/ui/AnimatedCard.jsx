import React from "react";
import { useScrollAnimation } from "../../hooks/hooks";

const AnimatedCard = ({ children, className }) => {
  const [ref, isVisible] = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
