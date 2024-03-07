import React, { useState } from "react";
import "./SignIn.css";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../ReUsableComponents/Input/Input";
import axios from "axios";
import { useDispatch } from "react-redux";
import { LOGIN } from "../../Redux/AuthTypes/AuthTypes";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  const handleSignIn = () => {
    let endpoint = "http://127.0.0.1:8000/users/sign_in/";
    console.log("endpoint", endpoint);
    let data = user;
    axios.post(endpoint, data).then((res) => {
      const responseData = res.data;
      if (responseData.success) {
        dispatch({
          type: LOGIN,
          payload: {
            authenticated: true,
          },
        });
        navigate("/");
      }
      console.log("SignIn", "responseData", responseData);
    });
  };
  return (
    <div className="container">
      <div>
        <h1 className="">Join the community</h1>
        <div className="form-container">
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
              disabled={!user.username || !user.password}
              className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded 
              disabled:bg-gray-300 disabled:cursor-not-allowed button block m-auto	`}
              onClick={handleSignIn}
            >
              Sign In
            </button>
          </div>
          <p className="link">
            Don't have an account? <Link to={"/sign_up"}>Sign up here</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignIn;
