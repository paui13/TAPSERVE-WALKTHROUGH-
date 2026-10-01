import React, { useState } from "react";
import { Screen } from "../types";
import { Booking, Provider } from "../data/mockData";
import { A } from "../components/SharedUI";

export function BookingCompletedScreen({
  nav,
  goBack,
  booking,
  provider,
  onSelectProvider,
  onSubmitReview,
  onToast,
}: {
  nav: (s: Screen) => void;
  goBack: () => void;
  booking: Booking | null;
  provider?: Provider;
  onSelectProvider: (p: Provider) => void;
  onSubmitReview: (bookingId: string, rating: number, comment: string, isAnon: boolean) => void;
  onToast: (msg: string) => void;
}) {
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isAnon, setIsAnon] = useState(false);
  const [hasSubmittedLocal, setHasSubmittedLocal] = useState(false);

  if (!booking) {
    return (
      <div className="bg-[#f8fafc] flex flex-col items-center justify-center size-full p-6 text-center">
        <p className="text-[#64748b] text-sm">No booking details available.</p>
        <button
          onClick={() => nav("bookings")}
          className="mt-4 bg-[#0d9488] text-white text-xs font-bold px-4 py-2 rounded-xl"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  const prov = provider || {
    id: booking.providerId,
    name: booking.providerName,
    photo: booking.providerPhoto || `${A}81684.png`,
    category: booking.serviceCategory,
    categoryId: "plumbing",
    specialization: booking.serviceDetail || "Household Specialist",
    rating: 4.9,
    reviewCount: 142,
    completedJobs: 142,
    yearsExperience: 10,
    hourlyRate: booking.estimatedCost,
    area: "San Pablo City, Laguna",
    distance: "1.2 km away",
    isVerified: true,
    description: "Certified professional specialist.",
    services: [booking.serviceDetail],
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: "8:00 AM – 5:00 PM",
    isAcceptingBookings: true,
    availableSlots: {},
    reviews: [],
  };

  const isReviewed = booking.reviewed || hasSubmittedLocal;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReview(booking.id, rating, reviewComment || "Napakagaling at pulido ng gawa. Salamat Kuya!", isAnon);
    setHasSubmittedLocal(true);
    onToast("Review submitted successfully! Salamat sa feedback.");
  };

  const handleBookAgain = () => {
    onSelectProvider(prov as Provider);
    nav("booking");
  };

  return (
    <div className="bg-[#f8fafc] flex flex-col size-full relative">
      {/* Top App Bar */}
      <div className="bg-[#115e59] flex items-center justify-between px-5 pt-8 pb-4 shrink-0 shadow-md">
        <button
          onClick={goBack}
          className="bg-white/15 flex items-center justify-center rounded-xl size-9 active:bg-white/25 touch-manipulation text-white"
          aria-label="Back"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1
          className="text-white text-base font-bold tracking-tight text-center flex-1 mx-2"
          style={{ fontFamily: "Lexend Deca, sans-serif" }}
        >
          Completed Service
        </h1>
        <button
          onClick={() => setShowReceiptModal(true)}
          className="bg-white/15 flex items-center justify-center rounded-xl size-9 active:bg-white/25 touch-manipulation text-white"
          title="View Receipt"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4">
        {/* Celebration / Status Card */}
        <div className="bg-white border border-[#ccfbf1] rounded-3xl p-5 flex flex-col items-center text-center shadow-xs relative overflow-hidden scale-in shrink-0">
          <div className="absolute -right-6 -top-6 size-24 bg-[#ccfbf1]/40 rounded-full blur-xl pointer-events-none" />
          <div className="bg-[#dcfce7] border-2 border-[#86efac] text-[#15803d] rounded-full size-16 flex items-center justify-center shadow-sm mb-3 shrink-0">
            <svg
              className="size-8 text-[#15803d]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-[#15803d] text-xs font-bold uppercase tracking-wider bg-[#dcfce7] px-3 py-1 rounded-full mb-1">
            Service Completed
          </span>
          <h2
            className="text-[#0f172a] text-xl font-bold tracking-tight mt-1"
            style={{ fontFamily: "Lexend Deca, sans-serif" }}
          >
            Job Done & Settled
          </h2>
          <p className="text-[#64748b] text-xs mt-1 max-w-[280px]">
            Service for <span className="font-semibold text-[#0f172a]">{booking.serviceDetail}</span> was marked completed.
          </p>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#f1f5f9] text-[11px] text-[#94a3b8] font-mono">
            <span>Ref: {booking.id}</span>
            <span>•</span>
            <span>{booking.date} • {booking.time}</span>
          </div>
        </div>

        {/* Provider Profile Summary */}
        <div className="bg-white border border-[#e2e8f0] rounded-3xl p-4 flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <img
              src={booking.providerPhoto}
              className="size-14 rounded-2xl object-cover shrink-0 border border-slate-100"
              alt={booking.providerName}
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[#0f172a] text-sm font-bold truncate">
                  {booking.providerName}
                </span>
                <span className="bg-[#ccfbf1] text-[#0f766e] text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-flex items-center gap-0.5 shrink-0">
                  <svg className="size-3 text-[#0f766e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Verified
                </span>
              </div>
              <span className="text-[#64748b] text-xs truncate">
                {booking.serviceCategory} Specialist
              </span>
              <span className="text-[#0d9488] text-[11px] font-semibold mt-0.5">
                ★ {prov.rating.toFixed(1)} ({prov.completedJobs} jobs)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                onSelectProvider(prov as Provider);
                nav("messaging");
              }}
              className="bg-[#f0fdfa] border border-[#ccfbf1] text-[#0f766e] text-xs font-bold p-2.5 rounded-xl active:bg-teal-100 touch-manipulation flex items-center gap-1"
              title="Message Specialist"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            <button
              onClick={() => onToast(`Calling ${booking.providerName} at +63 917 555 1234...`)}
              className="bg-slate-100 text-slate-700 text-xs font-bold p-2.5 rounded-xl active:bg-slate-200 touch-manipulation flex items-center gap-1"
              title="Call Specialist"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Location & Problem Summary */}
        <div className="bg-white border border-[#e2e8f0] rounded-3xl p-4 flex flex-col gap-2.5 shadow-xs text-xs shrink-0">
          <span className="text-[#0f172a] font-bold uppercase tracking-wider text-[11px]">
            Service Information
          </span>
          <div className="flex items-start gap-2 text-[#475569]">
            <span className="text-base mt-0.5">📍</span>
            <div className="flex flex-col">
              <span className="font-semibold text-[#0f172a]">Service Address</span>
              <span>{booking.address}</span>
            </div>
          </div>
          {booking.problemDescription && (
            <div className="flex items-start gap-2 text-[#475569] pt-1 border-t border-[#f1f5f9]">
              <span className="text-base mt-0.5">📝</span>
              <div className="flex flex-col">
                <span className="font-semibold text-[#0f172a]">Problem Reported</span>
                <span className="text-[#64748b]">{booking.problemDescription}</span>
              </div>
            </div>
          )}
          <div className="bg-[#f0fdfa] border border-[#ccfbf1] p-2.5 rounded-xl flex items-center gap-2 text-[#0f766e] text-[11px] font-medium mt-1">
            <svg className="size-3.5 text-[#0d9488] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Verified service completion in San Pablo City.</span>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white border border-[#e2e8f0] rounded-3xl p-4 flex flex-col gap-2 shadow-xs text-xs shrink-0">
          <div className="flex items-center justify-between pb-1 border-b border-[#f1f5f9]">
            <span className="text-[#0f172a] font-bold uppercase tracking-wider text-[11px]">
              Payment Summary
            </span>
            <span className="bg-[#dcfce7] text-[#15803d] font-bold text-[10px] px-2 py-0.5 rounded-full">
              Paid in Cash
            </span>
          </div>

          <div className="flex items-center justify-between text-[#64748b]">
            <span>Specialist Labor & Service</span>
            <span className="font-medium text-[#0f172a]">₱{booking.estimatedCost}.00</span>
          </div>
          <div className="flex items-center justify-between text-[#64748b]">
            <span>Payment Settlement</span>
            <span className="font-medium text-[#0f766e]">Direct Cash on Service</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9] text-sm font-bold">
            <span className="text-[#0f172a]">Total Cash Collected:</span>
            <span className="text-[#0f766e] text-base">₱{booking.estimatedCost}.00</span>
          </div>
          <button
            onClick={() => setShowReceiptModal(true)}
            className="text-[#0d9488] font-bold text-xs hover:underline text-left pt-1"
          >
            View Official E-Receipt →
          </button>
        </div>

        {/* Rating & Review Section */}
        <div className="bg-white border border-[#e2e8f0] rounded-3xl p-5 flex flex-col gap-3 shadow-xs shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[#0f172a] font-bold text-xs uppercase tracking-wider">
              {isReviewed ? "Your Review & Rating" : "Rate Specialist"}
            </span>
            {isReviewed && (
              <span className="bg-[#ccfbf1] text-[#0f766e] text-[10px] font-bold px-2 py-0.5 rounded-full">
                Submitted ★
              </span>
            )}
          </div>

          {isReviewed ? (
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400 text-lg">
                  {"★".repeat(booking.userRating || 5)}
                  {"☆".repeat(5 - (booking.userRating || 5))}
                </div>
                <span className="text-[#0d9488] text-xs font-bold">
                  {(booking.userRating || 5).toFixed(1)} Stars
                </span>
              </div>
              <p className="text-[#475569] text-xs leading-relaxed italic">
                &ldquo;{booking.userReviewText || reviewComment || "Very professional electrician. Fixed the overloaded breaker safely."}&rdquo;
              </p>
              <span className="text-[#94a3b8] text-[10px]">
                Posted by {booking.clientName || "Carlo Santos"} • Verified Laguna Client
              </span>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3">
              <p className="text-[#64748b] text-xs">
                How satisfied were you with {booking.providerName}&apos;s work today?
              </p>

              {/* Star selector */}
              <div className="flex items-center justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="text-3xl transition-transform hover:scale-110 active:scale-95 touch-manipulation"
                  >
                    {s <= rating ? "⭐" : "☆"}
                  </button>
                ))}
              </div>
              <div className="text-center">
                <span className="text-xs font-bold text-[#0d9488]">
                  {rating === 5 ? "Excellent (5 Stars)" : `${rating} Stars`}
                </span>
              </div>

              {/* Feedback text */}
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your feedback about punctuality, skill, cleanliness..."
                className="bg-[#f8fafc] border border-[#e2e8f0] h-20 p-3 rounded-xl text-xs text-[#0f172a] outline-none resize-none focus:border-[#0d9488]"
              />

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer touch-manipulation">
                  <input
                    type="checkbox"
                    checked={isAnon}
                    onChange={(e) => setIsAnon(e.target.checked)}
                    className="accent-[#0d9488] size-4 rounded"
                  />
                  <span className="text-[#64748b] text-[11px]">Post anonymously</span>
                </label>
                <button
                  type="submit"
                  className="bg-[#0d9488] text-white text-xs font-bold px-4 py-2 rounded-xl active:brightness-90 touch-manipulation shadow-xs cursor-pointer"
                >
                  Submit Review
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-1 pb-4 shrink-0">
          <button
            onClick={handleBookAgain}
            className="bg-[#0d9488] text-white text-sm font-bold py-3.5 rounded-2xl shadow-md active:brightness-90 touch-manipulation flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🔄</span> Book {booking.providerName} Again
          </button>
          <button
            onClick={() => nav("bookings")}
            className="bg-white border border-[#e2e8f0] text-[#0f172a] text-xs font-bold py-3 rounded-2xl active:bg-slate-50 touch-manipulation text-center cursor-pointer"
          >
            Back to My Bookings
          </button>
        </div>
      </div>

      {/* Official E-Receipt Modal */}
      {showReceiptModal && (
        <div
          className="absolute inset-0 bg-black/60 flex items-center justify-center p-5 z-50 scale-in"
          onClick={() => setShowReceiptModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-[340px] flex flex-col gap-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Stamp */}
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2">
                <img src={`${A}tapserve_logo.png`} className="size-8 object-contain" alt="TapServe" />
                <div className="flex flex-col">
                  <span className="text-[#0f766e] text-xs font-bold">TapServe Receipt</span>
                  <span className="text-[#94a3b8] text-[9px] font-mono">San Pablo City, Laguna</span>
                </div>
              </div>
              <span className="bg-[#dcfce7] text-[#15803d] font-bold text-[10px] px-2 py-0.5 rounded-full">
                PAID IN FULL
              </span>
            </div>

            {/* Receipt Items */}
            <div className="flex flex-col gap-1.5 text-xs text-[#475569]">
              <div className="flex justify-between">
                <span>Receipt No:</span>
                <span className="font-mono font-bold text-[#0f172a]">RCPT-{booking.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span className="font-semibold text-[#0f172a]">{booking.date} • {booking.time}</span>
              </div>
              <div className="flex justify-between">
                <span>Client:</span>
                <span className="font-semibold text-[#0f172a]">{booking.clientName || "Carlo Santos"}</span>
              </div>
              <div className="flex justify-between">
                <span>Specialist:</span>
                <span className="font-semibold text-[#0f172a]">{booking.providerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Category:</span>
                <span className="font-semibold text-[#0f172a]">{booking.serviceCategory}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-semibold text-[#0f766e]">Cash on Service</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-[#f8fafc] border border-[#e2e8f0] p-3 rounded-2xl flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between text-[#64748b]">
                <span>Service Labor & Materials:</span>
                <span className="font-medium text-[#0f172a]">₱{booking.estimatedCost}.00</span>
              </div>
              <div className="flex justify-between text-[#64748b]">
                <span>Payment Settlement:</span>
                <span className="font-semibold text-[#0f766e]">Direct Cash on Service</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#0f172a] pt-1.5 border-t border-[#e2e8f0]">
                <span>Total Amount Paid:</span>
                <span className="text-[#0f766e]">₱{booking.estimatedCost}.00</span>
              </div>
            </div>

            {/* Close */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  onToast("Receipt saved to photos / downloads.");
                  setShowReceiptModal(false);
                }}
                className="flex-1 bg-[#0d9488] text-white text-xs font-bold py-2.5 rounded-xl shadow-xs active:brightness-90 touch-manipulation cursor-pointer"
              >
                Save Receipt
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 bg-slate-100 text-slate-700 text-xs font-bold py-2.5 rounded-xl active:bg-slate-200 touch-manipulation cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
