import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userId , setUserId] = useState(null);

    const login = (token) => {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp && decoded.exp > currentTime) {
                setUserId(decoded.id);
                setIsAuthenticated(true);
            } else {
                logout();
            }
        } catch {
            logout();
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, isLoading, login, logout, userId }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);