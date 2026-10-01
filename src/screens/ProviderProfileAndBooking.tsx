import React, { useState, useEffect, useRef } from "react";
import { Screen } from "../types";
import { A } from "../components/SharedUI";
import {
  Provider,
  Booking,
  SavedAddress,
  UserAccount,
  AppStorage,
} from "../data/mockData";

// ─── Provider Profile Screen ──────────────────────────────────────────────────
export function ProviderProfileScreen({
  nav,
  goBack,
  provider,
  favorites,
  toggleFavorite,
  onToast,
}: {
  nav: (s: Screen) => void;
  goBack: () => void;
  provider: Provider;
  favorites: string[];
  toggleFavorite: (providerId: string) => void;
  onToast: (msg: string) => void;
}) {
  const isFav = favorites.includes(provider.id);

  return (
    <div className="bg-[#f8fafc] flex flex-col justify-between size-full">
      <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-3 pt-5 px-6 bg-white border-b border-[#e2e8f0]">
          <button
            onClick={goBack}
            className="bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center rounded-xl size-9 active:bg-slate-200 touch-manipulation"
          >
            <svg className="size-4 text-[#0f172a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toggleFavorite(provider.id);
                onToast(
                  isFav
                    ? `${provider.name} removed from favorites.`
                    : `${provider.name} saved to favorites!`
                );
              }}
              className={`border flex items-center justify-center rounded-xl size-9 active:scale-90 transition-all touch-manipulation ${
                isFav
                  ? "bg-[#fff7ed] border-[#fed7aa]"
                  : "bg-white border-[#e2e8f0]"
              }`}
            >
              <svg
                className={`size-5 transition-colors ${
                  isFav ? "text-[#f97316] fill-[#f97316]" : "text-[#94a3b8]"
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
            <button
              onClick={() => onToast("Provider profile link copied to clipboard.")}
              className="bg-white border border-[#e2e8f0] flex items-center justify-center rounded-xl size-9 active:bg-slate-50 touch-manipulation"
            >
              <svg className="size-4 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Profile Card Header */}
        <div className="flex flex-col gap-3 items-center pb-5 pt-4 px-6 bg-white border-b border-[#e2e8f0]">
          <div className="border-4 border-[#ccfbf1] rounded-[24px] shadow-sm size-[100px] overflow-hidden shrink-0">
            <img
              src={provider.photo}
              className="size-full object-cover"
              alt={provider.name}
            />
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex gap-1.5 items-center">
              <h2
                className="text-[#0f172a] text-xl font-bold"
                style={{ fontFamily: "Lexend Deca, sans-serif" }}
              >
                {provider.name}
              </h2>
              {provider.isVerified && (
                <svg className="size-4 text-[#0d9488]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className="text-[#0d9488] text-xs font-bold mt-0.5">
              {provider.specialization}
            </span>
            <span className="text-[#64748b] text-xs mt-1">
              📍 {provider.area} · {provider.distance}
            </span>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-2 w-full pt-2">
            {[
              { label: "Rating", val: `${provider.rating} ★`, sub: `(${provider.reviewCount})` },
              { label: "Jobs Done", val: `${provider.completedJobs}+`, sub: "Completed" },
              { label: "Experience", val: `${provider.yearsExperience} yrs`, sub: "Verified" },
              { label: "Rate", val: `₱${provider.hourlyRate}`, sub: "/ hour" },
            ].map((st) => (
              <div key={st.label} className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-2 flex flex-col items-center text-center">
                <span className="text-[#0f172a] text-xs font-bold">{st.val}</span>
                <span className="text-[#64748b] text-[10px]">{st.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content sections */}
        <div className="flex flex-col gap-4 p-5">
          {/* About */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
            <h3 className="text-[#0f172a] text-sm font-bold">About Specialist</h3>
            <p className="text-[#475569] text-xs leading-relaxed">
              {provider.description}
            </p>
          </div>

          {/* Services Offered */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-2.5 shadow-xs">
            <h3 className="text-[#0f172a] text-sm font-bold">Services Offered</h3>
            <div className="flex flex-col gap-2">
              {provider.services.map((svc) => (
                <div key={svc} className="flex items-center gap-2 text-xs text-[#0f172a]">
                  <div className="size-4 rounded-full bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center shrink-0">
                    <svg className="size-2.5 text-[#0f766e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{svc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Working Schedule */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
            <h3 className="text-[#0f172a] text-sm font-bold">Working Days & Hours</h3>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748b]">Days:</span>
              <span className="font-semibold text-[#0f172a]">{provider.workingDays.join(", ")}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748b]">Service Hours:</span>
              <span className="font-semibold text-[#0f172a]">{provider.workingHours}</span>
            </div>
          </div>

          {/* Reviews list */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-[#0f172a] text-sm font-bold">Client Reviews</h3>
              <span className="text-[#0d9488] text-xs font-bold">⭐ {provider.rating} ({provider.reviewCount})</span>
            </div>
            <div className="flex flex-col gap-3">
              {provider.reviews.map((rev) => (
                <div key={rev.id} className="border-t border-[#f1f5f9] pt-2.5 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#0f172a] text-xs font-bold">{rev.userName}</span>
                    <span className="text-[#94a3b8] text-[10px]">{rev.date}</span>
                  </div>
                  <div className="flex gap-0.5 text-amber-400 text-xs">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-[#475569] text-xs leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Buttons */}
      <div className="bg-white border-t border-[#e2e8f0] p-4 flex gap-3 shrink-0">
        <button
          onClick={() => nav("messaging")}
          className="border border-[#e2e8f0] flex items-center justify-center rounded-xl px-4 py-3 active:bg-slate-50 touch-manipulation"
        >
          <svg className="size-5 text-[#0f766e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
        <button
          onClick={() => nav("booking")}
          className="bg-[#0d9488] flex-1 flex items-center justify-center rounded-xl py-3 active:brightness-90 touch-manipulation shadow-md"
        >
          <span className="text-white text-sm font-bold">Book Service (₱{provider.hourlyRate}/hr)</span>
        </button>
      </div>
    </div>
  );
}

// ─── Booking Screen ───────────────────────────────────────────────────────────
export function BookingScreen({
  nav,
  goBack,
  provider,
  addresses,
  bookings,
  currentUser,
  onBookingConfirmed,
  onToast,
}: {
  nav: (s: Screen) => void;
  goBack: () => void;
  provider: Provider;
  addresses: SavedAddress[];
  bookings: Booking[];
  currentUser: UserAccount;
  onBookingConfirmed: (newBooking: Booking) => void;
  onToast: (msg: string) => void;
}) {
  const [selectedService, setSelectedService] = useState(
    provider.services[0] || "General Repair"
  );
  const [selectedDate, setSelectedDate] = useState("Today, Oct 12");
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(9); // 9 = October (0-indexed)
  const [selectedSlot, setSelectedSlot] = useState("10:30 AM");
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ""
  );
  const [customAddress, setCustomAddress] = useState("");
  const [description, setDescription] = useState(
    "May leak sa ilalim ng aming kitchen sink basin. Lumalaki na ang basa sa sahig. kailangan palitan ang selyo o piping."
  );
  const [photoUploaded, setPhotoUploaded] = useState(true);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictSlotTime, setConflictSlotTime] = useState("");
  const [confirming, setConfirming] = useState(false);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => {
    if (calYear === 2026 && calMonth <= 9) return;
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  // Check if provider is available on the currently selected date
  const isSelectedDateWorkingDay = (() => {
    if (selectedDate.startsWith("Today")) {
      return provider.workingDays.some((w) => w.toLowerCase() === "monday");
    }
    if (selectedDate.startsWith("Tomorrow")) {
      return provider.workingDays.some((w) => w.toLowerCase() === "tuesday");
    }
    const prefix = selectedDate.split(",")[0]?.trim().toLowerCase();
    const dayMap: Record<string, string> = {
      sun: "sunday",
      mon: "monday",
      tue: "tuesday",
      wed: "wednesday",
      thu: "thursday",
      fri: "friday",
      sat: "saturday",
    };
    const fullDay = dayMap[prefix || ""];
    if (!fullDay) return true;
    return provider.workingDays.some((w) => w.toLowerCase() === fullDay);
  })();

  // Available slots for selected date
  const dateSlots = !isSelectedDateWorkingDay
    ? []
    : provider.availableSlots[selectedDate] || [
        "9:00 AM",
        "10:30 AM",
        "2:00 PM",
        "3:30 PM",
      ];

  const handleSelectDate = (dateKey: string) => {
    setSelectedDate(dateKey);
    const slots = provider.availableSlots[dateKey] || [
      "9:00 AM",
      "10:30 AM",
      "2:00 PM",
      "3:30 PM",
    ];
    if (slots.length > 0 && !slots.includes(selectedSlot)) {
      setSelectedSlot(slots[0]);
    }
  };

  // Helper: check if a slot is already booked for this provider on this date
  const isSlotBooked = (timeStr: string) => {
    return bookings.some(
      (b) =>
        b.providerId === provider.id &&
        b.date === selectedDate &&
        b.time === timeStr &&
        b.status !== "Cancelled"
    );
  };

  const handleSelectSlot = (slot: string) => {
    if (isSlotBooked(slot)) {
      setConflictSlotTime(slot);
      setShowConflictModal(true);
      return;
    }
    setSelectedSlot(slot);
  };

  const activeAddress = addresses.find((a) => a.id === selectedAddressId);
  const finalAddressText = activeAddress
    ? `${activeAddress.houseUnit} ${activeAddress.street}, ${activeAddress.barangay}, ${activeAddress.city}`
    : customAddress || "123 Sample Street, Brgy. San Roque, San Pablo City";

  const handleConfirmFinal = () => {
    setShowWarningModal(false);
    setConfirming(true);

    setTimeout(() => {
      setConfirming(false);
      const uniqueNum = Math.floor(10000 + Math.random() * 90000);
      const newBookingId = `TS-2026-${uniqueNum}`;

      const newBooking: Booking = {
        id: newBookingId,
        providerId: provider.id,
        providerName: provider.name,
        providerPhoto: provider.photo,
        serviceCategory: provider.category,
        serviceDetail: selectedService,
        date: selectedDate,
        time: selectedSlot,
        address: finalAddressText,
        clientName: currentUser.name,
        clientPhone: currentUser.phone,
        problemDescription: description,
        urgencyLevel: photoUploaded ? "High" : "Medium",
        photoUrl: photoUploaded ? `${A}c2bb0.png` : undefined,
        estimatedCost: provider.hourlyRate,
        paymentMethod: "Cash Payment",
        status: "Accepted",
        createdAt: new Date().toISOString(),
      };

      onBookingConfirmed(newBooking);
      onToast(`Booking confirmed! ID: ${newBookingId}`);
      nav("booking-success");
    }, 900);
  };

  return (
    <div className="relative bg-[#f8fafc] flex flex-col justify-between size-full">
      <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex gap-3 items-center px-6 py-4 bg-white border-b border-[#e2e8f0]">
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
              Setup Booking
            </h2>
            <span className="text-[#64748b] text-xs">with {provider.name} · ₱{provider.hourlyRate}/hr</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-5">
          {/* Select Service */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-2.5 shadow-xs">
            <label className="text-[#0f172a] text-xs font-bold uppercase tracking-wider">
              Select Service
            </label>
            <div className="flex flex-col gap-2">
              {provider.services.map((svc) => (
                <button
                  key={svc}
                  type="button"
                  onClick={() => setSelectedService(svc)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-semibold transition-all touch-manipulation ${
                    selectedService === svc
                      ? "bg-[#f0fdfa] border-[#0d9488] text-[#0f766e]"
                      : "bg-[#f8fafc] border-[#e2e8f0] text-[#475569]"
                  }`}
                >
                  <span>{svc}</span>
                  {selectedService === svc && (
                    <span className="size-4 rounded-full bg-[#0d9488] text-white flex items-center justify-center shrink-0">
                      <svg className="size-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Select Date - Interactive Calendar View */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-[#0f172a] text-xs font-bold uppercase tracking-wider block">
                  Select Date
                </label>
                <span className="text-[#64748b] text-[11px]">
                  Pick an appointment date from the calendar
                </span>
              </div>
              <div className="bg-[#f0fdfa] border border-[#ccfbf1] text-[#0f766e] text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-2xs">
                <span>📅</span>
                <span>{selectedDate}</span>
              </div>
            </div>

            {/* Quick Date Presets */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {[
                { label: "Today (Oct 12)", val: "Today, Oct 12", m: 9, y: 2026 },
                { label: "Tomorrow (Oct 13)", val: "Tomorrow, Oct 13", m: 9, y: 2026 },
                { label: "Wed, Oct 14", val: "Wed, Oct 14", m: 9, y: 2026 },
                { label: "Thu, Oct 15", val: "Thu, Oct 15", m: 9, y: 2026 },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => {
                    handleSelectDate(p.val);
                    setCalMonth(p.m);
                    setCalYear(p.y);
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all touch-manipulation ${
                    selectedDate === p.val
                      ? "bg-[#0d9488] border-[#0d9488] text-white shadow-xs"
                      : "bg-[#f8fafc] border-[#e2e8f0] text-[#475569] hover:border-[#0d9488]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Monthly Calendar View */}
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3 flex flex-col gap-2">
              {/* Month Header & Controls */}
              <div className="flex items-center justify-between px-1">
                <span className="text-[#0f172a] text-xs font-bold tracking-tight">
                  {monthNames[calMonth]} {calYear}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    disabled={calYear === 2026 && calMonth <= 9}
                    className="size-7 rounded-lg flex items-center justify-center border border-[#e2e8f0] bg-white text-[#475569] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors text-xs font-bold"
                    aria-label="Previous Month"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="size-7 rounded-lg flex items-center justify-center border border-[#e2e8f0] bg-white text-[#475569] hover:bg-slate-100 transition-colors text-xs font-bold"
                    aria-label="Next Month"
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* Weekday Names Header */}
              <div className="grid grid-cols-7 text-center">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((dName) => (
                  <span
                    key={dName}
                    className="text-[10px] font-bold text-[#94a3b8] py-0.5 uppercase tracking-wide"
                  >
                    {dName}
                  </span>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for offset */}
                {Array.from({
                  length: new Date(calYear, calMonth, 1).getDay(),
                }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-8" />
                ))}

                {/* Day numbers */}
                {Array.from({
                  length: new Date(calYear, calMonth + 1, 0).getDate(),
                }).map((_, i) => {
                  const dayNum = i + 1;
                  const dayDate = new Date(calYear, calMonth, dayNum);
                  const isPast = dayDate < new Date(2026, 9, 12);
                  const isToday = calYear === 2026 && calMonth === 9 && dayNum === 12;
                  const isTomorrow = calYear === 2026 && calMonth === 9 && dayNum === 13;
                  const dayOfWeekName = dayDate.toLocaleDateString("en-US", { weekday: "long" });
                  const dayOfWeekShort = dayDate.toLocaleDateString("en-US", { weekday: "short" });
                  const monthShort = dayDate.toLocaleDateString("en-US", { month: "short" });

                  let dateKey = `${dayOfWeekShort}, ${monthShort} ${dayNum}`;
                  if (isToday) dateKey = `Today, ${monthShort} ${dayNum}`;
                  else if (isTomorrow) dateKey = `Tomorrow, ${monthShort} ${dayNum}`;

                  const isWorkingDay = provider.workingDays.some(
                    (w) => w.toLowerCase() === dayOfWeekName.toLowerCase()
                  );
                  const isSelected = selectedDate === dateKey;

                  if (isPast) {
                    return (
                      <button
                        key={dayNum}
                        type="button"
                        disabled
                        className="h-8 w-full rounded-lg text-slate-300 text-[11px] font-medium cursor-not-allowed flex items-center justify-center"
                      >
                        {dayNum}
                      </button>
                    );
                  }

                  if (!isWorkingDay) {
                    return (
                      <button
                        key={dayNum}
                        type="button"
                        onClick={() =>
                          onToast(`${provider.name} is off on ${dayOfWeekName}s. Please pick an active day.`)
                        }
                        title={`Day Off (${dayOfWeekName})`}
                        className="h-8 w-full rounded-lg text-slate-400 bg-slate-200/50 text-[11px] flex flex-col items-center justify-center hover:bg-slate-200/80 transition-colors touch-manipulation"
                      >
                        <span className="line-through text-[10px] leading-none opacity-60">
                          {dayNum}
                        </span>
                        <span className="text-[7px] text-slate-400 font-bold -mt-0.5 leading-none">
                          Off
                        </span>
                      </button>
                    );
                  }

                  if (isSelected) {
                    return (
                      <button
                        key={dayNum}
                        type="button"
                        className="h-8 w-full rounded-lg bg-[#0d9488] text-white font-bold text-xs shadow-xs flex flex-col items-center justify-center scale-105 transition-all touch-manipulation"
                      >
                        <span className="leading-none">{dayNum}</span>
                        {isToday && (
                          <span className="size-1 rounded-full bg-white mt-0.5" />
                        )}
                      </button>
                    );
                  }

                  return (
                    <button
                      key={dayNum}
                      type="button"
                      onClick={() => handleSelectDate(dateKey)}
                      className="h-8 w-full rounded-lg bg-white border border-[#e2e8f0] text-[#0f172a] hover:border-[#0d9488] hover:text-[#0d9488] font-semibold text-[11px] transition-all flex flex-col items-center justify-center active:scale-95 touch-manipulation"
                    >
                      <span className="leading-none">{dayNum}</span>
                      {isToday && (
                        <span className="size-1 rounded-full bg-[#0d9488] mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Calendar Legend */}
              <div className="flex items-center justify-between pt-1.5 border-t border-[#e2e8f0] text-[10px] text-[#64748b]">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#0d9488]" />
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-sm bg-white border border-[#e2e8f0]" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-sm bg-slate-200" />
                  <span>Day Off / Past</span>
                </div>
              </div>
            </div>

            {/* Time Slots Section */}
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[#64748b] text-[11px] font-semibold">
                  Available Time Slots for <span className="text-[#0f172a] font-bold">{selectedDate}</span>
                </span>
                {provider.workingHours && (
                  <span className="text-[#94a3b8] text-[10px]">
                    Hours: {provider.workingHours}
                  </span>
                )}
              </div>

              {!isSelectedDateWorkingDay ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center text-xs text-amber-800 flex items-center justify-center gap-2">
                  <span>⚠️</span>
                  <span>{provider.name} has a scheduled Day Off on this date. Please pick an active day above.</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {dateSlots.map((slot) => {
                    const booked = isSlotBooked(slot);
                    const isSelected = selectedSlot === slot && !booked;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleSelectSlot(slot)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all touch-manipulation ${
                          booked
                            ? "bg-slate-100 border-slate-200 text-slate-400 line-through cursor-not-allowed"
                            : isSelected
                            ? "bg-[#0d9488] border-[#0d9488] text-white shadow-xs"
                            : "bg-[#f8fafc] border-[#e2e8f0] text-[#0f172a] hover:border-[#0d9488]"
                        }`}
                      >
                        {booked ? `${slot} (Booked)` : slot}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Address selection */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-[#0f172a] text-xs font-bold uppercase tracking-wider">
                Service Address
              </label>
              <button
                type="button"
                onClick={() => nav("saved-addresses")}
                className="text-[#0d9488] text-xs font-bold hover:underline"
              >
                Manage
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {addresses.map((addr) => (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all touch-manipulation ${
                    selectedAddressId === addr.id
                      ? "bg-[#f0fdfa] border-[#0d9488]"
                      : "bg-[#f8fafc] border-[#e2e8f0]"
                  }`}
                >
                  <span className="text-base mt-0.5">📍</span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#0f172a] text-xs font-bold">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="bg-[#ccfbf1] text-[#0f766e] text-[9px] font-bold px-1.5 py-0.2 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <span className="text-[#64748b] text-[11px] truncate">
                      {addr.houseUnit} {addr.street}, {addr.barangay}, {addr.city}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Problem Description */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
            <label className="text-[#0f172a] text-xs font-bold uppercase tracking-wider">
              Describe the Problem
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#f8fafc] border border-[#e2e8f0] h-20 p-3 rounded-xl text-[#0f172a] text-xs resize-none outline-none leading-relaxed focus:border-[#0d9488]"
            />

            {/* AI Urgency Photo */}
            <div className="bg-[#f0fdfa] border border-[#ccfbf1] rounded-xl p-3 flex flex-col gap-2 mt-1">
              <div className="flex items-center justify-between">
                <span className="text-[#0f766e] text-[11px] font-bold">
                  AI Urgency Analyzer
                </span>
                <span className="bg-[#ccfbf1] text-[#0f766e] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              </div>
              {photoUploaded ? (
                <div className="flex gap-3 items-center">
                  <img
                    src={`${A}c2bb0.png`}
                    className="rounded-lg size-12 object-cover shrink-0"
                    alt="Problem inspection"
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[#0f766e] text-xs font-bold">
                      Photo Uploaded!
                    </span>
                    <span className="text-[#64748b] text-[11px]">
                      AI Assessment: High Urgency (leak threat)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhotoUploaded(false)}
                    className="text-red-500 text-xs font-bold p-1 touch-manipulation"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setPhotoUploaded(true)}
                  className="border-2 border-dashed border-[#0d9488] bg-white/60 p-2.5 rounded-xl text-xs font-bold text-[#0d9488] flex items-center justify-center gap-1.5 touch-manipulation"
                >
                  <span>📷</span>
                  <span>Upload Service Photo</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Price & Confirm */}
      <div className="bg-white border-t border-[#e2e8f0] p-4 flex flex-col gap-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[#64748b] text-xs font-medium">Estimated Minimum (1hr)</span>
            <span className="text-[10px] text-[#0d9488] font-semibold">Payment: Cash after service</span>
          </div>
          <span className="text-[#0f172a] text-xl font-bold">₱{provider.hourlyRate}.00</span>
        </div>
        <button
          onClick={() => setShowWarningModal(true)}
          disabled={confirming}
          className="bg-[#0d9488] shadow-md flex h-12 items-center justify-center rounded-xl w-full active:brightness-90 touch-manipulation font-bold text-white text-base disabled:opacity-70"
        >
          {confirming ? "Confirming Booking…" : "Confirm Booking"}
        </button>
      </div>

      {/* Conflict Modal */}
      {showConflictModal && (
        <div
          className="absolute inset-0 bg-black/50 flex items-end justify-center z-50"
          onClick={() => setShowConflictModal(false)}
        >
          <div
            className="bg-white rounded-t-3xl w-full p-6 flex flex-col gap-4 scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2 items-center text-center">
              <div className="bg-red-100 text-red-600 rounded-full size-14 flex items-center justify-center text-2xl">
                ⚠️
              </div>
              <h3 className="text-[#0f172a] text-lg font-bold" style={{ fontFamily: "Lexend Deca, sans-serif" }}>
                Schedule No Longer Available
              </h3>
              <p className="text-[#64748b] text-xs leading-relaxed max-w-[280px]">
                This time slot ({conflictSlotTime}) has already been booked by another client. Please select another time.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setShowConflictModal(false)}
                className="bg-[#0d9488] text-white text-sm font-bold py-3 rounded-xl touch-manipulation active:brightness-90"
              >
                Select Another Time
              </button>
              <button
                onClick={() => {
                  setShowConflictModal(false);
                  const firstAvail = dateSlots.find((s) => !isSlotBooked(s));
                  if (firstAvail) setSelectedSlot(firstAvail);
                }}
                className="border border-[#e2e8f0] text-[#0f172a] text-xs font-semibold py-2.5 rounded-xl touch-manipulation"
              >
                View Next Available Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Warning Policy Modal */}
      {showWarningModal && (
        <div
          className="absolute inset-0 bg-black/50 flex items-end justify-center z-50"
          onClick={() => setShowWarningModal(false)}
        >
          <div
            className="bg-white rounded-t-3xl w-full p-6 flex flex-col gap-4 scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2 items-center text-center">
              <div className="bg-amber-100 text-amber-700 rounded-full size-14 flex items-center justify-center text-2xl">
                🛡️
              </div>
              <h3 className="text-[#0f172a] text-lg font-bold" style={{ fontFamily: "Lexend Deca, sans-serif" }}>
                Fair Booking Policy
              </h3>
              <p className="text-[#64748b] text-xs leading-relaxed max-w-[280px]">
                Once confirmed, your provider reserves this time slot for you. Payment will be made in cash directly after completion.
              </p>
            </div>

            <div className="bg-[#f0fdfa] border border-[#ccfbf1] rounded-xl p-3 flex flex-col gap-1 text-xs text-[#0f766e]">
              <span className="font-bold">Summary:</span>
              <span>📅 {selectedDate} at {selectedSlot}</span>
              <span>📍 {finalAddressText}</span>
              <span>💵 ₱{provider.hourlyRate}.00 (Cash Payment)</span>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleConfirmFinal}
                className="bg-[#0d9488] text-white text-sm font-bold py-3 rounded-xl touch-manipulation active:brightness-90"
              >
                Final Confirm Booking
              </button>
              <button
                onClick={() => setShowWarningModal(false)}
                className="border border-[#e2e8f0] text-[#64748b] text-xs font-semibold py-2.5 rounded-xl touch-manipulation"
              >
                Back to Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Booking Success Screen ───────────────────────────────────────────────────
export function BookingSuccessScreen({
  nav,
  booking,
}: {
  nav: (s: Screen) => void;
  booking?: Booking;
}) {
  return (
    <div className="bg-[#f8fafc] flex flex-col items-center justify-center size-full px-8 text-center gap-5">
      <div className="scale-in bg-[#d1fae5] flex items-center justify-center rounded-full size-20 shadow-md">
        <svg
          className="size-10 text-[#10b981]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="flex flex-col gap-1.5">
        <h2
          className="text-[#0f172a] text-2xl font-bold"
          style={{ fontFamily: "Lexend Deca, sans-serif" }}
        >
          Booking Confirmed!
        </h2>
        <span className="text-[#0d9488] text-xs font-mono font-bold">
          ID: {booking?.id || "TS-2026-00125"}
        </span>
        <p className="text-[#64748b] text-xs leading-relaxed max-w-[260px] mx-auto mt-1">
          {booking?.providerName || "Your specialist"} has accepted your booking request.
        </p>
      </div>

      <div className="bg-[#f0fdfa] border border-[#ccfbf1] flex flex-col gap-1 items-center p-3.5 rounded-2xl w-full text-xs">
        <span className="text-[#0f766e] font-bold">
          📅 {booking?.date || "Today, Oct 12"} at {booking?.time || "2:00 PM"}
        </span>
        <span className="text-[#64748b]">
          {booking?.serviceDetail || "Household Repair"}
        </span>
        <span className="text-[#0f766e] font-semibold text-[11px] mt-1">
          💵 ₱{booking?.estimatedCost || 350}.00 · Cash on Completion
        </span>
      </div>

      <div className="flex flex-col gap-2.5 w-full pt-2">
        <button
          onClick={() => nav("tracking")}
          className="bg-[#0d9488] text-white text-sm font-bold py-3.5 rounded-xl shadow-md active:brightness-90 touch-manipulation"
        >
          View Live Tracking
        </button>
        <button
          onClick={() => nav("bookings")}
          className="bg-white border border-[#e2e8f0] text-[#0f172a] text-xs font-bold py-3 rounded-xl active:bg-slate-50 touch-manipulation"
        >
          Go to My Bookings
        </button>
      </div>
    </div>
  );
}

// ─── Tracking Screen (Live Location Simulation) ───────────────────────────────
export function TrackingScreen({
  nav,
  goBack,
  booking,
  onCompleteBooking,
}: {
  nav: (s: Screen) => void;
  goBack: () => void;
  booking?: Booking;
  onCompleteBooking?: (bookingId: string) => void;
}) {
  const [eta, setEta] = useState(7);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setEta((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          setArrived(true);
          return 0;
        }
        return prev - 1;
      });
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const providerName = booking?.providerName || "Kuya Reynaldo";
  const providerPhoto = booking?.providerPhoto || `${A}81684.png`;

  return (
    <div className="relative flex flex-col items-start justify-between overflow-hidden size-full bg-[#f8fafc]">
      {/* Map Background */}
      <div className="absolute inset-0">
        <img
          src={`${A}0aac5.png`}
          className="size-full object-cover"
          alt="Map"
        />
      </div>

      {/* Top Banner */}
      <div className="relative flex flex-col left-0 right-0 top-0 px-5 pt-6 w-full z-20">
        <div className="bg-[#115e59] shadow-lg flex gap-3 items-center px-4 py-3 rounded-2xl w-full">
          <button
            onClick={goBack}
            className="text-white p-1 hover:bg-white/10 rounded-lg touch-manipulation"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex flex-1 flex-col gap-0.5 min-w-0">
            <span className="text-white text-xs font-bold">
              {arrived ? "Specialist has arrived!" : "Provider is on the way"}
            </span>
            <span className="text-[#ccfbf1] text-[10px] font-medium truncate">
              {providerName} is traversing Brgy. San Roque, San Pablo
            </span>
          </div>
          <div className="bg-[#10b981] pulse-dot rounded-full size-2.5 shrink-0" />
        </div>
      </div>

      {/* Simulated GPS Navigation Route along Ring Road */}
      <svg className="absolute inset-0 size-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d="M 16 43 Q 11 32, 22 21"
          fill="none"
          stroke="#0D9488"
          strokeWidth="1"
          strokeDasharray="2.5,2.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Animated map markers (Positioned on San Pablo City streets, NOT in the lake) */}
      <div className="absolute left-[22%] top-[17%] z-10">
        <div className="bg-white border-2 border-[#0d9488] shadow-md flex items-center justify-center rounded-2xl size-10">
          <span className="text-lg">🏠</span>
        </div>
      </div>
      <div className="absolute left-[11%] top-[39%] z-10 animate-pulse">
        <div className="bg-[#0d9488] border-2 border-white shadow-lg flex items-center justify-center rounded-2xl size-11">
          <span className="text-lg">🛵</span>
        </div>
      </div>

      {/* Bottom Information Card */}
      <div className="relative bg-white shadow-2xl flex flex-col gap-3 p-5 rounded-t-3xl w-full z-20">
        <div className="mx-auto bg-[#e2e8f0] h-1 rounded-full w-10 mb-1" />

        <div className="flex items-center justify-between">
          <div className="flex gap-3 items-center">
            <div className="rounded-xl size-12 overflow-hidden shrink-0 border border-[#e2e8f0]">
              <img
                src={providerPhoto}
                className="size-full object-cover"
                alt={providerName}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[#0f172a] text-sm font-bold">
                {providerName}
              </span>
              <span className="text-[#64748b] text-[11px]">
                Honda Click 125 (Laguna)
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[#94a3b8] text-[10px] font-bold uppercase tracking-wider">
              Estimated Arrival
            </span>
            <span className="text-[#0f766e] text-base font-bold">
              {arrived ? "Arrived!" : `${eta} mins (1.2 km)`}
            </span>
          </div>
        </div>

        <div className="bg-[#f0fdfa] border border-[#ccfbf1] rounded-xl p-2.5 flex items-center justify-between text-xs">
          <span className="text-[#64748b]">{booking?.serviceDetail || "Household Plumbing Repair"}</span>
          <span className="text-[#0f766e] font-bold">₱{booking?.estimatedCost || 350} (Cash)</span>
        </div>

        {/* Complete service button */}
        <button
          onClick={() => {
            if (booking && onCompleteBooking) {
              onCompleteBooking(booking.id);
            }
            nav("booking-completed");
          }}
          className="w-full bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold py-3 rounded-xl shadow-xs active:scale-[0.98] transition-all touch-manipulation flex items-center justify-center gap-2 cursor-pointer mt-0.5"
        >
          <svg className="size-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg> Complete Service & Settle Cash
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => nav("messaging")}
            className="flex-1 bg-[#0d9488] text-white text-xs font-bold py-2.5 rounded-xl shadow-xs active:brightness-90 touch-manipulation flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>💬</span> Message Specialist
          </button>
          <button
            onClick={() => nav("bookings")}
            className="border border-[#e2e8f0] text-[#0f172a] text-xs font-bold px-4 py-2.5 rounded-xl active:bg-slate-50 touch-manipulation cursor-pointer"
          >
            View Bookings
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Messaging Screen ─────────────────────────────────────────────────────────
export function MessagingScreen({
  nav,
  goBack,
  provider,
  onToast,
}: {
  nav: (s: Screen) => void;
  goBack: () => void;
  provider?: Provider;
  onToast: (msg: string) => void;
}) {
  const providerName = provider?.name || "Kuya Reynaldo";
  const [messages, setMessages] = useState([
    { id: 1, from: "provider", text: "Magandang araw po! Naka-alis na po ako patungo sa inyo." },
    { id: 2, from: "user", text: "Salamat po kuya! May landmark po malapit sa gate." },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const sendMessage = (textToSend?: string) => {
    const txt = (textToSend || input).trim();
    if (!txt) return;

    const userMsg = { id: Date.now(), from: "user", text: txt };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");

    setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);

    // Simulated provider reply
    setTimeout(() => {
      const replies = [
        "Sige po ma'am/sir, malapit na po ako sa street ninyo.",
        "Noted po! Dala ko po ang complete tools para sa repair.",
        "Opo, nag-abiso na rin po ako sa guard sa may gate.",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, from: "provider", text: randomReply },
      ]);
      setTimeout(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }, 1200);
  };

  return (
    <div className="bg-[#f8fafc] flex flex-col size-full">
      {/* Header */}
      <div className="bg-[#115e59] flex items-center justify-between px-5 pt-12 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="text-white p-1 hover:bg-white/10 rounded-lg touch-manipulation"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex flex-col">
            <span className="text-white text-sm font-bold">{providerName}</span>
            <div className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-[#10b981]" />
              <span className="text-[#ccfbf1] text-[10px]">Active now · On the way</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onToast(`Calling ${providerName} at +63 917 555 8899...`)}
          className="bg-white/15 p-2 rounded-xl text-white touch-manipulation active:bg-white/25"
          aria-label="Call provider"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>
      </div>

      {/* Message history */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col max-w-[75%] ${
              m.from === "user" ? "ml-auto items-end" : "mr-auto items-start"
            }`}
          >
            <div
              className={`p-3 rounded-2xl text-xs leading-relaxed ${
                m.from === "user"
                  ? "bg-[#0d9488] text-white rounded-br-xs"
                  : "bg-white border border-[#e2e8f0] text-[#0f172a] rounded-bl-xs shadow-xs"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Suggested Quick Chips */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar bg-white/70 border-t border-[#f1f5f9]">
        {[
          "Nasaan na po kayo?",
          "Nasa harap na po ng gate.",
          "Ready na po ang cash payment.",
        ].map((chip) => (
          <button
            key={chip}
            onClick={() => sendMessage(chip)}
            className="bg-[#f0fdfa] border border-[#ccfbf1] text-[#0f766e] text-[11px] font-semibold px-3 py-1 rounded-full shrink-0 touch-manipulation hover:bg-[#ccfbf1]"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="bg-white border-t border-[#e2e8f0] p-3 flex gap-2 items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="bg-[#f8fafc] border border-[#e2e8f0] flex-1 h-11 px-4 rounded-xl text-xs text-[#0f172a] outline-none focus:border-[#0d9488]"
        />
        <button
          onClick={() => sendMessage()}
          className="bg-[#0d9488] text-white size-11 rounded-xl flex items-center justify-center shrink-0 active:brightness-90 touch-manipulation"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Review Screen ────────────────────────────────────────────────────────────
export function ReviewScreen({
  nav,
  goBack,
  booking,
  onSubmitReview,
}: {
  nav: (s: Screen) => void;
  goBack: () => void;
  booking?: Booking;
  onSubmitReview: (bookingId: string, rating: number, comment: string, isAnon: boolean) => void;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isAnon, setIsAnon] = useState(false);

  const providerName = booking?.providerName || "Kuya Reynaldo";

  const handleSubmit = () => {
    if (booking) {
      onSubmitReview(booking.id, rating, comment || "Great service, very professional!", isAnon);
    }
    nav("bookings");
  };

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
          Rate & Review
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4">
        {/* Provider details */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex gap-3.5 items-center shadow-xs">
          <img
            src={booking?.providerPhoto || `${A}81684.png`}
            className="size-14 rounded-2xl object-cover border border-[#e2e8f0]"
            alt={providerName}
          />
          <div className="flex flex-col">
            <span className="text-[#0f172a] text-sm font-bold">{providerName}</span>
            <span className="text-[#64748b] text-xs">{booking?.serviceDetail || "Household Service"}</span>
            <span className="text-[#0d9488] text-[11px] font-semibold">Completed Booking: {booking?.id}</span>
          </div>
        </div>

        {/* Star Rating Picker */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 flex flex-col items-center gap-3 shadow-xs">
          <span className="text-[#0f172a] text-sm font-bold">How was your service experience?</span>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-3xl transition-transform hover:scale-110 p-1 touch-manipulation"
              >
                {star <= rating ? "⭐" : "☆"}
              </button>
            ))}
          </div>
          <span className="text-[#0d9488] text-xs font-bold">
            {rating === 5 ? "Excellent (5 Stars)" : `${rating} Stars`}
          </span>
        </div>

        {/* Comment field */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
          <label className="text-[#0f172a] text-xs font-bold">Write a Review (Optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details about punctuality, cleanliness, quality of repair..."
            className="bg-[#f8fafc] border border-[#e2e8f0] h-24 p-3 rounded-xl text-xs text-[#0f172a] outline-none resize-none leading-relaxed focus:border-[#0d9488]"
          />

          <label className="flex items-center gap-2 pt-2 cursor-pointer touch-manipulation">
            <input
              type="checkbox"
              checked={isAnon}
              onChange={(e) => setIsAnon(e.target.checked)}
              className="accent-[#0d9488] size-4 rounded"
            />
            <span className="text-[#475569] text-xs font-medium">Post review anonymously</span>
          </label>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-[#e2e8f0]">
        <button
          onClick={handleSubmit}
          className="bg-[#0d9488] text-white text-sm font-bold py-3.5 rounded-xl w-full active:brightness-90 touch-manipulation shadow-md"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}
