import React from "react";

const Explore = () => {
  return (
    <div>
      Explore
      <input placeholder="Search..." />
      <div className="flex flex-1">
        <button>For you</button>
        <button>Trending</button>
        <button>News</button>
        <button>Sports</button>
        <button>Entertainment</button>
      </div>
    </div>
  );
};

export default Explore;
