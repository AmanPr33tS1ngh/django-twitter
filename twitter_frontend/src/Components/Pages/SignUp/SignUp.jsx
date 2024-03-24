import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../ReUsableComponents/Input/Input";
import { LOGIN } from "../../Redux/ActionTypes/ActionTypes";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signUp = () => {
    const endpoint = "http://127.0.0.1:8000/users/sign_up/";
    axios.post(endpoint, credentials).then((res) => {
      const responseData = res.data;
      if (responseData.success) {
        localStorage.setItem("authTokens", JSON.stringify(responseData.token));
        dispatch({
          type: LOGIN,
          payload: {
            authenticated: true,
            user: jwtDecode(responseData.token.access_token),
          },
        });
        navigate("/");
      }
    });
  };
  const [credentials, setCredentials] = useState({
    username: "",
    first_name: "",
    last_name: "",
    password: "",
    verifyPassword: "",
    email: "",
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-20 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="py-3 px-8 font-bold">Sign Up</h2>
        <Input
          onChange={handleChange}
          value={credentials.username}
          name={"username"}
          placeholder={"Username..."}
        />
        <Input
          onChange={handleChange}
          value={credentials.first_name}
          name={"first_name"}
          placeholder={"First Name..."}
        />
        <Input
          onChange={handleChange}
          value={credentials.last_name}
          name={"last_name"}
          placeholder={"Last Name..."}
        />
        <Input
          onChange={handleChange}
          value={credentials.email}
          name={"email"}
          placeholder={"Email..."}
        />
        <Input
          onChange={handleChange}
          value={credentials.password}
          name={"password"}
          type="password"
          placeholder={"Password..."}
        />
        <Input
          onChange={handleChange}
          type="password"
          value={credentials.verifyPassword}
          name={"verifyPassword"}
          placeholder={"Verify Password..."}
        />
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer text-base"
            onClick={() => signUp(credentials)}
          >
            Sign Up
          </button>
        </div>
        <p className="block  mt-2 text-sm">
          Already have an account?{" "}
          <Link className="text-blue-500 hover:text-blue-700" to={"/sign_in"}>
            Sign in here
          </Link>
          .
        </p>
      </div>
    </div>
  );
};
export default SignUp;
