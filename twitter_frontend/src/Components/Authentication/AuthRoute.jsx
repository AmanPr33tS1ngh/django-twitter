import React, { useContext } from "react";
import AuthContext from "./AuthProvider";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../Sidebar/Sidebar";

const AuthRoute = ({ element, isSign }) => {
  const { user, authTokens } = useContext(AuthContext);
  const { isAuthenticated } = useSelector((state) => state.reducer);
  return isAuthenticated || isSign ? (
    <div
      className={`${
        isAuthenticated ? "grid grid-cols-4 px-12 py-4" : ""
      } h-screen`}
    >
      {isAuthenticated ? <Sidebar /> : null}
      <div className={"col-span-3"}>{element}</div>
    </div>
  ) : (
    <Navigate to="/sign_in" />
  );
};

export default AuthRoute;
