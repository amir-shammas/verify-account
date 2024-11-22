import React, { useCallback, useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import AuthContext from "./context/authContext";
import routes from "./routes";

import "./App.css";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(false);
  const [userInfos, setUserInfos] = useState({});

  const router = useRoutes(routes);

  // const login = useCallback((userInfos, token) => {
  //   setToken(token);
  //   setIsLoggedIn(true);
  //   setUserInfos(userInfos);
  //   localStorage.setItem("user", JSON.stringify({ token }));
  // }, []);

  const login = (userInfos, token, rememberMe) => {
    setToken(token);
    setIsLoggedIn(true);
    setUserInfos(userInfos);

    // localStorage.setItem("user", JSON.stringify({ token }));

    if(rememberMe){
      localStorage.setItem("user", JSON.stringify({ token }));
    }else{
      sessionStorage.setItem("user", JSON.stringify({ token }));
    }
  };

  const logout = useCallback(() => {
    setToken(null);
    setIsLoggedIn(false);
    setUserInfos({});
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  });


  useEffect(() => {
    const storageData = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
    if (storageData) {
      // If there's a token in local storage, set it to state
      setToken(storageData.token);
    }
  }, []); // Run only once on mount


  useEffect(() => {
    if (token) {
      fetch(`http://localhost:4000/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then((userData) => {
          setIsLoggedIn(true);
          setUserInfos(userData);
        })
        .catch(() => {
          setIsLoggedIn(false);
          setUserInfos({});
          setToken(null);
          localStorage.removeItem("user"); // Clear user data on error
          sessionStorage.removeItem("user"); // Clear user data on error
        });
    }
  }, [token]); // Run this effect when the token changes



  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        userInfos,
        login,
        logout,
      }}
    >
      {router}
    </AuthContext.Provider>
  );
}
