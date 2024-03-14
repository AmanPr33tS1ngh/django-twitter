import React from "react";

const Navbar = () => {
  return (
    <nav className="grid grid-cols-2 justify-center">
      <button className={`font-bold	text-black`}>For you</button>
      <button className={`font-bold	text-gray-600`}>Following</button>
    </nav>
  );
};
export default Navbar;
