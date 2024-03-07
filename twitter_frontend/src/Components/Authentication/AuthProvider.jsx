import React, { createContext, useContext, useReducer } from "react";
import { useSelector } from "react-redux";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { isAuthenticated: true };
    case "LOGOUT":
      return { isAuthenticated: false };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state);
  const [state, dispatch] = useReducer(authReducer, isAuthenticated);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
