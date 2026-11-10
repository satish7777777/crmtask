export type UserRole = "admin" | "customer";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // stored for demo / validation
  role: UserRole;
  company?: string;
  createdAt: string;
}

export interface ValidationState {
  isValid: boolean;
  message: string;
}

export interface PasswordValidationState {
  isValid: boolean;
  message: string;
  checks: {
    startsWithLower: boolean;
    hasUpper: boolean;
    noSpaces: boolean;
    minLength: boolean;
  };
}

export interface CRMModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  adminOnly: boolean;
  category: "core" | "sales" | "support" | "admin";
}

