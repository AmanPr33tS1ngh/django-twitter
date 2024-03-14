import React, {useContext, useState} from "react";
import { Link } from "react-router-dom";
import Input from "../../ReUsableComponents/Input/Input";
import AuthContext from "../../Authentication/AuthProvider";

const SignIn = () => {
  const {loginUser} = useContext(AuthContext);

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
  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <div className="bg-white p-20 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="">Join the community</h1>
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
              onClick={()=>loginUser(user)}
            >
              Sign In
            </button>
          </div>
          <p className="block text-blue-500 hover:text-blue-700 mt-2 text-sm">
            Don't have an account? <Link to={"/sign_up"}>Sign up here</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignIn;
