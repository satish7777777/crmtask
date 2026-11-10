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
} from "@/lib/auth";
import {
  IconHome,
  IconCheckCircle,
  IconAlertTriangle,
  IconArrowRight,
  IconCheck,
  IconX,
  IconInfo,
} from "@/components/Icons";

export default function SignupPage() {
  const router = useRouter();
  const { signup, user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const isAdminAttempt =
    email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

  // Real-time Regex email validation
  const emailValidation = email.length > 0 ? validateEmail(email) : null;

  // Real-time camelCase password validation
  const passwordValidation =
    password.length > 0 ? validateCamelCasePassword(password, false) : null;

  // Confirm password match check
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (isAdminAttempt) {
      setErrorMessage(
        "admin@crm.com is reserved for the System Administrator. Please sign in instead."
      );
      return;
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      setErrorMessage(`Email format error: ${emailCheck.message}`);
      return;
    }

    const passCheck = validateCamelCasePassword(password, false);
    if (!passCheck.isValid) {
      setErrorMessage(`camelCase Password Error: ${passCheck.message}`);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const result = signup(name, email, password, company);

    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    } else {
      setIsSubmitting(false);
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 bg-[#F8FAFC]">
      <div className="w-full max-w-lg">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#4F46E5] text-white shadow-xl shadow-indigo-600/25 ring-4 ring-indigo-500/10 mb-3">
            <IconHome className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Create Account
          </h1>
          <p className="mt-1 text-xs text-slate-400 font-medium">
            Sign up as Customer with limited module access
          </p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
          {/* Role Disclosure Banner */}
          <div className="mb-6 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <IconInfo className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">
                Customer Account Notice
              </p>
              <p className="mt-0.5 text-amber-700 text-[11px]">
                New accounts receive <strong>Customer Role</strong> with access to view property listings, submit JV inquiries, and track tickets. Full administrative control is reserved for{" "}
                <code className="bg-amber-100 px-1 py-0.2 rounded font-mono font-bold text-amber-900">
                  admin@crm.com
                </code>
                .
              </p>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <IconAlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Validation Error</p>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2.5">
              <IconCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Account Created</p>
                <p className="mt-0.5">{successMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name & Company using reusable InputBox */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <InputBox
                label="Full Name"
                value={name}
                onChange={setName}
                placeholder="Jane Doe"
                required
              />

              <InputBox
                label="Company / Organization"
                value={company}
                onChange={setCompany}
                placeholder="Acme Global Inc."
              />
            </div>

            {/* Email Field with Runtime Regex Validation using reusable InputBox */}
            <InputBox
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="client@company.com"
              required
              isValid={email.length > 0 ? (!isAdminAttempt && emailValidation?.isValid) : null}
              validationBadge={
                isAdminAttempt ? (
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    Admin email reserved
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
                      !isAdminAttempt && emailValidation?.isValid
                        ? "text-emerald-600 font-medium"
                        : "text-rose-500 font-medium"
                    }
                  >
                    {isAdminAttempt
                      ? "admin@crm.com cannot be registered as a new user."
                      : emailValidation?.message}
                  </span>
                ) : null
              }
              metaText={email.length > 0 ? "runtime regex validation" : undefined}
            />

            {/* Password Field with camelCase validation using reusable InputBox */}
            <InputBox
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="e.g. userPassword123"
              required
              showPasswordToggle={true}
              isValid={password.length > 0 ? passwordValidation?.isValid : null}
              validationBadge={
                <span className="text-[11px] font-semibold text-indigo-600">
                  must use camelCase
                </span>
              }
            />

            {/* camelCase Runtime Checklist */}
            {password.length > 0 && passwordValidation && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-[11px] font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>camelCase Password Requirements:</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      passwordValidation.isValid
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {passwordValidation.isValid ? "✓ Valid camelCase" : "Incomplete"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div
                    className={`flex items-center gap-1.5 ${
                      passwordValidation.checks.startsWithLower
                        ? "text-emerald-700 font-medium"
                        : "text-slate-400"
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full inline-flex items-center justify-center text-[9px] border border-current">
                      {passwordValidation.checks.startsWithLower ? "✓" : "1"}
                    </span>
                    <span>Starts lowercase (a-z)</span>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 ${
                      passwordValidation.checks.hasUpper
                        ? "text-emerald-700 font-medium"
                        : "text-slate-400"
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full inline-flex items-center justify-center text-[9px] border border-current">
                      {passwordValidation.checks.hasUpper ? "✓" : "2"}
                    </span>
                    <span>Contains uppercase (A-Z)</span>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 ${
                      passwordValidation.checks.noSpaces
                        ? "text-emerald-700 font-medium"
                        : "text-slate-400"
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full inline-flex items-center justify-center text-[9px] border border-current">
                      {passwordValidation.checks.noSpaces ? "✓" : "3"}
                    </span>
                    <span>No whitespace / spaces</span>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 ${
                      passwordValidation.checks.minLength
                        ? "text-emerald-700 font-medium"
                        : "text-slate-400"
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full inline-flex items-center justify-center text-[9px] border border-current">
                      {passwordValidation.checks.minLength ? "✓" : "4"}
                    </span>
                    <span>At least 6 characters</span>
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Password using reusable InputBox */}
            <InputBox
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Re-enter camelCase password"
              required
              showPasswordToggle={true}
              isValid={confirmPassword.length > 0 ? passwordsMatch : null}
              validationBadge={
                confirmPassword.length > 0 ? (
                  <span
                    className={`text-[11px] font-semibold ${
                      passwordsMatch ? "text-emerald-600" : "text-rose-500"
                    }`}
                  >
                    {passwordsMatch ? "✓ Passwords match" : "✗ Does not match"}
                  </span>
                ) : null
              }
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs bg-[#4F46E5] hover:bg-[#4338CA] shadow-md shadow-indigo-600/20 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Registering Account...</span>
                </>
              ) : (
                <>
                  <span>Create Customer Account</span>
                  <IconArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#4F46E5] hover:text-[#4338CA] transition"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
