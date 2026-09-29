import React from "react";
import { Screen } from "../types";

export const A = `${import.meta.env.BASE_URL}assets/`;

// ─── TapServe Official Logo ───────────────────────────────────────────────────
export function TapServeLogo({
  size = 64,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={`${A}tapserve_logo.png`}
      alt="TapServe"
      style={{ width: size, height: size }}
      className={`object-contain shrink-0 ${className}`}
    />
  );
}

// ─── TapServe Official Icon Emblem (Crisp, No Squished Text) ───────────────────
export function TapServeIcon({
  size = 38,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={`${A}tapserve_icon.png`}
      alt="TapServe"
      style={{ width: size, height: size }}
      className={`object-contain shrink-0 ${className}`}
    />
  );
}


// ─── Tappy Mascot Avatar ──────────────────────────────────────────────────────
export function TappyAvatar({
  size = 56,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={`${A}tappy_mascot.png`}
      alt="Tappy — TapServe AI Assistant"
      style={{ width: size, height: size }}
      className={`rounded-full object-contain shrink-0 drop-shadow-xs ${className}`}
    />
  );
}

// ─── Tappy Mascot Small Icon ──────────────────────────────────────────────────
export function TappyIcon({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={`${A}tappy_mascot.png`}
      alt="Tappy — TapServe AI Assistant"
      style={{ width: size, height: size }}
      className={`rounded-full object-contain shrink-0 drop-shadow-xs ${className}`}
    />
  );
}

// ─── User Bottom Navigation ───────────────────────────────────────────────────
export function BottomNav({
  active,
  nav,
  bookingCount = 0,
}: {
  active: string;
  nav: (s: Screen) => void;
  bookingCount?: number;
}) {
  const tabs = [
    {
      id: "home",
      label: "Home",
      screen: "home" as Screen,
      icon: (a: boolean) => (
        <svg
          className={`size-5 ${a ? "text-[#0d9488]" : "text-[#94a3b8]"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      id: "bookings",
      label: "Bookings",
      screen: "bookings" as Screen,
      badge: bookingCount > 0 ? bookingCount : undefined,
      icon: (a: boolean) => (
        <svg
          className={`size-5 ${a ? "text-[#0d9488]" : "text-[#94a3b8]"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "messaging",
      label: "Messages",
      screen: "conversations" as Screen,
      icon: (a: boolean) => (
        <svg
          className={`size-5 ${a ? "text-[#0d9488]" : "text-[#94a3b8]"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
    },
    {
      id: "profile",
      label: "Profile",
      screen: "user-profile" as Screen,
      icon: (a: boolean) => (
        <svg
          className={`size-5 ${a ? "text-[#0d9488]" : "text-[#94a3b8]"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white border-t border-[#e2e8f0] flex pb-4 pt-1.5 shrink-0 relative z-20">
      {tabs.map((t) => {
        const isTabActive =
          active === t.id ||
          (t.id === "messaging" && (active === "conversations" || active === "messaging"));
        return (
          <button
            key={t.id}
            onClick={() => nav(t.screen)}
            className="flex flex-1 flex-col gap-1 items-center pt-1.5 touch-manipulation relative cursor-pointer"
          >
            <div className="relative">
              {t.icon(isTabActive)}
              {t.badge && (
                <span className="absolute -top-1 -right-2 bg-[#0d9488] text-white text-[9px] font-bold rounded-full size-4 flex items-center justify-center">
                  {t.badge}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] font-semibold transition-colors ${
                isTabActive ? "text-[#0d9488] font-bold" : "text-[#94a3b8]"
              }`}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Provider Bottom Navigation ───────────────────────────────────────────────
// ─── Provider Bottom Navigation (Redesigned 5-Tab Marketplace Bar) ───────────
export function ProviderBottomNav({
  active,
  nav,
  requestCount = 0,
  unreadMessagesCount = 0,
  onSelectTab,
}: {
  active: "home" | "jobs" | "bookings" | "messages" | "profile" | string;
  nav?: (s: Screen) => void;
  requestCount?: number;
  unreadMessagesCount?: number;
  onSelectTab?: (tab: "home" | "jobs" | "bookings" | "messages" | "profile") => void;
}) {
  const tabs = [
    {
      id: "home",
      label: "Home",
      match: ["home", "dashboard"],
      screen: "provider-dashboard" as Screen,
      icon: (a: boolean) => (
        <svg
          className={`size-5 transition-colors ${a ? "text-[#115E59]" : "text-[#6B7280]"}`}
          fill={a ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={a ? 1.5 : 2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      id: "jobs",
      label: "Jobs",
      match: ["jobs", "requests", "provider-booking-request"],
      screen: "provider-booking-request" as Screen,
      badge: requestCount > 0 ? requestCount : undefined,
      icon: (a: boolean) => (
        <svg
          className={`size-5 transition-colors ${a ? "text-[#115E59]" : "text-[#6B7280]"}`}
          fill={a ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={a ? 1.5 : 2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 7h-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM10 5h4v2h-4V5zm10 14H4V9h16v10z"
          />
        </svg>
      ),
    },
    {
      id: "bookings",
      label: "Bookings",
      match: ["bookings", "availability", "schedule", "provider-availability"],
      screen: "provider-availability" as Screen,
      icon: (a: boolean) => (
        <svg
          className={`size-5 transition-colors ${a ? "text-[#115E59]" : "text-[#6B7280]"}`}
          fill={a ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={a ? 1.5 : 2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "messages",
      label: "Messages",
      match: ["messages", "chat", "messaging"],
      screen: "messaging" as Screen,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      icon: (a: boolean) => (
        <svg
          className={`size-5 transition-colors ${a ? "text-[#115E59]" : "text-[#6B7280]"}`}
          fill={a ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={a ? 1.5 : 2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
    },
    {
      id: "profile",
      label: "Profile",
      match: ["profile", "reviews", "provider-reviews", "provider-services"],
      screen: "provider-dashboard" as Screen,
      icon: (a: boolean) => (
        <svg
          className={`size-5 transition-colors ${a ? "text-[#115E59]" : "text-[#6B7280]"}`}
          fill={a ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={a ? 1.5 : 2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white border-t border-[#E5E7EB] flex pb-4 pt-2 shrink-0 relative z-20 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      {tabs.map((t) => {
        const isTabActive = t.id === active || t.match.includes(active);
        return (
          <button
            key={t.id}
            onClick={() => {
              if (onSelectTab) {
                onSelectTab(t.id as any);
              } else if (nav) {
                nav(t.screen);
              }
            }}
            className="flex flex-1 flex-col gap-1 items-center touch-manipulation relative cursor-pointer group"
          >
            {/* Top Indicator bar */}
            <div
              className={`h-0.5 w-6 rounded-full transition-all mb-0.5 ${
                isTabActive ? "bg-[#115E59]" : "bg-transparent group-hover:bg-slate-200"
              }`}
            />
            <div className="relative">
              {t.icon(isTabActive)}
              {t.badge && (
                <span className="absolute -top-1 -right-2 bg-[#DC2626] text-white text-[9px] font-bold rounded-full size-4 flex items-center justify-center animate-pulse">
                  {t.badge}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] tracking-tight transition-colors ${
                isTabActive
                  ? "text-[#115E59] font-bold"
                  : "text-[#6B7280] font-medium"
              }`}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Floating AI Assistant Button ─────────────────────────────────────────────
export function FloatingAIButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="absolute bottom-[72px] right-3 z-30">
      <button
        onClick={onClick}
        className="bg-[#0f766e] hover:bg-[#115e59] drop-shadow-[0px_6px_20px_rgba(15,118,110,0.45)] flex items-center justify-center size-12 rounded-full active:scale-95 transition-all touch-manipulation border-2 border-white/90 shadow-lg cursor-pointer p-1"
        aria-label="Tappy — TapServe AI Assistant"
        title="TapServe AI Assistant"
      >
        <div className="size-full rounded-full bg-white/25 p-1 flex items-center justify-center shrink-0 border border-white/60 overflow-hidden">
          <img
            src={`${A}tappy_mascot.png`}
            className="size-full object-contain rounded-full"
            alt="Tappy"
          />
        </div>
      </button>
    </div>
  );
}
