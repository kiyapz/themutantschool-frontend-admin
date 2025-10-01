"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  profile?: {
    avatar?: {
      url: string;
      key?: string;
    };
  };
  [key: string]: unknown;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If on the login page, don't show loading screen
    if (pathname === "/auth/login") {
      setLoading(false);
      return;
    }

    // Check if user is authenticated on page load
    const checkAuth = () => {
      const token = localStorage.getItem("login-accessToken");
      const userData = localStorage.getItem("USER");

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("login-accessToken");
          localStorage.removeItem("USER");
          localStorage.removeItem("refreshToken");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [pathname]);

  // Removed authentication restrictions - users can access all pages without login

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("=== LOGIN SUCCESS DEBUG ===");
        console.log("API Response:", data);
        console.log("User data from API:", data.user);

        // Store the actual access token from the API response
        localStorage.setItem("login-accessToken", data.accessToken);
        console.log("Stored access token:", data.accessToken);

        // Use the real user data from the API response
        const userData = data.user;

        // Add lastLogin timestamp to the user data
        const adminProfile = {
          ...userData,
          lastLogin: new Date().toISOString(),
        };

        console.log("Created admin profile:", adminProfile);

        // Save admin profile to localStorage
        localStorage.setItem("adminProfile", JSON.stringify(adminProfile));
        localStorage.setItem("USER", JSON.stringify(adminProfile));

        console.log("Saved to localStorage:");
        console.log("adminProfile:", localStorage.getItem("adminProfile"));
        console.log("USER:", localStorage.getItem("USER"));

        setUser(adminProfile);
        setIsAuthenticated(true);
        console.log("Set user state and authentication");
        router.push("/admin");
        return true;
      } else {
        // Handle error response
        console.error("Login failed:", data.error);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Call logout API to clear server-side session
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with client-side logout even if API fails
    } finally {
      // Clear client-side storage and state
      localStorage.removeItem("login-accessToken");
      localStorage.removeItem("USER");
      localStorage.removeItem("adminProfile");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("mutant_admin_token");
      setUser(null);
      setIsAuthenticated(false);
      router.push("/auth/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        loading,
        setIsAuthenticated,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
