import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";

const AuthRoute = ({ element, isSign }) => {
  const { isAuthenticated, user } = useSelector(
    (state) => state.reducer.reducer
  );
  const { accessToken, refreshToken } = useSelector(
    (state) => state.reducer.reducer
  );

  const updateToken = async (authTokens) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/users/api/token/refresh/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: authTokens?.refresh }),
        }
      );

      const data = await response.json();
      console.log("datatatatat", data);
      if (response.status === 200) {
        localStorage.setItem("authTokens", JSON.stringify(data));
      } else {
        console.log("elseeeeee");
      }

      // if (loading) {
      //   setLoading(false);
      // }
      // console.log("authTokens?.refresh", authTokens?.refresh);
      // axios
      //   .post(
      //     "http://127.0.0.1:8000/users/api/token/refresh/",
      //     authTokens?.refresh
      //   )
      //   .then((response) => {
      //     console.log("responseeeee update token", response);
      //     if (response.status === 200) {
      //       localStorage.setItem("authTokens", JSON.stringify(response.data));
      //     } else {
      //       console.log("couldn't refresh", response);
      //     }
      //   });
    } catch (error) {
      console.error("Failed to refresh token:", error);
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const fourMinutes = 1000 * 60 * 4;

    const interval = setInterval(() => {
      let authTokens = null;
      const localAuthToken = localStorage.getItem("authTokens");
      if (localAuthToken) {
        authTokens = JSON.parse(localAuthToken);
      }
      if (authTokens) {
        updateToken(authTokens);
      }
    }, fourMinutes);
    return () => clearInterval(interval);
  }, [accessToken, refreshToken, dispatch]);

  return (isAuthenticated && user?.username) || isSign ? (
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
