import React, { useState } from "react";
import { Screen } from "../types";
import { BottomNav, A } from "../components/SharedUI";
import { Booking, BookingStatus, Provider } from "../data/mockData";

export function BookingsScreen({
  nav,
  goBack,
  bookings,
  providers,
  onCancelBooking,
  onProgressStatus,
  onSelectBooking,
  onSelectProvider,
  onToast,
}: {
  nav: (s: Screen) => void;
  goBack: () => void;
  bookings: Booking[];
  providers: Provider[];
  onCancelBooking: (bookingId: string, reason: string) => void;
  onProgressStatus: (bookingId: string, nextStatus: BookingStatus) => void;
  onSelectBooking: (b: Booking) => void;
  onSelectProvider: (p: Provider) => void;
  onToast: (msg: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "history">("all");

  // Cancellation modal state
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("Change of personal schedule");

  // Upcoming details modal state
  const [viewDetailsBooking, setViewDetailsBooking] = useState<Booking | null>(null);

  // Tab filtering
  const currentList = bookings.filter((b) => {
    if (activeTab === "all") return true;
    if (activeTab === "upcoming") {
      return (
        b.status === "Pending" ||
        b.status === "Accepted" ||
        b.status === "On the Way" ||
        b.status === "In Progress"
      );
    }
    // history
    return b.status === "Completed" || b.status === "Cancelled";
  });

  const getServiceTitle = (b: Booking) => {
    if (b.providerId === "p-reynaldo" || b.serviceCategory === "Plumbing") {
      return "Plumbing Services";
    }
    if (b.providerId === "p-maria" || b.serviceCategory === "Cleaning") {
      return "Deep Cleaning Expert";
    }
    if (b.providerId === "p-jose" || b.serviceCategory === "Electrical") {
      return "Electrical Repair";
    }
    return b.serviceDetail || `${b.serviceCategory} Specialist`;
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "In Progress":
      case "On the Way":
        return {
          label: "In Progress",
          className: "bg-[#fef3c7] text-[#d97706]",
        };
      case "Accepted":
      case "Pending":
        return {
          label: "Confirmed",
          className: "bg-[#ccfbf1] text-[#0f766e]",
        };
      case "Completed":
        return {
          label: "Completed",
          className: "bg-[#dcfce7] text-[#15803d]",
        };
      case "Cancelled":
        return {
          label: "Cancelled",
          className: "bg-rose-100 text-rose-700",
        };
    }
  };

  const handleCardClick = (b: Booking) => {
    onSelectBooking(b);
    const prov = providers.find((p) => p.id === b.providerId);
    if (prov) onSelectProvider(prov);

    if (b.status === "Completed") {
      nav("booking-completed");
    } else if (b.status === "In Progress" || b.status === "On the Way") {
      nav("tracking");
    } else {
      setViewDetailsBooking(b);
    }
  };

  const handleCancelSubmit = () => {
    if (!cancelBookingId) return;
    onCancelBooking(cancelBookingId, cancelReason);
    setCancelBookingId(null);
    setViewDetailsBooking(null);
    onToast("Booking cancelled successfully.");
  };

  return (
    <div className="bg-[#f8fafc] flex flex-col justify-between size-full relative">
      <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex flex-col gap-1 px-6 pt-7 pb-4">
          <h1
            className="text-[#0f172a] text-2xl font-bold tracking-tight"
            style={{ fontFamily: "Lexend Deca, sans-serif" }}
          >
            My Bookings
          </h1>
          <p className="text-[#64748b] text-xs font-normal">
            Track and manage your service requests
          </p>
        </div>

        {/* 3-Pill Tabs: All Bookings | Upcoming | History */}
        <div className="px-5 pb-4">
          <div className="bg-[#e2e8f0]/80 p-1 rounded-2xl flex gap-1 items-center">
            {(["all", "upcoming", "history"] as const).map((tab) => {
              const label =
                tab === "all"
                  ? "All Bookings"
                  : tab === "upcoming"
                  ? "Upcoming"
                  : "History";
              const isSelected = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-xl text-xs transition-all touch-manipulation cursor-pointer ${
                    isSelected
                      ? "bg-white text-[#0f766e] shadow-xs font-bold"
                      : "text-[#64748b] font-medium hover:text-[#0f172a]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Booking Cards List */}
        <div className="flex flex-col gap-3 px-5 pb-6">
          {currentList.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="bg-[#f0fdfa] border border-[#ccfbf1] rounded-full size-16 flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-[#0f172a] text-sm font-bold">
                No bookings found
              </h3>
              <p className="text-[#64748b] text-xs max-w-[220px]">
                Your {activeTab === "all" ? "" : activeTab} service requests will appear here.
              </p>
              <button
                onClick={() => nav("all-categories")}
                className="bg-[#0d9488] text-white text-xs font-bold px-4 py-2 rounded-xl mt-1 active:brightness-90 touch-manipulation cursor-pointer"
              >
                Find Services
              </button>
            </div>
          ) : (
            currentList.map((b) => {
              const badge = getStatusBadge(b.status);
              const prov = providers.find((p) => p.id === b.providerId);

              return (
                <div
                  key={b.id}
                  onClick={() => handleCardClick(b)}
                  className="bg-white border border-[#e2e8f0] rounded-3xl p-4 flex items-center justify-between gap-3 shadow-xs hover:border-[#99f6e4] transition-all cursor-pointer active:scale-[0.99] touch-manipulation"
                >
                  {/* Left: Avatar + Title Stack */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={b.providerPhoto}
                      className="size-16 rounded-2xl object-cover shrink-0 border border-slate-100 bg-slate-50"
                      alt={b.providerName}
                    />
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-[#0f172a] text-[15px] font-bold truncate">
                        {b.providerName}
                      </h3>
                      <span className="text-[#64748b] text-xs font-medium truncate mt-0.5">
                        {getServiceTitle(b)}
                      </span>
                      <div className="flex items-center gap-1.5 text-[#64748b] text-xs mt-1">
                        {/* Clock icon */}
                        <svg
                          className="size-3.5 text-[#64748b] shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="truncate">
                          {b.date} • {b.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status Pill Badge */}
                  <div className="shrink-0 self-start mt-0.5">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-xl ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Booking Details Modal for Upcoming Bookings */}
      {viewDetailsBooking && (
        <div
          className="absolute inset-0 bg-black/50 flex items-end justify-center z-50 scale-in"
          onClick={() => setViewDetailsBooking(null)}
        >
          <div
            className="bg-white rounded-t-3xl w-full p-6 flex flex-col gap-4 max-h-[85%] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[#0f172a] text-base font-bold">Booking Details</h3>
              <span className="bg-[#ccfbf1] text-[#0f766e] text-xs font-bold px-2.5 py-0.5 rounded-full">
                Confirmed
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl">
              <img
                src={viewDetailsBooking.providerPhoto}
                className="size-12 rounded-xl object-cover"
                alt={viewDetailsBooking.providerName}
              />
              <div className="flex flex-col">
                <span className="text-[#0f172a] text-sm font-bold">
                  {viewDetailsBooking.providerName}
                </span>
                <span className="text-[#64748b] text-xs">
                  {getServiceTitle(viewDetailsBooking)}
                </span>
                <span className="text-[#0d9488] text-[11px] font-mono">
                  ID: {viewDetailsBooking.id}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-xs text-[#475569]">
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span className="font-semibold text-[#0f172a]">
                  {viewDetailsBooking.date} • {viewDetailsBooking.time}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span>📍</span>
                <span>{viewDetailsBooking.address}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9]">
                <span>Payment Method:</span>
                <span className="font-bold text-[#0f766e]">Cash on Service (₱{viewDetailsBooking.estimatedCost}.00)</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  onSelectBooking(viewDetailsBooking);
                  nav("tracking");
                }}
                className="bg-[#0d9488] text-white text-xs font-bold py-3 rounded-xl touch-manipulation active:brightness-90 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>🛵</span> Live Track Specialist
              </button>
              <button
                onClick={() => {
                  const prov = providers.find((p) => p.id === viewDetailsBooking.providerId);
                  if (prov) onSelectProvider(prov);
                  nav("messaging");
                }}
                className="bg-[#f0fdfa] border border-[#ccfbf1] text-[#0f766e] text-xs font-bold py-3 rounded-xl touch-manipulation active:bg-teal-100 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>💬</span> Message {viewDetailsBooking.providerName}
              </button>
              <button
                onClick={() => {
                  setCancelBookingId(viewDetailsBooking.id);
                  setViewDetailsBooking(null);
                }}
                className="border border-red-200 text-red-600 text-xs font-bold py-2.5 rounded-xl touch-manipulation active:bg-red-50 cursor-pointer"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelBookingId && (
        <div
          className="absolute inset-0 bg-black/50 flex items-end justify-center z-50"
          onClick={() => setCancelBookingId(null)}
        >
          <div
            className="bg-white rounded-t-3xl w-full p-6 flex flex-col gap-4 scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-1 text-center items-center">
              <div className="bg-red-100 text-red-600 rounded-full size-12 flex items-center justify-center text-xl">
                ⚠️
              </div>
              <h3 className="text-[#0f172a] text-base font-bold mt-1">
                Cancel Booking Request?
              </h3>
              <p className="text-[#64748b] text-xs max-w-[260px]">
                Please let us know why you need to cancel this service request.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#0f172a] text-xs font-bold">Reason for Cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="bg-[#f8fafc] border border-[#e2e8f0] p-2.5 rounded-xl text-xs outline-none focus:border-[#0d9488]"
              >
                <option>Change of personal schedule</option>
                <option>Problem already solved</option>
                <option>Booked by mistake</option>
                <option>Found alternative service provider</option>
                <option>Other reason</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCancelBookingId(null)}
                className="flex-1 bg-[#f1f5f9] text-[#64748b] text-xs font-bold py-3 rounded-xl touch-manipulation cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelSubmit}
                className="flex-1 bg-red-600 text-white text-xs font-bold py-3 rounded-xl active:bg-red-700 touch-manipulation shadow-xs cursor-pointer"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav active="bookings" nav={nav} bookingCount={bookings.filter(b => b.status === "Pending" || b.status === "Accepted" || b.status === "On the Way" || b.status === "In Progress").length} />
    </div>
  );
}
