import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

const PrivateProfile = ({ follow }) => {
  return (
    // <div className="flex items-center bg-gray-100 px-4 py-3 rounded-lg border border-gray-300">
    //   <div className="flex-shrink-0">
    //     <FontAwesomeIcon icon={faLock} className="w-6 h-6 text-gray-600" />
    //   </div>
    //   <div className="ml-4">
    //     <span className="text-gray-600 font-semibold">
    //       This profile is private
    //     </span>
    //     <p className="text-sm text-gray-500 mt-1">
    //       Follow this account to see their posts.
    //     </p>
    //     <button className="bg-blue-500 text-white rounded-md px-3 py-1 mt-2 hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
    //       Follow
    //     </button>
    //   </div>
    // </div>
    <div className="flex items-center bg-gray-100 px-6 py-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex-shrink-0">
        <FontAwesomeIcon icon={faLock} className="w-10 h-10 text-gray-600" />
      </div>
      <div className="ml-6">
        <h2 className="text-lg font-semibold text-gray-800">
          This profile is private
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Follow this account to see their posts and more.
        </p>
        <div className="mt-3">
          <button
            onClick={follow}
            className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Follow
          </button>
          <button className="ml-3 text-gray-600 hover:text-blue-600 focus:outline-none">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivateProfile;
