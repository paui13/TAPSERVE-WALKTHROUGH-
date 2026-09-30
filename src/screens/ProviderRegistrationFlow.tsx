import React, { useState, useEffect, useMemo } from "react";
import { Screen } from "../types";
import {
  UserAccount,
  ProviderApplicationData,
  AppStorage,
  INITIAL_CATEGORIES,
} from "../data/mockData";
import { TapServeLogo, TapServeIcon } from "../components/SharedUI";

// ─── TYPES & INTERFACES ────────────────────────────────────────────────────────

interface FormErrors {
  [key: string]: string;
}

export interface ProviderRegistrationFlowProps {
  nav: (s: Screen) => void;
  goBack: () => void;
  currentUser: UserAccount;
  onSubmitApplication: (appData: ProviderApplicationData) => void;
  onToast: (msg: string) => void;
  initialStep?: number;
}

// Preset avatars for quick demo selection
const DEMO_AVATARS = [
  { id: "av1", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256", label: "Maria" },
  { id: "av2", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256", label: "Reynaldo" },
  { id: "av3", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256", label: "Elena" },
  { id: "av4", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256", label: "Pedro" },
];

export const SAN_PABLO_SERVICE_ZONES = [
  "All San Pablo City (City-Wide Coverage)",
  "Poblacion / City Proper (Districts I–VII)",
  "San Francisco & Calihan Zone",
  "San Roque, Soledad & San Antonio",
  "Concepcion & Del Remedio District",
  "San Jose & Malamig Corridor",
  "Santa Veronica & San Gabriel",
  "San Cristobal & San Ignacio",
  "Sampaloc Lake & City Center",
  "Seven Lakes Eco-Tourism Belt",
  "San Diego & Dolores Highway",
  "Bautista, Santa Maria & San Bartolome",
];

const LAGUNA_MUNICIPALITIES = [
  "San Pablo City",
];

const SAN_PABLO_BARANGAYS = [
  "San Francisco Calihan",
  "San Roque",
  "Concepcion",
  "Del Remedio",
  "San Jose",
  "Santa Veronica",
  "San Gabriel",
  "Barangay I-A",
  "Barangay II-B",
  "San Cristobal",
  "Soledad",
];

const CATEGORY_SKILLS_MAP: Record<string, string[]> = {
  "House Cleaning": ["General Housekeeping", "Disinfection", "Kitchen Deep Clean", "Window & Glass Detailing"],
  "Deep Cleaning": ["Post-Construction Cleaning", "Move-In Sanitization", "Mattress & Sofa Extraction", "Grease Trap Cleaning"],
  "Plumbing": ["Pipe Leak Repair", "Drain & Sink Unclogging", "Faucet & Shower Install", "Toilet Tank Repair", "Water Pump Maintenance"],
  "Electrical Services": ["Breaker & Wiring Repair", "Lighting & Outlet Install", "Short Circuit Troubleshooting", "Ceiling Fan Setup"],
  "Aircon Cleaning": ["Split-Type Chemical Wash", "Window-Type Cleaning", "Freon Leak Diagnostics", "Filter Replacement"],
  "Appliance Repair": ["Refrigerator Diagnostics", "Washing Machine Repair", "Microwave & Oven Fix", "Water Dispenser Service"],
  "Carpentry": ["Cabinet Repair & Assembly", "Door Lock & Hinge Fitting", "Wood Furniture Restoration", "Ceiling Partition"],
  "Home Maintenance": ["Minor Painting Touchups", "Roof Sealant / Gutter Repair", "Pressure Washing", "Door & Screen Mesh Repair"],
  "Gardening": ["Lawn Mowing & Edging", "Hedge & Tree Trimming", "Garden Landscaping", "Pest & Weed Spraying"],
};

// ─── MAIN PROVIDER REGISTRATION FLOW COMPONENT ─────────────────────────────────

export function ProviderApplyScreen({
  nav,
  goBack,
  currentUser,
  onSubmitApplication,
  onToast,
  initialStep = 1,
}: ProviderRegistrationFlowProps) {
  // Step tracker: 1 to 10
  // 1: Account, 2: Personal, 3: Services, 4: Experience, 5: Area, 6: Availability, 7: Identity, 8: Pricing, 9: Review, 10: Success
  const [step, setStep] = useState<number>(initialStep);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [applicationId, setApplicationId] = useState<string>("TSP-2026-00124");

  // Step 1: Account Information
  const [firstName, setFirstName] = useState("Maria");
  const [lastName, setLastName] = useState("Santos");
  const [email, setEmail] = useState(currentUser.email || "maria.specialist@tapserve.demo");
  const [mobileNumber, setMobileNumber] = useState("+63 917 555 1234");
  const [password, setPassword] = useState("TapServe2026!");
  const [confirmPassword, setConfirmPassword] = useState("TapServe2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeNotifications, setAgreeNotifications] = useState(true);

  // Step 2: Personal Information
  const [profilePhoto, setProfilePhoto] = useState(DEMO_AVATARS[0].url);
  const [photoName, setPhotoName] = useState("maria_profile.jpg");
  const [address, setAddress] = useState("Blk 12 Lot 4, Villa Antonio Subd.");
  const [province, setProvince] = useState("Laguna");
  const [city, setCity] = useState("San Pablo City");
  const [barangay, setBarangay] = useState("San Francisco Calihan");
  const [dob, setDob] = useState("1990-05-14");
  const [gender, setGender] = useState("Female");
  const [emergencyName, setEmergencyName] = useState("Roberto Santos");
  const [emergencyPhone, setEmergencyPhone] = useState("+63 918 889 1122");

  // Step 3: Service Information
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "House Cleaning",
    "Deep Cleaning",
  ]);
  const [otherCategorySpecified, setOtherCategorySpecified] = useState("");

  // Step 4: Experience & Skills
  const [yearsExperience, setYearsExperience] = useState("3–5 years");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "General Housekeeping",
    "Disinfection",
    "Kitchen Deep Clean",
  ]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [professionalBio, setProfessionalBio] = useState(
    "Accredited cleaning professional with over 4 years of verified experience in residential sanitization, kitchen deep cleans, and post-tenancy disinfection across San Pablo City."
  );
  const [previousEmployer, setPreviousEmployer] = useState("CleanPro Laguna Services");
  const [trainingCert, setTrainingCert] = useState("TESDA Housekeeping NC II Accreditation");

  // Step 5: Service Area (San Pablo City Only)
  const [serviceAreas, setServiceAreas] = useState<string[]>([
    "All San Pablo City (City-Wide Coverage)",
    "Poblacion / City Proper (Districts I–VII)",
    "San Francisco & Calihan Zone",
  ]);
  const [maxTravelDistance, setMaxTravelDistance] = useState("12 km");

  // Step 6: Availability
  const [weeklyAvailability, setWeeklyAvailability] = useState<
    Record<string, { available: boolean; start: string; end: string }>
  >({
    Monday: { available: true, start: "8:00 AM", end: "5:00 PM" },
    Tuesday: { available: true, start: "8:00 AM", end: "5:00 PM" },
    Wednesday: { available: true, start: "8:00 AM", end: "5:00 PM" },
    Thursday: { available: true, start: "8:00 AM", end: "5:00 PM" },
    Friday: { available: true, start: "8:00 AM", end: "5:00 PM" },
    Saturday: { available: true, start: "8:00 AM", end: "4:00 PM" },
    Sunday: { available: false, start: "9:00 AM", end: "3:00 PM" },
  });
  const [acceptEmergencyBookings, setAcceptEmergencyBookings] = useState(true);
  const [preferredNotice, setPreferredNotice] = useState("Same day");

  // Step 7: Identity & Credentials
  const [idType, setIdType] = useState("National ID (PhilSys)");
  const [idNumber, setIdNumber] = useState("PhilSys 7192-3841-9920");
  const [idFrontUploaded, setIdFrontUploaded] = useState(true);
  const [idBackUploaded, setIdBackUploaded] = useState(true);
  const [selfieUploaded, setSelfieUploaded] = useState(true);
  const [credentialUploaded, setCredentialUploaded] = useState(true);
  const [credentialType, setCredentialType] = useState("TESDA NC II Certificate");

  // Step 8: Pricing & Accreditation (50% Off 1st Year Promo)
  const [servicePricing, setServicePricing] = useState<
    Record<string, { price: number; type: "Fixed" | "Starting From" | "Per Hour" }>
  >({
    "House Cleaning": { price: 500, type: "Starting From" },
    "Deep Cleaning": { price: 850, type: "Starting From" },
  });
  const [subscriptionPlan, setSubscriptionPlan] = useState<"monthly" | "yearly">("yearly");
  const [subscriptionPaymentMethod, setSubscriptionPaymentMethod] = useState<string>("GCash");

  // Step 9: Terms & Review
  const [certifyTrue, setCertifyTrue] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreePrivacy, setAgreePrivacy] = useState(true);
  const [understandReview, setUnderstandReview] = useState(true);

  // Form Validation Errors
  const [errors, setErrors] = useState<FormErrors>({});

  // ─── RESTORE SAVED DRAFT ON MOUNT ────────────────────────────────────────────
  useEffect(() => {
    try {
      const draft = AppStorage.getProviderApplicationDraft();
      if (draft) {
        if (draft.firstName) setFirstName(draft.firstName);
        if (draft.lastName) setLastName(draft.lastName);
        if (draft.email) setEmail(draft.email);
        if (draft.contactNumber) setMobileNumber(draft.contactNumber);
        if (draft.address) setAddress(draft.address);
        if (draft.barangay) setBarangay(draft.barangay);
        if (draft.city) setCity(draft.city);
        if (draft.province) setProvince(draft.province);
        if (draft.dob) setDob(draft.dob);
        if (draft.gender) setGender(draft.gender);
        if (draft.categories && draft.categories.length > 0) setSelectedCategories(draft.categories);
        if (draft.skills && draft.skills.length > 0) setSelectedSkills(draft.skills);
        if (draft.description) setProfessionalBio(draft.description);
        if (draft.serviceAreas && draft.serviceAreas.length > 0) setServiceAreas(draft.serviceAreas);
        if (draft.maxTravelDistance) setMaxTravelDistance(draft.maxTravelDistance);
        if (draft.pricing) setServicePricing(draft.pricing);
        if (draft.subscriptionPlan) setSubscriptionPlan(draft.subscriptionPlan);
        if (draft.subscriptionPaymentMethod) setSubscriptionPaymentMethod(draft.subscriptionPaymentMethod);
        if (draft.idType) setIdType(draft.idType);
        if (draft.idNumber) setIdNumber(draft.idNumber);
        if (draft.step && draft.step < 10) setStep(draft.step);
      }
    } catch {
      // ignore
    }
  }, []);

  // Update Pricing when Categories change
  useEffect(() => {
    setServicePricing((prev) => {
      const updated = { ...prev };
      selectedCategories.forEach((cat) => {
        if (!updated[cat]) {
          const defaultPrice =
            cat.includes("Deep") ? 800 : cat.includes("Plumbing") ? 650 : cat.includes("Electrical") ? 750 : cat.includes("Aircon") ? 600 : 500;
          updated[cat] = { price: defaultPrice, type: "Starting From" };
        }
      });
      return updated;
    });
  }, [selectedCategories]);

  // Save progress draft helper
  const handleSaveDraft = () => {
    const draft = {
      step,
      firstName,
      lastName,
      email,
      contactNumber: mobileNumber,
      address,
      province,
      city,
      barangay,
      dob,
      gender,
      emergencyContactName: emergencyName,
      emergencyContactNumber: emergencyPhone,
      categories: selectedCategories,
      otherCategorySpecified,
      yearsExperience,
      skills: selectedSkills,
      description: professionalBio,
      previousEmployer,
      trainingCertification: trainingCert,
      serviceAreas,
      maxTravelDistance,
      weeklyAvailability,
      acceptEmergencyBookings,
      preferredNotice,
      idType,
      idNumber,
      pricing: servicePricing,
      subscriptionPlan,
      subscriptionPaymentMethod,
      savedAt: new Date().toLocaleTimeString(),
    };
    AppStorage.saveProviderApplicationDraft(draft);
    onToast("Progress saved! You can resume your application anytime.");
  };

  // ─── VALIDATION ENGINE PER STEP ──────────────────────────────────────────────
  const validateStep = (currentStep: number): boolean => {
    const newErrors: FormErrors = {};

    if (currentStep === 1) {
      if (!firstName.trim()) newErrors.firstName = "First name is required";
      if (!lastName.trim()) newErrors.lastName = "Last name is required";
      if (!email.trim() || !email.includes("@") || !email.includes(".")) {
        newErrors.email = "Please enter a valid email address";
      }
      if (!mobileNumber.trim() || mobileNumber.replace(/\D/g, "").length < 10) {
        newErrors.mobileNumber = "Enter a valid 11-digit mobile number (+63...)";
      }
      if (!password || password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/\d/.test(password)) {
        newErrors.password = "Password must include at least one number";
      } else if (!/[A-Z]/.test(password)) {
        newErrors.password = "Password must include at least one uppercase letter";
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (currentStep === 2) {
      if (!address.trim()) newErrors.address = "Complete address is required";
      if (!barangay.trim()) newErrors.barangay = "Barangay is required";
      if (!city.trim()) newErrors.city = "City / Municipality is required";
      if (!province.trim()) newErrors.province = "Province is required";
      if (!dob) newErrors.dob = "Date of birth is required";
      if (!emergencyName.trim()) newErrors.emergencyName = "Emergency contact name is required";
      if (!emergencyPhone.trim()) newErrors.emergencyPhone = "Emergency contact number is required";
    }

    if (currentStep === 3) {
      if (selectedCategories.length === 0) {
        newErrors.categories = "Please select at least one service category";
      }
      if (selectedCategories.includes("Other") && !otherCategorySpecified.trim()) {
        newErrors.otherCategory = "Please specify your custom service trade";
      }
    }

    if (currentStep === 4) {
      if (!yearsExperience) newErrors.yearsExperience = "Please select your years of experience";
      if (!professionalBio.trim() || professionalBio.trim().length < 20) {
        newErrors.professionalBio = "Please enter a professional bio of at least 20 characters";
      }
    }

    // Step 5 is Availability & Schedule (no required errors needed)

    if (currentStep === 6) {
      // Step 6: Identity & Credentials
      if (!idType) newErrors.idType = "Please select your government ID type";
      if (!idNumber.trim()) newErrors.idNumber = "Government ID number is required";
      if (!idFrontUploaded) newErrors.idFront = "Front photo of your government ID is required";
      if (!selfieUploaded) newErrors.selfie = "Verification selfie holding your ID is required";
    }

    if (currentStep === 7) {
      // Step 7: Pricing & Accreditation
      for (const cat of selectedCategories) {
        const item = servicePricing[cat];
        if (!item || item.price <= 0 || isNaN(item.price)) {
          newErrors[`price_${cat}`] = `Starting price for ${cat} must be greater than ₱0`;
        }
      }
    }

    if (currentStep === 8) {
      // Step 8: Terms & Review
      if (!certifyTrue) newErrors.certify = "You must certify the accuracy of your information";
      if (!agreeTerms) newErrors.terms = "You must agree to the Service Provider Terms";
      if (!agreePrivacy) newErrors.privacy = "You must agree to the Privacy Policy";
      if (!understandReview) newErrors.review = "You must acknowledge the verification review process";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setErrors({});
      setStep((prev) => Math.min(prev + 1, 8));
      // Auto save draft after passing validation
      try {
        const draft = {
          step: step + 1,
          firstName,
          lastName,
          email,
          contactNumber: mobileNumber,
          address,
          province,
          city,
          barangay,
          dob,
          gender,
          categories: selectedCategories,
          skills: selectedSkills,
          description: professionalBio,
          serviceAreas: ["San Pablo City (City-Wide)"],
          maxTravelDistance: "City-Wide",
          pricing: servicePricing,
          subscriptionPlan,
          subscriptionPaymentMethod,
          idType,
          idNumber,
        };
        AppStorage.saveProviderApplicationDraft(draft);
      } catch {
        // ignore
      }
    } else {
      onToast("Please correct the errors before proceeding.");
    }
  };

  const handlePrevStep = () => {
    setErrors({});
    if (step === 1) {
      goBack();
    } else {
      setStep((prev) => Math.max(prev - 1, 1));
    }
  };

  // ─── FINAL SUBMISSION ────────────────────────────────────────────────────────
  const handleFinalSubmit = () => {
    if (!validateStep(8)) {
      onToast("Please accept all required agreements to submit your application.");
      return;
    }

    setSubmitting(true);
    setShowConfirmModal(false);

    setTimeout(() => {
      setSubmitting(false);

      const generatedAppId = `TSP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      setApplicationId(generatedAppId);

      const finalAppData: ProviderApplicationData = {
        applicationId: generatedAppId,
        fullName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        dob,
        address: `${address}, Brgy. ${barangay}, ${city}, ${province}`,
        province,
        city,
        barangay,
        contactNumber: mobileNumber,
        email,
        gender,
        emergencyContactName: emergencyName,
        emergencyContactNumber: emergencyPhone,
        profilePhotoName: photoName,
        category: selectedCategories[0] || "General Services",
        categories: selectedCategories,
        otherCategorySpecified,
        specialization: selectedSkills.slice(0, 3).join(", ") || "Accredited Specialist",
        yearsExperience,
        skills: selectedSkills,
        description: professionalBio,
        previousEmployer,
        trainingCertification: trainingCert,
        serviceArea: serviceAreas.join(", "),
        serviceAreas,
        maxTravelDistance,
        workingDays: Object.keys(weeklyAvailability).filter((d) => weeklyAvailability[d].available),
        workingHours: "8:00 AM – 5:00 PM",
        acceptEmergencyBookings,
        preferredNotice,
        idType,
        idNumber,
        idFrontFile: `${idType.replace(/\s+/g, "_")}_Front.png`,
        idBackFile: `${idType.replace(/\s+/g, "_")}_Back.png`,
        selfieFile: "selfie_verification.jpg",
        credentialFile: `${credentialType.replace(/\s+/g, "_")}.pdf`,
        documents: {
          govId: `${idType.replace(/\s+/g, "_")}_ID.pdf`,
          proofAddress: `Barangay_${barangay.replace(/\s+/g, "_")}_Clearance.pdf`,
          certifications: `${credentialType.replace(/\s+/g, "_")}.pdf`,
          barangayClearance: "Barangay_Clearance_San_Pablo.pdf",
        },
        pricing: servicePricing,
        subscriptionPlan,
        subscriptionPaymentMethod,
        subscriptionFee: subscriptionPlan === "yearly" ? 500 : 60,
        termsAgreed: true,
        status: "Under Review",
        submittedAt: "Oct 12, 2026",
      };

      // 1. Submit through App.tsx handler
      onSubmitApplication(finalAppData);

      // 2. Connect to Admin Credentials system!
      try {
        const existingCreds = AppStorage.getCredentials() || [];
        const newAdminCredItem = {
          id: `cred-${Date.now()}`,
          name: `${firstName} ${lastName}`,
          initials: `${firstName[0] || "S"}${lastName[0] || "P"}`,
          avatarBg: "bg-teal-600",
          serviceType: selectedCategories.join(", "),
          submittedDate: "Just now",
          providedDocs: "Government ID, Selfie, Credentials",
          status: "Pending",
          phone: mobileNumber,
          email,
          experience: `${yearsExperience} • ${subscriptionPlan === "yearly" ? "Annual (₱500/yr)" : "Monthly (₱60/mo)"} • ${professionalBio.slice(0, 45)}...`,
          docsList: [
            {
              id: `doc-${Date.now()}-1`,
              title: idType,
              type: "Government ID",
              verified: false,
              status: "Pending Review",
              docNumber: idNumber,
              issuedDate: "Jan 12, 2024",
              expiryDate: "Permanent / Valid",
              issuingAuthority: "Republic of the Philippines",
              documentCategory: "government_id",
              fileFormat: "PNG",
              fileSize: "2.4 MB",
              notes: "Front and back submitted during specialist onboarding.",
            },
            {
              id: `doc-${Date.now()}-2`,
              title: "Selfie Holding ID",
              type: "Identity Verification",
              verified: false,
              status: "Pending Review",
              docNumber: "BIOMETRIC-FACE-01",
              issuedDate: "Just now",
              issuingAuthority: "TapServe Verification Engine",
              documentCategory: "clearance",
              fileFormat: "PNG",
              fileSize: "1.9 MB",
              notes: "Applicant selfie with physical government ID for visual facial matching.",
            },
            {
              id: `doc-${Date.now()}-3`,
              title: credentialType || "Trade Certificate",
              type: "Trade Certification",
              verified: false,
              status: "Pending Review",
              docNumber: "NC2-TESDA-2026-9921",
              issuedDate: "Sep 15, 2023",
              expiryDate: "Sep 15, 2028",
              issuingAuthority: "TESDA Regional Center IV-A",
              documentCategory: "tesda",
              fileFormat: "PDF",
              fileSize: "2.2 MB",
              notes: "Skills certification accreditation.",
            },
          ],
        };

        // Insert at the top of admin credential list
        const updatedCreds = [newAdminCredItem, ...existingCreds.filter((c: any) => c.email !== email)];
        AppStorage.saveCredentials(updatedCreds);
      } catch (err) {
        console.error("Error staging credential for admin", err);
      }

      // 3. Clear draft
      AppStorage.saveProviderApplicationDraft(null);

      // 4. Move to Success Screen (Step 9)
      setStep(9);
      onToast("Application submitted successfully! Your credentials are now under review.");
    }, 900);
  };

  // ─── STEP 9: SUCCESS SCREEN ─────────────────────────────────────────────────
  if (step === 9) {
    return (
      <div className="bg-[#F8FAFA] flex flex-col size-full font-sans select-none">
        <header className="bg-[#115E59] text-white px-5 pt-12 pb-4 shrink-0 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-white/10 flex items-center justify-center p-1">
              <TapServeLogo size={24} />
            </div>
            <span className="font-bold text-sm tracking-tight">TapServe Specialist Onboarding</span>
          </div>
          <button
            onClick={() => nav("home")}
            className="text-xs text-[#CCFBF1] font-semibold hover:underline cursor-pointer"
          >
            Home
          </button>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col items-center justify-center text-center gap-5">
          {/* Animated checkmark circle */}
          <div className="relative">
            <div className="size-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-4xl shadow-inner border-4 border-emerald-300 animate-in zoom-in-75 duration-300">
              ✓
            </div>
            <span className="absolute -bottom-1 -right-1 size-8 rounded-full bg-[#115E59] text-white text-base flex items-center justify-center shadow-md">
              ⭐
            </span>
          </div>

          <div className="flex flex-col gap-1.5 max-w-xs">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0F766E] bg-teal-50 px-3 py-1 rounded-full border border-teal-200 self-center">
              Application Under Review
            </span>
            <h1 className="text-xl font-black text-[#1F2937] tracking-tight">
              Application Submitted!
            </h1>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Thank you for applying to become a <strong>TapServe Service Provider</strong>. Your credentials and clearances have been received and forwarded to our compliance team.
            </p>
          </div>

          {/* Reference Card */}
          <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-4 text-left shadow-xs flex flex-col gap-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-[#F3F4F6] text-xs">
              <span className="text-[#6B7280]">Application ID:</span>
              <span className="font-mono font-bold text-[#115E59]">{applicationId}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#F3F4F6] text-xs">
              <span className="text-[#6B7280]">Applicant Name:</span>
              <span className="font-semibold text-[#1F2937]">{firstName} {lastName}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#F3F4F6] text-xs">
              <span className="text-[#6B7280]">Selected Services:</span>
              <span className="font-semibold text-[#1F2937] text-right truncate max-w-[180px]">
                {selectedCategories.join(", ")}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#6B7280]">Estimated Review Time:</span>
              <span className="font-semibold text-[#0F766E]">24 – 48 Hours</span>
            </div>
          </div>

          {/* Notice Banner */}
          <div className="w-full bg-teal-50/70 border border-teal-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-left text-xs text-[#0F766E]">
            <span className="text-base shrink-0">📱</span>
            <p className="text-[11px] leading-relaxed">
              We&apos;ll notify you via SMS (<strong>{mobileNumber}</strong>) and email once your specialist account is verified.
            </p>
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col gap-2.5 mt-2">
            <button
              onClick={() => nav("provider-apply-status")}
              className="w-full py-3.5 bg-[#115E59] hover:bg-[#0F766E] text-white font-bold text-xs rounded-2xl shadow-md cursor-pointer transition-colors active:scale-[0.99]"
            >
              View Application Status →
            </button>
            <button
              onClick={() => nav("home")}
              className="w-full py-3 bg-white border border-[#E5E7EB] text-[#1F2937] hover:bg-slate-50 font-bold text-xs rounded-2xl cursor-pointer transition-colors"
            >
              Back to Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ─── STEPS 1 TO 8 CONTAINER ─────────────────────────────────────────────────
  const stepTitles = [
    "",
    "Account Information",
    "Personal Information",
    "Service Information",
    "Experience & Skills",
    "Availability & Hours",
    "Identity & Credentials",
    "Rates & Accreditation",
    "Review & Submit",
  ];

  return (
    <div className="bg-[#F8FAFA] flex flex-col size-full font-sans select-none relative overflow-hidden">
      {/* ─── STICKY HEADER WITH PROGRESS INDICATOR ─── */}
      <header className="bg-white border-b border-[#E5E7EB] px-5 pt-11 pb-3 shrink-0 flex flex-col gap-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrevStep}
              className="size-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-xs text-[#1F2937] cursor-pointer transition-colors"
              aria-label="Back"
            >
              ←
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F766E]">
                Step {step} of 8
              </span>
              <span className="text-xs font-bold text-[#1F2937] truncate max-w-[200px]">
                {stepTitles[step]}
              </span>
            </div>
          </div>

          {/* Save & Continue Later Demo Trigger */}
          <button
            type="button"
            onClick={handleSaveDraft}
            className="text-[11px] font-bold text-[#0F766E] hover:text-[#115E59] bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors flex items-center gap-1 shadow-2xs"
            title="Save progress to finish later"
          >
            <span>💾</span>
            <span className="hidden xs:inline">Save Draft</span>
          </button>
        </div>

        {/* Progress Bar (8 Steps) */}
        <div className="flex gap-1 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? "bg-[#115E59]" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </header>

      {/* ─── SCROLLABLE STEP BODY ─── */}
      <main className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4 text-xs">
        {/* ─── STEP 1: ACCOUNT INFORMATION ─── */}
        {step === 1 && (
          <div className="flex flex-col gap-3.5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-black text-[#1F2937] tracking-tight">
                Create your provider account
              </h2>
              <p className="text-[#6B7280] text-[11px] mt-0.5">
                Set up your credentials to manage your business on TapServe.
              </p>
            </div>

            {/* Name Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#1F2937]">First Name *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Maria"
                  className={`bg-white border p-2.5 rounded-xl text-xs outline-none transition-all ${
                    errors.firstName ? "border-rose-500 ring-1 ring-rose-200" : "border-[#E5E7EB] focus:border-[#115E59]"
                  }`}
                />
                {errors.firstName && <span className="text-[10px] text-rose-600 font-semibold">{errors.firstName}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#1F2937]">Last Name *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Santos"
                  className={`bg-white border p-2.5 rounded-xl text-xs outline-none transition-all ${
                    errors.lastName ? "border-rose-500 ring-1 ring-rose-200" : "border-[#E5E7EB] focus:border-[#115E59]"
                  }`}
                />
                {errors.lastName && <span className="text-[10px] text-rose-600 font-semibold">{errors.lastName}</span>}
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[#1F2937]">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="specialist@tapserve.demo"
                className={`bg-white border p-2.5 rounded-xl text-xs outline-none transition-all ${
                  errors.email ? "border-rose-500 ring-1 ring-rose-200" : "border-[#E5E7EB] focus:border-[#115E59]"
                }`}
              />
              {errors.email && <span className="text-[10px] text-rose-600 font-semibold">{errors.email}</span>}
            </div>

            {/* Mobile Number */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[#1F2937]">Mobile Number *</label>
              <div className="flex">
                <span className="bg-slate-100 border border-r-0 border-[#E5E7EB] px-3 py-2.5 rounded-l-xl font-bold text-slate-500 flex items-center text-xs">
                  🇵🇭 +63
                </span>
                <input
                  type="tel"
                  value={mobileNumber.replace(/^\+63\s?/, "")}
                  onChange={(e) => setMobileNumber(`+63 ${e.target.value}`)}
                  placeholder="917 555 1234"
                  className={`bg-white border p-2.5 rounded-r-xl text-xs flex-1 outline-none transition-all ${
                    errors.mobileNumber ? "border-rose-500 ring-1 ring-rose-200" : "border-[#E5E7EB] focus:border-[#115E59]"
                  }`}
                />
              </div>
              {errors.mobileNumber && <span className="text-[10px] text-rose-600 font-semibold">{errors.mobileNumber}</span>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="font-bold text-[#1F2937]">Password *</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] font-bold text-[#0F766E] hover:underline cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter strong password"
                className={`bg-white border p-2.5 rounded-xl text-xs outline-none transition-all ${
                  errors.password ? "border-rose-500 ring-1 ring-rose-200" : "border-[#E5E7EB] focus:border-[#115E59]"
                }`}
              />
              {errors.password && <span className="text-[10px] text-rose-600 font-semibold">{errors.password}</span>}

              {/* Password Requirements Checklist */}
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex flex-col gap-1 mt-1 text-[10px]">
                <span className="font-bold text-slate-600">Password requirements:</span>
                <div className="grid grid-cols-1 gap-0.5">
                  <span className={`flex items-center gap-1.5 ${password.length >= 8 ? "text-emerald-700 font-bold" : "text-slate-400"}`}>
                    {password.length >= 8 ? "✓" : "○"} Minimum 8 characters
                  </span>
                  <span className={`flex items-center gap-1.5 ${/\d/.test(password) ? "text-emerald-700 font-bold" : "text-slate-400"}`}>
                    {/\d/.test(password) ? "✓" : "○"} At least one number (0-9)
                  </span>
                  <span className={`flex items-center gap-1.5 ${/[A-Z]/.test(password) ? "text-emerald-700 font-bold" : "text-slate-400"}`}>
                    {/[A-Z]/.test(password) ? "✓" : "○"} At least one uppercase letter (A-Z)
                  </span>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="font-bold text-[#1F2937]">Confirm Password *</label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-[11px] font-bold text-[#0F766E] hover:underline cursor-pointer"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type password"
                className={`bg-white border p-2.5 rounded-xl text-xs outline-none transition-all ${
                  errors.confirmPassword ? "border-rose-500 ring-1 ring-rose-200" : "border-[#E5E7EB] focus:border-[#115E59]"
                }`}
              />
              {errors.confirmPassword && (
                <span className="text-[10px] text-rose-600 font-semibold">{errors.confirmPassword}</span>
              )}
            </div>

            {/* Notification Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer bg-white p-3 rounded-xl border border-[#E5E7EB] mt-1 shadow-2xs">
              <input
                type="checkbox"
                checked={agreeNotifications}
                onChange={(e) => setAgreeNotifications(e.target.checked)}
                className="size-4 accent-[#115E59] mt-0.5 cursor-pointer"
              />
              <span className="text-[11px] text-[#4B5563] leading-relaxed">
                I agree to receive account, security, and customer booking alerts from TapServe via SMS & Email.
              </span>
            </label>

            {/* Sign in alternative link */}
            <div className="text-center pt-2">
              <span className="text-[#6B7280] text-[11px]">Already have an account? </span>
              <button
                type="button"
                onClick={() => nav("login")}
                className="text-[#0F766E] font-bold text-[11px] hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 2: PERSONAL INFORMATION ─── */}
        {step === 2 && (
          <div className="flex flex-col gap-3.5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-black text-[#1F2937] tracking-tight">
                Tell us about yourself
              </h2>
              <p className="text-[#6B7280] text-[11px] mt-0.5">
                Provide your residential and emergency contact information.
              </p>
            </div>

            {/* Profile Photo Upload / Picker */}
            <div className="bg-white border border-[#E5E7EB] p-4 rounded-2xl flex flex-col gap-2.5 shadow-2xs">
              <label className="font-bold text-[#1F2937] block">Specialist Profile Photo *</label>
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="size-16 rounded-2xl object-cover border-2 border-[#115E59] shadow-xs"
                  />
                  <span className="absolute -bottom-1 -right-1 size-5 bg-[#115E59] text-white rounded-full flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-[#1F2937]">{photoName}</span>
                  <span className="text-[10px] text-[#6B7280]">Select a presentation avatar or tap to upload</span>
                  <div className="flex gap-1.5 mt-1">
                    {DEMO_AVATARS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => {
                          setProfilePhoto(av.url);
                          setPhotoName(`${av.label.toLowerCase()}_avatar.jpg`);
                        }}
                        className={`size-7 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                          profilePhoto === av.url ? "border-[#115E59] scale-105" : "border-transparent opacity-60"
                        }`}
                        title={av.label}
                      >
                        <img src={av.url} alt={av.label} className="size-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[#1F2937]">Complete Street Address *</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Unit No., Street, Subdivision"
                className={`bg-white border p-2.5 rounded-xl text-xs outline-none ${
                  errors.address ? "border-rose-500" : "border-[#E5E7EB] focus:border-[#115E59]"
                }`}
              />
              {errors.address && <span className="text-[10px] text-rose-600 font-semibold">{errors.address}</span>}
            </div>

            {/* Province & City Dropdowns */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#1F2937]">Province *</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="bg-white border border-[#E5E7EB] p-2.5 rounded-xl text-xs outline-none cursor-pointer"
                >
                  <option value="Laguna">Laguna</option>
                  <option value="Batangas">Batangas</option>
                  <option value="Cavite">Cavite</option>
                  <option value="Quezon">Quezon</option>
                  <option value="Metro Manila">Metro Manila</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#1F2937]">City / Municipality *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-white border border-[#E5E7EB] p-2.5 rounded-xl text-xs outline-none cursor-pointer"
                >
                  <option value="San Pablo City">San Pablo City (Coverage Area)</option>
                </select>
              </div>
            </div>

            {/* Barangay Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[#1F2937]">Barangay *</label>
              <select
                value={barangay}
                onChange={(e) => setBarangay(e.target.value)}
                className="bg-white border border-[#E5E7EB] p-2.5 rounded-xl text-xs outline-none cursor-pointer"
              >
                {SAN_PABLO_BARANGAYS.map((brgy) => (
                  <option key={brgy} value={brgy}>
                    {brgy}
                  </option>
                ))}
              </select>
              {errors.barangay && <span className="text-[10px] text-rose-600 font-semibold">{errors.barangay}</span>}
            </div>

            {/* Date of Birth & Gender */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#1F2937]">Date of Birth *</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="bg-white border border-[#E5E7EB] p-2 rounded-xl text-xs outline-none"
                />
                {errors.dob && <span className="text-[10px] text-rose-600 font-semibold">{errors.dob}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#1F2937]">Gender (Optional)</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="bg-white border border-[#E5E7EB] p-2.5 rounded-xl text-xs outline-none cursor-pointer"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex flex-col gap-2 mt-1">
              <span className="font-bold text-[#1F2937] text-xs flex items-center gap-1.5">
                <span>🛡️</span> Emergency Contact Details
              </span>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-semibold text-slate-500">Contact Person Name *</span>
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="Full name of spouse / parent / guardian"
                    className="bg-white border border-[#E5E7EB] p-2 rounded-xl text-xs outline-none"
                  />
                  {errors.emergencyName && <span className="text-[10px] text-rose-600 font-semibold">{errors.emergencyName}</span>}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-semibold text-slate-500">Contact Number *</span>
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="+63 9XX XXX XXXX"
                    className="bg-white border border-[#E5E7EB] p-2 rounded-xl text-xs outline-none"
                  />
                  {errors.emergencyPhone && <span className="text-[10px] text-rose-600 font-semibold">{errors.emergencyPhone}</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 3: SERVICE INFORMATION ─── */}
        {step === 3 && (
          <div className="flex flex-col gap-3.5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-black text-[#1F2937] tracking-tight">
                What services do you offer?
              </h2>
              <p className="text-[#6B7280] text-[11px] mt-0.5">
                Select one or multiple service categories you are skilled and accredited to perform.
              </p>
            </div>

            {errors.categories && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                ⚠️ {errors.categories}
              </div>
            )}

            {/* Selectable Category Cards Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { name: "House Cleaning", icon: "🧹", desc: "General & regular home cleaning" },
                { name: "Deep Cleaning", icon: "✨", desc: "Intensive disinfection & wash" },
                { name: "Plumbing", icon: "🔧", desc: "Pipe leaks, drains & sanitary" },
                { name: "Electrical Services", icon: "⚡", desc: "Wiring, breakers & fixtures" },
                { name: "Aircon Cleaning", icon: "❄️", desc: "Chemical wash & maintenance" },
                { name: "Appliance Repair", icon: "🔌", desc: "Refrigerators, washers & stoves" },
                { name: "Carpentry", icon: "🪚", desc: "Furniture, cabinets & doors" },
                { name: "Home Maintenance", icon: "🏠", desc: "Repairs, touchups & painting" },
                { name: "Gardening", icon: "🌿", desc: "Lawn care, pruning & yard" },
                { name: "Other", icon: "⭐", desc: "Custom specialized services" },
              ].map((cat) => {
                const isSelected = selectedCategories.includes(cat.name);
                return (
                  <div
                    key={cat.name}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedCategories(selectedCategories.filter((c) => c !== cat.name));
                      } else {
                        setSelectedCategories([...selectedCategories, cat.name]);
                      }
                    }}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-2 select-none relative ${
                      isSelected
                        ? "bg-[#F0FDFA] border-[#115E59] shadow-xs"
                        : "bg-white border-[#E5E7EB] hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-2xl">{cat.icon}</span>
                      <div
                        className={`size-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                          isSelected ? "border-[#115E59] bg-[#115E59] text-white" : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && "✓"}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1F2937] text-xs leading-snug">{cat.name}</span>
                      <span className="text-[10px] text-[#6B7280] leading-tight mt-0.5 line-clamp-1">{cat.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* If "Other" is selected, show specify input */}
            {selectedCategories.includes("Other") && (
              <div className="bg-teal-50/60 border border-teal-200 p-3.5 rounded-2xl flex flex-col gap-1.5 animate-in fade-in">
                <label className="font-bold text-[#0F766E] text-xs">Specify Custom Service *</label>
                <input
                  type="text"
                  value={otherCategorySpecified}
                  onChange={(e) => setOtherCategorySpecified(e.target.value)}
                  placeholder="e.g. Locksmithing, Pest Control, Tile Grouting"
                  className="bg-white border border-[#E5E7EB] p-2.5 rounded-xl text-xs outline-none"
                />
                {errors.otherCategory && (
                  <span className="text-[10px] text-rose-600 font-semibold">{errors.otherCategory}</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* ─── STEP 4: EXPERIENCE & SKILLS (REDESIGNED & UNCLUTTERED) ─── */}
        {step === 4 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <span>⭐</span> Step 4 of 9: Trade Background
              </div>
              <h2 className="text-base font-black text-[#1F2937] tracking-tight">
                Specialist Experience & Skills
              </h2>
              <p className="text-[#6B7280] text-[11px] mt-0.5">
                Highlight your background, trade capabilities, and credentials for customers in San Pablo City.
              </p>
            </div>

            {/* Card 1: Years of Experience */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col gap-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#1F2937] text-xs">Years of Active Trade Experience *</h3>
                  <p className="text-[10px] text-slate-500">How long have you provided these trade services?</p>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-50 text-[#0F766E] border border-teal-200">
                  {yearsExperience}
                </span>
              </div>

              {/* Segmented Choice Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: "Less than 1 yr", label: "< 1 Year", badge: "Entry Level" },
                  { id: "1–2 years", label: "1–2 Years", badge: "Intermediate" },
                  { id: "3–5 years", label: "3–5 Years", badge: "Specialist" },
                  { id: "6–10 years", label: "6–10 Years", badge: "Senior Specialist" },
                  { id: "10+ years", label: "10+ Years", badge: "Master Craftsman" },
                ].map((item) => {
                  const isSelected = yearsExperience === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setYearsExperience(item.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                        isSelected
                          ? "bg-[#115E59] text-white border-[#115E59] shadow-sm ring-2 ring-teal-600/30"
                          : "bg-slate-50/70 hover:bg-slate-100 text-[#1F2937] border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-xs">{item.label}</span>
                        {isSelected && <span className="text-[10px] text-teal-200 font-bold">✓</span>}
                      </div>
                      <span className={`text-[9px] ${isSelected ? "text-teal-100" : "text-slate-500"}`}>
                        {item.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.yearsExperience && (
                <span className="text-[10px] text-rose-600 font-semibold">{errors.yearsExperience}</span>
              )}
            </div>

            {/* Card 2: Trade Skills & Specializations */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col gap-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#1F2937] text-xs">Specialized Skills & Capabilities</h3>
                  <p className="text-[10px] text-slate-500">Select all skills relevant to your trade services</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {selectedSkills.length} selected
                </span>
              </div>

              {/* Curated Skill Tag Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedCategories.flatMap((cat) => CATEGORY_SKILLS_MAP[cat] || []).map((skill) => {
                  const isChecked = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          setSelectedSkills(selectedSkills.filter((s) => s !== skill));
                        } else {
                          setSelectedSkills([...selectedSkills, skill]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isChecked
                          ? "bg-[#0F766E] text-white border-[#0F766E] shadow-2xs"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span className={`text-[11px] ${isChecked ? "text-teal-200" : "text-slate-400"}`}>
                        {isChecked ? "✓" : "+"}
                      </span>
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Skill Bar */}
              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  placeholder="Add custom skill or tool (e.g. Pressure washer ready)"
                  className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs flex-1 outline-none focus:bg-white focus:border-[#0F766E]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customSkillInput.trim()) {
                      e.preventDefault();
                      if (!selectedSkills.includes(customSkillInput.trim())) {
                        setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
                      }
                      setCustomSkillInput("");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
                      setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
                      setCustomSkillInput("");
                    }
                  }}
                  className="bg-[#0F766E] hover:bg-[#115E59] text-white px-3.5 py-2 rounded-xl font-bold text-xs cursor-pointer shadow-2xs shrink-0"
                >
                  + Add
                </button>
              </div>

              {/* Custom tags added list (if any custom additions) */}
              {selectedSkills.filter((s) => !selectedCategories.flatMap((c) => CATEGORY_SKILLS_MAP[c] || []).includes(s)).length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedSkills
                    .filter((s) => !selectedCategories.flatMap((c) => CATEGORY_SKILLS_MAP[c] || []).includes(s))
                    .map((customSkill) => (
                      <span
                        key={customSkill}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200"
                      >
                        <span>✓ {customSkill}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedSkills(selectedSkills.filter((s) => s !== customSkill))}
                          className="hover:text-rose-600 font-bold ml-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* Card 3: Professional Bio Textarea */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col gap-2.5 shadow-xs">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-[#1F2937] text-xs">Professional Bio & Client Pitch *</h3>
                  <p className="text-[10px] text-slate-500">Introduce your work quality and punctuality to clients</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{professionalBio.length} / 500</span>
              </div>

              {/* Starter chips */}
              <div className="flex flex-wrap items-center gap-1.5 py-0.5">
                <span className="text-[10px] text-slate-400">Quick inserts:</span>
                {[
                  "+ 5+ yrs experience",
                  "+ TESDA NC II certified",
                  "+ Complete tools ready",
                  "+ San Pablo local specialist",
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      const cleanChip = chip.replace("+ ", "");
                      if (!professionalBio.includes(cleanChip)) {
                        setProfessionalBio((prev) => (prev ? `${prev.trim()} ${cleanChip}.` : `${cleanChip}.`));
                      }
                    }}
                    className="text-[10px] bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                value={professionalBio}
                onChange={(e) => setProfessionalBio(e.target.value)}
                placeholder="Describe your hands-on experience, equipment, and commitment to service excellence in San Pablo City..."
                className={`bg-slate-50/60 border p-3 rounded-xl text-xs outline-none leading-relaxed transition-all focus:bg-white ${
                  errors.professionalBio ? "border-rose-500 ring-1 ring-rose-200" : "border-[#E5E7EB] focus:border-[#115E59]"
                }`}
              />
              {errors.professionalBio && (
                <span className="text-[10px] text-rose-600 font-semibold">{errors.professionalBio}</span>
              )}
            </div>

            {/* Card 4: Background & Accreditations (Optional) - Full Width Unclipped */}
            <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-4 flex flex-col gap-3 shadow-2xs">
              <div>
                <h3 className="font-bold text-[#1F2937] text-xs">Previous Work & Certifications (Optional)</h3>
                <p className="text-[10px] text-slate-500">Helps fast-track verification by TapServe Admin</p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-700">Previous Employer / Shop Name</label>
                  <input
                    type="text"
                    value={previousEmployer}
                    onChange={(e) => setPreviousEmployer(e.target.value)}
                    placeholder="e.g. Freelance or CleanPro Laguna"
                    className="w-full bg-white border border-[#E5E7EB] px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#1F2937] outline-none focus:border-[#115E59] focus:ring-2 focus:ring-[#115E59]/10"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-700">Certifications & Training</label>
                  <input
                    type="text"
                    value={trainingCert}
                    onChange={(e) => setTrainingCert(e.target.value)}
                    placeholder="e.g. TESDA NC II, Dualtech Training"
                    className="w-full bg-white border border-[#E5E7EB] px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#1F2937] outline-none focus:border-[#115E59] focus:ring-2 focus:ring-[#115E59]/10"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 5: AVAILABILITY & HOURS (PREVIOUSLY STEP 6) ─── */}
        {step === 5 && (
          <div className="flex flex-col gap-3.5 animate-in fade-in duration-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <span>🕒</span> Step 5 of 8: Weekly Schedule
              </div>
              <h2 className="text-base font-black text-[#1F2937] tracking-tight">
                When are you available?
              </h2>
              <p className="text-[#6B7280] text-[11px] mt-0.5">
                Set your weekly working days and preferred same-day booking notice.
              </p>
            </div>

            {/* Weekly Days List */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3 divide-y divide-[#F3F4F6] shadow-2xs flex flex-col">
              {Object.keys(weeklyAvailability).map((day) => {
                const item = weeklyAvailability[day];
                return (
                  <div key={day} className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setWeeklyAvailability({
                            ...weeklyAvailability,
                            [day]: { ...item, available: !item.available },
                          })
                        }
                        className={`size-6 rounded-md flex items-center justify-center text-xs font-bold transition-colors cursor-pointer ${
                          item.available ? "bg-[#115E59] text-white" : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {item.available ? "✓" : "✕"}
                      </button>
                      <span className={`text-xs font-bold ${item.available ? "text-[#1F2937]" : "text-slate-400"}`}>
                        {day}
                      </span>
                    </div>

                    {item.available ? (
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <select
                          value={item.start}
                          onChange={(e) =>
                            setWeeklyAvailability({
                              ...weeklyAvailability,
                              [day]: { ...item, start: e.target.value },
                            })
                          }
                          className="bg-slate-50 border border-slate-200 rounded-lg p-1 text-[11px] font-semibold text-[#1F2937] outline-none"
                        >
                          <option>7:00 AM</option>
                          <option>8:00 AM</option>
                          <option>9:00 AM</option>
                        </select>
                        <span className="text-slate-400">to</span>
                        <select
                          value={item.end}
                          onChange={(e) =>
                            setWeeklyAvailability({
                              ...weeklyAvailability,
                              [day]: { ...item, end: e.target.value },
                            })
                          }
                          className="bg-slate-50 border border-slate-200 rounded-lg p-1 text-[11px] font-semibold text-[#1F2937] outline-none"
                        >
                          <option>4:00 PM</option>
                          <option>5:00 PM</option>
                          <option>6:00 PM</option>
                          <option>8:00 PM</option>
                        </select>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        Unavailable
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Emergency Bookings Toggle */}
            <div className="bg-white border border-[#E5E7EB] p-3.5 rounded-2xl flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">⚡</span>
                <div className="flex flex-col">
                  <span className="font-bold text-[#1F2937] text-xs">Accept emergency / same-day bookings</span>
                  <span className="text-[10px] text-[#6B7280]">Allows urgent requests when you are online</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAcceptEmergencyBookings(!acceptEmergencyBookings)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  acceptEmergencyBookings ? "bg-[#115E59]" : "bg-slate-300"
                }`}
              >
                <div
                  className={`size-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                    acceptEmergencyBookings ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Preferred Notice Period */}
            <div className="flex flex-col gap-1.5 pt-1">
              <label className="font-bold text-[#1F2937]">Preferred Booking Notice</label>
              <div className="grid grid-cols-4 gap-1.5">
                {["Same day", "1 day before", "2 days before", "3 days before"].map((notice) => (
                  <button
                    key={notice}
                    type="button"
                    onClick={() => setPreferredNotice(notice)}
                    className={`py-2 px-1 rounded-xl text-[10px] font-bold border text-center transition-all cursor-pointer ${
                      preferredNotice === notice
                        ? "bg-[#0F766E] text-white border-[#0F766E] shadow-2xs"
                        : "bg-white text-[#4B5563] border-[#E5E7EB] hover:bg-slate-50"
                    }`}
                  >
                    {notice}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 6: IDENTITY & CREDENTIALS ─── */}
        {step === 6 && (
          <div className="flex flex-col gap-3.5 animate-in fade-in duration-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <span>🪪</span> Step 6 of 8: Identity & Credentials
              </div>
              <h2 className="text-base font-black text-[#1F2937] tracking-tight">
                Verify your identity
              </h2>
              <p className="text-[#6B7280] text-[11px] mt-0.5 leading-relaxed">
                Verification helps build trust and keeps the TapServe community safe in San Pablo City.
              </p>
            </div>

            {/* 1. Government-issued ID */}
            <div className="bg-white border border-[#E5E7EB] p-4 rounded-2xl flex flex-col gap-3 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="size-6 rounded-full bg-[#115E59] text-white flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <span className="font-bold text-[#1F2937] text-xs">Government-issued ID *</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold text-slate-500">ID Type *</span>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs outline-none cursor-pointer font-medium text-slate-700"
                  >
                    <option value="National ID (PhilSys)">National ID (PhilSys)</option>
                    <option value="Driver's License">Driver&apos;s License (LTO)</option>
                    <option value="Philippine Passport">Philippine Passport (DFA)</option>
                    <option value="UMID">Unified Multi-Purpose ID (UMID)</option>
                    <option value="Postal ID">Postal ID (PhilPost)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold text-slate-500">ID Number *</span>
                  <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="Enter official document ID number"
                    className="bg-white border border-[#E5E7EB] p-2.5 rounded-xl text-xs outline-none focus:border-[#115E59] focus:ring-1 focus:ring-[#115E59]"
                  />
                  {errors.idNumber && <span className="text-[10px] text-rose-600 font-semibold">{errors.idNumber}</span>}
                </div>

                {/* Upload Front of ID */}
                <div
                  onClick={() => setIdFrontUploaded(!idFrontUploaded)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    idFrontUploaded
                      ? "bg-gradient-to-r from-emerald-50/90 to-teal-50/60 border-emerald-300 shadow-2xs"
                      : "bg-slate-50/80 border-dashed border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                    <div className="size-10 rounded-xl bg-white border border-emerald-200/80 flex items-center justify-center text-xl shrink-0 shadow-2xs">
                      🪪
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-[#1F2937] text-xs truncate">Front of ID Document</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">
                        {idFrontUploaded ? "PhilSys_Front_Scan.png (2.4 MB)" : "Click to stage / upload ID photo"}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 border ${
                      idFrontUploaded
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200 shadow-2xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {idFrontUploaded ? "✓ Uploaded" : "+ Upload"}
                  </span>
                </div>

                {/* Upload Back of ID (Optional) */}
                <div
                  onClick={() => setIdBackUploaded(!idBackUploaded)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    idBackUploaded
                      ? "bg-gradient-to-r from-emerald-50/90 to-teal-50/60 border-emerald-300 shadow-2xs"
                      : "bg-slate-50/80 border-dashed border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                    <div className="size-10 rounded-xl bg-white border border-emerald-200/80 flex items-center justify-center text-xl shrink-0 shadow-2xs">
                      🪪
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-[#1F2937] text-xs truncate">Back of ID (Optional)</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">
                        {idBackUploaded ? "PhilSys_Back_Scan.png (1.8 MB)" : "Click to stage back side"}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 border ${
                      idBackUploaded
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200 shadow-2xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {idBackUploaded ? "✓ Uploaded" : "+ Upload"}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Selfie / Profile Verification */}
            <div className="bg-white border border-[#E5E7EB] p-4 rounded-2xl flex flex-col gap-3 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="size-6 rounded-full bg-[#115E59] text-white flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <span className="font-bold text-[#1F2937] text-xs">Selfie / Profile Verification *</span>
              </div>

              <div
                onClick={() => setSelfieUploaded(!selfieUploaded)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  selfieUploaded
                    ? "bg-gradient-to-r from-emerald-50/90 to-teal-50/60 border-emerald-300 shadow-2xs"
                    : "bg-slate-50/80 border-dashed border-slate-300 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                  <div className="size-10 rounded-xl bg-white border border-emerald-200/80 flex items-center justify-center text-xl shrink-0 shadow-2xs">
                    🤳
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-[#1F2937] text-xs truncate">Selfie holding the ID</span>
                    <span className="text-[10px] text-slate-500 truncate mt-0.5">
                      {selfieUploaded ? "verification_selfie_holding_id.jpg (1.9 MB)" : "Tap to stage / upload verification photo"}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 border ${
                    selfieUploaded
                      ? "bg-emerald-100 text-emerald-800 border-emerald-200 shadow-2xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {selfieUploaded ? "✓ Uploaded" : "+ Upload"}
                </span>
              </div>
            </div>

            {/* 3. Service Credentials (TESDA NC II / License) */}
            <div className="bg-white border border-[#E5E7EB] p-4 rounded-2xl flex flex-col gap-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-full bg-[#115E59] text-white flex items-center justify-center font-bold text-xs">
                    3
                  </span>
                  <span className="font-bold text-[#1F2937] text-xs">Service Credentials</span>
                </div>
                {(selectedCategories.includes("Electrical Services") ||
                  selectedCategories.includes("Plumbing") ||
                  selectedCategories.includes("Aircon Cleaning")) && (
                  <span className="text-[9px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full">
                    Recommended for your trades
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2.5">
                <select
                  value={credentialType}
                  onChange={(e) => setCredentialType(e.target.value)}
                  className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs outline-none cursor-pointer font-medium text-slate-700"
                >
                  <option value="TESDA NC II Certificate">TESDA NC II Certificate</option>
                  <option value="Professional PRC License">Professional PRC License</option>
                  <option value="Trade Training Certificate">Trade Training Certificate</option>
                  <option value="DTI / Mayor Business Permit">DTI / Mayor Business Permit</option>
                  <option value="Barangay Work Clearance">Barangay Work Clearance</option>
                </select>

                <div
                  onClick={() => setCredentialUploaded(!credentialUploaded)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    credentialUploaded
                      ? "bg-gradient-to-r from-emerald-50/90 to-teal-50/60 border-emerald-300 shadow-2xs"
                      : "bg-slate-50/80 border-dashed border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                    <div className="size-10 rounded-xl bg-white border border-emerald-200/80 flex items-center justify-center text-xl shrink-0 shadow-2xs">
                      📜
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-[#1F2937] text-xs truncate">{credentialType}</span>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">
                        {credentialUploaded ? "TESDA_Certification_Accreditation.pdf (2.2 MB)" : "Click to stage document"}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 border ${
                      credentialUploaded
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200 shadow-2xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {credentialUploaded ? "✓ Uploaded" : "+ Upload"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 7: PRICING & SUBSCRIPTION (50% OFF 1ST YEAR) ─── */}
        {step === 7 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <span>🏷️</span> Step 7 of 8: Rates & Accreditation Plan
              </div>
              <h2 className="text-base font-black text-[#1F2937] tracking-tight">
                Rates & Specialist Accreditation
              </h2>
              <p className="text-[#6B7280] text-[11px] mt-0.5">
                Set your customer-facing starting rates and choose your 50% promotional accreditation plan.
              </p>
            </div>

            {/* Service Rates Inputs */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col gap-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#1F2937] text-xs">Customer Starting Rates</h3>
                <span className="text-[10px] text-slate-400">Base quote per booking</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {selectedCategories.map((cat) => {
                  const item = servicePricing[cat] || { price: 500, type: "Starting From" };
                  return (
                    <div key={cat} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1F2937] text-xs">{cat}</span>
                        <span className="text-[10px] text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                          {item.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-white border border-[#E5E7EB] rounded-xl px-2.5 py-2 flex-1">
                          <span className="font-bold text-[#115E59] text-xs mr-1">₱</span>
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) =>
                              setServicePricing({
                                ...servicePricing,
                                [cat]: { ...item, price: Number(e.target.value) },
                              })
                            }
                            className="bg-transparent font-bold text-xs text-[#1F2937] outline-none w-full"
                          />
                        </div>

                        {/* Pricing Type */}
                        <div className="flex gap-1">
                          {(["Starting From", "Fixed", "Per Hour"] as const).map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() =>
                                setServicePricing({
                                  ...servicePricing,
                                  [cat]: { ...item, type: t },
                                })
                              }
                              className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                                item.type === t
                                  ? "bg-[#115E59] text-white border-[#115E59]"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[10px] text-[#6B7280] italic">
                ℹ️ Initial rate displayed to customers in San Pablo City. You can adjust final quotes depending on actual job scope.
              </p>
            </div>

            {/* 50% OFF 1ST YEAR ACCREDITATION PLAN PICKER (STACKED FULL WIDTH FOR ZERO CROWDING) */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col gap-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#1F2937] text-xs">TapServe Specialist Accreditation</h3>
                  <p className="text-[10px] text-slate-500">Choose your billing cycle (50% OFF for your entire 1st year!)</p>
                </div>
                <span className="text-[9px] bg-amber-100 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-full border border-amber-300">
                  🎉 50% OFF 1ST YEAR
                </span>
              </div>

              {/* Stacked Full-Width Plan Cards */}
              <div className="flex flex-col gap-3.5">
                {/* Yearly Plan Card */}
                <div
                  onClick={() => setSubscriptionPlan("yearly")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-3 relative ${
                    subscriptionPlan === "yearly"
                      ? "bg-gradient-to-br from-teal-50/80 to-emerald-50/50 border-[#115E59] shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`size-5 rounded-full border-2 flex items-center justify-center ${
                          subscriptionPlan === "yearly" ? "border-[#115E59] bg-[#115E59]" : "border-slate-300"
                        }`}
                      >
                        {subscriptionPlan === "yearly" && <div className="size-2 rounded-full bg-white" />}
                      </div>
                      <span className="font-black text-sm text-[#1F2937]">Annual Plan</span>
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#115E59] text-white shadow-2xs">
                      👑 BEST VALUE
                    </span>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-[#115E59]">₱500</span>
                      <span className="text-xs text-slate-500 font-medium">/ 1st year</span>
                      <span className="text-xs line-through text-slate-400">₱1,000/yr</span>
                    </div>
                    <div className="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800 text-[10px] font-bold">
                      🎉 50% OFF promo • Equivalent to only ~₱41.67 / month • Save ₱500!
                    </div>
                  </div>

                  <ul className="text-xs text-slate-600 space-y-1.5 border-t border-slate-200/80 pt-2.5">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Full 12 months verified specialist accreditation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Priority listing in San Pablo City customer searches</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Gold Specialist Badge on your verified profile</span>
                    </li>
                  </ul>
                </div>

                {/* Monthly Plan Card */}
                <div
                  onClick={() => setSubscriptionPlan("monthly")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-3 relative ${
                    subscriptionPlan === "monthly"
                      ? "bg-gradient-to-br from-teal-50/80 to-emerald-50/50 border-[#115E59] shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`size-5 rounded-full border-2 flex items-center justify-center ${
                          subscriptionPlan === "monthly" ? "border-[#115E59] bg-[#115E59]" : "border-slate-300"
                        }`}
                      >
                        {subscriptionPlan === "monthly" && <div className="size-2 rounded-full bg-white" />}
                      </div>
                      <span className="font-black text-sm text-[#1F2937]">Monthly Plan</span>
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      FLEXIBLE
                    </span>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-[#115E59]">₱60</span>
                      <span className="text-xs text-slate-500 font-medium">/ month</span>
                      <span className="text-xs line-through text-slate-400">₱120/mo</span>
                    </div>
                    <div className="inline-block mt-1 px-2 py-0.5 rounded-md bg-teal-100/70 text-[#0F766E] text-[10px] font-bold">
                      🎉 50% OFF each month for your entire first 12 months
                    </div>
                  </div>

                  <ul className="text-xs text-slate-600 space-y-1.5 border-t border-slate-200/80 pt-2.5">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Month-to-month flexibility with no long lock-in</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Standard San Pablo City search listing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Switch or cancel plan anytime</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Preferred Payment Channel */}
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#1F2937]">
                  Preferred Payment Method (for when billing starts):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "GCash", label: "GCash", icon: "📱" },
                    { id: "Maya", label: "Maya", icon: "💳" },
                    { id: "Bank Transfer", label: "Bank Transfer", icon: "🏦" },
                  ].map((pay) => (
                    <button
                      key={pay.id}
                      type="button"
                      onClick={() => setSubscriptionPaymentMethod(pay.id)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        subscriptionPaymentMethod === pay.id
                          ? "bg-[#0F766E] text-white border-[#0F766E] shadow-2xs"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      <span>{pay.icon}</span>
                      <span>{pay.label}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-[#0F766E] italic mt-0.5">
                  🔒 <strong>No payment is charged today.</strong> Your 50% promo fee ({subscriptionPlan === "yearly" ? "₱500/yr" : "₱60/mo"}) is only activated after TapServe Admin approves your credentials.
                </p>
              </div>
            </div>

            {/* Platform Commission Card (10%) */}
            <div className="bg-gradient-to-br from-[#F0FDFA] to-teal-50 border border-[#99F6E4] p-4 rounded-2xl flex flex-col gap-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#115E59] tracking-wider flex items-center gap-1.5">
                  <span>💼</span> TapServe Platform Facilitation
                </span>
                <span className="text-[9px] bg-teal-100 text-teal-800 font-extrabold px-2.5 py-0.5 rounded-full border border-teal-200">
                  10% Commission
                </span>
              </div>

              <div className="divide-y divide-teal-100 text-xs text-[#1F2937]">
                <div className="flex items-center justify-between py-2">
                  <span className="text-[#4B5563]">Completed Booking Commission:</span>
                  <span className="font-bold text-[#115E59]">10% per completed job</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[#4B5563]">Specialist Keeps:</span>
                  <span className="font-bold text-emerald-700">90% of total customer payment</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 gap-1">
                  <span className="text-[#4B5563]">Chosen 1st-Year Plan:</span>
                  <span className="font-bold text-[#115E59]">
                    {subscriptionPlan === "yearly" ? "Annual (₱500 / 1st Year — 50% OFF)" : "Monthly (₱60 / month — 50% OFF)"}
                  </span>
                </div>
              </div>

              <div className="bg-white/80 p-2.5 rounded-xl border border-teal-200 text-[10px] text-[#0F766E] leading-relaxed">
                TapServe only earns when you complete a booking in San Pablo City. Fair, transparent, and built for local specialists.
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 8: TERMS & REVIEW ─── */}
        {step === 8 && (
          <div className="flex flex-col gap-3.5 animate-in fade-in duration-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <span>📋</span> Step 8 of 8: Review & Submit
              </div>
              <h2 className="text-base font-black text-[#1F2937] tracking-tight">
                Review your application
              </h2>
              <p className="text-[#6B7280] text-[11px] mt-0.5">
                Review your submitted credentials before final compliance submission.
              </p>
            </div>

            {/* Summary Sections Accordion with [Edit] buttons */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl divide-y divide-[#F3F4F6] shadow-xs">
              {/* Personal Info */}
              <div className="p-3.5 flex items-start justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F766E]">
                    Personal Information
                  </span>
                  <span className="font-bold text-[#1F2937] text-xs">{firstName} {lastName}</span>
                  <span className="text-[11px] text-[#6B7280]">{mobileNumber} • {email}</span>
                  <span className="text-[11px] text-[#6B7280]">{address}, {barangay}, {city}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-[#0F766E] hover:underline cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Services & Pricing */}
              <div className="p-3.5 flex items-start justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F766E]">
                    Selected Services & Rates
                  </span>
                  <span className="font-bold text-[#1F2937] text-xs">{selectedCategories.join(", ")}</span>
                  <div className="flex flex-wrap gap-1.5 mt-0.5">
                    {selectedCategories.map((c) => (
                      <span key={c} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                        {c}: ₱{servicePricing[c]?.price || 500} ({servicePricing[c]?.type || "Starting From"})
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs font-bold text-[#0F766E] hover:underline cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Accreditation Plan & Platform Fees */}
              <div className="p-3.5 flex items-start justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F766E]">
                    Accreditation Plan & Platform Fees
                  </span>
                  <span className="font-bold text-[#1F2937] text-xs">
                    {subscriptionPlan === "yearly"
                      ? "Annual Specialist Pass — ₱500 / 1st Year (50% OFF)"
                      : "Monthly Specialist Pass — ₱60 / month (50% OFF)"}
                  </span>
                  <span className="text-[11px] text-[#6B7280]">
                    Payment via {subscriptionPaymentMethod} • 10% platform commission on completed jobs
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(7)}
                  className="text-xs font-bold text-[#0F766E] hover:underline cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Experience */}
              <div className="p-3.5 flex items-start justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F766E]">
                    Experience & Bio
                  </span>
                  <span className="font-bold text-[#1F2937] text-xs">{yearsExperience}</span>
                  <p className="text-[11px] text-[#6B7280] line-clamp-2 leading-relaxed">{professionalBio}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-xs font-bold text-[#0F766E] hover:underline cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Weekly Availability & Schedule */}
              <div className="p-3.5 flex items-start justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F766E]">
                    Weekly Schedule & Notice
                  </span>
                  <span className="font-bold text-[#1F2937] text-xs">
                    {Object.keys(weeklyAvailability)
                      .filter((d) => weeklyAvailability[d].available)
                      .join(", ") || "Mon – Sat"}
                  </span>
                  <span className="text-[11px] text-[#6B7280]">Notice: {preferredNotice} • Emergency Jobs: {acceptEmergencyBookings ? "Yes" : "No"}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="text-xs font-bold text-[#0F766E] hover:underline cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Service Areas (San Pablo Only) */}
              <div className="p-3.5 flex items-start justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F766E]">
                    San Pablo City Coverage
                  </span>
                  <span className="font-bold text-[#1F2937] text-xs">All 77 Barangays • City-Wide Jurisdiction</span>
                  <span className="text-[11px] text-[#6B7280]">Exclusively serving San Pablo City residents</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Fixed Area ✓
                </span>
              </div>

              {/* Identity Documents */}
              <div className="p-3.5 flex items-start justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F766E]">
                    Documents & Identity
                  </span>
                  <span className="font-bold text-[#1F2937] text-xs">{idType} ({idNumber})</span>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    ✓ Front ID, Selfie, and {credentialType} staged
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(6)}
                  className="text-xs font-bold text-[#0F766E] hover:underline cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Checkboxes Agreement */}
            <div className="bg-white border border-[#E5E7EB] p-3.5 rounded-2xl flex flex-col gap-2.5 shadow-2xs">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={certifyTrue}
                  onChange={(e) => setCertifyTrue(e.target.checked)}
                  className="size-4 accent-[#115E59] mt-0.5 cursor-pointer"
                />
                <span className="text-[11px] text-[#374151]">
                  I certify that all information, credentials, and trade experience provided are accurate and authentic.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="size-4 accent-[#115E59] mt-0.5 cursor-pointer"
                />
                <span className="text-[11px] text-[#374151]">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowTermsModal(true);
                    }}
                    className="text-[#0F766E] font-bold underline cursor-pointer"
                  >
                    TapServe Service Provider Terms
                  </button>
                  , including the 10% booking commission and my selected 50% promotional subscription (
                  <strong className="text-[#115E59]">
                    {subscriptionPlan === "yearly" ? "₱500 / 1st Year" : "₱60 / month"}
                  </strong>
                  ) upon approval.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  className="size-4 accent-[#115E59] mt-0.5 cursor-pointer"
                />
                <span className="text-[11px] text-[#374151]">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPrivacyModal(true);
                    }}
                    className="text-[#0F766E] font-bold underline cursor-pointer"
                  >
                    TapServe Privacy Policy
                  </button>
                  .
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={understandReview}
                  onChange={(e) => setUnderstandReview(e.target.checked)}
                  className="size-4 accent-[#115E59] mt-0.5 cursor-pointer"
                />
                <span className="text-[11px] text-[#374151]">
                  I understand that my application will be reviewed and verified by TapServe compliance before I can accept bookings.
                </span>
              </label>
            </div>
          </div>
        )}
      </main>

      {/* ─── STICKY BOTTOM ACTIONS ─── */}
      <footer className="p-4 bg-white border-t border-[#E5E7EB] shrink-0 flex gap-2.5 shadow-lg">
        <button
          type="button"
          onClick={handlePrevStep}
          className="py-3 px-4 bg-[#F8FAFA] hover:bg-slate-100 text-[#4B5563] font-bold text-xs rounded-xl border border-[#E5E7EB] cursor-pointer transition-colors"
        >
          {step === 1 ? "Cancel" : "Back"}
        </button>

        {step < 8 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="flex-1 py-3 bg-[#115E59] hover:bg-[#0F766E] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors active:scale-[0.99]"
          >
            Continue →
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            disabled={!certifyTrue || !agreeTerms || !agreePrivacy || !understandReview}
            className="flex-1 py-3 bg-[#115E59] hover:bg-[#0F766E] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors active:scale-[0.99]"
          >
            Submit Application
          </button>
        )}
      </footer>

      {/* ─── SUBMISSION CONFIRMATION MODAL ─── */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full shadow-2xl flex flex-col gap-3.5 text-center">
            <div className="size-12 rounded-full bg-teal-50 text-[#115E59] text-2xl flex items-center justify-center mx-auto shadow-inner">
              📄
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-black text-[#1F2937]">Submit your application?</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Make sure all the information you provided is correct. You may be asked to provide additional documents during verification.
              </p>
            </div>

            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#4B5563] hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-[#115E59] hover:bg-[#0F766E] text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {submitting ? "Submitting…" : "Confirm & Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TERMS MODAL ─── */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl flex flex-col gap-3 max-h-[80vh]">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-[#1F2937]">Service Provider Terms</h3>
              <button onClick={() => setShowTermsModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <div className="overflow-y-auto text-xs text-[#4B5563] space-y-2 leading-relaxed pr-1">
              <p>1. <strong>Platform Commission:</strong> TapServe deducts a 10% platform facilitation fee upon successfully completed customer jobs.</p>
              <p>2. <strong>Accreditation:</strong> Specialists must maintain true and valid government identity, background clearance, and trade competency.</p>
              <p>3. <strong>Punctuality & Safety:</strong> Specialists pledge professional conduct and compliance with Philippine home service safety standards.</p>
            </div>
            <button
              onClick={() => {
                setAgreeTerms(true);
                setShowTermsModal(false);
              }}
              className="py-2.5 bg-[#115E59] text-white text-xs font-bold rounded-xl mt-2 cursor-pointer"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      )}

      {/* ─── PRIVACY MODAL ─── */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl flex flex-col gap-3 max-h-[80vh]">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-[#1F2937]">Privacy Policy</h3>
              <button onClick={() => setShowPrivacyModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <div className="overflow-y-auto text-xs text-[#4B5563] space-y-2 leading-relaxed pr-1">
              <p>TapServe complies with the Philippine Data Privacy Act of 2012 (RA 10173). Your government ID, clearances, and personal records are encrypted and utilized solely for background verification and specialist accreditation.</p>
            </div>
            <button
              onClick={() => {
                setAgreePrivacy(true);
                setShowPrivacyModal(false);
              }}
              className="py-2.5 bg-[#115E59] text-white text-xs font-bold rounded-xl mt-2 cursor-pointer"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DEDICATED PROVIDER APPLICATION STATUS SCREEN ─────────────────────────────

export function ProviderApplyStatusScreen({
  nav,
  goBack,
  currentUser,
  onToast,
}: {
  nav: (s: Screen) => void;
  goBack: () => void;
  currentUser: UserAccount;
  onToast: (msg: string) => void;
}) {
  const applicationData = AppStorage.getProviderApplication();
  const status = currentUser.providerApplicationStatus || applicationData?.status || "Under Review";
  const isApproved = status === "Approved" || currentUser.isProvider;
  const isRejected = status === "Rejected";

  return (
    <div className="bg-[#F8FAFA] flex flex-col size-full font-sans select-none">
      <header className="bg-[#115E59] text-white px-5 pt-12 pb-4 shrink-0 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => nav("home")}
            className="size-8 rounded-xl bg-white/10 flex items-center justify-center font-bold text-xs"
          >
            ←
          </button>
          <h1 className="text-sm font-bold">Provider Application Status</h1>
        </div>
        <button onClick={() => nav("home")} className="text-xs text-[#CCFBF1] font-semibold hover:underline">
          Home
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4 text-xs">
        {/* Status Card Header */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex flex-col items-center text-center gap-3 shadow-xs">
          <div className="size-16 rounded-full flex items-center justify-center text-3xl shadow-inner border-2 border-slate-100">
            {isApproved ? "🎉" : isRejected ? "❌" : "⏳"}
          </div>

          <div className="flex flex-col gap-1">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-bold border self-center ${
                isApproved
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : isRejected
                  ? "bg-rose-50 text-rose-800 border-rose-200"
                  : "bg-teal-50 text-[#0F766E] border-teal-200"
              }`}
            >
              Status: {status}
            </span>
            <h2 className="text-base font-black text-[#1F2937] tracking-tight mt-1">
              {isApproved
                ? "Congratulations! You are Approved"
                : isRejected
                ? "Application Not Approved"
                : "Application Under Review"}
            </h2>
            <p className="text-[#6B7280] text-[11px] leading-relaxed max-w-xs">
              {isApproved
                ? "Your credentials have been verified. You now have full access to accept customer bookings in San Pablo City."
                : isRejected
                ? "One or more required documents could not be verified by our compliance team."
                : "Your submitted government ID, trade credentials, and police clearances are currently undergoing verification."}
            </p>
          </div>

          <div className="w-full pt-3 border-t border-[#F3F4F6] flex justify-between text-[11px] text-[#6B7280]">
            <span>Application ID:</span>
            <span className="font-mono font-bold text-[#115E59]">
              {applicationData?.applicationId || "TSP-2026-00124"}
            </span>
          </div>
        </div>

        {/* Vertical Status Timeline */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col gap-3 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280]">
            Verification Timeline
          </span>

          <div className="flex flex-col gap-4 relative pl-3">
            {/* Timeline Line */}
            <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-slate-200" />

            {/* Step 1 */}
            <div className="flex items-start gap-3 relative z-10">
              <span className="size-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                ✓
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-[#1F2937] text-xs">Application Submitted</span>
                <span className="text-[10px] text-slate-500">Account details and trade profile created</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 relative z-10">
              <span className="size-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                ✓
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-[#1F2937] text-xs">Documents Received</span>
                <span className="text-[10px] text-slate-500">Government ID, selfie, and trade certificate staged</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 relative z-10">
              <span
                className={`size-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isApproved
                    ? "bg-emerald-600 text-white"
                    : isRejected
                    ? "bg-rose-600 text-white"
                    : "bg-[#115E59] text-white animate-pulse"
                }`}
              >
                {isApproved ? "✓" : isRejected ? "✕" : "●"}
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-[#1F2937] text-xs">Under Review</span>
                <span className="text-[10px] text-slate-500">Admin compliance checking submitted credentials</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3 relative z-10">
              <span
                className={`size-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isApproved ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
                }`}
              >
                {isApproved ? "✓" : "○"}
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-[#1F2937] text-xs">Final Approval & Activation</span>
                <span className="text-[10px] text-slate-500">Service Provider Console access unlocked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {isApproved ? (
          <button
            onClick={() => {
              AppStorage.saveActiveRole("provider");
              nav("provider-dashboard");
            }}
            className="w-full py-3.5 bg-[#115E59] hover:bg-[#0F766E] text-white font-bold text-xs rounded-2xl shadow-md cursor-pointer transition-colors active:scale-[0.99] mt-auto"
          >
            Go to Provider Dashboard →
          </button>
        ) : isRejected ? (
          <button
            onClick={() => nav("provider-apply")}
            className="w-full py-3.5 bg-[#DC2626] hover:bg-rose-700 text-white font-bold text-xs rounded-2xl shadow-md cursor-pointer transition-colors active:scale-[0.99] mt-auto"
          >
            Update Application →
          </button>
        ) : (
          <button
            onClick={() => nav("home")}
            className="w-full py-3.5 bg-[#115E59] hover:bg-[#0F766E] text-white font-bold text-xs rounded-2xl shadow-md cursor-pointer transition-colors active:scale-[0.99] mt-auto"
          >
            Return to Home
          </button>
        )}
      </main>
    </div>
  );
}
