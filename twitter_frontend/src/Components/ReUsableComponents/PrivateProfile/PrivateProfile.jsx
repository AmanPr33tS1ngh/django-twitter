import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

const PrivateProfile = ({ follow, showCancelReq, cancelReq }) => {
  return (
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
          {showCancelReq ? (
            <button
              onClick={cancelReq}
              className="bg-gray-200 rounded-md px-10 py-2 hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
            >
              Cancel follow request
            </button>
          ) : (
            <button
              onClick={follow}
              className="bg-blue-500 text-white rounded-md px-10 py-2 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Follow
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivateProfile;
