import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LOGIN, LOGOUT } from "../Redux/ActionTypes/ActionTypes";
import axios from "axios";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const localAuthToken = localStorage.getItem("authTokens");
  const [authTokens, setAuthTokens] = useState(() =>
    localAuthToken ? JSON.parse(localAuthToken) : null
  );
  const [user, setUser] = useState(() =>
    localAuthToken ? jwtDecode(localAuthToken) : null
  );
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginUser = async (user) => {
    const response = await fetch("http://127.0.0.1:8000/users/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user.username,
        password: user.password,
      }),
    });
    const data = await response.json();
    console.log("Data", data);
    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwtDecode(data.access));

      console.log("Data", jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      dispatch({
        type: LOGIN,
        payload: {
          authenticated: true,
        },
      });
      navigate("/");
    } else if (response.status === 401) {
      console.error("Unauthorized access:", data);
      alert("Invalid username or password. Please try again.");
    } else {
      console.error("Login failed:", data);
      alert("Login failed. Please try again later.");
    }
  };

  const signUp = (credentials) => {
    const endpoint = "http://127.0.0.1:8000/users/sign_up/";
    axios.post(endpoint, credentials).then((res) => {
      const responseData = res.data;
      console.log("responseData", responseData);
      if (responseData.success) {
        setAuthTokens(responseData.token);
        setUser(jwtDecode(responseData.token.access_token));
        localStorage.setItem("authTokens", JSON.stringify(responseData.token));
        dispatch({
          type: LOGIN,
          payload: {
            authenticated: true,
          },
        });
        navigate("/");
      }
    });
  };

  const logoutUser = () => {
    const endpoint = "http://127.0.0.1:8000/users/sign_out/";
    axios.post(endpoint).then((res) => {
      const responseData = res.data;
      console.log("signout responseData", responseData);
      if (responseData.success) {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        dispatch({
          type: LOGOUT,
          payload: {
            authenticated: false,
          },
        });
        navigate("/sign_in");
      }
    });
  };

  const updateToken = async () => {
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

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    } else {
      logoutUser();
    }

    if (loading) {
      setLoading(false);
    }
  };

  const contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
    signUp: signUp,
    isAuthenticated: !!localAuthToken,
  };

  useEffect(() => {
    if (loading) {
      updateToken();
    }

    const fourMinutes = 1000 * 60 * 4;

    const interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
