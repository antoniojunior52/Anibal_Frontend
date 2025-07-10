import React from "react";

const MobileNavItem = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium text-left w-full"
  >
    {children}
  </button>
);

export default MobileNavItem;
