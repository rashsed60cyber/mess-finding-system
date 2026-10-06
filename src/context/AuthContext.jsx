import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("messFinderCurrentUser");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      localStorage.removeItem("messFinderCurrentUser");
    } finally {
      setLoading(false);
    }
  }, []);

  const register = (userData) => {
    const savedUsers =
      JSON.parse(localStorage.getItem("messFinderUsers")) || [];

    const emailExists = savedUsers.some(
      (item) =>
        item.email.toLowerCase() === userData.email.toLowerCase()
    );

    if (emailExists) {
      return {
        success: false,
        message: "An account with this email already exists."
      };
    }

    const newUser = {
      id: Date.now(),
      name: userData.name.trim(),
      email: userData.email.trim(),
      password: userData.password,
      role: "student"
    };

    localStorage.setItem(
      "messFinderUsers",
      JSON.stringify([...savedUsers, newUser])
    );

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };

    localStorage.setItem(
      "messFinderCurrentUser",
      JSON.stringify(sessionUser)
    );

    setUser(sessionUser);

    return {
      success: true
    };
  };

  const login = (email, password) => {
    const savedUsers =
      JSON.parse(localStorage.getItem("messFinderUsers")) || [];

    const foundUser = savedUsers.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    );

    if (!foundUser) {
      return {
        success: false,
        message: "Invalid email or password."
      };
    }

    const sessionUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role
    };

    localStorage.setItem(
      "messFinderCurrentUser",
      JSON.stringify(sessionUser)
    );

    setUser(sessionUser);

    return {
      success: true
    };
  };

  const logout = () => {
    localStorage.removeItem("messFinderCurrentUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
