import React, { useContext } from "react";
import AuthContext from "./AuthProvider";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../Sidebar/Sidebar";
import Trending from "../Pages/Trending/Trending";

const AuthRoute = ({ element, isSign }) => {
  const { user, authTokens } = useContext(AuthContext);
  console.log(user, authTokens);
  const isAuthenticated = useSelector((state) => state.reducer);

  return isAuthenticated || isSign ? (
    <div className={`${isAuthenticated ? "d-grid px-12 py-4" : ""} h-screen`}>
      {isAuthenticated ? <Sidebar /> : null}
      {element}
      {isAuthenticated ? <Trending /> : null}
    </div>
  ) : (
    <Navigate to="/sign_in" />
  );
};

export default AuthRoute;
