import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "underright_token";
const USER_KEY = "underright_user";

function readStoredUser() {
  try {
    const stored =
      localStorage.getItem(USER_KEY);

    if (!stored) {
      return null;
    }

    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function AuthProvider({
  children,
}) {
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_KEY),
  );

  const [user, setUser] = useState(() =>
    readStoredUser(),
  );

  const login = async (
    email,
    password,
  ) => {
    const response = await api.post(
      "/auth/login",
      {
        email,
        password,
      },
    );

    const {
      token: newToken,
      user: newUser,
    } = response.data;

    localStorage.setItem(
      TOKEN_KEY,
      newToken,
    );

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(newUser),
    );

    setToken(newToken);
    setUser(newUser);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      isAuthenticated: Boolean(token),
    }),
    [token, user],
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider.",
    );
  }

  return context;
}