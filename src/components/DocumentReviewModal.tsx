import React, { useState } from "react";

export interface CredentialDoc {
  id: string;
  title: string;
  type: string;
  verified: boolean;
  status: "Verified" | "Pending Review" | "Needs Re-upload";
  docNumber: string;
  issuedDate: string;
  expiryDate?: string;
  issuingAuthority: string;
  documentCategory:
    | "government_id"
    | "tesda"
    | "clearance"
    | "permit"
    | "license"
    | "business";
  fileFormat: "PDF" | "PNG" | "JPEG";
  fileSize: string;
  notes?: string;
  rejectionReason?: string;
}

export interface CredentialItem {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  serviceType: string;
  submittedDate: string;
  providedDocs: string;
  status: "Pending" | "Verified" | "Rejected";
  phone: string;
  email: string;
  experience: string;
  docsList: CredentialDoc[];
}

export interface DocumentReviewModalProps {
  credential: CredentialItem;
  activeDocIndex: number;
  onChangeDocIndex: (index: number) => void;
  onClose: () => void;
  onUpdateDocStatus: (
    docIndex: number,
    newStatus: "Verified" | "Pending Review" | "Needs Re-upload",
    note?: string,
    reason?: string
  ) => void;
  onApproveApplicant: (applicantId: string) => void;
  onRejectApplicant: (applicantId: string) => void;
  onToast: (msg: string) => void;
}

export function DocumentReviewModal({
  credential,
  activeDocIndex,
  onChangeDocIndex,
  onClose,
  onUpdateDocStatus,
  onApproveApplicant,
  onRejectApplicant,
  onToast,
}: DocumentReviewModalProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    seal: true,
    nameMatch: true,
    notExpired: true,
    legible: true,
  });

  const activeDoc = credential.docsList[activeDocIndex] || credential.docsList[0];
  const allVerified = credential.docsList.every((d) => d.status === "Verified");
  const verifiedCount = credential.docsList.filter((d) => d.status === "Verified").length;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => {
    setZoom(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleDownload = () => {
    onToast(`Audit copy downloaded: ${activeDoc.title.replace(/\s+/g, "_")}.pdf`);
  };

  const handleMarkVerified = () => {
    onUpdateDocStatus(
      activeDocIndex,
      "Verified",
      customNote || activeDoc.notes || "Document verified and validated against official registry."
    );
    setShowRejectForm(false);
    onToast(`✓ ${activeDoc.title} marked as Verified`);
  };

  const handleConfirmReupload = () => {
    if (!selectedReason && !customNote) {
      onToast("Please select or enter a reason for re-upload.");
      return;
    }
    const finalReason = selectedReason || customNote;
    onUpdateDocStatus(activeDocIndex, "Needs Re-upload", customNote, finalReason);
    setShowRejectForm(false);
    onToast(`⚠️ Re-upload requested: ${finalReason}`);
  };

  const handleToggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="max-w-6xl w-full h-[94vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#cbd5e1] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── Top Header ─── */}
        <div className="bg-[#062e28] text-white px-5 py-3.5 flex items-center justify-between shrink-0 border-b border-[#0f4e44]">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-[#0d9488]/30 border border-[#2dd4bf]/40 flex items-center justify-center text-lg shadow-inner">
              🔍
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-sm md:text-base font-bold text-white tracking-wide">
                  Document Verification & Inspection
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#115e59] text-[#5eead4] border border-[#2dd4bf]/30">
                  TapServe Audit Console
                </span>
              </div>
              <p className="text-xs text-[#99f6e4] font-medium flex items-center gap-1.5">
                <span>Applicant: <strong className="text-white">{credential.name}</strong></span>
                <span>•</span>
                <span>{credential.serviceType}</span>
                <span>•</span>
                <span>Submitted {credential.submittedDate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status pill */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                credential.status === "Verified"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                  : credential.status === "Pending"
                  ? "bg-amber-500/20 text-amber-300 border-amber-400/40"
                  : "bg-rose-500/20 text-rose-300 border-rose-400/40"
              }`}
            >
              Application: {credential.status}
            </span>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="size-8 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-colors text-sm font-bold"
              title="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ─── Document Selector Tab Bar ─── */}
        <div className="bg-[#f8fafc] border-b border-[#e2e8f0] px-4 py-2 flex items-center justify-between shrink-0 overflow-x-auto gap-2 no-scrollbar">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#64748b] mr-1 hidden sm:inline">
              Submitted Documents ({credential.docsList.length}):
            </span>
            {credential.docsList.map((doc, idx) => {
              const isActive = idx === activeDocIndex;
              return (
                <button
                  key={doc.id || idx}
                  onClick={() => {
                    onChangeDocIndex(idx);
                    setShowRejectForm(false);
                    setCustomNote(doc.notes || "");
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shrink-0 ${
                    isActive
                      ? "bg-[#0d9488] text-white border-[#0d9488] shadow-xs"
                      : "bg-white text-[#475569] border-[#cbd5e1] hover:bg-slate-100"
                  }`}
                >
                  <span>
                    {doc.documentCategory === "government_id"
                      ? "🪪"
                      : doc.documentCategory === "tesda"
                      ? "🎖️"
                      : doc.documentCategory === "clearance"
                      ? "📜"
                      : doc.documentCategory === "business"
                      ? "🏢"
                      : doc.documentCategory === "license"
                      ? "⚖️"
                      : "🩺"}
                  </span>
                  <span className="truncate max-w-[150px] sm:max-w-[180px]">{doc.title}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                      doc.status === "Verified"
                        ? isActive
                          ? "bg-white/20 text-white"
                          : "bg-emerald-100 text-emerald-800"
                        : doc.status === "Needs Re-upload"
                        ? isActive
                          ? "bg-white/20 text-white"
                          : "bg-rose-100 text-rose-800"
                        : isActive
                        ? "bg-white/20 text-white"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {doc.status === "Verified"
                      ? "✓ Valid"
                      : doc.status === "Needs Re-upload"
                      ? "⚠️ Re-upload"
                      : "⏳ Pending"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#0f172a] shrink-0">
            <span className="text-[#64748b]">Verification Progress:</span>
            <span className="px-2 py-0.5 rounded-md bg-[#ccfbf1] text-[#0f766e] font-bold">
              {verifiedCount} / {credential.docsList.length} Approved
            </span>
          </div>
        </div>

        {/* ─── Main Content Split View ─── */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* ─── Left Column: Scanned Document Viewer Stage (~62%) ─── */}
          <div className="flex-1 bg-[#0f172a] flex flex-col overflow-hidden relative border-r border-[#334155]">
            {/* Viewer Toolbar */}
            <div className="bg-[#1e293b]/95 backdrop-blur-xs text-white px-4 py-2 border-b border-[#334155] flex items-center justify-between z-10 shrink-0 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-300 font-bold truncate max-w-[260px]">
                  📄 {activeDoc.title}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-[10px] font-mono">
                  {activeDoc.fileFormat} • {activeDoc.fileSize}
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleZoomOut}
                  className="size-7 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition-colors"
                  title="Zoom Out"
                >
                  −
                </button>
                <span className="text-[11px] font-mono text-slate-300 w-12 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="size-7 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition-colors"
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  onClick={handleResetZoom}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition-colors ml-1"
                  title="Reset view"
                >
                  Fit
                </button>
                <button
                  onClick={handleRotate}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition-colors flex items-center gap-1 ml-1"
                  title="Rotate document"
                >
                  ↻ 90°
                </button>
                <button
                  onClick={handleDownload}
                  className="px-2.5 py-1 rounded bg-[#0d9488] hover:bg-[#0f766e] text-white text-[11px] font-bold transition-colors flex items-center gap-1 ml-2 shadow-xs"
                  title="Download audit copy"
                >
                  📥 Download Copy
                </button>
              </div>
            </div>

            {/* Document Canvas Viewport */}
            <div className="flex-1 overflow-auto p-4 md:p-8 flex items-center justify-center relative select-none">
              <div
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: "transform 0.2s ease-out",
                }}
                className="origin-center shadow-2xl transition-transform"
              >
                <DocumentVisualPreview doc={activeDoc} applicant={credential} />
              </div>

              {/* Watermark Tag */}
              <div className="absolute bottom-3 left-4 pointer-events-none bg-black/60 backdrop-blur-xs px-3 py-1 rounded-md text-[10px] font-mono text-slate-400 border border-slate-700/60 flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>TAPSERVE SECURE AUDIT VAULT • SHA-256 VERIFIED COPY</span>
              </div>
            </div>
          </div>

          {/* ─── Right Column: Review & Verification Action Panel (~38%) ─── */}
          <div className="w-full md:w-[410px] shrink-0 bg-white flex flex-col justify-between overflow-y-auto no-scrollbar border-t md:border-t-0 p-5 gap-4">
            <div className="flex flex-col gap-4">
              {/* Document Overview Card */}
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-2.5 text-xs shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
                  <span className="font-bold text-[#0f172a] text-sm">Document Metadata</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                      activeDoc.status === "Verified"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : activeDoc.status === "Needs Re-upload"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {activeDoc.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#64748b] block">Document ID:</span>
                    <span className="font-mono font-bold text-[#0f172a] truncate block">
                      {activeDoc.docNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748b] block">Category:</span>
                    <span className="font-semibold text-[#0f172a]">{activeDoc.type}</span>
                  </div>
                  <div>
                    <span className="text-[#64748b] block">Issuing Authority:</span>
                    <span className="font-semibold text-[#0f172a] line-clamp-1">
                      {activeDoc.issuingAuthority}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748b] block">Date Issued:</span>
                    <span className="font-semibold text-[#0f172a]">{activeDoc.issuedDate}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#64748b] block">Expiration / Validity:</span>
                    <span className="font-semibold text-[#0f766e]">
                      {activeDoc.expiryDate || "Not Specified / Permanent"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Automated Verification Checks */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-3.5 flex flex-col gap-2 shadow-2xs">
                <span className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
                  <span>🛡️</span> Security & Compliance Checklist
                </span>
                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.seal}
                      onChange={() => handleToggleCheck("seal")}
                      className="accent-[#0d9488] size-3.5 rounded"
                    />
                    <span className="text-[#334155]">Official agency seal / crest verified</span>
                  </label>
                  <label className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.nameMatch}
                      onChange={() => handleToggleCheck("nameMatch")}
                      className="accent-[#0d9488] size-3.5 rounded"
                    />
                    <span className="text-[#334155]">
                      Full name matches applicant (<strong>{credential.name}</strong>)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.notExpired}
                      onChange={() => handleToggleCheck("notExpired")}
                      className="accent-[#0d9488] size-3.5 rounded"
                    />
                    <span className="text-[#334155]">Document is current & not expired</span>
                  </label>
                  <label className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.legible}
                      onChange={() => handleToggleCheck("legible")}
                      className="accent-[#0d9488] size-3.5 rounded"
                    />
                    <span className="text-[#334155]">No tampering, glare, or blur detected</span>
                  </label>
                </div>
              </div>

              {/* Review Decision Buttons */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
                  Document Decision
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleMarkVerified}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>✓</span> Mark as Verified
                  </button>

                  <button
                    onClick={() => setShowRejectForm(!showRejectForm)}
                    className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>⚠️</span> Request Re-upload
                  </button>
                </div>

                {/* Re-upload / Flag Form */}
                {showRejectForm && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex flex-col gap-2 text-xs animate-in fade-in">
                    <span className="font-bold text-amber-900">
                      Reason for Requesting Re-upload:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Blurry or unreadable scan",
                        "Document is expired",
                        "Missing back page or official seal",
                        "Name does not match applicant profile",
                      ].map((reason) => (
                        <button
                          key={reason}
                          type="button"
                          onClick={() => setSelectedReason(reason)}
                          className={`text-[10px] px-2 py-1 rounded-lg border transition-colors ${
                            selectedReason === reason
                              ? "bg-amber-600 text-white border-amber-600"
                              : "bg-white text-amber-900 border-amber-300 hover:bg-amber-100"
                          }`}
                        >
                          {reason}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={handleConfirmReupload}
                        className="flex-1 py-1.5 bg-amber-600 text-white rounded-lg font-bold text-[11px] hover:bg-amber-700"
                      >
                        Submit Request
                      </button>
                      <button
                        onClick={() => setShowRejectForm(false)}
                        className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 rounded-lg font-semibold text-[11px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Reviewer Notes */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-[#0f172a]">Auditor Remarks & Notes:</span>
                <textarea
                  value={customNote || activeDoc.notes || ""}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Add verification notes, registry cross-checks, or comments..."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#cbd5e1] focus:outline-none focus:border-[#0d9488] bg-[#f8fafc] text-[#0f172a]"
                />
              </div>

              {/* Sequential Stepper Navigation */}
              <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9] text-xs">
                <button
                  disabled={activeDocIndex === 0}
                  onClick={() => onChangeDocIndex(activeDocIndex - 1)}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors ${
                    activeDocIndex === 0
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-[#0d9488] hover:bg-[#f0fdfa]"
                  }`}
                >
                  ← Previous Doc
                </button>
                <span className="text-[#94a3b8] text-[11px]">
                  {activeDocIndex + 1} of {credential.docsList.length}
                </span>
                <button
                  disabled={activeDocIndex === credential.docsList.length - 1}
                  onClick={() => onChangeDocIndex(activeDocIndex + 1)}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors ${
                    activeDocIndex === credential.docsList.length - 1
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-[#0d9488] hover:bg-[#f0fdfa]"
                  }`}
                >
                  Next Doc →
                </button>
              </div>

              {/* Overall Specialist Verification Ready Banner */}
              {allVerified && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🎉</span>
                    <span className="text-xs font-bold text-emerald-900">
                      All submitted documents are verified!
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 leading-snug">
                    This specialist has completed all compliance checks and is eligible for immediate accreditation.
                  </p>
                  <button
                    onClick={() => onApproveApplicant(credential.id)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Approve Specialist Application Now →
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#f1f5f9] flex gap-2">
              <button
                onClick={() => onRejectApplicant(credential.id)}
                className="py-2 px-3 rounded-xl border border-rose-300 text-rose-600 text-xs font-bold hover:bg-rose-50 transition-colors"
              >
                Reject Specialist
              </button>
              <button
                onClick={() => onApproveApplicant(credential.id)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#0d9488] text-white text-xs font-bold hover:bg-[#0f766e] transition-colors shadow-xs"
              >
                Approve Verification
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENT VISUAL PREVIEW COMPONENT (Authentic Scanned Document Renders)
// ─────────────────────────────────────────────────────────────────────────────
export function DocumentVisualPreview({
  doc,
  applicant,
}: {
  doc: CredentialDoc;
  applicant: CredentialItem;
}) {
  const category = doc.documentCategory;

  // ─── 1. TESDA NC II Certificate ───
  if (category === "tesda") {
    return (
      <div className="w-[530px] min-h-[420px] bg-[#fffdf0] rounded-xl shadow-2xl p-7 border-4 border-[#b45309] font-serif relative flex flex-col justify-between text-[#1e293b]">
        {/* Decorative corner borders */}
        <div className="absolute top-2 left-2 size-4 border-t-2 border-l-2 border-[#b45309]" />
        <div className="absolute top-2 right-2 size-4 border-t-2 border-r-2 border-[#b45309]" />
        <div className="absolute bottom-2 left-2 size-4 border-b-2 border-l-2 border-[#b45309]" />
        <div className="absolute bottom-2 right-2 size-4 border-b-2 border-r-2 border-[#b45309]" />

        {/* Certificate Header */}
        <div className="flex flex-col items-center text-center gap-1">
          <div className="flex items-center justify-center gap-3">
            <div className="size-11 rounded-full bg-[#1e3a8a] text-white font-bold flex items-center justify-center text-xs shadow-inner">
              🇵🇭
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#64748b]">
                Republic of the Philippines
              </span>
              <h3 className="text-sm font-bold tracking-wider text-[#0f172a] uppercase font-sans">
                Technical Education and Skills Development Authority
              </h3>
              <span className="text-[9px] text-[#475569] font-sans">
                Regional Training Center IV-A • Laguna Field Operations
              </span>
            </div>
            <div className="size-11 rounded-full bg-[#0d9488] text-white font-bold flex items-center justify-center text-xs shadow-inner">
              ⚙️
            </div>
          </div>

          <div className="mt-2 py-0.5 px-4 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-white text-[11px] font-bold uppercase tracking-widest rounded shadow-2xs font-sans">
            National Certificate II
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col items-center text-center my-3 gap-1">
          <span className="text-[11px] italic text-[#475569]">This certifies that</span>
          <h2 className="text-xl font-black text-[#0f172a] tracking-wide font-sans underline decoration-amber-500 underline-offset-4">
            {applicant.name.toUpperCase()}
          </h2>
          <span className="text-[11px] italic text-[#475569] mt-0.5">
            has been assessed and found qualified under Philippine TVET competency standards in
          </span>

          <div className="my-2 p-2.5 bg-[#f0fdfa] border border-[#99f6e4] rounded-lg text-center w-full">
            <span className="text-xs md:text-sm font-extrabold text-[#0f766e] uppercase tracking-wide font-sans block">
              {doc.title.toUpperCase()}
            </span>
            <span className="text-[10px] text-[#0d9488] font-sans block mt-0.5">
              Core Competencies: Roughing-in, Wiring Systems, Inspection & Testing
            </span>
          </div>

          <div className="flex justify-between w-full text-[10px] text-[#64748b] font-sans px-2">
            <span>Certificate No: <strong className="font-mono text-[#0f172a]">{doc.docNumber}</strong></span>
            <span>Validity: <strong className="text-[#0f172a]">{doc.expiryDate || "Aug 18, 2027"}</strong></span>
          </div>
        </div>

        {/* Signatures & Seal */}
        <div className="flex items-end justify-between pt-3 border-t border-[#e2e8f0] font-sans">
          <div className="flex flex-col items-center text-center">
            <div className="w-28 border-b border-[#334155] mb-1 italic text-[11px] text-[#475569] font-serif">
              Ramon S. Reyes
            </div>
            <span className="text-[9px] font-bold text-[#0f172a]">ENGR. RAMON S. REYES</span>
            <span className="text-[8px] text-[#64748b]">Regional Director, TESDA IV-A</span>
          </div>

          {/* Golden Seal */}
          <div className="size-16 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 border-2 border-amber-600 shadow-md flex flex-col items-center justify-center text-center p-1 text-[#78350f]">
            <span className="text-[8px] font-black uppercase tracking-tighter">TESDA</span>
            <span className="text-[9px]">🎖️</span>
            <span className="text-[7px] font-bold tracking-tighter uppercase">PASSED NC II</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-28 border-b border-[#334155] mb-1 italic text-[11px] text-[#475569] font-serif">
              S. Mangudadatu
            </div>
            <span className="text-[9px] font-bold text-[#0f172a]">SUHARTO MANGUDADATU</span>
            <span className="text-[8px] text-[#64748b]">Director General, TESDA</span>
          </div>
        </div>
      </div>
    );
  }

  // ─── 2. Barangay Clearance / Local Clearance ───
  if (category === "clearance" && doc.title.toLowerCase().includes("barangay")) {
    return (
      <div className="w-[520px] min-h-[430px] bg-white rounded-xl shadow-2xl p-7 border border-[#cbd5e1] font-serif relative flex flex-col justify-between text-[#0f172a]">
        {/* Letterhead */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#0f172a]">
          <div className="size-12 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-lg font-bold">
            🏛️
          </div>
          <div className="flex flex-col text-center">
            <span className="text-[9px] tracking-wider uppercase text-[#64748b] font-sans">
              Republic of the Philippines • Province of Laguna
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wide text-[#0f172a]">
              City Government of San Pablo
            </h3>
            <h4 className="text-xs font-semibold text-[#0d9488] uppercase tracking-wider font-sans">
              Office of the Punong Barangay • Barangay San Roque
            </h4>
          </div>
          <div className="size-12 rounded-full bg-[#0d9488] text-white flex items-center justify-center text-lg font-bold">
            🌴
          </div>
        </div>

        {/* Clearance Title */}
        <div className="text-center my-3 font-sans">
          <h2 className="text-base font-black uppercase tracking-widest text-[#0f172a]">
            Barangay Clearance & Certificate of Good Standing
          </h2>
          <span className="text-[10px] text-[#64748b]">Control No: {doc.docNumber}</span>
        </div>

        {/* Certification Text */}
        <div className="text-xs text-[#334155] leading-relaxed flex flex-col gap-2 font-serif text-justify px-2">
          <p className="font-bold text-[#0f172a]">TO WHOM IT MAY CONCERN:</p>
          <p>
            THIS IS TO CERTIFY that <strong className="text-[#0f172a] uppercase font-sans">{applicant.name}</strong>,
            of legal age, Filipino citizen, is a bonafide resident of Barangay San Roque, City of San Pablo, Province of Laguna.
          </p>
          <p>
            FURTHER CERTIFIES that according to the records and verification of this office, the subject applicant
            is known to be of <strong>GOOD MORAL CHARACTER</strong>, a law-abiding citizen, and has <strong>NO DEROGATORY RECORD</strong>
            nor pending criminal or civil case filed against them in this Barangay.
          </p>
          <p className="text-[11px] bg-slate-50 p-2 rounded border border-slate-200 font-sans">
            <strong>PURPOSE:</strong> Issued upon the request of the applicant for accreditation and accreditation review as a certified
            service professional under the <strong>TapServe Platform</strong>.
          </p>
        </div>

        {/* Footer & Dry Seal */}
        <div className="flex items-end justify-between pt-4 mt-2 border-t border-[#f1f5f9] font-sans">
          <div className="flex flex-col text-[10px] text-[#64748b]">
            <span>Date Issued: <strong>{doc.issuedDate}</strong></span>
            <span>Validity: <strong>6 Months from Date of Issue</strong></span>
            <span>CTC No: <strong>CCI-2026-99214</strong></span>
          </div>

          {/* Red Dry Seal Stamp */}
          <div className="size-16 rounded-full border-2 border-dashed border-rose-600 bg-rose-50 text-rose-800 flex flex-col items-center justify-center text-center p-1 font-bold text-[8px] uppercase tracking-tighter shadow-2xs rotate-[-8deg]">
            <span>OFFICIAL SEAL</span>
            <span className="text-[11px]">★</span>
            <span>BRGY SAN ROQUE</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-28 border-b border-[#334155] mb-1 italic text-xs font-serif">
              Danilo M. Alvarez
            </div>
            <span className="text-[10px] font-bold text-[#0f172a]">HON. DANILO M. ALVAREZ</span>
            <span className="text-[8px] text-[#64748b]">Punong Barangay</span>
          </div>
        </div>
      </div>
    );
  }

  // ─── 3. NBI / Police Clearance ───
  if (category === "clearance" && (doc.title.toLowerCase().includes("nbi") || doc.title.toLowerCase().includes("police"))) {
    return (
      <div className="w-[520px] min-h-[380px] bg-[#f0fdf4] rounded-xl shadow-2xl p-6 border-2 border-[#166534] font-sans relative flex flex-col justify-between text-[#0f172a] overflow-hidden">
        {/* Guilloche wave overlay watermark */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:8px_8px]" />

        {/* Clearance Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#15803d]">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-[#15803d] text-white flex items-center justify-center text-lg font-bold">
              ⚖️
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-[#166534] font-bold">
                Republic of the Philippines • Department of Justice
              </span>
              <h3 className="text-sm font-black uppercase text-[#14532d]">
                National Bureau of Investigation (NBI)
              </h3>
              <span className="text-[9px] text-[#166534]">
                District Clearance Office • San Pablo / Laguna Registry
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-[#64748b] block">Clearance ID:</span>
            <span className="font-mono text-xs font-black text-[#14532d]">{doc.docNumber}</span>
          </div>
        </div>

        {/* Applicant Row */}
        <div className="flex items-center gap-4 my-3 bg-white p-3 rounded-xl border border-emerald-200">
          <div className="size-16 rounded-lg bg-slate-200 border-2 border-emerald-600 flex items-center justify-center text-xl font-bold shrink-0 text-emerald-800">
            {applicant.initials}
          </div>
          <div className="flex-1 grid grid-cols-2 gap-1.5 text-[11px]">
            <div>
              <span className="text-[#64748b] block text-[10px]">Name:</span>
              <span className="font-bold text-[#0f172a]">{applicant.name.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-[#64748b] block text-[10px]">Address:</span>
              <span className="font-medium text-[#0f172a]">San Pablo City, Laguna</span>
            </div>
            <div>
              <span className="text-[#64748b] block text-[10px]">Purpose:</span>
              <span className="font-bold text-[#0f766e]">LOCAL EMPLOYMENT / TAPSERVE</span>
            </div>
            <div>
              <span className="text-[#64748b] block text-[10px]">Validity:</span>
              <span className="font-bold text-[#0f172a]">{doc.expiryDate || "1 Year from Issue"}</span>
            </div>
          </div>

          {/* Biometric Thumbprint */}
          <div className="size-14 rounded border border-emerald-400 bg-emerald-50 flex flex-col items-center justify-center text-[8px] text-emerald-800 font-bold shrink-0">
            <span className="text-base">👆</span>
            <span>BIOMETRIC</span>
          </div>
        </div>

        {/* Big Blue Stamp: NO DEROGATORY RECORD */}
        <div className="flex items-center justify-center my-1">
          <div className="border-3 border-[#1d4ed8] text-[#1d4ed8] px-6 py-1.5 rounded-lg text-sm font-black uppercase tracking-widest rotate-[-3deg] bg-white/80 shadow-xs">
            ★ NO DEROGATORY RECORD ★
          </div>
        </div>

        {/* Footer Barcode */}
        <div className="flex items-center justify-between pt-2 border-t border-emerald-200 text-[10px] text-[#475569]">
          <span className="font-mono text-[9px]">BARCODE: ||| | ||||| |||| | ||| |||||| |||||</span>
          <span className="font-bold text-[#14532d]">ISSUED BY: NBI CLEARANCE CENTRAL OPERATIONS</span>
        </div>
      </div>
    );
  }

  // ─── 4. DTI Business Name Registration ───
  if (category === "business") {
    return (
      <div className="w-[520px] min-h-[400px] bg-white rounded-xl shadow-2xl p-7 border-2 border-[#1e3a8a] font-sans relative flex flex-col justify-between text-[#0f172a]">
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#1e3a8a]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-base font-bold">
              🏢
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-[#64748b] font-semibold">
                Republic of the Philippines
              </span>
              <h3 className="text-sm font-black uppercase text-[#1e3a8a]">
                Department of Trade and Industry (DTI)
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-[#1e3a8a]">{doc.docNumber}</span>
        </div>

        <div className="flex flex-col items-center text-center my-3 gap-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#64748b]">
            Certificate of
          </span>
          <h2 className="text-base font-black uppercase tracking-wider text-[#0f172a]">
            Business Name Registration
          </h2>
          <div className="my-2 p-3 bg-blue-50 border border-blue-200 rounded-xl w-full text-center">
            <span className="text-[10px] text-[#64748b] uppercase block">Registered Business Name:</span>
            <span className="text-sm font-extrabold text-[#1e3a8a] block uppercase">
              {applicant.name}&apos;S HOME SERVICE ENTERPRISE
            </span>
          </div>

          <div className="w-full grid grid-cols-2 gap-2 text-left text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div>
              <span className="text-[#64748b] text-[10px] block">Proprietor:</span>
              <span className="font-bold text-[#0f172a]">{applicant.name}</span>
            </div>
            <div>
              <span className="text-[#64748b] text-[10px] block">Territorial Scope:</span>
              <span className="font-bold text-[#0f172a]">City of San Pablo, Laguna</span>
            </div>
            <div>
              <span className="text-[#64748b] text-[10px] block">Registration Date:</span>
              <span className="font-medium text-[#0f172a]">{doc.issuedDate}</span>
            </div>
            <div>
              <span className="text-[#64748b] text-[10px] block">Valid Until:</span>
              <span className="font-bold text-[#0d9488]">{doc.expiryDate || "5 Years"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#e2e8f0] text-[10px]">
          <span className="font-mono text-[#64748b]">QR VALIDATION: [VALID REGISTERED]</span>
          <span className="font-bold text-[#1e3a8a]">SECRETARY OF TRADE & INDUSTRY</span>
        </div>
      </div>
    );
  }

  // ─── 5. Default / Government ID (PhilSys National ID, UMID, Driver's License) ───
  return (
    <div className="w-[520px] min-h-[320px] rounded-2xl shadow-2xl p-5 border border-[#cbd5e1] font-sans relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#f8fafc] via-[#eff6ff] to-[#ecfdf5] text-[#0f172a]">
      {/* Security Guilloche subtle background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:6px_6px]" />

      {/* ID Card Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#94a3b8]/40 relative z-10">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-sm font-bold shadow-xs">
            🇵🇭
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#1e3a8a] leading-tight">
              REPUBLIKA NG PILIPINAS • REPUBLIC OF THE PHILIPPINES
            </span>
            <span className="text-xs font-black text-[#0f172a] tracking-wide leading-tight">
              PAMBANSANG PAGKAKAKILANLAN / PHILIPPINE IDENTIFICATION
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="size-7 rounded bg-amber-400/90 border border-amber-500 flex items-center justify-center text-[10px] font-bold text-amber-950 shadow-2xs">
            PSA
          </div>
        </div>
      </div>

      {/* ID Card Body */}
      <div className="flex gap-4 my-2 relative z-10 items-center">
        {/* Photo Box */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="size-24 rounded-xl bg-slate-300 border-2 border-[#1e40af] overflow-hidden flex flex-col items-center justify-center relative shadow-inner">
            <span className="text-3xl font-black text-slate-600">{applicant.initials}</span>
            {/* Hologram stripe overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/20 to-transparent pointer-events-none" />
          </div>
          <span className="text-[8px] font-mono text-[#64748b]">PHILIPPINE CITIZEN</span>
        </div>

        {/* Details Grid */}
        <div className="flex-1 flex flex-col gap-1 text-[11px]">
          <div className="flex justify-between items-center bg-white/70 px-2 py-1 rounded-lg border border-slate-200">
            <span className="text-[10px] text-[#64748b]">PhilSys Card Number:</span>
            <span className="font-mono font-black text-[#0f172a] tracking-wide text-xs">
              {doc.docNumber}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-0.5">
            <div>
              <span className="text-[9px] text-[#64748b] block">Last Name / Apelyido:</span>
              <span className="font-black text-[#0f172a] text-xs">
                {applicant.name.split(" ").slice(-1)[0].toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-[#64748b] block">Given Names / Mga Pangalan:</span>
              <span className="font-bold text-[#0f172a]">
                {applicant.name.split(" ").slice(0, -1).join(" ").toUpperCase() || applicant.name.toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-[#64748b] block">Date of Birth:</span>
              <span className="font-semibold text-[#0f172a]">14 MAY 1988</span>
            </div>
            <div>
              <span className="text-[9px] text-[#64748b] block">Sex / Kasarian:</span>
              <span className="font-semibold text-[#0f172a]">MALE / LALAKI</span>
            </div>
            <div className="col-span-2">
              <span className="text-[9px] text-[#64748b] block">Address / Tirahan:</span>
              <span className="font-semibold text-[#0f172a] leading-tight">
                Brgy. San Roque, San Pablo City, Laguna 4000
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ID Card Footer / MRZ & QR */}
      <div className="pt-2 border-t border-[#94a3b8]/40 flex items-center justify-between text-[10px] relative z-10">
        <div className="flex items-center gap-2">
          {/* Microchip Contact */}
          <div className="size-6 rounded bg-amber-400 border border-amber-600 flex items-center justify-center text-[8px] font-bold text-amber-950">
            SIM
          </div>
          <span className="font-mono text-[9px] text-[#475569] tracking-tighter">
            I&lt;PHL{applicant.name.replace(/\s+/g, "&lt;").toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
          </span>
        </div>

        {/* QR Code */}
        <div className="size-8 rounded bg-white border border-slate-300 p-0.5 flex items-center justify-center shadow-2xs font-mono text-[7px] text-center font-bold">
          QR
        </div>
      </div>
    </div>
  );
}
