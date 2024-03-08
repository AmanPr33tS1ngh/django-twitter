import React, {useContext} from "react";
import AuthContext from "./AuthProvider";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../Sidebar/Sidebar";
import Trending from "../Pages/Trending/Trending";

const AuthRoute = ({ element, isSign }) => {
    const {user, authTokens} = useContext(AuthContext);
  const isAuthenticated = useSelector((state) => state.reducer);

  return isAuthenticated || isSign ? (
    <React.Fragment>
          {isAuthenticated ? <Sidebar /> : null}
        {element}
          {isAuthenticated ? <Trending /> : null}
    </React.Fragment>
  ) : (
    <Navigate to="/sign_in" />
  );
};

export default AuthRoute;
