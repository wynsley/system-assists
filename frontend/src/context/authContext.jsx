import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { authStorage } from "../helpers/authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // PASO 1: vista previa optimista desde authStorage
    const cachedUser = authStorage.getUser();
    if (cachedUser && authStorage.isAuthenticated()) {
      setUserData(cachedUser);
      setIsAuthenticated(true);
    }

    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/me", {
          credentials: "include",
        });

        let data = null;
        try {
          data = await res.json();
        } catch {
          data = null;
        }

        if (res.ok && data?.user) {
          setUserData(data.user);
          setIsAuthenticated(true);
          authStorage.saveUser(data.user); //  ya no localStorage directo
        } else {
          setUserData(null);
          setIsAuthenticated(false);
          authStorage.clear(); //  limpia TODO (user, isAuthenticated, lastActivity)
        }
      } catch (err) {
        setUserData(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback((user) => {
    setIsAuthenticated(true);
    setUserData(user);
    authStorage.saveUser(user); //  ya no localStorage directo
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}

    setIsAuthenticated(false);
    setUserData(null);
    authStorage.clear(); // ya no localStorage.removeItem suelto
  }, []);

  const value = {
    isAuthenticated,
    userData,
    role: userData?.role ?? null,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}