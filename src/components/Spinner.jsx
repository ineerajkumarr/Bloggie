import React from "react";

const Spinner = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="w-12 h-12 border-4 border-white border-dashed rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
