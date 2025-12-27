"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("keewacker_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate login - in production, call your auth API
    try {
      // Get stored users
      const usersStored = localStorage.getItem("keewacker_users");
      const users: User[] = usersStored ? JSON.parse(usersStored) : [];
      
      // Find user (simple check - in production use proper auth)
      const foundUser = users.find(
        (u) => u.username.toLowerCase() === username.toLowerCase()
      );

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("keewacker_user", JSON.stringify(foundUser));
        return true;
      }

      // If no users exist, create first user automatically
      if (users.length === 0) {
        const newUser: User = {
          id: crypto.randomUUID(),
          username,
          email: `${username}@keewacker.local`,
          createdAt: new Date().toISOString(),
        };
        users.push(newUser);
        localStorage.setItem("keewacker_users", JSON.stringify(users));
        setUser(newUser);
        localStorage.setItem("keewacker_user", JSON.stringify(newUser));
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const usersStored = localStorage.getItem("keewacker_users");
      const users: User[] = usersStored ? JSON.parse(usersStored) : [];

      // Check if username exists
      if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
        return false;
      }

      const newUser: User = {
        id: crypto.randomUUID(),
        username,
        email,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem("keewacker_users", JSON.stringify(users));
      setUser(newUser);
      localStorage.setItem("keewacker_user", JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("keewacker_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
