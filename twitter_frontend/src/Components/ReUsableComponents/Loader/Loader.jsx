import React from 'react';

const Loader = () => {
  return (
      <div className="relative flex justify-center h-[100vh] items-center">
        <div className="absolute border-gray-300 h-10 w-10 animate-spin rounded-full border-4 border-t-blue-600"/>
      </div>
  );
};

export default Loader;
