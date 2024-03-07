import React, { useState } from "react";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../ReUsableComponents/Input/Input";
import axios from "axios";
import { LOGIN } from "../../Redux/AuthTypes/AuthTypes";
import { useDispatch } from "react-redux";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    first_name: "",
    last_name: "",
    password: "",
    verifyPassword: "",
    email: "",
  });
  const handleSignUp = () => {
    let endpoint = "http://127.0.0.1:8000/users/sign_up/";
    console.log("endpoint", endpoint);
    let data = credentials;
    axios.post(endpoint, data).then((res) => {
      const responseData = res.data;
      console.log("SignUp", "responseData", responseData);
      if (responseData.success) {
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
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="container">
      <div className="form-container">
        <h2>Sign Up</h2>
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
          placeholder={"Password..."}
        />
        <Input
          onChange={handleChange}
          value={credentials.verifyPassword}
          name={"verifyPassword"}
          placeholder={"Verify Password..."}
        />
        <div>
          <button className="button" onClick={handleSignUp}>
            Sign Up
          </button>
        </div>
        <p className="link">
          Already have an account? <Link to={"/sign_in"}>Sign in here</Link>.
        </p>
      </div>
    </div>
  );
};
export default SignUp;
