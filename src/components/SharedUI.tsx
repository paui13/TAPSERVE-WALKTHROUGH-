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
export function ProviderBottomNav({
  active,
  nav,
  requestCount = 0,
}: {
  active: string;
  nav: (s: Screen) => void;
  requestCount?: number;
}) {
  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      screen: "provider-dashboard" as Screen,
      icon: (a: boolean) => (
        <svg
          className={`size-5 ${a ? "text-[#0d9488]" : "text-[#94a3b8]"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      id: "requests",
      label: "Requests",
      screen: "provider-booking-request" as Screen,
      badge: requestCount > 0 ? requestCount : undefined,
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
            d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"
          />
        </svg>
      ),
    },
    {
      id: "availability",
      label: "Availability",
      screen: "provider-availability" as Screen,
      icon: (a: boolean) => (
        <svg
          className={`size-5 ${a ? "text-[#0d9488]" : "text-[#94a3b8]"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 2v4M8 2v4M3 10h18"
          />
        </svg>
      ),
    },
    {
      id: "reviews",
      label: "Reviews",
      screen: "provider-reviews" as Screen,
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
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 0 0 .95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 0 0-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 0 0-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 0 0-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 0 0 .951-.69l1.519-4.674z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white border-t border-[#e2e8f0] flex pb-4 pt-1.5 shrink-0 relative z-20">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => nav(t.screen)}
          className="flex flex-1 flex-col gap-1 items-center pt-1.5 touch-manipulation relative"
        >
          <div className="relative">
            {t.icon(active === t.id)}
            {t.badge && (
              <span className="absolute -top-1 -right-2 bg-[#0d9488] text-white text-[9px] font-bold rounded-full size-4 flex items-center justify-center">
                {t.badge}
              </span>
            )}
          </div>
          <span
            className={`text-[11px] font-semibold ${
              active === t.id ? "text-[#0d9488]" : "text-[#94a3b8]"
            }`}
          >
            {t.label}
          </span>
        </button>
      ))}
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
