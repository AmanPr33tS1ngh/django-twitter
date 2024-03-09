import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./SearchResults.css";

const SearchResults = ({ results, users, showResults }) => {
  return (
    showResults && (
      <div className="search">
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Search Results</h2>
          <Result results={results} type={"tweet"} iconType={faSearch} />
          <Result results={users} type={"user"} iconType={faUser} />
        </div>
      </div>
    )
  );
};

const Result = ({ results, type, iconType }) => {
  return (
    <ul>
      {results?.map((result, index) => (
        <li style={{ alignItems: "center" }} key={index} className="mb-2">
          <Link
            className="link"
            to={`/${type === "user" ? "" : "explore/"}${result.value}`}
          >
            <FontAwesomeIcon icon={iconType} />
            {result.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SearchResults;
