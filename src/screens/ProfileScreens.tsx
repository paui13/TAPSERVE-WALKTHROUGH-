import React, { useState } from "react";
import { Screen } from "../types";
import { BottomNav, TappyAvatar, A } from "../components/SharedUI";
import {
  UserAccount,
  SavedAddress,
  Provider,
  NotificationSettings,
  AppStorage,
} from "../data/mockData";

// ─── User Profile Screen ──────────────────────────────────────────────────────
export function UserProfileScreen({
  nav,
  goBack,
  currentUser,
  bookingCount,
  onLogout,
  onSwitchToProviderMode,
}: {
  nav: (s: Screen) => void;
  goBack: () => void;
  currentUser: UserAccount;
  bookingCount: number;
  onLogout: () => void;
  onSwitchToProviderMode: () => void;
}) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { icon: "📋", label: "My Bookings", screen: "bookings" as Screen },
    { icon: "❤️", label: "Favorite Providers", screen: "favorites" as Screen },
    { icon: "📍", label: "Saved Addresses", screen: "saved-addresses" as Screen },
    { icon: "💳", label: "Payment Methods", screen: "payment-methods" as Screen },
    { icon: "🔔", label: "Notifications", screen: "notifications-settings" as Screen },
    { icon: "🛡️", label: "Privacy & Security", screen: "privacy-security" as Screen },
    { icon: "🔰", label: "Account Status", screen: "account-status" as Screen },
    { icon: "❓", label: "Help & Support", screen: "help-support" as Screen },
  ];

  const isApprovedProvider =
    currentUser.isProvider ||
    currentUser.providerApplicationStatus === "Approved";

  return (
    <div className="bg-[#f8fafc] flex flex-col justify-between size-full relative">
      <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
        {/* Profile Teal Header */}
        <div className="bg-[#115e59] flex flex-col items-center gap-3 pt-8 pb-6 px-6 text-center">
          <div className="bg-white rounded-full size-20 overflow-hidden border-3 border-[#ccfbf1]/50 shadow-md">
            <img
              src={`${A}81684.png`}
              className="size-full object-cover"
              alt={currentUser.name}
            />
          </div>
          <div className="flex flex-col">
            <h2
              className="text-white text-lg font-bold tracking-tight"
              style={{ fontFamily: "Lexend Deca, sans-serif" }}
            >
              {currentUser.name}
            </h2>
            <span className="text-[#ccfbf1] text-xs">{currentUser.email}</span>
          </div>

          <div className="flex gap-6 bg-white/10 border border-white/15 px-6 py-2.5 rounded-2xl mt-1">
            <div className="flex flex-col items-center">
              <span className="text-white text-base font-bold">{bookingCount}</span>
              <span className="text-[#ccfbf1] text-[10px]">Bookings</span>
            </div>
            <div className="w-px bg-white/20" />
            <div className="flex flex-col items-center">
              <span className="text-white text-base font-bold">4.9 ★</span>
              <span className="text-[#ccfbf1] text-[10px]">Rating</span>
            </div>
            <div className="w-px bg-white/20" />
            <div className="flex flex-col items-center">
              <span className="text-white text-base font-bold">2026</span>
              <span className="text-[#ccfbf1] text-[10px]">Member</span>
            </div>
          </div>
        </div>

        {/* Provider Mode Banner / Switcher */}
        <div className="p-5 pb-2">
          {isApprovedProvider ? (
            <button
              onClick={onSwitchToProviderMode}
              className="bg-white border-2 border-[#0d9488] shadow-xs flex gap-3.5 items-center p-4 rounded-2xl w-full text-left active:bg-teal-50 transition-colors touch-manipulation"
            >
              <div className="bg-[#f0fdfa] border border-[#ccfbf1] rounded-xl size-11 flex items-center justify-center text-xl shrink-0">
                🔄
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[#0d9488] text-sm font-bold">
                  Switch to Provider Mode
                </span>
                <span className="text-[#64748b] text-[11px]">
                  Access your provider dashboard & manage job requests
                </span>
              </div>
              <svg className="size-4 text-[#0d9488] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <div className="bg-gradient-to-br from-[#115e59] to-[#0d9488] rounded-2xl p-4 flex gap-3 items-center shadow-md">
              <TappyAvatar size={50} />
              <div className="flex flex-1 flex-col gap-1">
                <span
                  className="text-white text-xs font-bold"
                  style={{ fontFamily: "Lexend Deca, sans-serif" }}
                >
                  Earn as a Specialist
                </span>
                <span className="text-[#ccfbf1] text-[11px] leading-tight">
                  Offer your skills and services to homeowners in San Pablo City.
                </span>
                <button
                  onClick={() => nav("provider-apply")}
                  className="bg-white text-[#0f766e] text-[11px] font-bold px-3 py-1.5 rounded-full self-start active:bg-slate-100 touch-manipulation mt-1 shadow-xs"
                >
                  Apply as Provider →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-2 p-5 pt-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => nav(item.screen)}
              className="bg-white border border-[#e2e8f0] flex gap-3.5 items-center p-3.5 rounded-2xl text-left active:bg-slate-50 transition-colors touch-manipulation shadow-xs"
            >
              <span className="text-xl shrink-0">{item.icon}</span>
              <span className="flex-1 text-[#0f172a] text-xs font-bold">
                {item.label}
              </span>
              <svg
                className="size-4 text-[#94a3b8] shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}

          {/* Log Out */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="bg-red-50/70 border border-red-200 flex gap-3.5 items-center p-3.5 rounded-2xl text-left active:bg-red-100 transition-colors touch-manipulation mt-2 shadow-xs"
          >
            <span className="text-xl shrink-0">🚪</span>
            <span className="flex-1 text-red-600 text-xs font-bold">Log Out</span>
          </button>
        </div>
      </div>

      {/* Log Out Confirmation Sheet */}
      {showLogoutModal && (
        <div
          className="absolute inset-0 bg-black/50 flex items-end justify-center z-50"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-white rounded-t-3xl w-full p-6 flex flex-col gap-4 scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-1 items-center text-center">
              <div className="bg-red-100 text-red-600 rounded-full size-12 flex items-center justify-center text-xl">
                🚪
              </div>
              <h3 className="text-[#0f172a] text-lg font-bold" style={{ fontFamily: "Lexend Deca, sans-serif" }}>
                Log Out?
              </h3>
              <p className="text-[#64748b] text-xs leading-relaxed max-w-[240px]">
                Are you sure you want to log out of your TapServe demo account?
              </p>
            </div>
            <div className="flex gap-2.5 pt-1">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-[#f1f5f9] text-[#64748b] text-xs font-bold py-3 rounded-xl touch-manipulation"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  onLogout();
                }}
                className="flex-1 bg-red-600 text-white text-xs font-bold py-3 rounded-xl touch-manipulation active:bg-red-700"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <BottomNav active="profile" nav={nav} bookingCount={bookingCount} />
    </div>
  );
}

// ─── Favorites Screen ─────────────────────────────────────────────────────────
export function FavoritesScreen({
  nav,
  goBack,
  providers,
  favorites,
  toggleFavorite,
  onSelectProvider,
  onToast,
}: {
  nav: (s: Screen) => void;
  goBack: () => void;
  providers: Provider[];
  favorites: string[];
  toggleFavorite: (providerId: string) => void;
  onSelectProvider: (p: Provider) => void;
  onToast: (msg: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [removeId, setRemoveId] = useState<string | null>(null);

  const favProviders = providers.filter((p) => favorites.includes(p.id));

  const filtered = favProviders.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.specialization.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === "All" || p.category === filterCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="bg-[#f8fafc] flex flex-col size-full relative">
      {/* Header */}
      <div className="bg-white border-b border-[#e2e8f0] flex flex-col gap-3 px-5 pt-12 pb-3 shrink-0">
        <div className="flex gap-3 items-center">
          <button
            onClick={goBack}
            className="bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center rounded-xl size-9 active:bg-slate-200 touch-manipulation"
          >
            <svg className="size-4 text-[#0f172a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex flex-col">
            <h2 className="text-[#0f172a] text-lg font-bold" style={{ fontFamily: "Lexend Deca, sans-serif" }}>
              Favorite Providers
            </h2>
            <span className="text-[#64748b] text-xs">
              {favProviders.length} saved specialist{favProviders.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#f8fafc] border border-[#e2e8f0] flex gap-2.5 h-10 items-center px-3 rounded-xl">
          <svg className="size-4 text-[#94a3b8] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search favorite providers..."
            className="flex-1 bg-transparent text-xs text-[#0f172a] outline-none placeholder:text-[#94a3b8]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="bg-[#f0fdfa] border border-[#ccfbf1] rounded-full size-16 flex items-center justify-center">
              <span className="text-2xl">❤️</span>
            </div>
            <h3 className="text-[#0f172a] text-sm font-bold">No Favorite Providers Yet</h3>
            <p className="text-[#64748b] text-xs max-w-[220px]">
              Tap the heart icon on any specialist card to save them here for quick booking.
            </p>
            <button
              onClick={() => nav("all-categories")}
              className="bg-[#0d9488] text-white text-xs font-bold px-4 py-2 rounded-xl active:brightness-90 touch-manipulation mt-1"
            >
              Find Providers
            </button>
          </div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-3 shadow-xs"
            >
              <div className="flex gap-3.5 items-start">
                <img
                  src={p.photo}
                  className="size-16 rounded-2xl object-cover shrink-0 border border-[#e2e8f0]"
                  alt={p.name}
                />
                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                  <div className="flex items-start justify-between">
                    <span className="text-[#0f172a] text-sm font-bold truncate">
                      {p.name}
                    </span>
                    <button
                      onClick={() => setRemoveId(p.id)}
                      className="p-1 touch-manipulation text-[#f97316]"
                    >
                      <svg className="size-5 fill-current" viewBox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>
                  <span className="text-[#64748b] text-xs">{p.specialization}</span>
                  <div className="flex items-center gap-3 text-xs pt-1">
                    <span className="font-bold text-[#0f172a]">⭐ {p.rating} ({p.reviewCount})</span>
                    <span className="text-[#64748b]">📍 {p.distance}</span>
                    <span className="text-[#0f766e] font-bold ml-auto">₱{p.hourlyRate}/hr</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-1 border-t border-[#f1f5f9]">
                <button
                  onClick={() => {
                    onSelectProvider(p);
                    nav("provider-profile");
                  }}
                  className="flex-1 bg-[#f1f5f9] text-[#0f172a] text-xs font-bold py-2 rounded-xl active:bg-slate-200 touch-manipulation"
                >
                  View Profile
                </button>
                <button
                  onClick={() => {
                    onSelectProvider(p);
                    nav("booking");
                  }}
                  className="flex-1 bg-[#0d9488] text-white text-xs font-bold py-2 rounded-xl active:brightness-90 touch-manipulation shadow-xs"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Remove Confirmation Sheet */}
      {removeId && (
        <div
          className="absolute inset-0 bg-black/50 flex items-end justify-center z-50"
          onClick={() => setRemoveId(null)}
        >
          <div
            className="bg-white rounded-t-3xl w-full p-6 flex flex-col gap-4 scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[#0f172a] text-base font-bold text-center">
              Remove from favorites?
            </h3>
            <p className="text-[#64748b] text-xs text-center leading-relaxed">
              This provider will be removed from your saved list. You can favorite them again anytime.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setRemoveId(null)}
                className="flex-1 bg-[#f1f5f9] text-[#64748b] text-xs font-bold py-3 rounded-xl touch-manipulation"
              >
                Keep
              </button>
              <button
                onClick={() => {
                  toggleFavorite(removeId);
                  onToast("Provider removed from favorites.");
                  setRemoveId(null);
                }}
                className="flex-1 bg-red-600 text-white text-xs font-bold py-3 rounded-xl touch-manipulation active:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Saved Addresses Screen ───────────────────────────────────────────────────
export function SavedAddressesScreen({
  goBack,
  addresses,
  onSaveAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  onToast,
}: {
  goBack: () => void;
  addresses: SavedAddress[];
  onSaveAddress: (address: SavedAddress) => void;
  onDeleteAddress: (addressId: string) => void;
  onSetDefaultAddress: (addressId: string) => void;
  onToast: (msg: string) => void;
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddr, setEditingAddr] = useState<SavedAddress | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form fields
  const [label, setLabel] = useState("Home");
  const [houseUnit, setHouseUnit] = useState("");
  const [street, setStreet] = useState("");
  const [barangay, setBarangay] = useState("Brgy. San Roque");
  const [city, setCity] = useState("San Pablo City");
  const [province, setProvince] = useState("Laguna");
  const [landmark, setLandmark] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const openAdd = () => {
    setEditingAddr(null);
    setLabel("Home");
    setHouseUnit("");
    setStreet("");
    setBarangay("Brgy. San Roque");
    setCity("San Pablo City");
    setProvince("Laguna");
    setLandmark("");
    setIsDefault(false);
    setShowAddModal(true);
  };

  const openEdit = (a: SavedAddress) => {
    setEditingAddr(a);
    setLabel(a.label);
    setHouseUnit(a.houseUnit);
    setStreet(a.street);
    setBarangay(a.barangay);
    setCity(a.city);
    setProvince(a.province);
    setLandmark(a.landmark || "");
    setIsDefault(a.isDefault);
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim() || !houseUnit.trim()) {
      onToast("Please enter house number and street.");
      return;
    }

    const newAddr: SavedAddress = {
      id: editingAddr ? editingAddr.id : `addr-${Date.now()}`,
      label: label.trim() || "Address",
      houseUnit: houseUnit.trim(),
      street: street.trim(),
      barangay: barangay.trim(),
      city: city.trim(),
      province: province.trim(),
      landmark: landmark.trim(),
      isDefault: isDefault || addresses.length === 0,
    };

    onSaveAddress(newAddr);
    setShowAddModal(false);
    onToast(editingAddr ? "Address updated successfully." : "New address added.");
  };

  return (
    <div className="bg-[#f8fafc] flex flex-col size-full relative">
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
          Saved Addresses
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-3">
        {addresses.map((a) => (
          <div
            key={a.id}
            className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex gap-3 items-start shadow-xs"
          >
            <div className="bg-[#f0fdfa] border border-[#ccfbf1] rounded-xl size-10 flex items-center justify-center text-lg shrink-0">
              📍
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[#0f172a] text-sm font-bold">{a.label}</span>
                {a.isDefault && (
                  <span className="bg-[#ccfbf1] text-[#0f766e] text-[9px] font-bold px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <p className="text-[#475569] text-xs mt-1">
                {a.houseUnit} {a.street}, {a.barangay}
              </p>
              <p className="text-[#64748b] text-[11px]">
                {a.city}, {a.province}
              </p>
              {a.landmark && (
                <p className="text-[#0d9488] text-[10px] italic mt-0.5">
                  Landmark: {a.landmark}
                </p>
              )}

              <div className="flex gap-3 items-center mt-3 pt-2 border-t border-[#f1f5f9]">
                <button
                  onClick={() => openEdit(a)}
                  className="text-[#0d9488] text-xs font-bold hover:underline touch-manipulation"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirmId(a.id)}
                  className="text-red-500 text-xs font-bold hover:underline touch-manipulation"
                >
                  Delete
                </button>
                {!a.isDefault && (
                  <button
                    onClick={() => {
                      onSetDefaultAddress(a.id);
                      onToast(`Set ${a.label} as default address.`);
                    }}
                    className="text-[#64748b] text-xs font-semibold hover:underline touch-manipulation ml-auto"
                  >
                    Set Default
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={openAdd}
          className="border-2 border-dashed border-[#0d9488] bg-white/70 flex gap-2 h-14 items-center justify-center rounded-2xl w-full text-xs font-bold text-[#0d9488] active:bg-[#f0fdfa] touch-manipulation shadow-xs mt-1"
        >
          <span className="text-base">+</span> Add New Address
        </button>
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div
          className="absolute inset-0 bg-black/50 flex items-end justify-center z-50"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-t-3xl w-full p-6 flex flex-col gap-4 scale-in max-h-[90%] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[#0f172a] text-base font-bold" style={{ fontFamily: "Lexend Deca, sans-serif" }}>
              {editingAddr ? "Edit Address" : "Add New Address"}
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[#0f172a] text-xs font-bold">Address Label</label>
                <div className="flex gap-2">
                  {["Home", "Work", "Other"].map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setLabel(lbl)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                        label === lbl
                          ? "bg-[#0d9488] border-[#0d9488] text-white"
                          : "bg-[#f8fafc] border-[#e2e8f0] text-[#64748b]"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[#0f172a] text-xs font-bold">Unit / House</label>
                  <input
                    value={houseUnit}
                    onChange={(e) => setHouseUnit(e.target.value)}
                    placeholder="123"
                    className="bg-[#f8fafc] border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none focus:border-[#0d9488]"
                    required
                  />
                </div>
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-[#0f172a] text-xs font-bold">Street</label>
                  <input
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Sample Street"
                    className="bg-[#f8fafc] border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none focus:border-[#0d9488]"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[#0f172a] text-xs font-bold">Barangay</label>
                <input
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  placeholder="Brgy. San Roque"
                  className="bg-[#f8fafc] border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none focus:border-[#0d9488]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[#0f172a] text-xs font-bold">City / Municipality</label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="San Pablo City"
                    className="bg-[#f8fafc] border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none focus:border-[#0d9488]"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[#0f172a] text-xs font-bold">Province</label>
                  <input
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    placeholder="Laguna"
                    className="bg-[#f8fafc] border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none focus:border-[#0d9488]"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[#0f172a] text-xs font-bold">Landmark (Optional)</label>
                <input
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Near Sampaloc Lake / Gate 2"
                  className="bg-[#f8fafc] border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none focus:border-[#0d9488]"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="accent-[#0d9488] size-4 rounded"
                />
                <span className="text-[#0f172a] text-xs font-semibold">Set as default address</span>
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-[#f1f5f9] text-[#64748b] text-xs font-bold py-3 rounded-xl touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0d9488] text-white text-xs font-bold py-3 rounded-xl touch-manipulation active:brightness-90 shadow-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirmId && (
        <div
          className="absolute inset-0 bg-black/50 flex items-end justify-center z-50"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="bg-white rounded-t-3xl w-full p-6 flex flex-col gap-4 scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[#0f172a] text-base font-bold text-center">Delete address?</h3>
            <p className="text-[#64748b] text-xs text-center">
              Are you sure you want to remove this address from your saved list?
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 bg-[#f1f5f9] text-[#64748b] text-xs font-bold py-3 rounded-xl touch-manipulation"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteAddress(deleteConfirmId);
                  setDeleteConfirmId(null);
                  onToast("Address deleted.");
                }}
                className="flex-1 bg-red-600 text-white text-xs font-bold py-3 rounded-xl touch-manipulation active:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Payment Methods Screen ───────────────────────────────────────────────────
export function PaymentMethodsScreen({ goBack }: { goBack: () => void }) {
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
          Payment Methods
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4">
        {/* Active Cash Card */}
        <div className="bg-[#f0fdfa] border border-[#ccfbf1] rounded-2xl p-4 flex gap-3.5 items-center shadow-xs">
          <div className="bg-white border border-[#ccfbf1] rounded-xl size-12 flex items-center justify-center text-2xl shrink-0">
            💵
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-[#0f172a] text-sm font-bold">Cash Payment</span>
            <span className="text-[#0f766e] text-xs font-semibold">Active & Default Method</span>
          </div>
          <div className="size-5 rounded-full bg-[#0d9488] text-white flex items-center justify-center text-xs">
            ✓
          </div>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
          <span className="text-[#0f172a] text-xs font-bold uppercase tracking-wider">
            Payment Policy
          </span>
          <p className="text-[#475569] text-xs leading-relaxed">
            Payment is made directly to the Service Provider in cash after the service is completed to your satisfaction.
          </p>
        </div>

        <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-2xl p-4 flex gap-2.5 items-start">
          <span className="text-base shrink-0">💡</span>
          <p className="text-[#92400e] text-xs leading-relaxed">
            Digital payment integrations (such as GCash or Maya) will be supported in upcoming versions of the platform.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Notification Settings Screen ─────────────────────────────────────────────
export function NotificationSettingsScreen({
  goBack,
  settings,
  onSaveSettings,
  onToast,
}: {
  goBack: () => void;
  settings: NotificationSettings;
  onSaveSettings: (s: NotificationSettings) => void;
  onToast: (msg: string) => void;
}) {
  const [local, setLocal] = useState<NotificationSettings>(settings);

  const toggle = (key: keyof NotificationSettings) => {
    const updated = { ...local, [key]: !local[key] };
    setLocal(updated);
    onSaveSettings(updated);
  };

  const handleEnableAll = () => {
    const allOn: NotificationSettings = {
      bookingConfirm: true,
      providerAccepted: true,
      providerOtw: true,
      serviceStarted: true,
      serviceCompleted: true,
      bookingCancel: true,
      newMessages: true,
      aiResponses: true,
      providerAvail: true,
      appStatus: true,
      loginAlerts: true,
      promotions: true,
    };
    setLocal(allOn);
    onSaveSettings(allOn);
    onToast("All notification alerts enabled.");
  };

  const ToggleSwitch = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        active ? "bg-[#0d9488]" : "bg-slate-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
          active ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

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
          Notification Settings
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-1">
          <span className="text-[#64748b] text-xs">Manage alerts and messages</span>
          <button
            onClick={handleEnableAll}
            className="text-[#0d9488] text-xs font-bold hover:underline touch-manipulation"
          >
            Enable All
          </button>
        </div>

        {/* Group: Bookings */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-xs">
          <div className="bg-[#f8fafc] px-4 py-2 border-b border-[#e2e8f0]">
            <span className="text-[#0f172a] text-xs font-bold uppercase tracking-wider">
              Booking Updates
            </span>
          </div>
          {[
            { key: "bookingConfirm", label: "Booking Confirmation" },
            { key: "providerAccepted", label: "Provider Accepted Request" },
            { key: "providerOtw", label: "Provider On the Way" },
            { key: "serviceStarted", label: "Service Started" },
            { key: "serviceCompleted", label: "Service Completed" },
            { key: "bookingCancel", label: "Booking Cancellation" },
          ].map((item, idx) => (
            <div
              key={item.key}
              className={`flex items-center justify-between px-4 py-3 ${
                idx > 0 ? "border-t border-[#f1f5f9]" : ""
              }`}
            >
              <span className="text-[#0f172a] text-xs font-medium">{item.label}</span>
              <ToggleSwitch
                active={local[item.key as keyof NotificationSettings]}
                onClick={() => toggle(item.key as keyof NotificationSettings)}
              />
            </div>
          ))}
        </div>

        {/* Group: Messages & AI */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-xs">
          <div className="bg-[#f8fafc] px-4 py-2 border-b border-[#e2e8f0]">
            <span className="text-[#0f172a] text-xs font-bold uppercase tracking-wider">
              Messages & AI
            </span>
          </div>
          {[
            { key: "newMessages", label: "New Provider Chat Messages" },
            { key: "aiResponses", label: "Tappy AI Assistant Insights" },
          ].map((item, idx) => (
            <div
              key={item.key}
              className={`flex items-center justify-between px-4 py-3 ${
                idx > 0 ? "border-t border-[#f1f5f9]" : ""
              }`}
            >
              <span className="text-[#0f172a] text-xs font-medium">{item.label}</span>
              <ToggleSwitch
                active={local[item.key as keyof NotificationSettings]}
                onClick={() => toggle(item.key as keyof NotificationSettings)}
              />
            </div>
          ))}
        </div>

        {/* Group: Security */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-xs">
          <div className="bg-[#f8fafc] px-4 py-2 border-b border-[#e2e8f0]">
            <span className="text-[#0f172a] text-xs font-bold uppercase tracking-wider">
              Account & Security
            </span>
          </div>
          {[
            { key: "appStatus", label: "Provider Application Alerts" },
            { key: "loginAlerts", label: "Login & Security Alerts" },
            { key: "promotions", label: "Local Services & Promotions" },
          ].map((item, idx) => (
            <div
              key={item.key}
              className={`flex items-center justify-between px-4 py-3 ${
                idx > 0 ? "border-t border-[#f1f5f9]" : ""
              }`}
            >
              <span className="text-[#0f172a] text-xs font-medium">{item.label}</span>
              <ToggleSwitch
                active={local[item.key as keyof NotificationSettings]}
                onClick={() => toggle(item.key as keyof NotificationSettings)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Privacy & Security Screen ────────────────────────────────────────────────
export function PrivacySecurityScreen({
  goBack,
  onToast,
}: {
  goBack: () => void;
  onToast: (msg: string) => void;
}) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLoginActivity, setShowLoginActivity] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  // Password fields
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      onToast("New password must be at least 6 characters.");
      return;
    }
    if (newPass !== confirmPass) {
      onToast("Passwords do not match.");
      return;
    }
    setShowPasswordModal(false);
    setOldPass("");
    setNewPass("");
    setConfirmPass("");
    onToast("Password updated successfully.");
  };

  return (
    <div className="bg-[#f8fafc] flex flex-col size-full relative">
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
          Privacy & Security
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4">
        {/* Security Section */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-xs">
          <div className="px-4 py-3 border-b border-[#f1f5f9]">
            <span className="text-[#0f172a] text-xs font-bold uppercase tracking-wider">
              Account Security
            </span>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center justify-between px-4 py-3.5 w-full text-left active:bg-slate-50 border-b border-[#f8fafc] touch-manipulation"
          >
            <div>
              <p className="text-[#0f172a] text-xs font-bold">Change Password</p>
              <p className="text-[#64748b] text-[11px]">Update your demo account password</p>
            </div>
            <span className="text-sm text-[#94a3b8]">→</span>
          </button>
          <button
            onClick={() => setShowLoginActivity(true)}
            className="flex items-center justify-between px-4 py-3.5 w-full text-left active:bg-slate-50 touch-manipulation"
          >
            <div>
              <p className="text-[#0f172a] text-xs font-bold">Login Activity</p>
              <p className="text-[#64748b] text-[11px]">Active sessions in San Pablo City</p>
            </div>
            <span className="text-sm text-[#94a3b8]">→</span>
          </button>
        </div>

        {/* Privacy Section */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-xs">
          <div className="px-4 py-3 border-b border-[#f1f5f9]">
            <span className="text-[#0f172a] text-xs font-bold uppercase tracking-wider">
              Privacy Permissions
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#f8fafc]">
            <div>
              <p className="text-[#0f172a] text-xs font-bold">Location Permission</p>
              <p className="text-[#64748b] text-[11px]">Allow live tracking & nearby matching</p>
            </div>
            <input
              type="checkbox"
              checked={locationEnabled}
              onChange={(e) => {
                setLocationEnabled(e.target.checked);
                onToast(`Location access ${e.target.checked ? "enabled" : "disabled"}.`);
              }}
              className="accent-[#0d9488] size-5"
            />
          </div>
          <div className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-[#0f172a] text-xs font-bold">Profile Visibility</p>
              <p className="text-[#64748b] text-[11px]">Visible to matched service providers</p>
            </div>
            <input
              type="checkbox"
              checked={profileVisible}
              onChange={(e) => {
                setProfileVisible(e.target.checked);
                onToast(`Profile visibility ${e.target.checked ? "enabled" : "disabled"}.`);
              }}
              className="accent-[#0d9488] size-5"
            />
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-xs">
          <div className="px-4 py-3 border-b border-[#f1f5f9]">
            <span className="text-red-600 text-xs font-bold uppercase tracking-wider">
              Account Control
            </span>
          </div>
          <button
            onClick={() => setShowDeactivateModal(true)}
            className="flex items-center justify-between px-4 py-3.5 w-full text-left active:bg-red-50 touch-manipulation"
          >
            <div>
              <p className="text-red-600 text-xs font-bold">Deactivate or Delete Account</p>
              <p className="text-[#64748b] text-[11px]">Manage permanent account status</p>
            </div>
            <span className="text-sm text-red-400">→</span>
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div
          className="absolute inset-0 bg-black/50 flex items-end justify-center z-50"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="bg-white rounded-t-3xl w-full p-6 flex flex-col gap-4 scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[#0f172a] text-base font-bold">Change Password</h3>
            <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
              <input
                type="password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                placeholder="Current password"
                className="bg-[#f8fafc] border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none"
                required
              />
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="New password (min 6 characters)"
                className="bg-[#f8fafc] border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none"
                required
              />
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Confirm new password"
                className="bg-[#f8fafc] border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none"
                required
              />
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-[#f1f5f9] text-[#64748b] text-xs font-bold py-3 rounded-xl touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0d9488] text-white text-xs font-bold py-3 rounded-xl touch-manipulation active:brightness-90 shadow-xs"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Login Activity Modal */}
      {showLoginActivity && (
        <div
          className="absolute inset-0 bg-black/50 flex items-end justify-center z-50"
          onClick={() => setShowLoginActivity(false)}
        >
          <div
            className="bg-white rounded-t-3xl w-full p-6 flex flex-col gap-4 scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[#0f172a] text-base font-bold">Recent Login Activity</h3>
            <div className="flex flex-col gap-2.5 text-xs">
              <div className="bg-[#f0fdfa] border border-[#ccfbf1] p-3 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#0f172a]">Chrome Mobile (Current)</p>
                  <p className="text-[#0f766e] text-[11px]">San Pablo City, Laguna · Active now</p>
                </div>
                <span className="size-2 rounded-full bg-[#10b981]" />
              </div>
              <div className="bg-[#f8fafc] border border-[#e2e8f0] p-3 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#0f172a]">Safari iOS</p>
                  <p className="text-[#64748b] text-[11px]">San Pablo City, Laguna · 2 days ago</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowLoginActivity(false)}
              className="bg-[#0d9488] text-white text-xs font-bold py-3 rounded-xl touch-manipulation"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Deactivate confirmation */}
      {showDeactivateModal && (
        <div
          className="absolute inset-0 bg-black/50 flex items-end justify-center z-50"
          onClick={() => setShowDeactivateModal(false)}
        >
          <div
            className="bg-white rounded-t-3xl w-full p-6 flex flex-col gap-4 scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[#0f172a] text-base font-bold text-center">Deactivate Account?</h3>
            <p className="text-[#64748b] text-xs text-center leading-relaxed">
              Your profile and active bookings will be paused. You can reactivate at any time by logging in.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 bg-[#f1f5f9] text-[#64748b] text-xs font-bold py-3 rounded-xl touch-manipulation"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeactivateModal(false);
                  onToast("Account simulated deactivation successful.");
                }}
                className="flex-1 bg-red-600 text-white text-xs font-bold py-3 rounded-xl touch-manipulation active:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Help & Support Screen ────────────────────────────────────────────────────
export function HelpSupportScreen({
  nav,
  goBack,
  onToast,
}: {
  nav: (s: Screen) => void;
  goBack: () => void;
  onToast: (msg: string) => void;
}) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportCategory, setSupportCategory] = useState("Booking Inquiries");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [hasFile, setHasFile] = useState(false);

  const faqs = [
    {
      q: "How does TapServe match me with a Service Provider?",
      a: "TapServe uses your location in San Pablo City and your required household task to recommend verified nearby specialists with high ratings and open availability.",
    },
    {
      q: "When and how do I pay for the service?",
      a: "Payment is made directly in cash to your Service Provider after the task is completed to your satisfaction.",
    },
    {
      q: "Can I cancel a scheduled booking?",
      a: "Yes, you can cancel any upcoming booking from the My Bookings screen. The provider's reserved slot will automatically be freed.",
    },
    {
      q: "How are Service Providers verified?",
      a: "All TapServe specialists submit valid government IDs, barangay or police clearances, and trade skill certifications before approval.",
    },
    {
      q: "How do I become a TapServe Service Provider?",
      a: "You can apply via the 'Register as Service Provider' option on the login screen or through your user profile.",
    },
  ];

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSupportModal(false);
    setSubject("");
    setMessage("");
    setHasFile(false);
    onToast("Support request submitted! Our team will respond shortly.");
  };

  return (
    <div className="bg-[#f8fafc] flex flex-col size-full relative">
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
          Help & Support
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4">
        {/* Tappy AI Assistant card shortcut */}
        <div className="bg-gradient-to-r from-[#115e59] to-[#0d9488] rounded-2xl p-4 flex gap-3.5 items-center shadow-md">
          <TappyAvatar size={50} />
          <div className="flex-1 min-w-0">
            <h3 className="text-white text-sm font-bold">Ask Tappy AI Assistant</h3>
            <p className="text-[#ccfbf1] text-[11px] leading-snug mt-0.5">
              Instant answers on bookings, cancellations, and specialist availability.
            </p>
            <button
              onClick={() => nav("chatbot")}
              className="bg-white text-[#0f766e] text-xs font-bold px-3 py-1.5 rounded-full mt-2 active:bg-slate-100 touch-manipulation shadow-xs"
            >
              Chat with Tappy →
            </button>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
          <h3 className="text-[#0f172a] text-xs font-bold uppercase tracking-wider mb-1">
            Frequently Asked Questions
          </h3>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={faq.q} className="border-b border-[#f1f5f9] last:border-b-0 py-2">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="flex items-center justify-between w-full text-left gap-2 touch-manipulation"
                >
                  <span className="text-[#0f172a] text-xs font-bold">{faq.q}</span>
                  <span className="text-xs text-[#0d9488] font-bold">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <p className="text-[#64748b] text-[11px] leading-relaxed pt-2">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Support Button */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-3 shadow-xs">
          <div>
            <h3 className="text-[#0f172a] text-sm font-bold">Need Personal Assistance?</h3>
            <p className="text-[#64748b] text-xs mt-0.5">
              Submit a support ticket or report an issue directly to TapServe team.
            </p>
          </div>
          <button
            onClick={() => setShowSupportModal(true)}
            className="bg-[#0d9488] text-white text-xs font-bold py-3 rounded-xl active:brightness-90 touch-manipulation shadow-xs cursor-pointer"
          >
            Submit Support Request
          </button>
        </div>

        {/* Official Brand Footer */}
        <div className="flex flex-col items-center justify-center py-6 gap-2 opacity-85">
          <img src={`${A}tapserve_logo.png`} className="size-16 object-contain" alt="TapServe" />
          <div className="text-center">
            <p className="text-xs font-bold text-[#0f766e]">TapServe Philippines</p>
            <p className="text-[10px] text-[#94a3b8]">One Tap. All Services. Better Living. • v1.0</p>
          </div>
        </div>
      </div>

      {/* Support Ticket Modal */}
      {showSupportModal && (
        <div
          className="absolute inset-0 bg-black/50 flex items-end justify-center z-50"
          onClick={() => setShowSupportModal(false)}
        >
          <div
            className="bg-white rounded-t-3xl w-full p-6 flex flex-col gap-4 scale-in max-h-[85%] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[#0f172a] text-base font-bold">Submit Support Request</h3>
            <form onSubmit={handleSupportSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[#0f172a] text-xs font-bold">Category</label>
                <select
                  value={supportCategory}
                  onChange={(e) => setSupportCategory(e.target.value)}
                  className="bg-[#f8fafc] border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none"
                >
                  <option>Booking Inquiries</option>
                  <option>Service Provider Feedback</option>
                  <option>Payment & Billing</option>
                  <option>Account & Verification</option>
                  <option>Technical Issue / Bug</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[#0f172a] text-xs font-bold">Subject</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of your inquiry"
                  className="bg-[#f8fafc] border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none focus:border-[#0d9488]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[#0f172a] text-xs font-bold">Description</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide complete details..."
                  className="bg-[#f8fafc] border border-[#e2e8f0] h-20 p-3 rounded-xl text-xs outline-none resize-none focus:border-[#0d9488]"
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => setHasFile(!hasFile)}
                className="border border-dashed border-[#0d9488] bg-[#f0fdfa] p-2.5 rounded-xl text-xs font-bold text-[#0d9488] flex items-center justify-center gap-1.5 touch-manipulation"
              >
                <span>📎</span>
                <span>{hasFile ? "screenshot_issue.jpg attached (Remove)" : "Attach Screenshot (Optional)"}</span>
              </button>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowSupportModal(false)}
                  className="flex-1 bg-[#f1f5f9] text-[#64748b] text-xs font-bold py-3 rounded-xl touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0d9488] text-white text-xs font-bold py-3 rounded-xl touch-manipulation active:brightness-90 shadow-xs"
                >
                  Send Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
