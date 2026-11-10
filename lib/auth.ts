import { User, ValidationState, PasswordValidationState, CRMModule } from "./auth-types";

export const ADMIN_EMAIL = "admin@crm.com";
export const ADMIN_PASSWORD = "Crm@123";

// Standard RFC-compliant email regex
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates an email address at runtime.
 * Exception: "admin@crm.com" is recognized directly as the system admin email
 * and bypasses standard regex failure checks.
 */
export function validateEmail(email: string): ValidationState {
  const trimmed = email.trim();
  if (!trimmed) {
    return { isValid: false, message: "Email is required" };
  }

  // Pre-check exception for admin email
  if (trimmed.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return {
      isValid: true,
      message: "Admin email recognized (Full Access)",
    };
  }

  // Use Regex for validating all other emails at runtime
  const isValidFormat = EMAIL_REGEX.test(trimmed);
  if (!isValidFormat) {
    return {
      isValid: false,
      message: "Invalid email format. Must match name@domain.ext",
    };
  }

  return {
    isValid: true,
    message: "Valid email address format",
  };
}

/**
 * Validates camelCase password at runtime.
 * Criteria for camelCase:
 * 1. Must start with a lowercase letter (e.g. a-z)
 * 2. Must contain at least one uppercase letter (e.g. A-Z)
 * 3. Must not contain whitespace
 * 4. Must be at least 6 characters long
 *
 * (Special case: if checking login for admin@crm.com, password is Crm@123)
 */
export function validateCamelCasePassword(
  password: string,
  forAdmin: boolean = false
): PasswordValidationState {
  if (forAdmin) {
    const isMatch = password === ADMIN_PASSWORD;
    return {
      isValid: isMatch,
      message: isMatch ? "Admin password matches" : "Admin password required: Crm@123",
      checks: {
        startsWithLower: false,
        hasUpper: true,
        noSpaces: true,
        minLength: true,
      },
    };
  }

  const startsWithLower = /^[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const noSpaces = /^\S+$/.test(password) && password.length > 0;
  const minLength = password.length >= 6;

  const isValid = startsWithLower && hasUpper && noSpaces && minLength;

  let message = "Valid camelCase password";
  if (!password) {
    message = "Password is required";
  } else if (!startsWithLower) {
    message = "camelCase password must start with a lowercase letter (a-z)";
  } else if (!hasUpper) {
    message = "camelCase password must contain at least one uppercase letter (A-Z)";
  } else if (!noSpaces) {
    message = "Password cannot contain spaces";
  } else if (!minLength) {
    message = "Password must be at least 6 characters long";
  }

  return {
    isValid,
    message,
    checks: {
      startsWithLower,
      hasUpper,
      noSpaces,
      minLength,
    },
  };
}

// Default pre-seeded users
export const DEFAULT_USERS: User[] = [
  {
    id: "user-admin",
    name: "System Administrator",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "admin",
    company: "CRM Global HQ",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-customer-demo",
    name: "Sarah Jenkins (Client)",
    email: "customer@crm.com",
    password: "custPass123", // camelCase
    role: "customer",
    company: "Acme Corporation",
    createdAt: new Date().toISOString(),
  },
];

// Modules list with Admin-only vs Customer-accessible designation
export const CRM_MODULES: CRMModule[] = [
  {
    id: "overview",
    name: "Dashboard Overview",
    description: "Key metrics, live activity stream, and business performance KPIs.",
    icon: "dashboard",
    adminOnly: false, // Customer has limited view, Admin has full view
    category: "core",
  },
  {
    id: "customers",
    name: "Customer Accounts",
    description: "Manage client directory, contact details, account tier, and history.",
    icon: "users",
    adminOnly: false, // Customer sees only their own account, Admin has full CRUD
    category: "core",
  },
  {
    id: "pipeline",
    name: "Leads & Sales Pipeline",
    description: "Full stage management, deal forecasting, lead scoring & assignments.",
    icon: "funnel",
    adminOnly: true, // Restricted to Admin
    category: "sales",
  },
  {
    id: "deals",
    name: "Deals & Revenue Financials",
    description: "Revenue tracking, closed deals, financial projections, and commissions.",
    icon: "dollar",
    adminOnly: true, // Restricted to Admin
    category: "sales",
  },
  {
    id: "support",
    name: "Support & Helpdesk Tickets",
    description: "Raise tickets, track resolution status, and communicate with support staff.",
    icon: "ticket",
    adminOnly: false, // Accessible to both Admin and Customer!
    category: "support",
  },
  {
    id: "invoices",
    name: "Invoices & Billing",
    description: "Manage subscription plans, view invoice history, and billing receipts.",
    icon: "file-text",
    adminOnly: false, // Admin sees all company billing, customer sees personal billing
    category: "core",
  },
  {
    id: "team",
    name: "User & Team Management",
    description: "Invite employees, assign RBAC permissions, and manage staff seats.",
    icon: "shield",
    adminOnly: true, // Restricted to Admin
    category: "admin",
  },
  {
    id: "settings",
    name: "System Settings & Audit Logs",
    description: "CRM configuration, Webhooks, API keys, and security audit records.",
    icon: "settings",
    adminOnly: true, // Restricted to Admin
    category: "admin",
  },
];

// LocalStorage helpers for browser persistence
const USERS_STORAGE_KEY = "crm_users_db";
const SESSION_STORAGE_KEY = "crm_current_user_session";

export function getStoredUsers(): User[] {
  if (typeof window === "undefined") return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

export function saveUser(newUser: User): void {
  if (typeof window === "undefined") return;
  const current = getStoredUsers();
  const exists = current.some((u) => u.email.toLowerCase() === newUser.email.toLowerCase());
  if (exists) {
    const updated = current.map((u) =>
      u.email.toLowerCase() === newUser.email.toLowerCase() ? newUser : u
    );
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
  } else {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...current, newUser]));
  }
}

export function getStoredSession(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredSession(user: User | null): void {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } else {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  }
  window.dispatchEvent(new Event("crm-auth-change"));
}
