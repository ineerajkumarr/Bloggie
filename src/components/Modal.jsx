import React from "react";

function Modal() {
  return (
    <div>
      <div className="fixed left-0 right-0 top-0 bottom-0 bg-black backdrop-blur-sm opacity-25 z-0"></div>
      <div className="bg-white p-6 rounded-md z-60 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h3 className="text-center">
          Are you sure you want to delete the post ?
        </h3>
        <div className="flex justify-between">
          <button className="border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded">
            Cancel
          </button>
          <button className="ml-4 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold py-2 px-4 rounded">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
