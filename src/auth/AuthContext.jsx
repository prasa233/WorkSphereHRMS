
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        if (active) setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        if (active) {
          setUser(response.data);
        }
      } catch (error) {
        if (active) {
          localStorage.removeItem("access_token");
          setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  async function login(email, password) {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const token =
      response.data.access_token ||
      response.data.token;

    if (!token) {
      throw new Error(
        "The API did not return an access token."
      );
    }

    localStorage.setItem("access_token", token);

    try {
      const profileResponse = await api.get("/auth/me");
      const profile = profileResponse.data;

      setUser(profile);
      return profile;
    } catch (error) {
      localStorage.removeItem("access_token");
      setUser(null);
      throw error;
    }
  }

  async function register(values) {
    return api.post("/auth/register", values);
  }

  function logout() {
    localStorage.removeItem("access_token");
    setUser(null);
    window.location.assign("/login");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be inside AuthProvider"
    );
  }

  return context;
}
