import React from "react";
import "./Navbar.css";
const Navbar = () => {
  return (
    <nav className="home-nav">
      <button className={`font-bold	active`}>For you</button>
      <button className={`font-bold	de-active`}>Following</button>
    </nav>
  );
};
export default Navbar;
