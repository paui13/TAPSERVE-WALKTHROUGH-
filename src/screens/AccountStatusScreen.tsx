import React, { useState } from "react";
import { Screen } from "../types";

export function AccountStatusScreen({
  nav,
  goBack,
  onToast,
}: {
  nav: (s: Screen) => void;
  goBack: () => void;
  onToast: (msg: string) => void;
}) {
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealReason, setAppealReason] = useState("");
  const [supportingInfo, setSupportingInfo] = useState("");
  const [hasAttachment, setHasAttachment] = useState(false);
  const [pendingAppeals, setPendingAppeals] = useState(0);

  const handleAppealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealReason.trim()) {
      onToast("Please provide a reason for your appeal.");
      return;
    }
    setPendingAppeals((prev) => prev + 1);
    setShowAppealModal(false);
    setAppealReason("");
    setSupportingInfo("");
    setHasAttachment(false);
    onToast("Appeal submitted successfully. TapServe Support will review within 24–48 hours.");
  };

  return (
    <div className="bg-[#f8fafc] flex flex-col size-full relative">
      {/* Top Header */}
      <div className="bg-[#115e59] flex items-center gap-3 px-5 pt-8 pb-5 shrink-0 shadow-md">
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
          className="text-white text-lg font-bold tracking-tight"
          style={{ fontFamily: "Lexend Deca, sans-serif" }}
        >
          Account Status
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4">
        {/* Card 1: Account in Good Standing */}
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
          <div className="bg-[#22c55e] text-white rounded-full size-10 flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
            ✓
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-[#15803d] text-sm font-bold">
              Account in Good Standing
            </h2>
            <p className="text-[#16a34a] text-xs font-medium mt-0.5">
              No violations or restrictions.
            </p>
          </div>
        </div>

        {/* Card 2: 2x2 Stats Grid */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 grid grid-cols-2 gap-4 shadow-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-[#94a3b8] text-xs font-medium">Account Status</span>
            <span className="text-[#0f172a] text-sm font-bold">Active</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[#94a3b8] text-xs font-medium">Warnings</span>
            <span className="text-[#0f172a] text-sm font-bold">0</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[#94a3b8] text-xs font-medium">Active Restrictions</span>
            <span className="text-[#0f172a] text-sm font-bold">None</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[#94a3b8] text-xs font-medium">Pending Appeals</span>
            <span className="text-[#0f172a] text-sm font-bold">{pendingAppeals}</span>
          </div>
        </div>

        {/* Card 3: No Violations Card */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 flex flex-col items-center text-center gap-2 shadow-xs">
          <div className="bg-[#f0fdfa] border border-[#ccfbf1] rounded-full size-12 flex items-center justify-center text-[#0d9488] mb-1">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-[#0f172a] text-sm font-bold">
            No Violations
          </h3>
          <p className="text-[#64748b] text-xs max-w-[240px]">
            Your account has a clean record. Keep it up!
          </p>
        </div>

        {/* Card 4: How the Violation System Works */}
        <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-2xl p-4 flex flex-col gap-1.5">
          <h4 className="text-[#b45309] text-xs font-bold">
            How the Violation System Works
          </h4>
          <p className="text-[#92400e] text-[11px] leading-relaxed">
            1st Violation → Warning · 2nd → Restriction · 3rd → Temporary Suspension · Further → Admin Review / Possible Ban
          </p>
        </div>

        {/* Card 5: Submit an Appeal */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setShowAppealModal(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setShowAppealModal(true);
          }}
          className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex items-center justify-between shadow-xs cursor-pointer active:bg-slate-50 touch-manipulation hover:border-[#99f6e4] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="size-5 rounded-full border-2 border-[#0d9488] text-[#0d9488] flex items-center justify-center font-bold text-xs shrink-0">
              ?
            </div>
            <span className="text-[#0f172a] text-sm font-bold">
              Submit an Appeal
            </span>
          </div>
          <svg className="size-4 text-[#94a3b8] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Submit Appeal Bottom Sheet Modal */}
      {showAppealModal && (
        <div
          className="absolute inset-0 bg-black/60 flex items-end justify-center z-50 scale-in"
          onClick={() => setShowAppealModal(false)}
        >
          <div
            className="bg-white rounded-t-3xl w-full p-6 flex flex-col gap-4 max-h-[90%] overflow-y-auto no-scrollbar shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab Handle */}
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-1" />

            <h3
              className="text-[#0f172a] text-lg font-bold"
              style={{ fontFamily: "Lexend Deca, sans-serif" }}
            >
              Submit Appeal
            </h3>

            <form onSubmit={handleAppealSubmit} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[#0f172a] text-xs font-bold">
                  Reason for Appeal
                </label>
                <textarea
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  placeholder="Describe why you are appealing..."
                  className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-3 text-xs text-[#0f172a] outline-none h-24 resize-none leading-relaxed focus:border-[#0d9488]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#0f172a] text-xs font-bold">
                  Supporting Information
                </label>
                <textarea
                  value={supportingInfo}
                  onChange={(e) => setSupportingInfo(e.target.value)}
                  placeholder="Any additional context or evidence..."
                  className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-3 text-xs text-[#0f172a] outline-none h-20 resize-none leading-relaxed focus:border-[#0d9488]"
                />
              </div>

              {/* Upload Attachment Button */}
              <button
                type="button"
                onClick={() => {
                  setHasAttachment(!hasAttachment);
                  onToast(hasAttachment ? "Attachment removed." : "Document attachment added.");
                }}
                className={`border border-dashed rounded-xl py-3 flex items-center justify-center gap-2 text-xs font-medium transition-all touch-manipulation cursor-pointer ${
                  hasAttachment
                    ? "border-[#0d9488] bg-[#f0fdfa] text-[#0d9488] font-bold"
                    : "border-[#cbd5e1] text-[#64748b] hover:border-[#94a3b8]"
                }`}
              >
                <span>📎</span>
                <span>{hasAttachment ? "statement_proof.pdf (Tap to remove)" : "Upload Attachment"}</span>
              </button>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAppealModal(false)}
                  className="flex-1 bg-[#f1f5f9] text-[#64748b] text-sm font-bold py-3 rounded-2xl touch-manipulation active:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0d9488] text-white text-sm font-bold py-3 rounded-2xl touch-manipulation active:brightness-90 shadow-md cursor-pointer"
                >
                  Submit Appeal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
