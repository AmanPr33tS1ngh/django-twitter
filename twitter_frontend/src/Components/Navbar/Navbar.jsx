import React from "react";

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="grid grid-cols-2 justify-center">
      <button
        className="flex px-2 grid-cols-1 justify-center hover:bg-gray-200"
        onClick={() => setActiveTab("For you")}
      >
        <span
          className={
            activeTab === "For you"
              ? "flex justify-center font-bold text-black border-b-4 border-blue-300 py-3"
              : "flex justify-center font-bold text-gray-500 transition-colors duration-300 ease-in-out py-3"
          }
        >
          For you
        </span>
      </button>
      <button
        className="flex px-2 grid-cols-1 justify-center hover:bg-gray-200"
        onClick={() => setActiveTab("Following")}
      >
        <span
          className={
            activeTab === "Following"
              ? "flex justify-center font-bold text-black border-b-4 border-blue-300 py-3"
              : "flex justify-center font-bold text-gray-500 transition-colors duration-300 ease-in-out py-3"
          }
        >
          Following
        </span>
      </button>
    </nav>
  );
};
export default Navbar;
