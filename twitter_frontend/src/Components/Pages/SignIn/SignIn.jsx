import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../ReUsableComponents/Input/Input";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { LOGIN } from "../../Redux/ActionTypes/ActionTypes";
import { jwtDecode } from "jwt-decode";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const endpoint = "http://127.0.0.1:8000/users/api/token/";
    axios.post(endpoint, user).then((res) => {
      const responseData = res.data;

      localStorage.setItem("authTokens", JSON.stringify(responseData));
      const user = jwtDecode(responseData.access).user;

      dispatch({
        type: LOGIN,
        payload: {
          authenticated: true,
          user: user,
          accessToken: responseData.access,
          refreshToken: responseData.refresh,
        },
      });
      navigate("/");
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSignIn}>
        <div className="bg-white p-20 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="py-3 px-8 font-bold">Join the community</h1>
          <Input
            placeholder="Enter username"
            className="block m-5"
            name="username"
            onChange={handleChange}
          />
          <Input
            placeholder="Enter password"
            className="block m-5"
            name="password"
            onChange={handleChange}
          />
          <div className="flex flex-1 justify-center items-center">
            <button
              type={"submit"}
              disabled={!user.username || !user.password}
              className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded 
              disabled:bg-gray-300 disabled:cursor-not-allowed button block m-auto	`}
            >
              Sign In
            </button>
          </div>
          <p className="block mt-2 text-sm">
            Don't have an account?{" "}
            <Link
              className=" text-blue-500 hover:text-blue-700"
              to={"/sign_up"}
            >
              Sign up here
            </Link>
            .
          </p>
        </div>
      </form>
    </div>
  );
};
export default SignIn;
