import React, { useState, useEffect } from "react";
import { Screen } from "../types";
import { TapServeLogo, TapServeIcon, A } from "../components/SharedUI";
import { UserAccount, AppStorage } from "../data/mockData";

// ─── Splash Screen ────────────────────────────────────────────────────────────
export function SplashScreen({ nav }: { nav: (s: Screen) => void }) {
  useEffect(() => {
    const t = setTimeout(() => nav("login"), 1600);
    return () => clearTimeout(t);
  }, [nav]);

  return (
    <div
      className="bg-[#115e59] flex flex-col items-center justify-between size-full cursor-pointer select-none"
      onClick={() => nav("login")}
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
        <div className="bg-white drop-shadow-[0px_8px_20px_rgba(0,0,0,0.22)] flex items-center justify-center rounded-[28px] size-28 scale-in p-2.5">
          <TapServeLogo size={88} />
        </div>
        <h1
          className="text-white text-[36px] font-bold tracking-tight"
          style={{ fontFamily: "Lexend Deca, sans-serif" }}
        >
          TapServe
        </h1>
        <p className="text-[#ccfbf1] text-sm leading-relaxed font-medium max-w-[280px]">
          AI-Driven Household Services Matching with Live Location Tracking
        </p>
      </div>
      <div className="flex flex-col items-center gap-6 p-8 w-full">
        <div className="bg-white/[0.12] border border-white/20 flex gap-2 items-center px-4 py-2 rounded-full">
          <svg className="size-4 text-[#5eead4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-white text-[13px] font-semibold">
            San Pablo City, Laguna
          </span>
        </div>
        <div className="w-[139px] h-[5px] bg-white/40 rounded-full" />
      </div>
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
export function LoginScreen({
  nav,
  onLoginSuccess,
  onToast,
}: {
  nav: (s: Screen) => void;
  onLoginSuccess: (user: UserAccount) => void;
  onToast: (msg: string) => void;
}) {
  const [tab, setTab] = useState<"login" | "signup">("login");

  // Login form state
  const [email, setEmail] = useState("user@tapserve.demo");
  const [password, setPassword] = useState("12345678");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Sign up form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPass, setSignupPass] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupError, setSignupError] = useState("");

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError("");

    if (!email.trim() || !password.trim()) {
      setLoginError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const accounts = AppStorage.getRegisteredAccounts();
      const matched = accounts.find(
        (a) =>
          a.email.toLowerCase() === email.trim().toLowerCase() &&
          a.pass === password
      );

      // Check standard demo accounts or registered accounts
      if (
        matched ||
        (email.trim().toLowerCase() === "user@tapserve.demo" && password === "12345678") ||
        (email.trim().toLowerCase() === "carlo.santos@gmail.com" && password === "password123")
      ) {
        const currentUser = AppStorage.getUser();
        const updatedUser: UserAccount = {
          ...currentUser,
          name: matched ? matched.name : (currentUser.name || "Carlo Santos"),
          email: email.trim(),
        };
        AppStorage.saveUser(updatedUser);
        onLoginSuccess(updatedUser);
        onToast("Login successful! Welcome back.");
        nav("home");
      } else {
        setLoginError("Invalid credentials. Try demo: user@tapserve.demo / 12345678");
      }
    }, 700);
  };

  const handleQuickDemo = () => {
    setEmail("user@tapserve.demo");
    setPassword("12345678");
    setLoginError("");
  };

  const handleSignUp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSignupError("");

    if (!signupName.trim()) {
      setSignupError("Please enter your full name.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupEmail.trim())) {
      setSignupError("Please enter a valid email address.");
      return;
    }
    if (signupPass.length < 6) {
      setSignupError("Password must be at least 6 characters.");
      return;
    }
    if (signupPass !== signupConfirm) {
      setSignupError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      AppStorage.saveRegisteredAccount({
        name: signupName.trim(),
        email: signupEmail.trim(),
        pass: signupPass,
      });

      const newUser: UserAccount = {
        name: signupName.trim(),
        email: signupEmail.trim(),
        phone: "+63 917 555 0000",
        address: "San Pablo City, Laguna",
        rating: 5.0,
        memberSince: "2026",
        isProvider: false,
        providerApplicationStatus: "None",
      };
      AppStorage.saveUser(newUser);
      onLoginSuccess(newUser);
      onToast("Account created successfully! Welcome to TapServe.");
      nav("home");
    }, 800);
  };

  return (
    <div className="bg-[#f8fafc] flex flex-col justify-between size-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex flex-col gap-2 items-start pb-3 pt-6 px-6">
          <div className="flex gap-2.5 items-center">
            <div className="size-11 rounded-2xl bg-white border-2 border-[#ccfbf1] p-1 flex items-center justify-center shadow-xs shrink-0">
              <TapServeIcon size={36} />
            </div>
            <span
              className="text-[#0f172a] text-[24px] font-black tracking-tight leading-none"
              style={{ fontFamily: "Lexend Deca, sans-serif" }}
            >
              Tap<span className="text-[#0d9488]">Serve</span>
            </span>
          </div>
          <h2
            className="text-[#0f172a] text-2xl font-bold tracking-tight mt-1"
            style={{ fontFamily: "Lexend Deca, sans-serif" }}
          >
            {tab === "login" ? "Welcome to TapServe" : "Create Your Account"}
          </h2>
          <p className="text-[#475569] text-xs leading-relaxed">
            Find trusted professional help for your household needs in San Pablo City.
          </p>
        </div>

        {/* Tabs */}
        <div className="px-6 pb-4">
          <div className="bg-[#e2e8f0] flex gap-1 p-1 rounded-xl">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setLoginError("");
                  setSignupError("");
                }}
                className={`flex-1 h-10 rounded-lg text-sm transition-all touch-manipulation font-semibold ${
                  tab === t
                    ? "bg-white text-[#0f766e] shadow-sm"
                    : "text-[#64748b]"
                }`}
              >
                {t === "login" ? "Login" : "Sign Up"}
              </button>
            ))}
          </div>
        </div>

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-3.5 px-6">
            {/* Quick Demo Pill */}
            <div className="bg-[#f0fdfa] border border-[#ccfbf1] p-2.5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0f766e]">Demo Account:</span>
                <span className="text-[11px] text-[#0d9488] font-mono">user@tapserve.demo</span>
              </div>
              <button
                type="button"
                onClick={handleQuickDemo}
                className="bg-[#0d9488] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg active:scale-95 transition-transform"
              >
                Fill Demo
              </button>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
                <svg className="size-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{loginError}</span>
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#0f172a] text-xs font-bold">
                Email Address
              </label>
              <div className="bg-white border border-[#e2e8f0] flex gap-3 h-12 items-center px-4 rounded-xl focus-within:border-[#0d9488]">
                <svg className="size-5 text-[#94a3b8] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="flex-1 text-[#0f172a] text-sm bg-transparent outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#0f172a] text-xs font-bold">
                Password
              </label>
              <div className="bg-white border border-[#e2e8f0] flex gap-3 h-12 items-center px-4 rounded-xl relative focus-within:border-[#0d9488]">
                <svg className="size-5 text-[#94a3b8] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 text-[#0f172a] text-sm bg-transparent outline-none pr-8"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#0f172a]"
                >
                  {showPass ? (
                    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between pt-0.5">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="flex gap-2 items-center touch-manipulation"
              >
                <div
                  className={`flex items-center justify-center rounded size-5 transition-colors ${
                    rememberMe ? "bg-[#0d9488]" : "border border-[#e2e8f0] bg-white"
                  }`}
                >
                  {rememberMe && (
                    <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-[#475569] text-xs font-medium">
                  Remember me
                </span>
              </button>
              <button
                type="button"
                onClick={() => onToast("Password reset instructions sent to your email.")}
              >
                <span className="text-[#0d9488] text-xs font-bold">
                  Forgot Password?
                </span>
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0d9488] shadow-md flex h-12 items-center justify-center rounded-xl w-full active:brightness-90 transition-all touch-manipulation disabled:opacity-70 mt-1 cursor-pointer"
            >
              <span className="text-white text-base font-bold">
                {loading ? "Logging in…" : "Log In"}
              </span>
            </button>

            {/* Social Separator */}
            <div className="flex gap-3 items-center my-0.5">
              <div className="flex-1 h-px bg-[#e2e8f0]" />
              <span className="text-[#94a3b8] text-[10px] font-bold tracking-wider">
                OR CONTINUE WITH
              </span>
              <div className="flex-1 h-px bg-[#e2e8f0]" />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setEmail("carlo.santos@gmail.com");
                  setPassword("password123");
                  onToast("Google demo account selected.");
                }}
                className="bg-white border border-[#e2e8f0] hover:border-[#cbd5e1] flex flex-1 gap-2.5 h-11 items-center justify-center rounded-xl active:bg-gray-50 touch-manipulation text-xs font-bold text-[#0f172a] shadow-xs transition-all cursor-pointer"
              >
                <img src={`${A}google_logo.jpg`} className="size-5 rounded-full object-cover shrink-0" alt="Google" />
                Google
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("carlo.santos@gmail.com");
                  setPassword("password123");
                  onToast("Facebook demo account selected.");
                }}
                className="bg-white border border-[#e2e8f0] hover:border-[#cbd5e1] flex flex-1 gap-2.5 h-11 items-center justify-center rounded-xl active:bg-gray-50 touch-manipulation text-xs font-bold text-[#0f172a] shadow-xs transition-all cursor-pointer"
              >
                <img src={`${A}fb_logo.png`} className="size-5 rounded-sm object-contain shrink-0" alt="Facebook" />
                Facebook
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="flex flex-col gap-3 px-6">
            {signupError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
                <svg className="size-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{signupError}</span>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-[#0f172a] text-xs font-bold">
                Full Name
              </label>
              <div className="bg-white border border-[#e2e8f0] flex gap-3 h-11 items-center px-4 rounded-xl">
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Juan Dela Cruz"
                  className="flex-1 text-[#0f172a] text-sm bg-transparent outline-none placeholder:text-[#94a3b8]"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#0f172a] text-xs font-bold">
                Email Address
              </label>
              <div className="bg-white border border-[#e2e8f0] flex gap-3 h-11 items-center px-4 rounded-xl">
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="juan@email.com"
                  className="flex-1 text-[#0f172a] text-sm bg-transparent outline-none placeholder:text-[#94a3b8]"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#0f172a] text-xs font-bold">
                Password
              </label>
              <div className="bg-white border border-[#e2e8f0] flex gap-3 h-11 items-center px-4 rounded-xl">
                <input
                  type="password"
                  value={signupPass}
                  onChange={(e) => setSignupPass(e.target.value)}
                  placeholder="At least 6 characters"
                  className="flex-1 text-[#0f172a] text-sm bg-transparent outline-none placeholder:text-[#94a3b8]"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#0f172a] text-xs font-bold">
                Confirm Password
              </label>
              <div className="bg-white border border-[#e2e8f0] flex gap-3 h-11 items-center px-4 rounded-xl">
                <input
                  type="password"
                  value={signupConfirm}
                  onChange={(e) => setSignupConfirm(e.target.value)}
                  placeholder="Re-type your password"
                  className="flex-1 text-[#0f172a] text-sm bg-transparent outline-none placeholder:text-[#94a3b8]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#0d9488] shadow-md flex h-12 items-center justify-center rounded-xl w-full active:brightness-90 transition-all touch-manipulation font-bold text-white text-base mt-2 cursor-pointer"
            >
              {loading ? "Creating Account…" : "Create Account"}
            </button>

            {/* Social Sign Up Separator */}
            <div className="flex gap-3 items-center my-0.5">
              <div className="flex-1 h-px bg-[#e2e8f0]" />
              <span className="text-[#94a3b8] text-[10px] font-bold tracking-wider">
                OR SIGN UP WITH
              </span>
              <div className="flex-1 h-px bg-[#e2e8f0]" />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setSignupName("Carlo Santos");
                  setSignupEmail("carlo.santos@gmail.com");
                  setSignupPass("password123");
                  setSignupConfirm("password123");
                  onToast("Google account details filled.");
                }}
                className="bg-white border border-[#e2e8f0] hover:border-[#cbd5e1] flex flex-1 gap-2.5 h-11 items-center justify-center rounded-xl active:bg-gray-50 touch-manipulation text-xs font-bold text-[#0f172a] shadow-xs transition-all cursor-pointer"
              >
                <img src={`${A}google_logo.jpg`} className="size-5 rounded-full object-cover shrink-0" alt="Google" />
                Google
              </button>
              <button
                type="button"
                onClick={() => {
                  setSignupName("Carlo Santos");
                  setSignupEmail("carlo.santos@gmail.com");
                  setSignupPass("password123");
                  setSignupConfirm("password123");
                  onToast("Facebook account details filled.");
                }}
                className="bg-white border border-[#e2e8f0] hover:border-[#cbd5e1] flex flex-1 gap-2.5 h-11 items-center justify-center rounded-xl active:bg-gray-50 touch-manipulation text-xs font-bold text-[#0f172a] shadow-xs transition-all cursor-pointer"
              >
                <img src={`${A}fb_logo.png`} className="size-5 rounded-sm object-contain shrink-0" alt="Facebook" />
                Facebook
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Footer Section */}
      <div className="flex flex-col gap-3.5 items-center p-6 pt-3">
        {/* Clickable Terms & Privacy links */}
        <p className="text-[#94a3b8] text-xs text-center leading-relaxed max-w-[300px]">
          By continuing, you agree to TapServe&apos;s{" "}
          <button
            type="button"
            onClick={() => nav("terms-conditions")}
            className="text-[#0f766e] font-semibold underline touch-manipulation cursor-pointer"
          >
            Terms and Conditions
          </button>{" "}
          and
          <br />
          <button
            type="button"
            onClick={() => nav("privacy-policy")}
            className="text-[#0f766e] font-semibold underline touch-manipulation cursor-pointer"
          >
            Privacy Policy
          </button>
          .
        </p>

        {/* Functional "Want to earn as a specialist?" CTA Card */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => nav("provider-apply")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") nav("provider-apply");
          }}
          className="bg-gradient-to-r from-[#f0fdfa] to-emerald-50/60 border-2 border-[#14b8a6]/40 flex items-center justify-between p-4 rounded-3xl w-full text-left cursor-pointer active:scale-[0.99] touch-manipulation shadow-xs hover:border-[#0f766e] transition-all group"
          aria-label="Want to earn as a specialist? Apply as Service Provider"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="size-11 rounded-2xl bg-[#115e59] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#0f766e] transition-colors">
              <svg
                className="size-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 7h-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 00-8 0" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v2" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-[#0f766e] font-extrabold uppercase tracking-wider">
                Want to earn as a specialist?
              </span>
              <span className="text-[#1F2937] text-sm font-bold truncate">
                Apply as Service Provider →
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-[#6b7280]">Join certified home pros in Laguna</span>
                <span className="text-[10px] text-slate-300">•</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nav("provider-terms");
                  }}
                  className="text-[#0f766e] hover:underline text-[10px] font-semibold touch-manipulation cursor-pointer"
                >
                  Terms
                </button>
              </div>
            </div>
          </div>
          <div className="size-8 rounded-full bg-white border border-[#14b8a6]/30 flex items-center justify-center text-[#0f766e] group-hover:translate-x-0.5 transition-transform shrink-0 shadow-2xs">
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <div className="w-[139px] h-[5px] bg-black/40 rounded-full mt-1" />
      </div>
    </div>
  );
}

// ─── Terms & Conditions Screen ────────────────────────────────────────────────
export function TermsConditionsScreen({ goBack }: { goBack: () => void }) {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      body: "By accessing or using TapServe, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, please do not use the platform.",
    },
    {
      title: "2. Household Matching Services",
      body: "TapServe is an AI-driven household services matching platform that connects clients with verified independent service providers in San Pablo City, Laguna. TapServe provides the platform and matching technology but is not an employer.",
    },
    {
      title: "3. Booking & Fair Cancellations",
      body: "Clients and providers agree to respect scheduled time slots. Cancellations made after a provider has accepted may be recorded to protect provider schedules and prevent platform misuse.",
    },
    {
      title: "4. Cash Payments on Completion",
      body: "Payment is made in cash directly to the Service Provider upon satisfactory completion of the requested household task.",
    },
    {
      title: "5. Code of Conduct & Safety",
      body: "Users and Service Providers agree to communicate respectfully, maintain safety standards, and adhere to local city laws during service execution.",
    },
  ];

  return (
    <div className="bg-[#f8fafc] flex flex-col size-full">
      <div className="bg-[#115e59] flex gap-3 items-center px-5 pt-12 pb-5 shrink-0">
        <button
          onClick={goBack}
          className="bg-white/15 flex items-center justify-center rounded-xl size-9 active:bg-white/25 touch-manipulation text-white"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white text-lg font-bold flex-1" style={{ fontFamily: "Lexend Deca, sans-serif" }}>
          Terms and Conditions
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4">
        <div className="bg-[#f0fdfa] border border-[#ccfbf1] rounded-2xl px-4 py-3">
          <p className="text-[#0f766e] text-xs font-semibold">TapServe User Agreement · San Pablo City</p>
        </div>
        {sections.map((s) => (
          <div key={s.title} className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
            <p className="text-[#0f172a] text-sm font-bold">{s.title}</p>
            <p className="text-[#475569] text-xs leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Privacy Policy Screen ────────────────────────────────────────────────────
export function PrivacyPolicyScreen({ goBack }: { goBack: () => void }) {
  const sections = [
    {
      title: "1. Information We Collect",
      body: "We collect information you provide (name, email, phone number, address) and location data to match you with nearby service providers in San Pablo City.",
    },
    {
      title: "2. How We Use Location Data",
      body: "Location data is utilized specifically for estimated arrival times (ETA), live map tracking when a provider is on the way, and accurate distance calculation.",
    },
    {
      title: "3. Anonymous Reviews Option",
      body: "Users may choose to submit reviews anonymously to protect personal privacy while providing valuable feedback for service improvement.",
    },
    {
      title: "4. Data Security",
      body: "Uploaded verification documents for Service Providers (IDs, clearances) are securely stored and strictly used for platform verification.",
    },
  ];

  return (
    <div className="bg-[#f8fafc] flex flex-col size-full">
      <div className="bg-[#115e59] flex gap-3 items-center px-5 pt-12 pb-5 shrink-0">
        <button
          onClick={goBack}
          className="bg-white/15 flex items-center justify-center rounded-xl size-9 active:bg-white/25 touch-manipulation text-white"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white text-lg font-bold flex-1" style={{ fontFamily: "Lexend Deca, sans-serif" }}>
          Privacy Policy
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4">
        <div className="bg-[#f0fdfa] border border-[#ccfbf1] rounded-2xl px-4 py-3">
          <p className="text-[#0f766e] text-xs font-semibold">TapServe Privacy Guidelines</p>
        </div>
        {sections.map((s) => (
          <div key={s.title} className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
            <p className="text-[#0f172a] text-sm font-bold">{s.title}</p>
            <p className="text-[#475569] text-xs leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Provider Terms Screen ────────────────────────────────────────────────────
export function ProviderTermsScreen({ goBack }: { goBack: () => void }) {
  const sections = [
    {
      title: "1. Specialist Verification",
      body: "Service Providers must be of legal age (18+) and present valid government identification and barangay or police clearances before accepting bookings.",
    },
    {
      title: "2. Availability & Commitments",
      body: "Providers are expected to honor accepted bookings and update their working schedules to maintain transparent service matching for clients.",
    },
    {
      title: "3. Direct Remittance",
      body: "Clients pay providers directly in cash upon completion of service.",
    },
    {
      title: "4. Professional Standards",
      body: "Providers agree to maintain professional craftsmanship, honest diagnostics, and respectful communication.",
    },
  ];

  return (
    <div className="bg-[#f8fafc] flex flex-col size-full">
      <div className="bg-[#115e59] flex gap-3 items-center px-5 pt-12 pb-5 shrink-0">
        <button
          onClick={goBack}
          className="bg-white/15 flex items-center justify-center rounded-xl size-9 active:bg-white/25 touch-manipulation text-white"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white text-lg font-bold flex-1" style={{ fontFamily: "Lexend Deca, sans-serif" }}>
          Provider Terms
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4">
        <div className="bg-[#f0fdfa] border border-[#ccfbf1] rounded-2xl px-4 py-3">
          <p className="text-[#0f766e] text-xs font-semibold">Specialist Terms & Code of Conduct</p>
        </div>
        {sections.map((s) => (
          <div key={s.title} className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
            <p className="text-[#0f172a] text-sm font-bold">{s.title}</p>
            <p className="text-[#475569] text-xs leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
