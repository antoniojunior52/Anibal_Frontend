import React from "react";

const FormWrapper = ({ title, icon, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2 flex items-center text-gray-800">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );

export default FormWrapper;
