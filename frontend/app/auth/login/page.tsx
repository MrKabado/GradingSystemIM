"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"login" | "signup" | "forgot">("login");

  // Forgot password state
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Sign up state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const inputBase =
    "w-full rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-all duration-150 placeholder:text-[#3d4466]";
  const inputStyle = {
    background: "#1a2236",
    border: "1px solid rgba(255,255,255,0.07)",
  };
  const inputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = "1px solid rgba(99,102,241,0.6)";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
  };
  const inputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-linear-to-b from-[#0d0f1a] to-[#13162A]">
      {/* Login / Sign Up card */}
      <div
        className="relative z-10 w-full max-w-xs mx-4 rounded-2xl px-8 py-5 mt-15"
        style={{
          background: "#13162A",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Logo + brand */}
        <div className="flex flex-col items-center mb-3">
          <div
            className="w-13 h-13 rounded-xl flex items-center justify-center mb-3 text-white font-bold text-lg tracking-tight select-none"
            style={{
              background: "#6366F1",
              boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
            }}
          >
            GS
          </div>
          <h1 className="text-white text-lg font-semibold tracking-tight leading-none mb-0.5">
            GradeSync
          </h1>
          <p className="text-xs" style={{ color: "#6b7499" }}>
            Administrator Portal
          </p>
        </div>

        {/* Tab switcher — hidden on forgot password view */}
        {view !== "forgot" && (
          <div
            className="flex rounded-xl p-1 mb-5"
            style={{ background: "#1a2236" }}
          >
            {(["login", "signup"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setView(tab)}
                className="flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all duration-200"
                style={
                  view === tab
                    ? {
                        background: "#6366F1",
                        color: "#fff",
                        boxShadow: "0 2px 10px rgba(99,102,241,0.35)",
                      }
                    : { color: "#6b7499" }
                }
              >
                {tab === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>
        )}

        {/* ── SIGN IN ── */}
        {view === "login" && (
          <>
            <div className="mb-4">
              <h2 className="text-white text-xl font-semibold mb-0.5">
                Sign in
              </h2>
              <p className="text-xs" style={{ color: "#6b7499" }}>
                Access the admin dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium"
                  style={{ color: "#a0a8c4" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@email.com"
                  required
                  className={inputBase}
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium"
                  style={{ color: "#a0a8c4" }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`${inputBase} pr-10`}
                    style={inputStyle}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7499] hover:text-[#a0a8c4] transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-2xl py-2.5 text-sm font-semibold text-white transition-all duration-150 active:scale-[0.98] disabled:opacity-70 bg-[#6366F1] cursor-pointer"
                style={{
                  boxShadow: loading ? "none" : "0 4px 20px rgba(99,102,241,0.35)",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Forgot password */}
            <p className="mt-5 text-center text-xs" style={{ color: "#6b7499" }}>
              Forgot Password?{" "}
              <button
                type="button"
                onClick={() => { setResetSent(false); setView("forgot"); }}
                className="font-medium transition-colors hover:text-white cursor-pointer"
                style={{ color: "#818cf8" }}
              >
                Reset
              </button>
            </p>
          </>
        )}

        {/* ── SIGN UP ── */}
        {view === "signup" && (
          <>
            <div className="mb-4">
              <h2 className="text-white text-xl font-semibold mb-0.5">
                Create account
              </h2>
              <p className="text-xs" style={{ color: "#6b7499" }}>
                Register a new admin account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {/* Full name */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium"
                  style={{ color: "#a0a8c4" }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Jane Smith"
                  required
                  className={inputBase}
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium"
                  style={{ color: "#a0a8c4" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="admin@email.com"
                  required
                  className={inputBase}
                  style={inputStyle}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium"
                  style={{ color: "#a0a8c4" }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`${inputBase} pr-10`}
                    style={inputStyle}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7499] hover:text-[#a0a8c4] transition-colors"
                    tabIndex={-1}
                  >
                    {showSignupPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-2xl py-2.5 text-sm font-semibold text-white transition-all duration-150 active:scale-[0.98] disabled:opacity-70 bg-[#6366F1]"
                style={{
                  boxShadow: loading ? "none" : "0 4px 20px rgba(99,102,241,0.35)",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Creating account…
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-xs" style={{ color: "#6b7499" }}>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setView("login")}
                className="font-medium transition-colors hover:text-white cursor-pointer"
                style={{ color: "#818cf8" }}
              >
                Sign in
              </button>
            </p>
          </>
        )}
        {/* ── FORGOT PASSWORD ── */}
        {view === "forgot" && (
          <>
            {/* Back button */}
            <button
              type="button"
              onClick={() => setView("login")}
              className="flex items-center gap-1.5 text-xs mb-4 transition-colors hover:text-white cursor-pointer"
              style={{ color: "#6b7499" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Back to Sign In
            </button>

            <div className="mb-4">
              <h2 className="text-white text-xl font-semibold mb-0.5">
                Reset password
              </h2>
              <p className="text-xs" style={{ color: "#6b7499" }}>
                Enter your email and we'll send you a reset link
              </p>
            </div>

            {resetSent ? (
              <div
                className="rounded-xl px-4 py-4 flex flex-col items-center gap-2 text-center"
                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center mb-1"
                  style={{ background: "rgba(99,102,241,0.2)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
                <p className="text-sm font-semibold text-white">Check your inbox</p>
                <p className="text-xs" style={{ color: "#6b7499" }}>
                  A reset link was sent to{" "}
                  <span style={{ color: "#818cf8" }}>{resetEmail}</span>
                </p>
                <button
                  type="button"
                  onClick={() => { setResetSent(false); setResetEmail(""); setView("login"); }}
                  className="mt-2 text-xs font-medium transition-colors hover:text-white"
                  style={{ color: "#818cf8" }}
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setLoading(true);
                  setTimeout(() => { setLoading(false); setResetSent(true); }, 1500);
                }}
                className="flex flex-col gap-3"
              >
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" style={{ color: "#a0a8c4" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="admin@email.com"
                    required
                    className={inputBase}
                    style={inputStyle}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 w-full rounded-2xl py-2.5 text-sm font-semibold text-white transition-all duration-150 active:scale-[0.98] disabled:opacity-70 bg-[#6366F1]"
                  style={{
                    boxShadow: loading ? "none" : "0 4px 20px rgba(99,102,241,0.35)",
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Sending…
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}