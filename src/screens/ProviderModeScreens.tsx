import React, { useState } from "react";
import { Screen } from "../types";
import { ProviderBottomNav, TappyAvatar, A } from "../components/SharedUI";
import {
  Booking,
  BookingStatus,
  Provider,
  ProviderApplicationData,
  UserAccount,
  AppStorage,
} from "../data/mockData";

// ─── Provider Application Flow ───────────────────────────────────────────────
export function ProviderApplyScreen({
  nav,
  goBack,
  currentUser,
  onSubmitApplication,
  onToast,
}: {
  nav: (s: Screen) => void;
  goBack: () => void;
  currentUser: UserAccount;
  onSubmitApplication: (appData: ProviderApplicationData) => void;
  onToast: (msg: string) => void;
}) {
  const [step, setStep] = useState(0); // 0 = Intro, 1 = Personal, 2 = Service, 3 = Docs, 4 = Terms, 5 = Review, 6 = Status
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Personal
  const [fullName, setFullName] = useState(currentUser.name || "Juan Dela Cruz");
  const [dob, setDob] = useState("1988-06-15");
  const [age, setAge] = useState("38");
  const [address, setAddress] = useState("Brgy. San Roque, San Pablo City, Laguna");
  const [contactNumber, setContactNumber] = useState("+63 917 555 1234");
  const [email, setEmail] = useState(currentUser.email || "specialist@tapserve.demo");
  const [photoName, setPhotoName] = useState<string | null>("profile_photo.jpg");

  // Step 2: Service
  const [category, setCategory] = useState("Plumbing");
  const [specialization, setSpecialization] = useState("Master Plumber & Pipe Specialist");
  const [yearsExp, setYearsExp] = useState("10");
  const [description, setDescription] = useState(
    "Experienced residential and commercial plumbing specialist handling pipe leak diagnostics, water pump installation, and drain unclogging."
  );
  const [serviceArea, setServiceArea] = useState("San Pablo City and surrounding Laguna areas");
  const [workingDays, setWorkingDays] = useState<string[]>([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]);
  const [workingHours, setWorkingHours] = useState("8:00 AM – 5:00 PM");

  // Step 3: Documents
  const [docs, setDocs] = useState<{ [key: string]: string }>({
    govId: "philippine_passport_front.jpg",
    proofAddress: "utility_bill_meralco.pdf",
    barangayClearance: "brgy_clearance_san_roque.pdf",
    nbiClearance: "nbi_clearance_verified.pdf",
  });

  // Step 4: Terms
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Categories list
  const categoryOptions = [
    "Cleaning",
    "Plumbing",
    "Electrical",
    "Gardening",
    "Appliance Repair",
    "Carpentry",
    "Home Maintenance",
    "Aircon Cleaning",
    "Painting",
    "Pest Control",
    "Moving Assistance",
    "Other Services",
  ];

  const daysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const toggleDay = (d: string) => {
    setWorkingDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const handleDocUpload = (key: string, name: string) => {
    setDocs((prev) => ({ ...prev, [key]: name }));
    onToast(`Uploaded ${name}`);
  };

  const handleRemoveDoc = (key: string) => {
    setDocs((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    onToast("Document removed.");
  };

  const handleSubmitFinal = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const appData: ProviderApplicationData = {
        fullName,
        dob,
        age,
        address,
        contactNumber,
        email,
        profilePhotoName: photoName || undefined,
        category,
        specialization,
        yearsExperience: yearsExp,
        description,
        serviceArea,
        workingDays,
        workingHours,
        documents: docs,
        termsAgreed,
        status: "Submitted",
        submittedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };
      onSubmitApplication(appData);
      setStep(6); // Go to Status screen
      onToast("Application submitted successfully!");
    }, 1000);
  };

  // ─── STEP 0: Intro Screen ───
  if (step === 0) {
    return (
      <div className="bg-[#f8fafc] flex flex-col size-full">
        <div className="bg-[#115e59] flex items-center gap-3 px-5 pt-12 pb-5 shrink-0">
          <button
            onClick={goBack}
            className="bg-white/15 flex items-center justify-center rounded-xl size-9 active:bg-white/25 touch-manipulation text-white"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-white text-lg font-bold flex-1" style={{ fontFamily: "Lexend Deca, sans-serif" }}>
            Service Provider Application
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col items-center text-center gap-4">
          <div className="size-20 rounded-full bg-[#f0fdfa] border-2 border-[#ccfbf1] flex items-center justify-center text-3xl shadow-sm mt-2">
            💼
          </div>

          <div className="flex flex-col gap-1.5">
            <h2 className="text-[#0f172a] text-xl font-bold tracking-tight" style={{ fontFamily: "Lexend Deca, sans-serif" }}>
              Join TapServe as a Certified Specialist
            </h2>
            <p className="text-[#64748b] text-xs leading-relaxed max-w-[280px]">
              Connect directly with households in San Pablo City, Laguna looking for reliable home services.
            </p>
          </div>

          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-3 text-left w-full shadow-xs">
            <span className="text-[#0f172a] text-xs font-bold uppercase tracking-wider">
              Application Steps
            </span>
            {[
              { num: "1", title: "Personal Details", desc: "Basic contact and identity information" },
              { num: "2", title: "Service & Experience", desc: "Select category, rates, and working days" },
              { num: "3", title: "Documents & Clearances", desc: "Upload ID, NBI or Barangay clearance" },
              { num: "4", title: "Terms Agreement", desc: "Review specialist code of conduct" },
            ].map((st) => (
              <div key={st.num} className="flex gap-3 items-center">
                <span className="size-6 rounded-full bg-[#0d9488] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {st.num}
                </span>
                <div className="flex flex-col">
                  <span className="text-[#0f172a] text-xs font-bold">{st.title}</span>
                  <span className="text-[#64748b] text-[10px]">{st.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep(1)}
            className="bg-[#0d9488] text-white text-sm font-bold py-3.5 rounded-xl w-full active:brightness-90 touch-manipulation shadow-md mt-auto"
          >
            Start Application
          </button>
        </div>
      </div>
    );
  }

  // ─── STEP 6: Application Status Screen ───
  if (step === 6) {
    const isApproved = currentUser.providerApplicationStatus === "Approved" || currentUser.isProvider;

    return (
      <div className="bg-[#f8fafc] flex flex-col size-full">
        <div className="bg-[#115e59] flex items-center justify-between px-5 pt-12 pb-5 shrink-0">
          <h1 className="text-white text-lg font-bold" style={{ fontFamily: "Lexend Deca, sans-serif" }}>
            Application Status
          </h1>
          <button
            onClick={() => nav("home")}
            className="text-white text-xs font-bold hover:underline"
          >
            Back Home
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col items-center text-center gap-4">
          <div
            className={`size-20 rounded-full flex items-center justify-center text-3xl shadow-sm mt-2 ${
              isApproved ? "bg-emerald-100 border-2 border-emerald-300" : "bg-teal-50 border-2 border-teal-200"
            }`}
          >
            {isApproved ? "✅" : "⏳"}
          </div>

          <div className="flex flex-col gap-1">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                isApproved
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-teal-100 text-[#0f766e]"
              }`}
            >
              Status: {isApproved ? "Approved" : "Submitted / Under Review"}
            </span>
            <h2 className="text-[#0f172a] text-xl font-bold tracking-tight mt-1" style={{ fontFamily: "Lexend Deca, sans-serif" }}>
              {isApproved ? "Application Approved!" : "Application Under Review"}
            </h2>
            <p className="text-[#64748b] text-xs leading-relaxed max-w-[280px]">
              {isApproved
                ? "Congratulations! Your specialist application has been approved. You now have access to Service Provider Mode."
                : "Your credentials and submitted documents have been received by the TapServe Verification Team in San Pablo City."}
            </p>
          </div>

          {/* Submitted Summary */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-2 text-left w-full shadow-xs text-xs">
            <span className="text-[#0f172a] font-bold">Applicant Summary</span>
            <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
              <span className="text-[#64748b]">Full Name:</span>
              <span className="font-semibold text-[#0f172a]">{fullName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
              <span className="text-[#64748b]">Service Category:</span>
              <span className="font-semibold text-[#0f172a]">{category}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
              <span className="text-[#64748b]">Specialization:</span>
              <span className="font-semibold text-[#0f172a]">{specialization}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
              <span className="text-[#64748b]">Experience:</span>
              <span className="font-semibold text-[#0f172a]">{yearsExp} years</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#64748b]">Service Area:</span>
              <span className="font-semibold text-[#0f172a]">San Pablo City, Laguna</span>
            </div>
          </div>

          {/* Discreet Capstone Demo Approval Trigger */}
          <div className="bg-[#fffbeb] border border-[#fde68a] p-3 rounded-2xl w-full flex flex-col gap-2 text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🎯</span>
              <span className="text-[#92400e] text-xs font-bold">Capstone Presentation Helper</span>
            </div>
            <p className="text-[#b45309] text-[11px] leading-relaxed">
              Use this instant simulation button to advance status directly to Approved and test Provider Mode.
            </p>
            <button
              onClick={() => {
                const user = AppStorage.getUser();
                const approvedUser: UserAccount = {
                  ...user,
                  isProvider: true,
                  providerApplicationStatus: "Approved",
                };
                AppStorage.saveUser(approvedUser);
                onToast("Simulated approval! Service Provider Mode unlocked.");
                nav("provider-dashboard");
              }}
              className="bg-[#0d9488] text-white text-xs font-bold py-2 rounded-xl active:brightness-90 touch-manipulation shadow-xs"
            >
              Simulate Instant Approval & Open Provider Mode →
            </button>
          </div>

          {isApproved ? (
            <button
              onClick={() => nav("provider-dashboard")}
              className="bg-[#0d9488] text-white text-sm font-bold py-3.5 rounded-xl w-full active:brightness-90 touch-manipulation shadow-md mt-auto"
            >
              Enter Provider Mode Dashboard
            </button>
          ) : (
            <button
              onClick={() => nav("home")}
              className="bg-slate-100 text-[#0f172a] text-xs font-bold py-3 rounded-xl w-full active:bg-slate-200 touch-manipulation mt-auto"
            >
              Return to User Home
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─── WIZARD STEPS 1 to 5 ───
  const stepTitles = [
    "",
    "Personal Information",
    "Service Information",
    "Documents & Clearances",
    "Terms and Conditions",
    "Review Application",
  ];

  return (
    <div className="bg-[#f8fafc] flex flex-col size-full">
      {/* Step Header */}
      <div className="bg-white border-b border-[#e2e8f0] flex flex-col gap-2.5 px-6 pt-12 pb-3 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStep((s) => s - 1)}
            className="bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center rounded-xl size-9 active:bg-slate-200 touch-manipulation"
          >
            <svg className="size-4 text-[#0f172a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex flex-col">
            <h2 className="text-[#0f172a] text-sm font-bold" style={{ fontFamily: "Lexend Deca, sans-serif" }}>
              Step {step} of 5: {stepTitles[step]}
            </h2>
            <span className="text-[#94a3b8] text-[10px]">TapServe Specialist Registration</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-1.5 pt-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-[#0d9488]" : "bg-[#e2e8f0]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-3.5">
        {/* ── STEP 1: Personal Info ── */}
        {step === 1 && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[#0f172a] text-xs font-bold">Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Juan Dela Cruz"
                className="bg-white border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none focus:border-[#0d9488]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[#0f172a] text-xs font-bold">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="bg-white border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none focus:border-[#0d9488]"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[#0f172a] text-xs font-bold">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="38"
                  className="bg-white border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none focus:border-[#0d9488]"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#0f172a] text-xs font-bold">Home Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Brgy., City, Province"
                className="bg-white border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none focus:border-[#0d9488]"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#0f172a] text-xs font-bold">Contact Number</label>
              <input
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+63 9XX XXX XXXX"
                className="bg-white border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none focus:border-[#0d9488]"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#0f172a] text-xs font-bold">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="specialist@email.com"
                className="bg-white border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none focus:border-[#0d9488]"
                required
              />
            </div>

            <div className="flex flex-col gap-1 pt-1">
              <label className="text-[#0f172a] text-xs font-bold">Profile Photo</label>
              {photoName ? (
                <div className="flex items-center justify-between bg-white border border-[#ccfbf1] p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📷</span>
                    <span className="text-xs font-semibold text-[#0f172a]">{photoName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhotoName(null)}
                    className="text-red-500 text-xs font-bold touch-manipulation"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setPhotoName("specialist_avatar.jpg")}
                  className="border-2 border-dashed border-[#0d9488] bg-[#f0fdfa] p-3 rounded-xl text-xs font-bold text-[#0d9488] flex items-center justify-center gap-2 touch-manipulation"
                >
                  <span>📷</span>
                  <span>Upload Professional Photo</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 2: Service Info ── */}
        {step === 2 && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[#0f172a] text-xs font-bold">Service Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-white border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none"
              >
                {categoryOptions.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#0f172a] text-xs font-bold">Service Specialization</label>
              <input
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g. Master Plumber, Aircon Inverter Cleaning"
                className="bg-white border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none focus:border-[#0d9488]"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#0f172a] text-xs font-bold">Years of Experience</label>
              <input
                type="number"
                value={yearsExp}
                onChange={(e) => setYearsExp(e.target.value)}
                placeholder="10"
                className="bg-white border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none focus:border-[#0d9488]"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#0f172a] text-xs font-bold">Service Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your skillset and services..."
                className="bg-white border border-[#e2e8f0] h-20 p-3 rounded-xl text-xs outline-none resize-none focus:border-[#0d9488]"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#0f172a] text-xs font-bold">Service Area</label>
              <input
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
                placeholder="San Pablo City, Laguna"
                className="bg-white border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none focus:border-[#0d9488]"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              <label className="text-[#0f172a] text-xs font-bold">Working Days (Multi-select)</label>
              <div className="flex flex-wrap gap-1.5">
                {daysList.map((d) => {
                  const isChecked = workingDays.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDay(d)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors touch-manipulation ${
                        isChecked
                          ? "bg-[#0d9488] border-[#0d9488] text-white"
                          : "bg-white border-[#e2e8f0] text-[#64748b]"
                      }`}
                    >
                      {d.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#0f172a] text-xs font-bold">Working Hours</label>
              <input
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                placeholder="8:00 AM – 5:00 PM"
                className="bg-white border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none focus:border-[#0d9488]"
              />
            </div>
          </div>
        )}

        {/* ── STEP 3: Documents ── */}
        {step === 3 && (
          <div className="flex flex-col gap-3">
            <p className="text-[#64748b] text-xs leading-relaxed">
              Upload mock files for verification. In this demonstration, browser local file state simulates document submission.
            </p>

            {[
              { key: "govId", label: "Valid Government ID", defaultFile: "gov_id_front.jpg" },
              { key: "proofAddress", label: "Proof of Address (Utility Bill)", defaultFile: "billing_statement.pdf" },
              { key: "barangayClearance", label: "Barangay Clearance", defaultFile: "brgy_clearance.pdf" },
              { key: "nbiClearance", label: "NBI / Police Clearance", defaultFile: "nbi_clearance.pdf" },
              { key: "certifications", label: "TESDA / Trade Certifications (Optional)", defaultFile: "tesda_cert.pdf" },
            ].map((d) => {
              const file = docs[d.key];
              return (
                <div
                  key={d.key}
                  className="bg-white border border-[#e2e8f0] rounded-xl p-3 flex items-center justify-between shadow-xs"
                >
                  <div className="flex flex-col">
                    <span className="text-[#0f172a] text-xs font-bold">{d.label}</span>
                    <span className={`text-[11px] ${file ? "text-[#0d9488] font-mono" : "text-[#94a3b8]"}`}>
                      {file ? `✓ ${file}` : "Not uploaded"}
                    </span>
                  </div>
                  {file ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc(d.key)}
                      className="text-red-500 text-xs font-bold touch-manipulation hover:underline"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleDocUpload(d.key, d.defaultFile)}
                      className="bg-[#0d9488] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg active:brightness-90 touch-manipulation"
                    >
                      Upload
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── STEP 4: Provider Terms ── */}
        {step === 4 && (
          <div className="flex flex-col gap-3">
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-2.5 shadow-xs max-h-[300px] overflow-y-auto no-scrollbar text-xs">
              <span className="text-[#0f172a] font-bold">TapServe Service Provider Agreement</span>
              <p className="text-[#475569] leading-relaxed">
                1. <strong>Verification:</strong> You verify that all information, licenses, and submitted clearance documents are genuine and accurate.
              </p>
              <p className="text-[#475569] leading-relaxed">
                2. <strong>Direct Payment:</strong> Clients remit cash payments directly upon service completion.
              </p>
              <p className="text-[#475569] leading-relaxed">
                3. <strong>Punctuality & Reliability:</strong> Accepting a booking commits your attendance. Cancellations should be avoided.
              </p>
              <p className="text-[#475569] leading-relaxed">
                4. <strong>Safety & Conduct:</strong> Professionalism, respectful communication, and quality workmanship are mandatory.
              </p>
            </div>

            <label className="bg-white border border-[#ccfbf1] p-3 rounded-xl flex items-start gap-2.5 cursor-pointer touch-manipulation">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="accent-[#0d9488] size-4 rounded mt-0.5"
              />
              <span className="text-[#0f172a] text-xs font-semibold leading-relaxed">
                I have read and agree to the TapServe Service Provider Terms and Conditions.
              </span>
            </label>
          </div>
        )}

        {/* ── STEP 5: Review Application ── */}
        {step === 5 && (
          <div className="flex flex-col gap-3 text-xs">
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0f172a]">Personal Info</span>
                <button onClick={() => setStep(1)} className="text-[#0d9488] font-bold">Edit</button>
              </div>
              <div className="flex justify-between text-[#64748b]">
                <span>Name:</span> <span className="font-semibold text-[#0f172a]">{fullName}</span>
              </div>
              <div className="flex justify-between text-[#64748b]">
                <span>Contact:</span> <span className="font-semibold text-[#0f172a]">{contactNumber}</span>
              </div>
              <div className="flex justify-between text-[#64748b]">
                <span>Address:</span> <span className="font-semibold text-[#0f172a]">{address}</span>
              </div>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0f172a]">Service Specialty</span>
                <button onClick={() => setStep(2)} className="text-[#0d9488] font-bold">Edit</button>
              </div>
              <div className="flex justify-between text-[#64748b]">
                <span>Category:</span> <span className="font-semibold text-[#0f172a]">{category}</span>
              </div>
              <div className="flex justify-between text-[#64748b]">
                <span>Specialization:</span> <span className="font-semibold text-[#0f172a]">{specialization}</span>
              </div>
              <div className="flex justify-between text-[#64748b]">
                <span>Working Days:</span> <span className="font-semibold text-[#0f172a]">{workingDays.join(", ")}</span>
              </div>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0f172a]">Verified Documents</span>
                <button onClick={() => setStep(3)} className="text-[#0d9488] font-bold">Edit</button>
              </div>
              {Object.entries(docs).map(([k, v]) => (
                <div key={k} className="flex justify-between text-[#64748b]">
                  <span className="capitalize">{k}:</span>
                  <span className="font-mono text-[#0d9488]">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Step Footer Navigation */}
      <div className="bg-white border-t border-[#e2e8f0] p-4 flex gap-2 shrink-0">
        <button
          onClick={() => setStep((s) => s - 1)}
          className="flex-1 bg-[#f1f5f9] text-[#64748b] text-xs font-bold py-3 rounded-xl touch-manipulation"
        >
          Previous
        </button>

        {step < 5 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 4 && !termsAgreed}
            className="flex-1 bg-[#0d9488] text-white text-xs font-bold py-3 rounded-xl touch-manipulation active:brightness-90 disabled:opacity-50 shadow-xs"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmitFinal}
            disabled={submitting}
            className="flex-1 bg-[#0d9488] text-white text-xs font-bold py-3 rounded-xl touch-manipulation active:brightness-90 shadow-md"
          >
            {submitting ? "Submitting Application…" : "Submit Application"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Provider Dashboard Screen ────────────────────────────────────────────────
export function ProviderDashboardScreen({
  nav,
  goBack,
  provider,
  bookings,
  onSwitchToUserMode,
}: {
  nav: (s: Screen) => void;
  goBack: () => void;
  provider: Provider;
  bookings: Booking[];
  onSwitchToUserMode: () => void;
}) {
  const [accepting, setAccepting] = useState(provider.isAcceptingBookings);

  // Compute stats from bookings
  const providerBookings = bookings.filter((b) => b.providerId === provider.id);
  const pendingRequests = providerBookings.filter((b) => b.status === "Pending");
  const upcomingJobs = providerBookings.filter(
    (b) => b.status === "Accepted" || b.status === "On the Way" || b.status === "In Progress"
  );
  const completedJobs = providerBookings.filter((b) => b.status === "Completed");

  return (
    <div className="bg-[#f8fafc] flex flex-col size-full">
      {/* Header */}
      <div className="bg-[#115e59] px-6 pt-10 pb-5 shrink-0 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-[#ccfbf1] text-[11px] font-semibold uppercase tracking-wider">
              Service Provider Mode
            </span>
            <h2 className="text-xl font-bold tracking-tight" style={{ fontFamily: "Lexend Deca, sans-serif" }}>
              {provider.name}
            </h2>
          </div>
          <button
            onClick={onSwitchToUserMode}
            className="bg-white/15 border border-white/20 flex items-center gap-1.5 px-3 py-1.5 rounded-full touch-manipulation active:bg-white/25"
          >
            <span className="text-xs">🔄</span>
            <span className="text-white text-xs font-bold">User Mode</span>
          </button>
        </div>

        {/* Accepting Bookings Toggle */}
        <div className="bg-white/10 border border-white/15 rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-white text-xs font-bold">Accepting Bookings</span>
            <span className="text-[#ccfbf1] text-[10px]">
              {accepting ? "You are visible in client search" : "Hidden from client search"}
            </span>
          </div>
          <button
            onClick={() => setAccepting(!accepting)}
            className={`relative flex shrink-0 h-6 w-11 rounded-full transition-colors ${
              accepting ? "bg-[#14b8a6]" : "bg-white/30"
            }`}
          >
            <span
              className={`inline-block size-5 rounded-full bg-white shadow transform transition-transform ${
                accepting ? "translate-x-5" : "translate-x-0.5"
              } mt-0.5`}
            />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: "New Requests", val: pendingRequests.length, icon: "📋", col: "text-[#0f766e] bg-[#f0fdfa] border-[#ccfbf1]" },
            { label: "Upcoming Jobs", val: upcomingJobs.length, icon: "📅", col: "text-amber-700 bg-amber-50 border-amber-200" },
            { label: "Completed", val: provider.completedJobs + completedJobs.length, icon: "✅", col: "text-emerald-700 bg-emerald-50 border-emerald-200" },
            { label: "Avg Rating", val: `${provider.rating} ★`, icon: "⭐", col: "text-indigo-700 bg-indigo-50 border-indigo-200" },
          ].map((st) => (
            <div key={st.label} className={`border rounded-2xl p-3.5 flex flex-col gap-1 ${st.col}`}>
              <span className="text-lg">{st.icon}</span>
              <span className="text-xl font-bold">{st.val}</span>
              <span className="text-xs font-semibold">{st.label}</span>
            </div>
          ))}
        </div>

        {/* Quick Actions Grid */}
        <div className="flex flex-col gap-2">
          <span className="text-[#0f172a] text-xs font-bold uppercase tracking-wider">
            Quick Actions
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Requests", icon: "📋", screen: "provider-booking-request" as Screen },
              { label: "Availability", icon: "📅", screen: "provider-availability" as Screen },
              { label: "Reviews", icon: "⭐", screen: "provider-reviews" as Screen },
              { label: "Services", icon: "🛠️", screen: "provider-services" as Screen },
              { label: "Messages", icon: "💬", screen: "messaging" as Screen },
              { label: "Profile", icon: "👤", screen: "user-profile" as Screen },
            ].map((q) => (
              <button
                key={q.label}
                onClick={() => nav(q.screen)}
                className="bg-white border border-[#e2e8f0] flex flex-col items-center justify-center p-3 rounded-2xl gap-1 active:bg-slate-50 touch-manipulation shadow-xs"
              >
                <span className="text-lg">{q.icon}</span>
                <span className="text-[#0f172a] text-[11px] font-bold">{q.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Today's Jobs List */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[#0f172a] text-xs font-bold uppercase tracking-wider">
              Active Service Jobs
            </span>
            <button
              onClick={() => nav("provider-booking-request")}
              className="text-[#0d9488] text-xs font-bold hover:underline"
            >
              View All
            </button>
          </div>

          {upcomingJobs.length === 0 ? (
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 text-center text-xs text-[#64748b]">
              No active jobs at the moment.
            </div>
          ) : (
            upcomingJobs.map((b) => (
              <div
                key={b.id}
                className="bg-white border border-[#e2e8f0] rounded-2xl p-3.5 flex items-center justify-between shadow-xs"
              >
                <div className="flex flex-col">
                  <span className="text-[#0f172a] text-xs font-bold">{b.clientName}</span>
                  <span className="text-[#64748b] text-[11px]">{b.serviceDetail}</span>
                  <span className="text-[#0d9488] text-[10px] font-semibold">📅 {b.date} · {b.time}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="bg-[#ccfbf1] text-[#0f766e] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {b.status}
                  </span>
                  <button
                    onClick={() => nav("provider-booking-request")}
                    className="text-[#0d9488] text-[11px] font-bold hover:underline"
                  >
                    Manage →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ProviderBottomNav active="dashboard" nav={nav} requestCount={pendingRequests.length} />
    </div>
  );
}

// ─── Provider Availability Screen ─────────────────────────────────────────────
export function ProviderAvailabilityScreen({
  nav,
  goBack,
  provider,
  onSaveSchedule,
  onToast,
}: {
  nav: (s: Screen) => void;
  goBack: () => void;
  provider: Provider;
  onSaveSchedule: (workingDays: string[], hours: string) => void;
  onToast: (msg: string) => void;
}) {
  const [days, setDays] = useState<string[]>(provider.workingDays);
  const [startTime, setStartTime] = useState("8:00 AM");
  const [endTime, setEndTime] = useState("5:00 PM");
  const [accepting, setAccepting] = useState(provider.isAcceptingBookings);

  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const toggleDay = (d: string) => {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  const handleSave = () => {
    onSaveSchedule(days, `${startTime} – ${endTime}`);
    onToast("Working schedule updated successfully.");
  };

  return (
    <div className="bg-[#f8fafc] flex flex-col size-full">
      <div className="bg-[#115e59] flex items-center gap-3 px-5 pt-12 pb-5 shrink-0">
        <button
          onClick={goBack}
          className="bg-white/15 flex items-center justify-center rounded-xl size-9 active:bg-white/25 touch-manipulation text-white"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white text-lg font-bold flex-1" style={{ fontFamily: "Lexend Deca, sans-serif" }}>
          My Availability
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4">
        {/* Toggle */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[#0f172a] text-xs font-bold">Accepting Bookings</p>
            <p className="text-[#64748b] text-[11px]">Clients can schedule appointments</p>
          </div>
          <input
            type="checkbox"
            checked={accepting}
            onChange={(e) => setAccepting(e.target.checked)}
            className="accent-[#0d9488] size-5"
          />
        </div>

        {/* Working Days */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-2.5 shadow-xs">
          <span className="text-[#0f172a] text-xs font-bold uppercase tracking-wider">
            Working Days
          </span>
          <div className="flex flex-col gap-2">
            {allDays.map((d) => {
              const active = days.includes(d);
              return (
                <div
                  key={d}
                  onClick={() => toggleDay(d)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                    active ? "bg-[#f0fdfa] border-[#ccfbf1]" : "bg-[#f8fafc] border-[#e2e8f0]"
                  }`}
                >
                  <span className={`text-xs font-semibold ${active ? "text-[#0f766e]" : "text-[#64748b]"}`}>
                    {d}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      active ? "bg-[#0d9488] text-white" : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {active ? "Available" : "Day Off"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-2.5 shadow-xs">
          <span className="text-[#0f172a] text-xs font-bold uppercase tracking-wider">
            Operating Hours
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-[#64748b]">Start Time</span>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-[#f8fafc] border border-[#e2e8f0] h-10 px-2 rounded-xl outline-none"
              >
                <option>7:00 AM</option>
                <option>8:00 AM</option>
                <option>9:00 AM</option>
                <option>10:00 AM</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[#64748b]">End Time</span>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-[#f8fafc] border border-[#e2e8f0] h-10 px-2 rounded-xl outline-none"
              >
                <option>4:00 PM</option>
                <option>5:00 PM</option>
                <option>6:00 PM</option>
                <option>8:00 PM</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-[#e2e8f0]">
        <button
          onClick={handleSave}
          className="bg-[#0d9488] text-white text-xs font-bold py-3 rounded-xl w-full active:brightness-90 touch-manipulation shadow-md"
        >
          Save Availability
        </button>
      </div>

      <ProviderBottomNav active="availability" nav={nav} />
    </div>
  );
}

// ─── Provider Booking Requests & Active Job Status Progression ────────────────
export function ProviderBookingRequestScreen({
  nav,
  goBack,
  provider,
  bookings,
  onAcceptBooking,
  onDeclineBooking,
  onProgressJobStatus,
}: {
  nav: (s: Screen) => void;
  goBack: () => void;
  provider: Provider;
  bookings: Booking[];
  onAcceptBooking: (bookingId: string) => void;
  onDeclineBooking: (bookingId: string) => void;
  onProgressJobStatus: (bookingId: string, nextStatus: BookingStatus) => void;
}) {
  const providerBookings = bookings.filter((b) => b.providerId === provider.id);
  const activeAndPending = providerBookings.filter((b) => b.status !== "Cancelled");

  const statusWorkflow: Record<BookingStatus, BookingStatus | null> = {
    Pending: "Accepted",
    Accepted: "On the Way",
    "On the Way": "In Progress",
    "In Progress": "Completed",
    Completed: null,
    Cancelled: null,
  };

  return (
    <div className="bg-[#f8fafc] flex flex-col size-full">
      <div className="bg-[#115e59] flex items-center gap-3 px-5 pt-12 pb-5 shrink-0">
        <button
          onClick={goBack}
          className="bg-white/15 flex items-center justify-center rounded-xl size-9 active:bg-white/25 touch-manipulation text-white"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white text-lg font-bold flex-1" style={{ fontFamily: "Lexend Deca, sans-serif" }}>
          Booking Requests & Active Jobs
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-3.5">
        {activeAndPending.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <span className="text-3xl">📥</span>
            <p className="text-[#0f172a] text-sm font-bold">No incoming requests</p>
            <p className="text-[#64748b] text-xs">New client booking requests will appear here.</p>
          </div>
        ) : (
          activeAndPending.map((b) => {
            const nextStatus = statusWorkflow[b.status];
            return (
              <div
                key={b.id}
                className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-3 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-[#0f172a] text-sm font-bold">{b.clientName}</span>
                    <span className="text-[#0d9488] text-xs font-semibold">{b.serviceDetail}</span>
                    <span className="text-[#94a3b8] text-[10px] font-mono">ID: {b.id}</span>
                  </div>
                  <span className="bg-[#ccfbf1] text-[#0f766e] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#99f6e4]">
                    {b.status}
                  </span>
                </div>

                <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-2.5 text-xs flex flex-col gap-1">
                  <div>📅 <span className="font-semibold text-[#0f172a]">{b.date} at {b.time}</span></div>
                  <div>📍 <span className="text-[#64748b]">{b.address}</span></div>
                  <div>📞 <span className="text-[#64748b]">{b.clientPhone}</span></div>
                  {b.problemDescription && (
                    <div className="pt-1 text-[#475569] italic">
                      Notes: "{b.problemDescription}"
                    </div>
                  )}
                </div>

                {/* Status action buttons */}
                {b.status === "Pending" ? (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => onDeclineBooking(b.id)}
                      className="flex-1 border border-red-200 text-red-600 text-xs font-bold py-2 rounded-xl active:bg-red-50 touch-manipulation"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => onAcceptBooking(b.id)}
                      className="flex-1 bg-[#0d9488] text-white text-xs font-bold py-2 rounded-xl active:brightness-90 touch-manipulation shadow-xs"
                    >
                      Accept Booking
                    </button>
                  </div>
                ) : nextStatus ? (
                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      onClick={() => onProgressJobStatus(b.id, nextStatus)}
                      className="bg-[#0d9488] text-white text-xs font-bold py-2.5 rounded-xl active:brightness-90 touch-manipulation shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <span>🔄</span> Advance Job Status to: <strong>{nextStatus}</strong>
                    </button>
                    <span className="text-[10px] text-[#94a3b8] text-center">
                      Advancing updates client live tracking and booking history
                    </span>
                  </div>
                ) : (
                  <div className="text-emerald-700 bg-emerald-50 text-xs font-bold p-2 rounded-xl text-center">
                    ✓ Job Completed & Recorded
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <ProviderBottomNav active="requests" nav={nav} />
    </div>
  );
}

// ─── Provider Reviews Screen ──────────────────────────────────────────────────
export function ProviderReviewsScreen({
  nav,
  goBack,
  provider,
}: {
  nav: (s: Screen) => void;
  goBack: () => void;
  provider: Provider;
}) {
  return (
    <div className="bg-[#f8fafc] flex flex-col size-full">
      <div className="bg-[#115e59] flex items-center gap-3 px-5 pt-12 pb-5 shrink-0">
        <button
          onClick={goBack}
          className="bg-white/15 flex items-center justify-center rounded-xl size-9 active:bg-white/25 touch-manipulation text-white"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white text-lg font-bold flex-1" style={{ fontFamily: "Lexend Deca, sans-serif" }}>
          My Reviews & Rating
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4">
        {/* Rating Overview */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 flex items-center gap-5 shadow-xs">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-[#0f172a]">{provider.rating}</span>
            <div className="flex text-amber-400 text-xs">★★★★★</div>
            <span className="text-[#64748b] text-[10px] mt-0.5">{provider.reviewCount} reviews</span>
          </div>

          <div className="flex-1 flex flex-col gap-1 text-[10px] text-[#64748b]">
            <div className="flex items-center gap-2">
              <span>5★</span>
              <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#0d9488] h-full w-[88%]" />
              </div>
              <span>88%</span>
            </div>
            <div className="flex items-center gap-2">
              <span>4★</span>
              <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#0d9488] h-full w-[10%]" />
              </div>
              <span>10%</span>
            </div>
            <div className="flex items-center gap-2">
              <span>3★</span>
              <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#0d9488] h-full w-[2%]" />
              </div>
              <span>2%</span>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="flex flex-col gap-3">
          <span className="text-[#0f172a] text-xs font-bold uppercase tracking-wider">
            Recent Client Feedback
          </span>
          {provider.reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-1.5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[#0f172a] text-xs font-bold">{r.userName}</span>
                <span className="text-[#94a3b8] text-[10px]">{r.date}</span>
              </div>
              <div className="flex text-amber-400 text-xs">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-[#475569] text-xs leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>

      <ProviderBottomNav active="reviews" nav={nav} />
    </div>
  );
}

// ─── Provider Services Screen ─────────────────────────────────────────────────
export function ProviderServicesScreen({
  goBack,
  provider,
  onSaveServices,
  onToast,
}: {
  goBack: () => void;
  provider: Provider;
  onSaveServices: (category: string, spec: string, rate: number, desc: string) => void;
  onToast: (msg: string) => void;
}) {
  const [cat, setCat] = useState(provider.category);
  const [spec, setSpec] = useState(provider.specialization);
  const [rate, setRate] = useState(provider.hourlyRate.toString());
  const [desc, setDesc] = useState(provider.description);

  const handleSave = () => {
    onSaveServices(cat, spec, parseInt(rate) || 350, desc);
    onToast("Specialist profile & services updated!");
    goBack();
  };

  return (
    <div className="bg-[#f8fafc] flex flex-col size-full">
      <div className="bg-[#115e59] flex items-center gap-3 px-5 pt-12 pb-5 shrink-0">
        <button
          onClick={goBack}
          className="bg-white/15 flex items-center justify-center rounded-xl size-9 active:bg-white/25 touch-manipulation text-white"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white text-lg font-bold flex-1" style={{ fontFamily: "Lexend Deca, sans-serif" }}>
          My Services & Rates
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-3.5">
        <div className="flex flex-col gap-1">
          <label className="text-[#0f172a] text-xs font-bold">Category</label>
          <input
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="bg-white border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[#0f172a] text-xs font-bold">Specialization</label>
          <input
            value={spec}
            onChange={(e) => setSpec(e.target.value)}
            className="bg-white border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[#0f172a] text-xs font-bold">Hourly Rate (₱)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="bg-white border border-[#e2e8f0] h-10 px-3 rounded-xl text-xs outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[#0f172a] text-xs font-bold">Bio & Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="bg-white border border-[#e2e8f0] h-28 p-3 rounded-xl text-xs outline-none resize-none leading-relaxed"
          />
        </div>
      </div>

      <div className="p-4 bg-white border-t border-[#e2e8f0]">
        <button
          onClick={handleSave}
          className="bg-[#0d9488] text-white text-xs font-bold py-3 rounded-xl w-full active:brightness-90 touch-manipulation shadow-md"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
