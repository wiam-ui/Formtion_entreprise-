import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";
import { getCookie, setCookie, deleteCookie } from "@/lib/cookieUtils";
import type { User } from "@/types";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (
        fullname: string,
        email: string,
        password: string
    ) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        const token = getCookie("token");
        console.log("🔍 Checking auth - Token from cookie:", token ? "✅ Found" : "❌ Not found");

        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.get("/users/me");
            setUser(response.data);
            console.log("✅ User authenticated:", response.data);
        } catch (error) {
            console.error("❌ Authentication error:", error);
            deleteCookie("token");
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        console.log("🔐 Logging in with:", email);
        const response = await api.post("/auth/login", {
            email,
            password,
        });

        const token = response.data?.accessToken;
        console.log("📦 Login response token:", token ? "✅ Received" : "❌ Missing");

        if (!token) {
            throw new Error("Login failed: token missing from response.");
        }

        setCookie("token", token, 12);
        console.log("✅ Token stored in cookie for 12 hours");
        await checkAuth();
    };

    const register = async (
        fullname: string,
        email: string,
        password: string
    ) => {
        console.log("📝 Registering with:", email);
        const response = await api.post("/auth/register", {
            fullname,
            email,
            password,
        });

        const token = response.data?.accessToken;
        console.log("📦 Register response token:", token ? "✅ Received" : "❌ Missing");

        if (!token) {
            throw new Error("Registration failed: token missing from response.");
        }

        setCookie("token", token, 12);
        console.log("✅ Token stored in cookie for 12 hours");
        await checkAuth();
    };

    const logout = async () => {
        console.log("🚪 Logging out...");
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Error during logout API call:", error);
        }
        deleteCookie("token");
        setUser(null);
        console.log("✅ Logged out successfully");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};