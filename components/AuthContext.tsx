"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import { User, UserRole } from "@/lib/auth-types";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  DEFAULT_USERS,
  getStoredUsers,
  saveUser,
  setStoredSession,
  validateCamelCasePassword,
  validateEmail,
} from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (
    email: string,
    password: string
  ) => { success: boolean; message: string; user?: User };
  signup: (
    name: string,
    email: string,
    password: string,
    company?: string
  ) => { success: boolean; message: string; user?: User };
  logout: () => void;
  quickLogin: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function subscribeSession(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("crm-auth-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("crm-auth-change", callback);
  };
}

function getSessionSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("crm_current_user_session");
}

function getServerSnapshot(): string | null {
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const sessionRaw = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    getServerSnapshot
  );

  const user: User | null = useMemo(() => {
    if (!sessionRaw) return null;
    try {
      return JSON.parse(sessionRaw);
    } catch {
      return null;
    }
  }, [sessionRaw]);

  // Once client-side evaluation is ready, isLoading is false
  const isLoading = false;

  const login = (email: string, password: string) => {
    const trimmedEmail = email.trim();

    // 1. Validate email
    const emailValidation = validateEmail(trimmedEmail);
    if (!emailValidation.isValid) {
      return { success: false, message: emailValidation.message };
    }

    // 2. Admin Check
    if (trimmedEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      if (password !== ADMIN_PASSWORD) {
        return {
          success: false,
          message: "Incorrect password for Admin. (Hint: Crm@123)",
        };
      }

      const adminUser: User = {
        id: "user-admin",
        name: "System Administrator",
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin",
        company: "CRM Enterprise",
        createdAt: new Date().toISOString(),
      };

      setStoredSession(adminUser);
      return {
        success: true,
        message: "Welcome Administrator! Full access granted.",
        user: adminUser,
      };
    }

    // 3. Password validation for non-admin: must follow camelCase
    const passwordValidation = validateCamelCasePassword(password, false);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        message: `Password validation failed: ${passwordValidation.message}`,
      };
    }

    // 4. Non-admin user check in database
    const allUsers = getStoredUsers();
    const existing = allUsers.find(
      (u) => u.email.toLowerCase() === trimmedEmail.toLowerCase()
    );

    if (!existing) {
      return {
        success: false,
        message: "No account found with this email. Please sign up first.",
      };
    }

    if (existing.password !== password) {
      return {
        success: false,
        message: "Incorrect password for this user.",
      };
    }

    // Login successful with restricted/customer access
    setStoredSession(existing);
    return {
      success: true,
      message: "Login successful! Restricted customer access granted.",
      user: existing,
    };
  };

  const signup = (
    name: string,
    email: string,
    password: string,
    company?: string
  ) => {
    const trimmedEmail = email.trim();

    if (!name.trim()) {
      return { success: false, message: "Full Name is required." };
    }

    // Admin email cannot be re-registered
    if (trimmedEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      return {
        success: false,
        message:
          "admin@crm.com is the reserved system administrator account. Please log in directly.",
      };
    }

    // Validate email format with Regex
    const emailValidation = validateEmail(trimmedEmail);
    if (!emailValidation.isValid) {
      return { success: false, message: emailValidation.message };
    }

    // Validate password with camelCase rules
    const passwordValidation = validateCamelCasePassword(password, false);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        message: `camelCase Password Error: ${passwordValidation.message}`,
      };
    }

    // Check if user already exists
    const allUsers = getStoredUsers();
    const exists = allUsers.some(
      (u) => u.email.toLowerCase() === trimmedEmail.toLowerCase()
    );
    if (exists) {
      return {
        success: false,
        message: "An account with this email already exists. Please log in.",
      };
    }

    // Create new customer user with limited access
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      password: password,
      role: "customer",
      company: company?.trim() || "Independent Client",
      createdAt: new Date().toISOString(),
    };

    saveUser(newUser);
    setStoredSession(newUser);

    return {
      success: true,
      message: "Account created successfully! Redirecting to Dashboard...",
      user: newUser,
    };
  };

  const logout = () => {
    setStoredSession(null);
    router.push("/login");
  };

  const quickLogin = (role: UserRole) => {
    if (role === "admin") {
      login(ADMIN_EMAIL, ADMIN_PASSWORD);
      router.push("/dashboard");
    } else {
      const demoCustomer = DEFAULT_USERS.find((u) => u.role === "customer")!;
      login(demoCustomer.email, demoCustomer.password);
      router.push("/dashboard");
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin,
        login,
        signup,
        logout,
        quickLogin,
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
