import React, { useState, useMemo } from "react";
import { Screen } from "../types";
import { BottomNav, FloatingAIButton, A, TapServeLogo, TapServeIcon } from "../components/SharedUI";
import {
  ServiceCategory,
  Provider,
  UserAccount,
  Booking,
} from "../data/mockData";

// ─── Verified Specialist Badge Pill ──────────────────────────────────────────
export function VerifiedBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 bg-[#ccfbf1] text-[#0f766e] text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#99f6e4] shrink-0 ${className}`}
      title="Verified Service Specialist"
    >
      <svg className="size-2.5 text-[#0d9488]" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
      Verified
    </span>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────
export function HomeScreen({
  nav,
  currentUser,
  categories,
  providers,
  favorites,
  toggleFavorite,
  onSelectCategory,
  onSelectProvider,
  onToast,
  bookingCount,
  bookings = [],
  onSelectBooking,
}: {
  nav: (s: Screen) => void;
  currentUser: UserAccount;
  categories: ServiceCategory[];
  providers: Provider[];
  favorites: string[];
  toggleFavorite: (providerId: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onSelectProvider: (provider: Provider) => void;
  onToast: (msg: string) => void;
  bookingCount: number;
  bookings?: Booking[];
  onSelectBooking?: (b: Booking) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "available" | "top_rated" | "nearest" | "favorites"
  >("all");
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  // Time-based greeting helper
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  // Upcoming Active Booking (Pending, Accepted, On the Way, In Progress)
  // Rule: If there is no active booking, do not show the card.
  const activeBooking = useMemo(() => {
    return bookings.find(
      (b) =>
        b.status === "Pending" ||
        b.status === "Accepted" ||
        b.status === "On the Way" ||
        b.status === "In Progress"
    );
  }, [bookings]);

  const activeBookingProvider = useMemo(() => {
    if (!activeBooking) return null;
    return providers.find((p) => p.id === activeBooking.providerId) || null;
  }, [activeBooking, providers]);

  // Available Today / Available Now providers
  const availableTodayProviders = useMemo(() => {
    return providers.filter((p) => p.isAcceptingBookings);
  }, [providers]);

  // Completed booking for Recently Viewed / Book Again
  const completedBooking = useMemo(() => {
    return bookings.find((b) => b.status === "Completed");
  }, [bookings]);

  const bookAgainProvider = useMemo(() => {
    if (completedBooking) {
      return providers.find((p) => p.id === completedBooking.providerId) || providers[2];
    }
    return providers.find((p) => p.id === "p-jose") || providers[2];
  }, [completedBooking, providers]);

  const activeCategories = useMemo(
    () => categories.filter((c) => c.enabled),
    [categories]
  );

  // Home preview: first 6 categories
  const previewCategories = useMemo(
    () => activeCategories.slice(0, 6),
    [activeCategories]
  );

  // Filtered providers based on Quick Filter chips
  const filteredProviders = useMemo(() => {
    if (activeFilter === "available") {
      return providers.filter((p) => p.isAcceptingBookings);
    }
    if (activeFilter === "top_rated") {
      return providers.filter((p) => p.rating >= 4.8);
    }
    if (activeFilter === "nearest") {
      return providers.filter(
        (p) => p.distance.includes("1.") || p.distance.includes("0.") || p.distance.includes("1.8")
      );
    }
    if (activeFilter === "favorites") {
      return providers.filter((p) => favorites.includes(p.id));
    }
    return providers;
  }, [providers, activeFilter, favorites]);

  // Search filter across categories, providers, and specialties
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matchedCats = activeCategories.filter((c) =>
      c.name.toLowerCase().includes(q)
    );

    const matchedProvs = providers.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.specialization.toLowerCase().includes(q) ||
        p.services.some((s) => s.toLowerCase().includes(q))
    );

    return { categories: matchedCats, providers: matchedProvs };
  }, [searchQuery, activeCategories, providers]);

  // AI Recommended providers (highest ratings)
  const recommendedProviders = useMemo(
    () => providers.slice(0, 3),
    [providers]
  );

  // Favorited providers
  const favoriteProviders = useMemo(
    () => providers.filter((p) => favorites.includes(p.id)),
    [providers, favorites]
  );

  // Dynamic Popular Services Near You - computed from real categories & live provider stats
  const popularServicesNearYou = useMemo(() => {
    const descriptions: Record<string, { desc: string; defaultTag: string }> = {
      cleaning: { desc: "Full home deep clean & disinfection", defaultTag: "High Demand" },
      plumbing: { desc: "Pipe leaks, drains & faucets", defaultTag: "Most Booked" },
      electrical: { desc: "Breakers, lights & circuits", defaultTag: "Fast Response" },
      gardening: { desc: "Lawn trimming & landscape care", defaultTag: "Popular" },
      "appliance-repair": { desc: "Refrigerators, washers & fans", defaultTag: "Fast Response" },
      aircon: { desc: "Filter, coil & coolant check", defaultTag: "Top Rated" },
      carpentry: { desc: "Doors, cabinets & repairs", defaultTag: "Available" },
      "home-maintenance": { desc: "Roof leak sealing & gutters", defaultTag: "Seasonal" },
      painting: { desc: "Interior & exterior wall paint", defaultTag: "Popular" },
      "pest-control": { desc: "Termite & rodent extermination", defaultTag: "Fast Response" },
      moving: { desc: "Packing & transport assistance", defaultTag: "Available" },
      other: { desc: "General home repairs", defaultTag: "On Demand" },
    };

    return activeCategories.slice(0, 6).map((cat) => {
      const catProviders = providers.filter((p) => p.categoryId === cat.id);
      const totalJobs = catProviders.reduce((sum, p) => sum + (p.completedJobs || 0), 0);
      const hasAvailableToday = catProviders.some((p) => p.isAcceptingBookings);
      const meta = descriptions[cat.id] || {
        desc: `${catProviders.length} active specialist${catProviders.length === 1 ? "" : "s"}`,
        defaultTag: "Available",
      };

      let tag = meta.defaultTag;
      if (totalJobs > 120) tag = "Most Booked";
      else if (hasAvailableToday) tag = "Available Today";
      else if (catProviders.length > 2) tag = "High Demand";

      return {
        id: cat.id,
        name: cat.name,
        emoji: cat.emoji,
        tag,
        desc: meta.desc,
        providerCount: catProviders.length,
      };
    });
  }, [activeCategories, providers]);

  return (
    <div className="bg-[#f8fafc] flex flex-col justify-between size-full relative">
      <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
        {/* ─── Top Header: Brand Logo, Location & Notifications Bell ─── */}
        <div className="bg-white border-b border-[#f1f5f9] px-5 pt-4 pb-3.5 shrink-0 shadow-xs">
          <div className="flex items-center justify-between gap-2 pb-2.5">
            {/* Logo + Brand Name */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="size-10 rounded-xl bg-white border-2 border-[#ccfbf1] p-0.5 flex items-center justify-center shadow-xs shrink-0">
                <TapServeIcon size={34} />
              </div>
              <div className="flex items-baseline">
                <span
                  className="text-[#0f172a] text-[23px] font-black tracking-tight leading-none"
                  style={{ fontFamily: "Lexend Deca, sans-serif" }}
                >
                  Tap<span className="text-[#0d9488]">Serve</span>
                </span>
              </div>
            </div>

            {/* Location Pill & Notifications Bell */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onToast("Service Area: San Pablo City & nearby Laguna municipalities.")}
                className="bg-[#f0fdfa] border border-[#ccfbf1] flex gap-1.5 items-center px-2.5 py-1.5 rounded-full shrink-0 hover:bg-[#ccfbf1] transition-colors cursor-pointer shadow-2xs active:scale-95"
                title="Service Area: San Pablo City"
              >
                <svg
                  className="size-3.5 text-[#0f766e]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-[#0f766e] text-[11px] font-bold">
                  San Pablo City
                </span>
              </button>

              {/* Notifications Bell with Unread Badge */}
              <button
                onClick={() => setShowNotifications(true)}
                className="relative bg-white border border-[#e2e8f0] size-9 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors shadow-xs touch-manipulation cursor-pointer shrink-0 active:scale-95"
                aria-label="View notifications"
              >
                <svg
                  className="size-4.5 text-[#334155]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-extrabold rounded-full size-4 flex items-center justify-center border-2 border-white shadow-xs animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Dynamic Greeting + Subtext */}
          <div className="flex flex-col gap-0.5 pt-1">
            <span className="text-[#0d9488] text-xs font-bold tracking-wide">
              {greeting}, {currentUser.name} 👋
            </span>
            <h2
              className="text-[#0f172a] text-[16px] font-bold tracking-tight whitespace-nowrap"
              style={{ fontFamily: "Lexend Deca, sans-serif" }}
            >
              What do you need fixed today?
            </h2>
          </div>
        </div>

        {/* ─── Live Search Bar ─── */}
        <div className="px-6 pt-4 pb-2 relative z-20">
          <div className="bg-white border border-[#e2e8f0] flex gap-2.5 h-12 items-center px-4 rounded-2xl shadow-xs focus-within:border-[#0d9488] focus-within:ring-2 focus-within:ring-[#0d9488]/10 transition-all">
            <svg
              className="size-5 text-[#94a3b8] shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plumber, cleaning, electrician..."
              className="flex-1 text-[#0f172a] text-sm bg-transparent outline-none placeholder:text-[#94a3b8]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-[#94a3b8] hover:text-[#0f172a] p-1"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {searchResults && (
            <div className="absolute left-6 right-6 top-[62px] bg-white border border-[#e2e8f0] rounded-2xl shadow-xl overflow-hidden max-h-[320px] overflow-y-auto no-scrollbar z-30">
              {searchResults.categories.length === 0 &&
              searchResults.providers.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#64748b]">
                  No matching services or specialists found.
                </div>
              ) : (
                <div className="flex flex-col p-2">
                  {searchResults.categories.length > 0 && (
                    <div className="pb-2">
                      <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider px-2">
                        Categories
                      </span>
                      {searchResults.categories.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setSearchQuery("");
                            onSelectCategory(c.id);
                            nav("browse");
                          }}
                          className="flex items-center gap-2.5 p-2 rounded-xl w-full text-left hover:bg-[#f0fdfa] touch-manipulation"
                        >
                          <span className="text-xl">{c.emoji}</span>
                          <span className="text-sm font-semibold text-[#0f172a]">
                            {c.name}
                          </span>
                          <span className="ml-auto text-xs text-[#0d9488] font-bold">
                            View →
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchResults.providers.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider px-2">
                        Service Providers
                      </span>
                      {searchResults.providers.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSearchQuery("");
                            onSelectProvider(p);
                            nav("provider-profile");
                          }}
                          className="flex items-center gap-3 p-2 rounded-xl w-full text-left hover:bg-[#f0fdfa] touch-manipulation"
                        >
                          <img
                            src={p.photo}
                            className="size-9 rounded-xl object-cover"
                            alt={p.name}
                          />
                          <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-[#0f172a] truncate">
                                {p.name}
                              </span>
                              {p.isVerified && <VerifiedBadge />}
                            </div>
                            <span className="text-xs text-[#64748b] truncate">
                              {p.specialization} · ⭐ {p.rating}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-[#0f766e]">
                            ₱{p.hourlyRate}/hr
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── Quick Filters under Search ─── */}
        <div className="px-6 py-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all touch-manipulation ${
                activeFilter === "all"
                  ? "bg-[#0d9488] text-white shadow-xs"
                  : "bg-white text-[#475569] border border-[#e2e8f0] hover:bg-slate-50"
              }`}
            >
              All Providers ({providers.length})
            </button>
            <button
              onClick={() => setActiveFilter("available")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1 transition-all touch-manipulation ${
                activeFilter === "available"
                  ? "bg-[#0d9488] text-white shadow-xs"
                  : "bg-white text-[#475569] border border-[#e2e8f0] hover:bg-slate-50"
              }`}
            >
              <span>⚡</span> Available Today ({availableTodayProviders.length})
            </button>
            <button
              onClick={() => setActiveFilter("top_rated")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1 transition-all touch-manipulation ${
                activeFilter === "top_rated"
                  ? "bg-[#0d9488] text-white shadow-xs"
                  : "bg-white text-[#475569] border border-[#e2e8f0] hover:bg-slate-50"
              }`}
            >
              <span>⭐</span> Top Rated (4.8+)
            </button>
            <button
              onClick={() => setActiveFilter("nearest")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1 transition-all touch-manipulation ${
                activeFilter === "nearest"
                  ? "bg-[#0d9488] text-white shadow-xs"
                  : "bg-white text-[#475569] border border-[#e2e8f0] hover:bg-slate-50"
              }`}
            >
              <span>📍</span> Nearest (&lt; 2km)
            </button>
            <button
              onClick={() => setActiveFilter("favorites")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1 transition-all touch-manipulation ${
                activeFilter === "favorites"
                  ? "bg-[#0d9488] text-white shadow-xs"
                  : "bg-white text-[#475569] border border-[#e2e8f0] hover:bg-slate-50"
              }`}
            >
              <span>❤️</span> Favorites ({favorites.length})
            </button>
          </div>
        </div>

        {/* ─── Small Safety / Trust Banner ─── */}
        <div className="px-6 py-1.5">
          <div className="bg-[#f0fdfa] border border-[#ccfbf1] rounded-2xl px-3.5 py-2.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="bg-[#0f766e] text-white rounded-full p-1 shrink-0">
                <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-[#0f766e] text-[11px] font-semibold truncate">
                Verified specialists • Ratings & reviews • Secure cash booking
              </span>
            </div>
            <span className="text-[10px] font-extrabold text-[#0d9488] bg-[#ccfbf1] px-2 py-0.5 rounded-full shrink-0 ml-1">
              100% Safe
            </span>
          </div>
        </div>



        {/* ─── Active Filter Results (When a filter chip is pressed) ─── */}
        {activeFilter !== "all" && (
          <div className="flex flex-col gap-3 px-6 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[#0d9488] font-bold text-sm">
                  Filtered Results ({filteredProviders.length})
                </span>
                <span className="text-[#64748b] text-xs">
                  · {activeFilter.replace("_", " ")}
                </span>
              </div>
              <button
                onClick={() => setActiveFilter("all")}
                className="text-xs text-[#0d9488] font-bold hover:underline"
              >
                Reset All
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {filteredProviders.length === 0 ? (
                <div className="p-4 bg-white rounded-2xl border border-dashed border-[#cbd5e1] text-center text-xs text-[#64748b]">
                  No specialists found for this filter in San Pablo City.
                </div>
              ) : (
                filteredProviders.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-[#e2e8f0] p-3 rounded-2xl shadow-xs flex items-center justify-between gap-3"
                  >
                    <div
                      onClick={() => {
                        onSelectProvider(p);
                        nav("provider-profile");
                      }}
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    >
                      <img
                        src={p.photo}
                        alt={p.name}
                        className="size-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-[#0f172a] truncate">
                            {p.name}
                          </span>
                          {p.isVerified && <VerifiedBadge />}
                        </div>
                        <span className="text-xs text-[#64748b] truncate">
                          {p.specialization} · ⭐ {p.rating}
                        </span>
                        <span className="text-[11px] text-[#0f766e] font-semibold">
                          📍 {p.distance} · ₱{p.hourlyRate}/hr
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onSelectProvider(p);
                        nav("booking");
                      }}
                      className="bg-[#0d9488] text-white text-xs font-bold px-3 py-1.5 rounded-xl shrink-0 active:scale-95 transition-transform"
                    >
                      Book
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ─── Available Now / Available Today (Horizontal Section) ─── */}
        <div className="flex flex-col gap-3 pt-3 pb-4">
          <div className="flex items-center justify-between px-6">
            <div className="flex items-center gap-2 min-w-0">
              <span className="size-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <h3
                className="text-[#0f172a] text-sm sm:text-base font-bold whitespace-nowrap truncate"
                style={{ fontFamily: "Lexend Deca, sans-serif" }}
              >
                Available Today
              </h3>
            </div>
            <span className="text-[#0f766e] text-xs font-bold bg-[#ccfbf1] px-2 py-0.5 rounded-full shrink-0">
              Accepting Now
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pl-6 pr-6 pb-1 no-scrollbar">
            {availableTodayProviders.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-[#e2e8f0] p-3 rounded-2xl shadow-xs shrink-0 w-[165px] flex flex-col justify-between hover:border-[#99f6e4] transition-all"
              >
                <div>
                  <div
                    onClick={() => {
                      onSelectProvider(p);
                      nav("provider-profile");
                    }}
                    className="relative rounded-xl size-14 overflow-hidden cursor-pointer mb-2"
                  >
                    <img
                      src={p.photo}
                      alt={p.name}
                      className="size-full object-cover"
                    />
                    <div className="absolute bottom-1 left-1 bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
                      <span className="size-1.5 rounded-full bg-white animate-pulse" />
                      Live
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[#0f172a] text-xs font-bold truncate">
                      {p.name}
                    </span>
                    {p.isVerified && (
                      <svg className="size-3 text-[#0d9488] shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[#64748b] text-[11px] block truncate">
                    {p.specialization}
                  </span>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[#0f766e] text-xs font-bold">
                      ₱{p.hourlyRate}/hr
                    </span>
                    <span className="text-amber-500 text-[11px] font-bold">
                      ⭐ {p.rating}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#0d9488] bg-[#f0fdfa] border border-[#ccfbf1] px-1.5 py-0.5 rounded block text-center mt-1.5 font-semibold">
                    Earliest: In 45 mins
                  </span>
                </div>

                <button
                  onClick={() => {
                    onSelectProvider(p);
                    nav("booking");
                  }}
                  className="bg-[#0d9488] text-white text-[11px] font-bold py-1.5 rounded-xl active:scale-95 transition-transform touch-manipulation w-full mt-2"
                >
                  Book Today
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Popular Services Near You (Dynamic from System Categories) ─── */}
        <div className="flex flex-col gap-3 py-3 px-6">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3
                className="text-[#0f172a] text-sm sm:text-base font-bold whitespace-nowrap truncate"
                style={{ fontFamily: "Lexend Deca, sans-serif" }}
              >
                Popular Services Near You
              </h3>
              <p className="text-[#64748b] text-xs truncate">
                {activeCategories.length} categories available in San Pablo City
              </p>
            </div>
            <button
              onClick={() => nav("all-categories")}
              className="text-[#0d9488] text-xs font-bold hover:underline shrink-0 cursor-pointer"
            >
              See All ({activeCategories.length}) →
            </button>
          </div>

          {/* 2x3 Grid with unified signature teal styling */}
          <div className="grid grid-cols-2 gap-2.5">
            {popularServicesNearYou.map((srv) => (
              <button
                key={srv.id}
                onClick={() => {
                  onSelectCategory(srv.id);
                  nav("browse");
                }}
                className="bg-white border border-[#ccfbf1] hover:border-[#0d9488] rounded-2xl p-3 flex flex-col gap-1.5 text-left shadow-xs transition-all active:scale-[0.98] group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="bg-[#f0fdfa] border border-[#ccfbf1] text-xl size-9 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#ccfbf1]/50 transition-colors">
                    <span>{srv.emoji}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#0f766e] bg-[#ccfbf1]/60 px-2 py-0.5 rounded-full">
                    {srv.tag}
                  </span>
                </div>
                <div className="flex items-baseline justify-between pt-0.5">
                  <span className="text-[#0f172a] text-xs font-bold truncate">
                    {srv.name}
                  </span>
                  <span className="text-[10px] text-[#0d9488] font-semibold shrink-0">
                    {srv.providerCount} {srv.providerCount === 1 ? "pro" : "pros"}
                  </span>
                </div>
                <span className="text-[#64748b] text-[10px] leading-tight line-clamp-1">
                  {srv.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ─── Recently Viewed / Book Again ─── */}
        {bookAgainProvider && (
          <div className="px-6 py-3">
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#f1f5f9]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <svg className="size-4 text-[#0d9488] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-xs font-bold text-[#0f172a] whitespace-nowrap truncate">
                    Book Again
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 shrink-0">
                  Completed Service
                </span>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <img
                  src={bookAgainProvider.photo}
                  alt={bookAgainProvider.name}
                  className="size-12 rounded-xl object-cover shrink-0"
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#0f172a] text-sm font-bold truncate">
                      {bookAgainProvider.name}
                    </span>
                    <VerifiedBadge />
                  </div>
                  <span className="text-[#64748b] text-xs truncate">
                    {bookAgainProvider.specialization} · ₱{bookAgainProvider.hourlyRate}/hr
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold pt-0.5">
                    <span>⭐ {bookAgainProvider.rating} ({bookAgainProvider.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  onClick={() => {
                    onSelectProvider(bookAgainProvider);
                    nav("booking");
                  }}
                  className="bg-[#0d9488] text-white text-xs font-bold py-2 px-3 rounded-xl flex-1 text-center active:scale-95 transition-transform"
                >
                  Book Again
                </button>
                <button
                  onClick={() => {
                    onSelectProvider(bookAgainProvider);
                    nav("messaging");
                  }}
                  className="bg-[#f0fdfa] border border-[#ccfbf1] text-[#0f766e] text-xs font-bold py-2 px-3 rounded-xl active:scale-95 transition-transform"
                >
                  Chat
                </button>
                {completedBooking && (
                  <button
                    onClick={() => {
                      if (onSelectBooking) onSelectBooking(completedBooking);
                      nav("booking-completed");
                    }}
                    className="bg-slate-100 text-[#475569] text-xs font-semibold py-2 px-3 rounded-xl active:scale-95 transition-transform"
                  >
                    Receipt
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── AI Recommended Specialists ─── */}
        <div className="flex flex-col gap-3 pb-6 px-6 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5 items-center">
              <svg
                className="size-4 text-[#0d9488]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <h3
                className="text-[#0f172a] text-base font-bold"
                style={{ fontFamily: "Lexend Deca, sans-serif" }}
              >
                AI Recommended for You
              </h3>
            </div>
            <span className="text-[#94a3b8] text-[11px] font-semibold">
              Near San Pablo City
            </span>
          </div>

          {recommendedProviders.map((p) => {
            const isFav = favorites.includes(p.id);
            return (
              <div
                key={p.id}
                className="bg-white border border-[#e2e8f0] flex gap-3.5 items-center p-3.5 rounded-2xl text-left w-full shadow-xs active:bg-slate-50 transition-colors relative"
              >
                <div
                  onClick={() => {
                    onSelectProvider(p);
                    nav("provider-profile");
                  }}
                  className="flex gap-3.5 items-center flex-1 min-w-0 cursor-pointer"
                >
                  <div className="relative rounded-2xl shrink-0 size-16 overflow-hidden border border-[#e2e8f0]">
                    <img
                      src={p.photo}
                      className="size-full object-cover"
                      alt={p.name}
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#0f172a] text-sm font-bold truncate">
                        {p.name}
                      </span>
                      {p.isVerified && <VerifiedBadge />}
                    </div>
                    <span className="text-[#64748b] text-xs font-medium truncate">
                      {p.specialization}
                    </span>
                    <div className="flex items-center gap-3 pt-0.5">
                      <div className="flex gap-1 items-center">
                        <svg className="size-3 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-[#0f172a] text-xs font-bold">
                          {p.rating}
                        </span>
                        <span className="text-[#94a3b8] text-[11px]">
                          ({p.reviewCount})
                        </span>
                      </div>
                      <span className="text-[#64748b] text-[11px]">
                        📍 {p.distance}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => {
                      toggleFavorite(p.id);
                      onToast(
                        isFav
                          ? `${p.name} removed from favorites.`
                          : `${p.name} added to favorites!`
                      );
                    }}
                    className="p-1 touch-manipulation"
                    aria-label="Toggle favorite"
                  >
                    <svg
                      className={`size-5 transition-colors ${
                        isFav ? "text-[#f97316] fill-[#f97316]" : "text-[#cbd5e1]"
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                      />
                    </svg>
                  </button>
                  <span className="text-[#0f766e] text-xs font-bold">
                    ₱{p.hourlyRate}/hr
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Favorite Providers Preview ─── */}
        {favoriteProviders.length > 0 && (
          <div className="flex flex-col gap-3 pb-6">
            <div className="flex items-center justify-between px-6">
              <div className="flex gap-1.5 items-center">
                <svg className="size-4 text-[#f97316] fill-[#f97316]" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span className="text-[#0f172a] text-sm font-bold">
                  Your Favorite Providers
                </span>
              </div>
              <button
                onClick={() => nav("favorites")}
                className="text-[#0d9488] text-xs font-bold touch-manipulation hover:underline"
              >
                View All ({favoriteProviders.length})
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar px-6 pb-2">
              {favoriteProviders.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-[#e2e8f0] shadow-xs flex flex-col gap-2 p-3 rounded-2xl shrink-0 w-[155px]"
                >
                  <div
                    onClick={() => {
                      onSelectProvider(p);
                      nav("provider-profile");
                    }}
                    className="relative rounded-xl size-14 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={p.photo}
                      className="size-full object-cover"
                      alt={p.name}
                    />
                    <div className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-xs">
                      <svg className="size-3 text-[#f97316] fill-[#f97316]" viewBox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[#0f172a] text-xs font-bold truncate">
                      {p.name}
                    </span>
                    <span className="text-[#64748b] text-[10px] truncate">
                      {p.category}
                    </span>
                    <span className="text-[#0f766e] text-xs font-bold">
                      ₱{p.hourlyRate}/hr
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onSelectProvider(p);
                      nav("booking");
                    }}
                    className="bg-[#0d9488] text-white text-[11px] font-bold py-1.5 rounded-xl active:brightness-90 touch-manipulation w-full mt-0.5"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── Notifications Drawer Modal ─── */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl w-full max-w-[420px] max-h-[85vh] flex flex-col p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#f0fdfa] rounded-xl text-[#0d9488]">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0f172a]">Notifications</h3>
                  <span className="text-xs text-[#64748b]">
                    {unreadCount > 0 ? `${unreadCount} new updates` : "All caught up"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      setUnreadCount(0);
                      onToast("All notifications marked as read.");
                    }}
                    className="text-xs text-[#0d9488] font-bold hover:underline"
                  >
                    Mark read
                  </button>
                )}
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-[#64748b]"
                >
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Notification Items */}
            <div className="flex-1 overflow-y-auto no-scrollbar py-3 flex flex-col gap-2.5">
              {/* Item 1: Booking update */}
              <div
                onClick={() => {
                  setShowNotifications(false);
                  if (activeBooking && onSelectBooking) onSelectBooking(activeBooking);
                  nav("tracking");
                }}
                className="bg-[#f0fdfa] border border-[#ccfbf1] p-3 rounded-2xl cursor-pointer hover:border-[#0d9488] transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🛠️</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0f766e]">
                        Booking In Progress
                      </span>
                      <span className="text-[10px] text-[#94a3b8]">10m ago</span>
                    </div>
                    <p className="text-xs text-[#0f172a] font-semibold pt-0.5">
                      Kuya Reynaldo is working on your Emergency Pipe Repair (#TS-2026-00125).
                    </p>
                    <span className="text-[10px] text-[#0d9488] font-bold pt-1 block">
                      Tap to open Live Tracking →
                    </span>
                  </div>
                </div>
              </div>

              {/* Item 2: Provider message */}
              <div
                onClick={() => {
                  setShowNotifications(false);
                  const pMaria = providers.find((p) => p.id === "p-maria");
                  if (pMaria) onSelectProvider(pMaria);
                  nav("messaging");
                }}
                className="bg-white border border-[#e2e8f0] p-3 rounded-2xl cursor-pointer hover:border-[#0d9488] transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💬</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0f172a]">
                        Ate Maria (Cleaning)
                      </span>
                      <span className="text-[10px] text-[#94a3b8]">25m ago</span>
                    </div>
                    <p className="text-xs text-[#475569] pt-0.5">
                      "Opo sir, dala ko na po ang gamit para bukas sa deep cleaning."
                    </p>
                    <span className="text-[10px] text-[#0d9488] font-bold pt-1 block">
                      Tap to reply →
                    </span>
                  </div>
                </div>
              </div>

              {/* Item 3: Account status */}
              <div
                onClick={() => {
                  setShowNotifications(false);
                  nav("account-status");
                }}
                className="bg-white border border-[#e2e8f0] p-3 rounded-2xl cursor-pointer hover:border-[#0d9488] transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🛡️</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0f172a]">
                        Account Health Verified
                      </span>
                      <span className="text-[10px] text-[#94a3b8]">2h ago</span>
                    </div>
                    <p className="text-xs text-[#475569] pt-0.5">
                      Your client account is in Good Standing. 100% completion rate.
                    </p>
                    <span className="text-[10px] text-[#0d9488] font-bold pt-1 block">
                      View Account Status →
                    </span>
                  </div>
                </div>
              </div>

              {/* Item 4: Completed booking review */}
              <div
                onClick={() => {
                  setShowNotifications(false);
                  if (completedBooking && onSelectBooking) onSelectBooking(completedBooking);
                  nav("booking-completed");
                }}
                className="bg-white border border-[#e2e8f0] p-3 rounded-2xl cursor-pointer hover:border-[#0d9488] transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⭐</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0f172a]">
                        Service Completed
                      </span>
                      <span className="text-[10px] text-[#94a3b8]">Yesterday</span>
                    </div>
                    <p className="text-xs text-[#475569] pt-0.5">
                      Electrical Wiring service with Kuya Jose was settled. View receipt.
                    </p>
                    <span className="text-[10px] text-[#0d9488] font-bold pt-1 block">
                      View Completion Summary →
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowNotifications(false)}
              className="mt-2 w-full py-2.5 bg-slate-100 text-[#0f172a] text-xs font-bold rounded-xl active:bg-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Floating AI Button */}
      <FloatingAIButton onClick={() => nav("chatbot")} />

      {/* Bottom Nav */}
      <BottomNav active="home" nav={nav} bookingCount={bookingCount} />
    </div>
  );
}

// ─── All Service Categories Screen ───────────────────────────────────────────
export function AllCategoriesScreen({
  nav,
  goBack,
  categories,
  providers = [],
  onSelectCategory,
}: {
  nav: (s: Screen) => void;
  goBack: () => void;
  categories: ServiceCategory[];
  providers?: Provider[];
  onSelectCategory: (categoryId: string) => void;
}) {
  const [search, setSearch] = useState("");

  const activeCategories = useMemo(
    () => categories.filter((c) => c.enabled),
    [categories]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return activeCategories;
    return activeCategories.filter((c) => c.name.toLowerCase().includes(q));
  }, [search, activeCategories]);

  return (
    <div className="bg-[#f8fafc] flex flex-col size-full">
      {/* Header */}
      <div className="bg-[#115e59] flex gap-3 items-center px-5 pt-12 pb-5 shrink-0">
        <button
          onClick={goBack}
          className="bg-white/15 flex items-center justify-center rounded-xl size-9 active:bg-white/25 touch-manipulation text-white cursor-pointer"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex flex-col flex-1 min-w-0">
          <h1
            className="text-white text-lg font-bold truncate"
            style={{ fontFamily: "Lexend Deca, sans-serif" }}
          >
            All Service Categories
          </h1>
          <span className="text-teal-200 text-xs">
            {activeCategories.length} categories available in San Pablo City
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="px-5 py-3.5 shrink-0">
        <div className="bg-white border border-[#e2e8f0] flex gap-3 h-11 items-center px-4 rounded-xl shadow-xs focus-within:border-[#0d9488]">
          <svg className="size-4 text-[#94a3b8] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service categories..."
            className="flex-1 text-sm outline-none bg-transparent placeholder:text-[#94a3b8] text-[#0f172a]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer p-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <span className="text-3xl">🔍</span>
            <p className="text-[#0f172a] text-sm font-bold">No categories found</p>
            <p className="text-[#94a3b8] text-xs">Try searching for cleaning, plumbing, or electrical.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((cat) => {
              const matchingCount = providers.filter((p) => p.categoryId === cat.id).length;
              const count = matchingCount > 0 ? matchingCount : cat.count || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    nav("browse");
                  }}
                  className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col items-center gap-2 text-center active:bg-teal-50 touch-manipulation shadow-xs hover:border-[#99f6e4] transition-all cursor-pointer group"
                >
                  <div className="bg-[#f0fdfa] border border-[#ccfbf1] flex items-center justify-center rounded-2xl size-14 text-3xl group-hover:scale-105 transition-transform">
                    <span>{cat.emoji}</span>
                  </div>
                  <span className="text-[#0f172a] text-xs font-bold leading-tight line-clamp-1">
                    {cat.name}
                  </span>
                  <span className="bg-[#f0fdfa] text-[#0d9488] text-[11px] font-bold px-3 py-1 rounded-full border border-[#ccfbf1] mt-0.5">
                    {count} {count === 1 ? "Specialist" : "Specialists"}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Browse Screen (Category Filtered Providers) ──────────────────────────────
export function BrowseScreen({
  nav,
  goBack,
  selectedCategoryId,
  categories,
  providers,
  favorites,
  toggleFavorite,
  onSelectProvider,
  onToast,
  bookingCount,
}: {
  nav: (s: Screen) => void;
  goBack: () => void;
  selectedCategoryId: string;
  categories: ServiceCategory[];
  providers: Provider[];
  favorites: string[];
  toggleFavorite: (providerId: string) => void;
  onSelectProvider: (p: Provider) => void;
  onToast: (msg: string) => void;
  bookingCount: number;
}) {
  const [filterMode, setFilterMode] = useState<"nearest" | "rating" | "budget" | "available">("nearest");
  const [searchQuery, setSearchQuery] = useState("");

  const currentCategory = categories.find((c) => c.id === selectedCategoryId);
  const categoryTitle = currentCategory ? currentCategory.name : "All Services";

  // Base list of providers for this category
  const baseCategoryProviders = useMemo(() => {
    if (!selectedCategoryId || selectedCategoryId === "all") return providers;
    return providers.filter((p) => p.categoryId === selectedCategoryId);
  }, [providers, selectedCategoryId]);

  // Live filtered and sorted providers
  const filteredProviders = useMemo(() => {
    let list = [...baseCategoryProviders];

    // Search query within category
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.specialization.toLowerCase().includes(q) ||
          p.area.toLowerCase().includes(q) ||
          p.services.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Interactive filter modes
    if (filterMode === "rating") {
      // Actually filters specialists with rating >= 4.5 and sorts highest first
      list = list.filter((p) => p.rating >= 4.5).sort((a, b) => b.rating - a.rating);
    } else if (filterMode === "budget") {
      // Sorts by lowest rate first
      list = [...list].sort((a, b) => a.hourlyRate - b.hourlyRate);
    } else if (filterMode === "available") {
      // Filters only specialists available today
      list = list.filter((p) => p.isAcceptingBookings);
    } else {
      // "nearest": sorts closest distance first
      list = [...list].sort((a, b) => {
        const distA = parseFloat(a.distance) || 99;
        const distB = parseFloat(b.distance) || 99;
        return distA - distB;
      });
    }

    return list;
  }, [baseCategoryProviders, filterMode, searchQuery]);

  // Dynamic status subtitle reflecting live filter state
  const subtitleText = useMemo(() => {
    const count = filteredProviders.length;
    const total = baseCategoryProviders.length;
    const plural = count === 1 ? "specialist" : "specialists";

    if (searchQuery.trim()) {
      return `${count} ${plural} matching "${searchQuery.trim()}"`;
    }
    if (filterMode === "rating") {
      return `${count} of ${total} ${plural} rated 4.5+ in San Pablo City`;
    }
    if (filterMode === "budget") {
      const lowestRate = filteredProviders[0]?.hourlyRate;
      return lowestRate
        ? `${count} ${plural} sorted by budget (from ₱${lowestRate}/hr)`
        : `${count} budget-friendly ${plural} in San Pablo City`;
    }
    if (filterMode === "available") {
      return `${count} of ${total} ${plural} available today in San Pablo City`;
    }
    return `${count} active ${plural} in San Pablo City (closest first)`;
  }, [filteredProviders, baseCategoryProviders, filterMode, searchQuery]);

  return (
    <div className="relative bg-[#f8fafc] flex flex-col justify-between size-full">
      <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex gap-3.5 items-center px-6 py-4 bg-white border-b border-[#e2e8f0]">
          <button
            onClick={goBack}
            className="bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center rounded-xl shrink-0 size-9 active:bg-slate-200 touch-manipulation cursor-pointer"
          >
            <svg className="size-4 text-[#0f172a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex flex-col min-w-0 flex-1">
            <h2
              className="text-[#0f172a] text-lg font-bold truncate"
              style={{ fontFamily: "Lexend Deca, sans-serif" }}
            >
              {categoryTitle}
            </h2>
            <span className="text-[#64748b] text-xs truncate">
              {subtitleText}
            </span>
          </div>
        </div>

        {/* Dynamic Filter Pills Row */}
        <div className="flex gap-2 items-center py-2.5 px-6 overflow-x-auto no-scrollbar bg-[#f8fafc]">
          {[
            { id: "nearest", label: "Nearest first" },
            { id: "rating", label: "Rating 4.5+" },
            { id: "budget", label: "Budget-friendly" },
            { id: "available", label: "Available Today" },
          ].map((f) => {
            const isActive = filterMode === f.id;
            return (
              <button
                key={f.id}
                onClick={() => {
                  if (isActive && f.id !== "nearest") {
                    setFilterMode("nearest");
                    onToast("Filter reset to nearest first");
                  } else {
                    setFilterMode(f.id as any);
                    onToast(`Filtering: ${f.label}`);
                  }
                }}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full shrink-0 border text-xs font-semibold transition-all touch-manipulation cursor-pointer ${
                  isActive
                    ? "bg-[#0d9488] border-[#0d9488] text-white shadow-2xs font-bold"
                    : "bg-white border-[#e2e8f0] text-[#64748b] hover:border-[#0d9488]/40 hover:text-[#0f172a]"
                }`}
              >
                <span>{f.label}</span>
                {isActive && (
                  <span className="size-1.5 rounded-full bg-white ml-0.5 animate-pulse" />
                )}
              </button>
            );
          })}
          {(filterMode !== "nearest" || searchQuery) && (
            <button
              onClick={() => {
                setFilterMode("nearest");
                setSearchQuery("");
                onToast("All filters cleared");
              }}
              className="text-[11px] font-bold text-[#0d9488] hover:underline shrink-0 px-2 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        {/* In-category Live Search */}
        <div className="px-6 pb-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${categoryTitle} (e.g. name, area, service)...`}
              className="w-full pl-9 pr-8 py-2 bg-white border border-[#e2e8f0] rounded-xl text-xs text-[#0f172a] placeholder-[#94a3b8] outline-none focus:border-[#0d9488] shadow-2xs transition-colors"
            />
            <svg
              className="size-4 text-[#94a3b8] absolute left-3 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-[#94a3b8] hover:text-[#0f172a] text-xs cursor-pointer p-0.5"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Providers List */}
        <div className="flex flex-col gap-3.5 px-6 pb-6 pt-2">
          {filteredProviders.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="bg-[#f0fdfa] border border-[#ccfbf1] rounded-full size-16 flex items-center justify-center">
                <span className="text-2xl">👷</span>
              </div>
              <h3 className="text-[#0f172a] text-base font-bold">
                No Providers Available
              </h3>
              <p className="text-[#64748b] text-xs max-w-[240px] leading-relaxed">
                {searchQuery || filterMode !== "nearest"
                  ? "No specialists match your active filter criteria. Try resetting filters."
                  : "There are currently no available Service Providers for this category right now."}
              </p>
              <div className="flex gap-2">
                {(searchQuery || filterMode !== "nearest") && (
                  <button
                    onClick={() => {
                      setFilterMode("nearest");
                      setSearchQuery("");
                    }}
                    className="bg-white border border-[#e2e8f0] text-[#0f172a] text-xs font-bold px-4 py-2 rounded-xl mt-2 active:bg-slate-50 cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  onClick={() => nav("all-categories")}
                  className="bg-[#0d9488] text-white text-xs font-bold px-4 py-2 rounded-xl mt-2 active:brightness-90 touch-manipulation cursor-pointer"
                >
                  Browse Other Categories
                </button>
              </div>
            </div>
          ) : (
            filteredProviders.map((p, index) => {
              const isFav = favorites.includes(p.id);
              return (
                <div
                  key={p.id}
                  className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-3 shadow-xs hover:border-[#99f6e4] transition-colors"
                >
                  <div
                    onClick={() => {
                      onSelectProvider(p);
                      nav("provider-profile");
                    }}
                    className="flex gap-3.5 items-start cursor-pointer"
                  >
                    <div className="relative rounded-2xl size-18 overflow-hidden shrink-0 border border-[#e2e8f0]">
                      <img
                        src={p.photo}
                        className="size-full object-cover"
                        alt={p.name}
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#0f172a] text-sm font-bold">
                            {p.name}
                          </span>
                          {p.isVerified && (
                            <svg className="size-3.5 text-[#0d9488] shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(p.id);
                            onToast(
                              isFav
                                ? `${p.name} removed from favorites.`
                                : `${p.name} saved to favorites!`
                            );
                          }}
                          className="p-1 touch-manipulation cursor-pointer"
                        >
                          <svg
                            className={`size-5 transition-colors ${
                              isFav ? "text-[#f97316] fill-[#f97316]" : "text-[#cbd5e1]"
                            }`}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                            />
                          </svg>
                        </button>
                      </div>

                      <span className="text-[#64748b] text-xs font-medium">
                        {p.specialization}
                      </span>

                      <div className="flex items-center gap-3 pt-0.5">
                        <div className={`flex gap-1 items-center px-1.5 py-0.5 rounded-md ${
                          filterMode === "rating" ? "bg-amber-50 text-amber-900 border border-amber-200" : ""
                        }`}>
                          <svg className="size-3 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-[#0f172a] text-xs font-bold">
                            {p.rating}
                          </span>
                          <span className="text-[#94a3b8] text-[11px]">
                            ({p.reviewCount})
                          </span>
                          {filterMode === "rating" && (
                            <span className="text-[10px] text-amber-700 font-bold ml-0.5">
                              Top Rated
                            </span>
                          )}
                        </div>
                        <span className={`text-[11px] px-1.5 py-0.5 rounded-md ${
                          filterMode === "nearest" ? "bg-teal-50 text-[#0f766e] border border-teal-100 font-bold" : "text-[#64748b]"
                        }`}>
                          📍 {p.distance}
                          {filterMode === "nearest" && index === 0 && (
                            <span className="text-[10px] text-[#0d9488] font-bold ml-1">
                              (Closest)
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sub-services pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.services.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="bg-[#f1f5f9] text-[#475569] text-[10px] font-semibold px-2 py-0.5 rounded-md"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Rate & Book Actions */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#f1f5f9]">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-bold ${
                        filterMode === "budget"
                          ? "text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg"
                          : "text-[#0f766e]"
                      }`}>
                        ₱{p.hourlyRate}/hr
                      </span>
                      {filterMode === "budget" && index === 0 && (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Lowest Rate
                        </span>
                      )}
                      {p.hourlyRate <= 280 && filterMode !== "budget" && (
                        <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                          Budget
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        onSelectProvider(p);
                        nav("booking");
                      }}
                      className="bg-[#0d9488] text-white text-xs font-bold px-4 py-1.5 rounded-xl active:scale-95 transition-transform touch-manipulation cursor-pointer hover:bg-[#0f766e]"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <BottomNav active="home" nav={nav} bookingCount={bookingCount} />
    </div>
  );
}

