"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import InputBox from "@/components/InputBox";
import {
  validateEmail,
  validateCamelCasePassword,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
} from "@/lib/auth";
import {
  IconHome,
  IconCheckCircle,
  IconAlertTriangle,
  IconArrowRight,
  IconSparkles,
  IconUser,
  IconCheck,
  IconX,
  IconShield,
} from "@/components/Icons";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const isAdminEmail = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

  // Real-time email validation using Regex (with admin exception)
  const emailValidation = email.length > 0 ? validateEmail(email) : null;

  // Real-time password validation (camelCase for non-admin, admin check for admin)
  const passwordValidation =
    password.length > 0
      ? validateCamelCasePassword(password, isAdminEmail)
      : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validate email
    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      setErrorMessage(emailCheck.message);
      return;
    }

    // Validate password
    if (isAdminEmail) {
      if (password !== ADMIN_PASSWORD) {
        setErrorMessage("Invalid credentials for admin. Password must be Crm@123");
        return;
      }
    } else {
      const passCheck = validateCamelCasePassword(password, false);
      if (!passCheck.isValid) {
        setErrorMessage(`Password requirement not met: ${passCheck.message}`);
        return;
      }
    }

    setIsSubmitting(true);
    const result = login(email, password);

    if (result.success) {
      setSuccessMessage(
        isAdminEmail
          ? "Admin authenticated! Redirecting to PrimeEstate Dashboard..."
          : "Customer authenticated! Redirecting to PrimeEstate Dashboard..."
      );
      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    } else {
      setIsSubmitting(false);
      setErrorMessage(result.message);
    }
  };

  const handleFillDemo = (type: "admin" | "customer") => {
    setErrorMessage("");
    setSuccessMessage("");
    if (type === "admin") {
      setEmail(ADMIN_EMAIL);
      setPassword(ADMIN_PASSWORD);
    } else {
      setEmail("customer@crm.com");
      setPassword("custPass123");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 bg-[#F8FAFC]">
      <div className="w-full max-w-md">
        {/* Brand Header (PrimeEstate theme) */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#4F46E5] text-white shadow-xl shadow-indigo-600/25 ring-4 ring-indigo-500/10 mb-3">
            <IconHome className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Login
          </h1>
          <p className="mt-1 text-xs text-slate-400 font-medium">
            Joint Venture Property Management • Role-Based Access
          </p>
        </div>

        {/* Quick Demo Credentials Panel */}
        <div className="mb-6 p-4 rounded-3xl bg-white border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <IconSparkles className="w-3.5 h-3.5 text-amber-500" />
              1-Click Demo Fill
            </span>
            <span className="text-[10px] text-slate-400">Quick Login</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleFillDemo("admin")}
              className="text-left p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 transition cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700">Admin</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-600 text-white font-bold">
                  Full
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium truncate mt-1">
                admin@crm.com
              </p>
              <p className="text-[10px] text-slate-400 font-mono">Crm@123</p>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo("customer")}
              className="text-left p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50 transition cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700">Customer</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold">
                  Restricted
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium truncate mt-1">
                customer@crm.com
              </p>
              <p className="text-[10px] text-slate-400 font-mono">custPass123</p>
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Sign In</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Runtime Regex email check • camelCase password enforcement
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <IconAlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Error</p>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2.5">
              <IconCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Success</p>
                <p className="mt-0.5">{successMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field with Runtime Regex Validation using reusable InputBox */}
            <InputBox
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="name@company.com or admin@crm.com"
              required
              isValid={email.length > 0 ? (isAdminEmail || emailValidation?.isValid) : null}
              validationBadge={
                isAdminEmail ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                    <IconShield className="w-3 h-3" />
                    Admin Email Recognized
                  </span>
                ) : emailValidation ? (
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                      emailValidation.isValid
                        ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                        : "text-rose-700 bg-rose-50 border-rose-200"
                    }`}
                  >
                    {emailValidation.isValid ? (
                      <IconCheck className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <IconX className="w-3 h-3 text-rose-600" />
                    )}
                    {emailValidation.isValid ? "Regex Valid" : "Regex Invalid"}
                  </span>
                ) : null
              }
              helperText={
                email.length > 0 ? (
                  <span
                    className={
                      isAdminEmail || emailValidation?.isValid
                        ? "text-emerald-600 font-medium"
                        : "text-rose-500 font-medium"
                    }
                  >
                    {isAdminEmail
                      ? "✓ Admin account exempted from standard pattern"
                      : emailValidation?.message}
                  </span>
                ) : null
              }
              metaText={
                email.length > 0
                  ? isAdminEmail
                    ? "admin override"
                    : "runtime regex check"
                  : undefined
              }
            />

            {/* Password Field with camelCase validation using reusable InputBox */}
            <InputBox
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder={isAdminEmail ? "Enter Crm@123" : "e.g., custPass123"}
              required
              showPasswordToggle={true}
              isValid={
                password.length > 0
                  ? isAdminEmail
                    ? password === ADMIN_PASSWORD
                    : passwordValidation?.isValid
                  : null
              }
              validationBadge={
                isAdminEmail ? (
                  <span className="text-[11px] font-mono text-indigo-600 font-medium">
                    Required: Crm@123
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-indigo-600">
                    camelCase format
                  </span>
                )
              }
              metaText={
                password.length > 0
                  ? isAdminEmail
                    ? "admin credential"
                    : "camelCase check"
                  : undefined
              }
            />

            {/* camelCase Runtime Requirements Indicator (for non-admin) */}
            {!isAdminEmail && password.length > 0 && passwordValidation && (
                <div className="mt-2 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center justify-between">
                    <span>camelCase Password Validation:</span>
                    <span
                      className={
                        passwordValidation.isValid
                          ? "text-emerald-600 font-bold"
                          : "text-amber-600 font-bold"
                      }
                    >
                      {passwordValidation.isValid ? "✓ Passed" : "In Progress"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px]">
                    <span
                      className={`flex items-center gap-1 ${passwordValidation.checks.startsWithLower
                          ? "text-emerald-700 font-medium"
                          : "text-slate-400"
                        }`}
                    >
                      {passwordValidation.checks.startsWithLower ? "✓" : "○"} Starts lowercase (a-z)
                    </span>
                    <span
                      className={`flex items-center gap-1 ${passwordValidation.checks.hasUpper
                          ? "text-emerald-700 font-medium"
                          : "text-slate-400"
                        }`}
                    >
                      {passwordValidation.checks.hasUpper ? "✓" : "○"} Has uppercase (A-Z)
                    </span>
                    <span
                      className={`flex items-center gap-1 ${passwordValidation.checks.noSpaces
                          ? "text-emerald-700 font-medium"
                          : "text-slate-400"
                        }`}
                    >
                      {passwordValidation.checks.noSpaces ? "✓" : "○"} No spaces
                    </span>
                    <span
                      className={`flex items-center gap-1 ${passwordValidation.checks.minLength
                          ? "text-emerald-700 font-medium"
                          : "text-slate-400"
                        }`}
                    >
                      {passwordValidation.checks.minLength ? "✓" : "○"} Min 6 characters
                    </span>
                  </div>
                </div>
              )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs bg-[#4F46E5] hover:bg-[#4338CA] shadow-md shadow-indigo-600/20 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>
                    Sign In as{" "}
                    {isAdminEmail ? "Administrator" : "Customer / Client"}
                  </span>
                  <IconArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Role Preview Legend */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <IconUser className="w-3.5 h-3.5 text-slate-400" />
              <span>
                New to PrimeEstate?{" "}
                <Link
                  href="/signup"
                  className="font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
                >
                  Create Customer Account
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
