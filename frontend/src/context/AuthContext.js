"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  getToken,
} from "../lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (currentUser) {
      setUser(currentUser);
    }

    setLoading(false);
  }, []);

  async function login(email, password) {
    const loggedInUser = await loginUser(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function register(email, password) {
    const newUser = await registerUser(email, password);
    setUser(newUser);
    return newUser;
  }

  function logout() {
    logoutUser();
    setUser(null);
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    token: getToken(),

    login,
    register,
    logout,

    loginUser: login,
    registerUser: register,
    logoutUser: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}

export default AuthContext;
