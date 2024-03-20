import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import OutsideClickHandler from "react-outside-click-handler";

const SearchResults = ({ results, users, showResults, handleShowResults }) => {
  return (
    showResults && (
      <OutsideClickHandler onOutsideClick={handleShowResults}>
        <div className="absolute z-10 bg-white shadow rounded p-4 w-full">
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Search Results</h2>
            <Result results={results} type={"tweet"} iconType={faSearch} />
            <Result results={users} type={"user"} iconType={faUser} />
          </div>
        </div>
      </OutsideClickHandler>
    )
  );
};

const Result = ({ results, type, iconType }) => {
  return (
    <ul>
      {results?.map((result, index) => (
        <li key={index} className="mb-2 items-center">
          <Link
            className="grid grid-cols-10 text-black items-center font-medium text-base"
            to={`/${type === "user" ? "" : "status/"}${result.value}`}
          >
            <span className={"col-span-1"}>
              <FontAwesomeIcon icon={iconType} />
            </span>
            <span className={"col-span-9"}>{result.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SearchResults;
