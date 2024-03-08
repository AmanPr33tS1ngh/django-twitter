import { createContext, useState, useEffect } from 'react'
import {jwtDecode} from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export const AuthProvider = ({children}) => {
    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)

    const navigate = useNavigate();
    let loginUser = async (user )=> {
        let response = await fetch('http://127.0.0.1:8000/users/api/token/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'username':user.username, 'password':user.password})
        })
        let data = await response.json()

        if(response.status === 200){
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))

            navigate('/');
        }else{
            alert('Something went wrong!')
        }
    }


    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/sign_in')
    }


    let updateToken = async ()=> {
        console.log("authTokens?.refresh", authTokens?.refresh)
        let response = await fetch('http://127.0.0.1:8000/users/api/token/refresh/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'refresh':authTokens?.refresh})
        })

        let data = await response.json()

        if (response.status === 200){
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        }else{
            logoutUser()
        }

        if(loading){
            setLoading(false)
        }
    }

    let contextData = {
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser,
    }

    useEffect(()=> {

        if(loading){
            updateToken()
        }

        let fourMinutes = 1000 * 60 * 4

        let interval =  setInterval(()=> {
            if(authTokens){
                updateToken()
            }
        }, fourMinutes)
        return ()=> clearInterval(interval)

    }, [authTokens, loading])

    return(
        <AuthContext.Provider value={contextData} >
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
export default AuthContext;

// import React, { createContext, useContext, useReducer, useState } from "react";
// import { useSelector } from "react-redux";
// import jwt_decode from "jwt-decode";
//
// const AuthContext = createContext();
//
// const authReducer = (state, action) => {
//   switch (action.type) {
//     case "LOGIN":
//       return { isAuthenticated: true };
//     case "LOGOUT":
//       return { isAuthenticated: false };
//     default:
//       return state;
//   }
// };
//
// const AuthProvider = ({ children }) => {
//     let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
//     let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
//   const { isAuthenticated } = useSelector((state) => state);
//   const [state, dispatch] = useReducer(authReducer, isAuthenticated);
//
//   return (
//     <AuthContext.Provider value={{ state, dispatch }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
//
// const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
//
// export { AuthProvider, useAuth };
