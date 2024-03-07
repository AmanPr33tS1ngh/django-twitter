import React from "react";
import { useAuth } from "./AuthProvider";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthRoute = ({ element, isSign }) => {
  const isAuthenticated = useSelector((state) => state.reducer);

  return isAuthenticated || isSign ? (
    <React.Fragment>{element}</React.Fragment>
  ) : (
    <Navigate to="/sign_in" />
  );
};

export default AuthRoute;
