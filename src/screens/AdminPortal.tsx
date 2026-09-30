import React, { useState } from "react";
import { A, TapServeIcon } from "../components/SharedUI";
import {
  CredentialDoc,
  CredentialItem,
  DocumentReviewModal,
} from "../components/DocumentReviewModal";

export type AdminTab =
  | "dashboard"
  | "credentials"
  | "accounts"
  | "bookings"
  | "sales"
  | "concerns"
  | "violations"
  | "appeals"
  | "mod-rules";

interface UserAccountItem {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  userId: string;
  role: "Customer" | "Service Provider" | "Admin";
  email: string;
  registered: string;
  status: "Active" | "Suspended";
  standing:
    | "Good Standing"
    | "Warning"
    | "Restricted"
    | "Temporarily Suspended"
    | "Permanent Ban";
  lastActive: string;
  phone: string;
  rating: number;
  warningsCount: number;
  violationsCount: number;
  cancellationsCount: number;
  recentBooking?: { id: string; service: string; status: string };
}

interface AdminBookingItem {
  id: string;
  customerName: string;
  customerInitials: string;
  customerLocation: string;
  providerName: string;
  providerInitials: string;
  providerTitle: string;
  service: string;
  serviceCategory: string;
  dateTime: string;
  amount: number;
  status: "In Progress" | "Completed" | "Confirmed" | "Cancelled" | "Disputed";
  paymentStatus: "Paid" | "Pending" | "Refunded";
  timeline: { time: string; text: string }[];
}

export function AdminPortal({
  onSwitchToMobile,
  onSwitchToProvider,
  onToast,
}: {
  onSwitchToMobile: () => void;
  onSwitchToProvider?: () => void;
  onToast: (msg: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  // ─── Credentials State ───────────────────────────────────────────────────────
  const [credentialFilter, setCredentialFilter] = useState<
    "All" | "Pending" | "Approved" | "Rejected"
  >("All");
  const [selectedCredential, setSelectedCredential] =
    useState<CredentialItem | null>(null);
  const [reviewingDocTarget, setReviewingDocTarget] = useState<{
    credentialId: string;
    docIndex: number;
  } | null>(null);

  const [credentialsList, setCredentialsList] = useState<CredentialItem[]>([
    {
      id: "cred-1",
      name: "Rogelio Dela Cruz",
      initials: "RD",
      avatarBg: "bg-purple-600",
      serviceType: "Electrical Services",
      submittedDate: "Oct 24, 2026",
      providedDocs: "Government, Certification, Clearance",
      status: "Pending",
      phone: "+63 920 112 4589",
      email: "rogelio.dc@gmail.com",
      experience: "8 years residential & commercial wiring",
      docsList: [
        {
          id: "doc-1-1",
          title: "Philippine National ID",
          type: "Government ID",
          verified: true,
          status: "Verified",
          docNumber: "PhilSys 7192-3841-9920",
          issuedDate: "Jan 14, 2023",
          expiryDate: "Permanent (National ID)",
          issuingAuthority: "Philippine Statistics Authority (PSA)",
          documentCategory: "government_id",
          fileFormat: "PNG",
          fileSize: "2.4 MB",
          notes: "Official PhilSys QR code validated. Microchip emblem and biometric photo match applicant profile.",
        },
        {
          id: "doc-1-2",
          title: "TESDA NC II Electrical Installation",
          type: "Trade Certification",
          verified: true,
          status: "Verified",
          docNumber: "TESDA-NC2-EIM-2022-8812",
          issuedDate: "Aug 18, 2022",
          expiryDate: "Aug 18, 2027",
          issuingAuthority: "Technical Education and Skills Development Authority (TESDA IV-A Laguna)",
          documentCategory: "tesda",
          fileFormat: "PDF",
          fileSize: "1.8 MB",
          notes: "TESDA Registry verified. Competency in residential/commercial wiring and distribution board install.",
        },
        {
          id: "doc-1-3",
          title: "Barangay Clearance (San Roque)",
          type: "Local Clearance",
          verified: false,
          status: "Pending Review",
          docNumber: "BC-SR-2026-0941",
          issuedDate: "Oct 19, 2026",
          expiryDate: "Apr 19, 2027",
          issuingAuthority: "Office of the Punong Barangay - San Roque, San Pablo City",
          documentCategory: "clearance",
          fileFormat: "PNG",
          fileSize: "3.1 MB",
          notes: "Ready for admin inspection. Issued within 6 months with official dry seal.",
        },
      ],
    },
    {
      id: "cred-2",
      name: "Sarah Alvarez",
      initials: "SA",
      avatarBg: "bg-orange-500",
      serviceType: "Deep Cleaning Expert",
      submittedDate: "Oct 23, 2026",
      providedDocs: "Government, Clearance, Sanitary Permit",
      status: "Pending",
      phone: "+63 918 445 7812",
      email: "sarah.alvarez@yahoo.com",
      experience: "5 years hotel housekeeping & disinfection",
      docsList: [
        {
          id: "doc-2-1",
          title: "UMID SSS Card",
          type: "Government ID",
          verified: true,
          status: "Verified",
          docNumber: "CRN-0111-7892345-8",
          issuedDate: "Mar 10, 2021",
          expiryDate: "Lifetime / Permanent",
          issuingAuthority: "Social Security System (SSS Philippines)",
          documentCategory: "government_id",
          fileFormat: "PNG",
          fileSize: "1.9 MB",
          notes: "Cardholder identity matches SSS portal query.",
        },
        {
          id: "doc-2-2",
          title: "NBI Clearance",
          type: "National Clearance",
          verified: true,
          status: "Verified",
          docNumber: "NBI-CLR-2026-788102",
          issuedDate: "Sep 05, 2026",
          expiryDate: "Sep 05, 2027",
          issuingAuthority: "National Bureau of Investigation (Laguna District)",
          documentCategory: "clearance",
          fileFormat: "PDF",
          fileSize: "2.1 MB",
          notes: "Confirmed NO DEROGATORY RECORD. Barcode verified with NBI clearance verification portal.",
        },
        {
          id: "doc-2-3",
          title: "Sanitary Permit & Health Certificate",
          type: "Health Clearance",
          verified: false,
          status: "Pending Review",
          docNumber: "SP-SPC-2026-4412",
          issuedDate: "Oct 01, 2026",
          expiryDate: "Oct 01, 2027",
          issuingAuthority: "San Pablo City Health Office",
          documentCategory: "permit",
          fileFormat: "PNG",
          fileSize: "1.5 MB",
          notes: "Sanitary inspection and lab exams marked Fit to Work.",
        },
      ],
    },
    {
      id: "cred-3",
      name: "Juanito Perez",
      initials: "JP",
      avatarBg: "bg-purple-600",
      serviceType: "Gardening & Landscape",
      submittedDate: "Oct 22, 2026",
      providedDocs: "Government ID, Business Registration",
      status: "Pending",
      phone: "+63 927 889 0123",
      email: "juanito.perez@live.com",
      experience: "10 years lawn care & tree trimming",
      docsList: [
        {
          id: "doc-3-1",
          title: "Driver's License (LTO)",
          type: "Government ID",
          verified: true,
          status: "Verified",
          docNumber: "N02-18-098712",
          issuedDate: "Jun 20, 2023",
          expiryDate: "Jun 20, 2033",
          issuingAuthority: "Land Transportation Office (LTO San Pablo)",
          documentCategory: "government_id",
          fileFormat: "PNG",
          fileSize: "2.2 MB",
          notes: "Professional driver license with 10-year validity.",
        },
        {
          id: "doc-3-2",
          title: "DTI Business Name Registration",
          type: "Business Registration",
          verified: true,
          status: "Verified",
          docNumber: "DTI-BMR-4882910",
          issuedDate: "Feb 12, 2024",
          expiryDate: "Feb 12, 2029",
          issuingAuthority: "Department of Trade and Industry (DTI Region IV-A)",
          documentCategory: "business",
          fileFormat: "PDF",
          fileSize: "2.8 MB",
          notes: "Registered Trade Name: Juanito's Green Oasis Landscaping. Territorial Scope: San Pablo City.",
        },
      ],
    },
    {
      id: "cred-4",
      name: "Pedro Beltran",
      initials: "PB",
      avatarBg: "bg-teal-600",
      serviceType: "Plumbing",
      submittedDate: "Oct 20, 2026",
      providedDocs: "Certification, Police Clearance",
      status: "Pending",
      phone: "+63 915 223 9988",
      email: "pedro.plumber@gmail.com",
      experience: "6 years pipe installation & sewer repair",
      docsList: [
        {
          id: "doc-4-1",
          title: "TESDA Plumbing NC II",
          type: "Trade Certification",
          verified: true,
          status: "Verified",
          docNumber: "TESDA-NC2-PLB-2021-3948",
          issuedDate: "May 15, 2021",
          expiryDate: "May 15, 2026",
          issuingAuthority: "TESDA Regional Training Center Laguna",
          documentCategory: "tesda",
          fileFormat: "PDF",
          fileSize: "2.0 MB",
          notes: "Accredited in pipe fitting, drainage installation, and pressure leak diagnostics.",
        },
        {
          id: "doc-4-2",
          title: "National Police Clearance",
          type: "Police Clearance",
          verified: false,
          status: "Pending Review",
          docNumber: "PNP-SPC-2026-1184",
          issuedDate: "Oct 12, 2026",
          expiryDate: "Apr 12, 2027",
          issuingAuthority: "Philippine National Police - San Pablo City Station",
          documentCategory: "clearance",
          fileFormat: "PNG",
          fileSize: "2.6 MB",
          notes: "Official PNP security watermark present. Awaiting admin clearance review.",
        },
      ],
    },
    {
      id: "cred-5",
      name: "Kuya Reynaldo",
      initials: "KR",
      avatarBg: "bg-orange-500",
      serviceType: "Plumbing Specialist",
      submittedDate: "Oct 15, 2026",
      providedDocs: "Professional License, Passport ID",
      status: "Verified",
      phone: "+63 917 555 9012",
      email: "reynaldo.pipes@tapserve.demo",
      experience: "12 years Master Plumber certification",
      docsList: [
        {
          id: "doc-5-1",
          title: "PRC Master Plumber License",
          type: "Professional License",
          verified: true,
          status: "Verified",
          docNumber: "PRC-MP-0014829",
          issuedDate: "Jul 11, 2018",
          expiryDate: "Jul 11, 2027",
          issuingAuthority: "Professional Regulation Commission (PRC)",
          documentCategory: "license",
          fileFormat: "PNG",
          fileSize: "1.7 MB",
          notes: "Licensed Master Plumber verified against PRC online verification database.",
        },
        {
          id: "doc-5-2",
          title: "Philippine Passport ID",
          type: "Government ID",
          verified: true,
          status: "Verified",
          docNumber: "P9928172B",
          issuedDate: "Nov 04, 2022",
          expiryDate: "Nov 04, 2032",
          issuingAuthority: "Department of Foreign Affairs (DFA)",
          documentCategory: "government_id",
          fileFormat: "PNG",
          fileSize: "2.3 MB",
          notes: "Valid DFA passport. Photo and signature verified.",
        },
      ],
    },
    {
      id: "cred-6",
      name: "Ate Maria",
      initials: "AM",
      avatarBg: "bg-blue-600",
      serviceType: "House Cleaning",
      submittedDate: "Oct 10, 2026",
      providedDocs: "Government ID, Barangay Clearance",
      status: "Verified",
      phone: "+63 919 778 3341",
      email: "maria.clean@tapserve.demo",
      experience: "7 years commercial & residential deep cleaning",
      docsList: [
        {
          id: "doc-6-1",
          title: "Postal ID (PhilPost)",
          type: "Government ID",
          verified: true,
          status: "Verified",
          docNumber: "PID-2023-882710",
          issuedDate: "Apr 09, 2023",
          expiryDate: "Apr 09, 2026",
          issuingAuthority: "Philippine Postal Corporation",
          documentCategory: "government_id",
          fileFormat: "PNG",
          fileSize: "1.6 MB",
          notes: "PhilPost hologram authenticated.",
        },
        {
          id: "doc-6-2",
          title: "Barangay San Pablo Clearance",
          type: "Clearance",
          verified: true,
          status: "Verified",
          docNumber: "BC-SP-2026-5521",
          issuedDate: "Oct 01, 2026",
          expiryDate: "Apr 01, 2027",
          issuingAuthority: "Barangay IV-A San Pablo City",
          documentCategory: "clearance",
          fileFormat: "PNG",
          fileSize: "2.1 MB",
          notes: "Certificate of residency and good moral character verified.",
        },
      ],
    },
    {
      id: "cred-7",
      name: "Kuya Cardo",
      initials: "KC",
      avatarBg: "bg-orange-500",
      serviceType: "Electrical Services",
      submittedDate: "Oct 8, 2026",
      providedDocs: "Government ID",
      status: "Rejected",
      phone: "+63 916 332 1109",
      email: "cardo.e@outlook.com",
      experience: "3 years wiring (lacks Master Electrician certification)",
      docsList: [
        {
          id: "doc-7-1",
          title: "Voter's Certificate",
          type: "Government ID",
          verified: false,
          status: "Needs Re-upload",
          docNumber: "COMELEC-2022-091823",
          issuedDate: "May 09, 2022",
          expiryDate: "Indefinite",
          issuingAuthority: "Commission on Elections (COMELEC San Pablo)",
          documentCategory: "government_id",
          fileFormat: "PNG",
          fileSize: "1.4 MB",
          notes: "Applicant must provide TESDA NC II Electrical certification or Master Electrician license. Basic voter certificate alone is insufficient for electrical services.",
          rejectionReason: "Missing TESDA NC II electrical trade certification or Master Electrician license.",
        },
      ],
    },
  ]);

  const handleUpdateDocStatus = (
    credentialId: string,
    docIndex: number,
    newStatus: "Verified" | "Pending Review" | "Needs Re-upload",
    note?: string,
    reason?: string
  ) => {
    setCredentialsList((prev) =>
      prev.map((c) => {
        if (c.id !== credentialId) return c;
        const nextDocs = c.docsList.map((d, idx) => {
          if (idx !== docIndex) return d;
          return {
            ...d,
            verified: newStatus === "Verified",
            status: newStatus,
            notes: note !== undefined ? note : d.notes,
            rejectionReason: reason !== undefined ? reason : d.rejectionReason,
          };
        });
        return {
          ...c,
          docsList: nextDocs,
        };
      })
    );

    setSelectedCredential((prev) => {
      if (!prev || prev.id !== credentialId) return prev;
      const nextDocs = prev.docsList.map((d, idx) => {
        if (idx !== docIndex) return d;
        return {
          ...d,
          verified: newStatus === "Verified",
          status: newStatus,
          notes: note !== undefined ? note : d.notes,
          rejectionReason: reason !== undefined ? reason : d.rejectionReason,
        };
      });
      return {
        ...prev,
        docsList: nextDocs,
      };
    });
  };

  // ─── Accounts State ──────────────────────────────────────────────────────────
  const [accountRoleFilter, setAccountRoleFilter] = useState<
    "All" | "Customer" | "Service Provider" | "Admin" | "Suspended"
  >("All");
  const [selectedUser, setSelectedUser] = useState<UserAccountItem | null>(null);

  const [usersList, setUsersList] = useState<UserAccountItem[]>([
    {
      id: "u1",
      userId: "#u1",
      name: "Carlo Santos",
      initials: "CS",
      avatarBg: "bg-orange-500",
      role: "Customer",
      email: "carlo.santos@tapserve.demo",
      registered: "Oct 12, 2026",
      status: "Active",
      standing: "Good Standing",
      lastActive: "2 hours ago",
      phone: "+63 918 234 5678",
      rating: 4.7,
      warningsCount: 0,
      violationsCount: 0,
      cancellationsCount: 0,
      recentBooking: { id: "#BK-8839", service: "House Cleaning", status: "Completed" },
    },
    {
      id: "u2",
      userId: "#u2",
      name: "Arianne Cruz",
      initials: "AC",
      avatarBg: "bg-blue-600",
      role: "Customer",
      email: "arianne.c@yahoo.com",
      registered: "Oct 11, 2026",
      status: "Active",
      standing: "Good Standing",
      lastActive: "5 hours ago",
      phone: "+63 917 889 4432",
      rating: 4.9,
      warningsCount: 0,
      violationsCount: 0,
      cancellationsCount: 0,
      recentBooking: { id: "#BK-8839", service: "House Cleaning", status: "Completed" },
    },
    {
      id: "u3",
      userId: "#u3",
      name: "Jose Rodriguez",
      initials: "JR",
      avatarBg: "bg-purple-600",
      role: "Customer",
      email: "j.rodriguez@outlook.com",
      registered: "Oct 8, 2026",
      status: "Suspended",
      standing: "Temporarily Suspended",
      lastActive: "3 days ago",
      phone: "+63 920 334 1122",
      rating: 3.2,
      warningsCount: 2,
      violationsCount: 1,
      cancellationsCount: 3,
    },
    {
      id: "u4",
      userId: "#u4",
      name: "Maricar Roxas",
      initials: "MR",
      avatarBg: "bg-purple-600",
      role: "Customer",
      email: "maricar.roxas@gmail.com",
      registered: "Oct 5, 2026",
      status: "Active",
      standing: "Good Standing",
      lastActive: "1 day ago",
      phone: "+63 916 445 8890",
      rating: 4.8,
      warningsCount: 0,
      violationsCount: 0,
      cancellationsCount: 0,
    },
    {
      id: "u5",
      userId: "#u5",
      name: "Gabriel Lim",
      initials: "GL",
      avatarBg: "bg-emerald-600",
      role: "Customer",
      email: "gab.lim@live.com",
      registered: "Oct 1, 2026",
      status: "Active",
      standing: "Good Standing",
      lastActive: "3 hours ago",
      phone: "+63 928 901 3345",
      rating: 4.6,
      warningsCount: 0,
      violationsCount: 0,
      cancellationsCount: 1,
    },
    {
      id: "u6",
      userId: "#u6",
      name: "Kuya Reynaldo",
      initials: "KR",
      avatarBg: "bg-orange-500",
      role: "Service Provider",
      email: "kuya.reynaldo@tapserve.demo",
      registered: "Oct 15, 2026",
      status: "Active",
      standing: "Good Standing",
      lastActive: "1 hour ago",
      phone: "+63 917 555 9012",
      rating: 4.9,
      warningsCount: 0,
      violationsCount: 0,
      cancellationsCount: 0,
    },
    {
      id: "u7",
      userId: "#u7",
      name: "Ate Maria",
      initials: "AM",
      avatarBg: "bg-blue-600",
      role: "Service Provider",
      email: "ate.maria@gmail.com",
      registered: "Oct 10, 2026",
      status: "Active",
      standing: "Good Standing",
      lastActive: "4 hours ago",
      phone: "+63 919 778 3341",
      rating: 4.8,
      warningsCount: 0,
      violationsCount: 0,
      cancellationsCount: 0,
    },
    {
      id: "u8",
      userId: "#u8",
      name: "Maria Santos",
      initials: "MS",
      avatarBg: "bg-teal-700",
      role: "Admin",
      email: "maria.santos@tapserve.ph",
      registered: "Jan 1, 2026",
      status: "Active",
      standing: "Good Standing",
      lastActive: "Now",
      phone: "+63 917 000 8888",
      rating: 5.0,
      warningsCount: 0,
      violationsCount: 0,
      cancellationsCount: 0,
    },
    {
      id: "u9",
      userId: "#u9",
      name: "Roselle Diaz",
      initials: "RD",
      avatarBg: "bg-pink-600",
      role: "Customer",
      email: "roselle.diaz@gmail.com",
      registered: "Sep 20, 2026",
      status: "Active",
      standing: "Warning",
      lastActive: "2 days ago",
      phone: "+63 922 771 9900",
      rating: 3.9,
      warningsCount: 1,
      violationsCount: 0,
      cancellationsCount: 2,
    },
    {
      id: "u10",
      userId: "#u10",
      name: "Arthur Pendragon",
      initials: "AP",
      avatarBg: "bg-blue-700",
      role: "Customer",
      email: "arthur.p@gmail.com",
      registered: "Sep 15, 2026",
      status: "Active",
      standing: "Restricted",
      lastActive: "1 hour ago",
      phone: "+63 918 667 2231",
      rating: 3.5,
      warningsCount: 1,
      violationsCount: 1,
      cancellationsCount: 4,
    },
  ]);

  // ─── Bookings State ──────────────────────────────────────────────────────────
  const [bookingStatusFilter, setBookingStatusFilter] = useState("All");
  const [bookingServiceFilter, setBookingServiceFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] =
    useState<AdminBookingItem | null>(null);

  const [adminBookings, setAdminBookings] = useState<AdminBookingItem[]>([
    {
      id: "#BK-8840",
      customerName: "Carlo Santos",
      customerInitials: "CS",
      customerLocation: "Quezon City",
      providerName: "Kuya Reynaldo",
      providerInitials: "KR",
      providerTitle: "Plumbing Specialist",
      service: "Plumbing Repair",
      serviceCategory: "Plumbing",
      dateTime: "Oct 28, 2026 · 2:30 PM",
      amount: 350,
      status: "In Progress",
      paymentStatus: "Paid",
      timeline: [
        { time: "2:00 PM", text: "Booking confirmed" },
        { time: "2:25 PM", text: "Provider en route" },
        { time: "2:30 PM", text: "Service started" },
      ],
    },
    {
      id: "#BK-8839",
      customerName: "Arianne Cruz",
      customerInitials: "AC",
      customerLocation: "San Pablo City",
      providerName: "Ate Maria",
      providerInitials: "AM",
      providerTitle: "Cleaning Specialist",
      service: "House Cleaning",
      serviceCategory: "Cleaning",
      dateTime: "Oct 28, 2026 · 11:00 AM",
      amount: 280,
      status: "Completed",
      paymentStatus: "Paid",
      timeline: [
        { time: "10:30 AM", text: "Provider arrived" },
        { time: "11:00 AM", text: "House deep clean started" },
        { time: "1:15 PM", text: "Service marked completed and settled" },
      ],
    },
    {
      id: "#BK-8838",
      customerName: "Gabriel Lim",
      customerInitials: "GL",
      customerLocation: "San Pablo City",
      providerName: "Kuya Cardo",
      providerInitials: "KC",
      providerTitle: "Emergency Plumber",
      service: "Electrical Check",
      serviceCategory: "Electrical",
      dateTime: "Oct 27, 2026 · 4:15 PM",
      amount: 380,
      status: "Confirmed",
      paymentStatus: "Pending",
      timeline: [
        { time: "3:40 PM", text: "Booking accepted by specialist" },
        { time: "4:00 PM", text: "Pre-service diagnostics checklist sent" },
      ],
    },
    {
      id: "#BK-8837",
      customerName: "Roselle Diaz",
      customerInitials: "RD",
      customerLocation: "San Pablo City",
      providerName: "Kuya Jose",
      providerInitials: "KJ",
      providerTitle: "Master Electrician",
      service: "Garden Weeding",
      serviceCategory: "Gardening",
      dateTime: "Oct 26, 2026 · 9:00 AM",
      amount: 300,
      status: "Cancelled",
      paymentStatus: "Refunded",
      timeline: [
        { time: "8:00 AM", text: "Booking submitted" },
        { time: "8:30 AM", text: "Cancelled by customer (Schedule conflict)" },
      ],
    },
    {
      id: "#BK-8836",
      customerName: "Rico Blanco",
      customerInitials: "RB",
      customerLocation: "Brgy. San Roque",
      providerName: "Ate Linda",
      providerInitials: "AL",
      providerTitle: "Housekeeping",
      service: "General Cleaning",
      serviceCategory: "Cleaning",
      dateTime: "Oct 25, 2026 · 1:30 PM",
      amount: 450,
      status: "Completed",
      paymentStatus: "Paid",
      timeline: [
        { time: "1:20 PM", text: "Arrived at location" },
        { time: "4:00 PM", text: "Completed inspection and settled" },
      ],
    },
    {
      id: "#BK-8835",
      customerName: "Arthur Pendragon",
      customerInitials: "AP",
      customerLocation: "Quezon City",
      providerName: "Kuya Reynaldo",
      providerInitials: "KR",
      providerTitle: "Master Plumber",
      service: "Plumbing Repair",
      serviceCategory: "Plumbing",
      dateTime: "Oct 24, 2026 · 10:00 AM",
      amount: 420,
      status: "Disputed",
      paymentStatus: "Pending",
      timeline: [
        { time: "9:50 AM", text: "Provider arrived on site" },
        { time: "10:15 AM", text: "Customer reported cancellation dispute" },
      ],
    },
  ]);

  // Set default selection when tab changes
  React.useEffect(() => {
    if (activeTab === "credentials" && !selectedCredential) {
      setSelectedCredential(credentialsList[0]);
    }
    if (activeTab === "accounts" && !selectedUser) {
      setSelectedUser(usersList[0]);
    }
    if (activeTab === "bookings" && !selectedBooking) {
      setSelectedBooking(adminBookings[0]);
    }
  }, [activeTab]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] text-[#0f172a] font-sans">
      {/* ─── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-[240px] shrink-0 bg-[#062e28] text-white flex flex-col justify-between select-none border-r border-[#0a3f37] z-20">
        <div>
          {/* Brand Logo Header */}
          <div className="p-5 flex items-center gap-3 border-b border-white/10">
            <TapServeIcon size={34} />
            <div className="flex flex-col">
              <span
                className="text-white text-lg font-bold tracking-tight"
                style={{ fontFamily: "Lexend Deca, sans-serif" }}
              >
                TapServe
              </span>
              <span className="text-[#5eead4] text-[10px] font-semibold uppercase tracking-wider">
                Admin Web Portal
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 flex flex-col gap-1">
            {[
              {
                id: "dashboard",
                label: "Dashboard",
                icon: (
                  <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                ),
              },
              {
                id: "credentials",
                label: "Credentials",
                badge: "4",
                icon: (
                  <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
              },
              {
                id: "accounts",
                label: "Accounts",
                icon: (
                  <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
              },
              {
                id: "bookings",
                label: "Bookings",
                badge: "7",
                icon: (
                  <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                id: "sales",
                label: "Sales & Plans",
                badge: "10% Cut",
                icon: (
                  <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                id: "concerns",
                label: "Concerns",
                badge: "2",
                icon: (
                  <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                id: "violations",
                label: "Violations",
                badge: "2",
                icon: (
                  <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ),
              },
              {
                id: "appeals",
                label: "Appeals",
                badge: "2",
                icon: (
                  <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                ),
              },
              {
                id: "mod-rules",
                label: "Mod. Rules",
                icon: (
                  <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                ),
              },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as AdminTab);
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all touch-manipulation cursor-pointer ${
                    isActive
                      ? "bg-[#0d9488] text-white shadow-sm font-bold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {tab.icon}
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? "bg-white/25 text-white"
                          : "bg-white/10 text-slate-300"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 flex flex-col gap-3">
          {/* Toggle Switch to Customer Mobile App */}
          <button
            onClick={onSwitchToMobile}
            className="flex items-center justify-center gap-2 bg-[#0d9488] hover:bg-[#0f766e] text-white px-3 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-98 cursor-pointer"
            title="Switch view to Customer Mobile Application"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>📱 Customer App</span>
          </button>

          {/* Toggle Switch to Provider Mode */}
          {onSwitchToProvider && (
            <button
              onClick={onSwitchToProvider}
              className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-3 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-98 cursor-pointer"
              title="Switch view to Service Provider Mode"
            >
              <span>👷 Provider Mode</span>
            </button>
          )}

          {/* Logout Button */}
          <button
            onClick={() => onToast("Admin session ended.")}
            className="flex items-center gap-2 text-slate-300 hover:text-rose-400 px-2 py-1.5 text-xs font-medium transition-colors"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>

          {/* Admin User Profile Tag */}
          <div className="flex items-center gap-2.5 pt-2 border-t border-white/10">
            <div className="size-8 rounded-full bg-[#0d9488] text-white flex items-center justify-center text-xs font-bold border border-white/20 shrink-0">
              MS
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-white text-xs font-bold truncate">Maria Santos</span>
              <span className="text-[#94a3b8] text-[10px] truncate">Platform Administrator</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Main Content Area ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-[#e2e8f0] px-6 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-4">
            <h1
              className="text-[#0f172a] text-lg font-bold"
              style={{ fontFamily: "Lexend Deca, sans-serif" }}
            >
              {activeTab === "dashboard" && "Dashboard Overview"}
              {activeTab === "credentials" && "Credential Verification"}
              {activeTab === "accounts" && "User & Provider Account Management"}
              {activeTab === "bookings" && "Booking Oversight"}
              {activeTab === "sales" && "Platform Sales, Revenue & Subscriptions"}
              {activeTab === "concerns" && "Concerns & Reports Oversight"}
              {activeTab === "violations" && "Violations"}
              {activeTab === "appeals" && "Appeals"}
              {activeTab === "mod-rules" && "Moderation Rules"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search accounts, bookings..."
                className="w-64 pl-9 pr-3 py-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-xs text-[#0f172a] placeholder-[#94a3b8] outline-none focus:border-[#0d9488] transition-colors"
              />
              <svg className="size-4 text-[#94a3b8] absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="size-9 rounded-xl border border-[#e2e8f0] bg-white flex items-center justify-center text-[#64748b] hover:text-[#0f172a] relative active:bg-slate-50 transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-1 -right-1 size-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  4
                </span>
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#e2e8f0] p-3 flex flex-col gap-2 z-50 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
                    <span className="text-xs font-bold text-[#0f172a]">Admin Alerts (4)</span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-[10px] text-[#0d9488] font-bold hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  {[
                    "New credential application submitted by Rogelio Dela Cruz",
                    "Disputed booking #BK-8835 requires moderation review",
                    "Arthur Pendragon submitted an appeal #AP-004",
                    "Weekly provider audit log successfully generated",
                  ].map((msg, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-[#f8fafc] text-xs text-[#334155] border border-[#f1f5f9] flex gap-2">
                      <span className="text-teal-600 mt-0.5">•</span>
                      <span>{msg}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Toggle Mode Switcher Button (Prominent) */}
            <div className="flex items-center bg-[#f1f5f9] p-1 rounded-xl border border-[#e2e8f0]">
              <button
                onClick={onSwitchToMobile}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#475569] hover:text-[#0f172a] hover:bg-white transition-all cursor-pointer"
                title="Switch to Mobile App Preview"
              >
                <span>📱</span>
                <span className="hidden sm:inline">Mobile App</span>
              </button>
              <button
                disabled
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0d9488] text-white shadow-2xs"
                title="Current View: Admin Web Portal"
              >
                <span>💻</span>
                <span className="hidden sm:inline">Admin Web</span>
              </button>
            </div>

            {/* Admin Avatar */}
            <div className="size-9 rounded-full bg-[#0d9488] text-white flex items-center justify-center text-xs font-bold border border-[#0f766e]">
              MS
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-6 bg-[#f8fafc]">
          {activeTab === "dashboard" && (
            <DashboardOverviewView
              onSelectTab={(tab) => setActiveTab(tab)}
              onToast={onToast}
            />
          )}

          {activeTab === "credentials" && (
            <CredentialsView
              filter={credentialFilter}
              onFilterChange={setCredentialFilter}
              credentials={credentialsList}
              selectedItem={selectedCredential}
              onSelectItem={setSelectedCredential}
              onApprove={(id) => {
                setCredentialsList((prev) =>
                  prev.map((c) => (c.id === id ? { ...c, status: "Verified" } : c))
                );
                if (selectedCredential?.id === id) {
                  setSelectedCredential((prev) =>
                    prev ? { ...prev, status: "Verified" } : null
                  );
                }
                onToast("Specialist credentials verified and approved!");
              }}
              onReject={(id) => {
                setCredentialsList((prev) =>
                  prev.map((c) => (c.id === id ? { ...c, status: "Rejected" } : c))
                );
                if (selectedCredential?.id === id) {
                  setSelectedCredential((prev) =>
                    prev ? { ...prev, status: "Rejected" } : null
                  );
                }
                onToast("Specialist application rejected.");
              }}
              onOpenDocReview={(item, docIdx) => {
                setSelectedCredential(item);
                setReviewingDocTarget({
                  credentialId: item.id,
                  docIndex: docIdx !== undefined ? docIdx : 0,
                });
              }}
              search={searchQuery}
            />
          )}

          {activeTab === "accounts" && (
            <AccountsView
              filter={accountRoleFilter}
              onFilterChange={setAccountRoleFilter}
              users={usersList}
              selectedUser={selectedUser}
              onSelectUser={setSelectedUser}
              search={searchQuery}
              onUpdateStanding={(userId, standing, status) => {
                setUsersList((prev) =>
                  prev.map((u) =>
                    u.id === userId ? { ...u, standing, status } : u
                  )
                );
                if (selectedUser?.id === userId) {
                  setSelectedUser((prev) =>
                    prev ? { ...prev, standing, status } : null
                  );
                }
                onToast(`User standing updated to ${standing}`);
              }}
            />
          )}

          {activeTab === "bookings" && (
            <BookingOversightView
              bookings={adminBookings}
              selectedBooking={selectedBooking}
              onSelectBooking={setSelectedBooking}
              statusFilter={bookingStatusFilter}
              onStatusFilterChange={setBookingStatusFilter}
              serviceFilter={bookingServiceFilter}
              onServiceFilterChange={setBookingServiceFilter}
              search={searchQuery}
              onUpdateBookingStatus={(bookingId, status) => {
                setAdminBookings((prev) =>
                  prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
                );
                if (selectedBooking?.id === bookingId) {
                  setSelectedBooking((prev) =>
                    prev ? { ...prev, status } : null
                  );
                }
                onToast(`Booking ${bookingId} status updated to ${status}`);
              }}
            />
          )}

          {activeTab === "sales" && (
            <SalesAndSubscriptionsView
              bookings={adminBookings}
              onToast={onToast}
              globalSearch={searchQuery}
            />
          )}

          {activeTab === "concerns" && <ConcernsView onToast={onToast} globalSearch={searchQuery} />}
          {activeTab === "violations" && <ViolationsView onToast={onToast} globalSearch={searchQuery} />}
          {activeTab === "appeals" && <AppealsView onToast={onToast} globalSearch={searchQuery} />}
          {activeTab === "mod-rules" && <ModRulesView onToast={onToast} globalSearch={searchQuery} />}
        </main>
      </div>

      {/* ─── Document Review & Inspection Modal ─── */}
      {reviewingDocTarget && (() => {
        const targetCred = credentialsList.find(
          (c) => c.id === reviewingDocTarget.credentialId
        );
        if (!targetCred) return null;
        return (
          <DocumentReviewModal
            credential={targetCred}
            activeDocIndex={reviewingDocTarget.docIndex}
            onChangeDocIndex={(idx) =>
              setReviewingDocTarget({
                credentialId: reviewingDocTarget.credentialId,
                docIndex: idx,
              })
            }
            onClose={() => setReviewingDocTarget(null)}
            onUpdateDocStatus={(docIdx, status, note, reason) =>
              handleUpdateDocStatus(targetCred.id, docIdx, status, note, reason)
            }
            onApproveApplicant={(id) => {
              setCredentialsList((prev) =>
                prev.map((c) => (c.id === id ? { ...c, status: "Verified" } : c))
              );
              if (selectedCredential?.id === id) {
                setSelectedCredential((prev) =>
                  prev ? { ...prev, status: "Verified" } : null
                );
              }
              setReviewingDocTarget(null);
              onToast("All documents verified! Specialist credentials approved.");
            }}
            onRejectApplicant={(id) => {
              setCredentialsList((prev) =>
                prev.map((c) => (c.id === id ? { ...c, status: "Rejected" } : c))
              );
              if (selectedCredential?.id === id) {
                setSelectedCredential((prev) =>
                  prev ? { ...prev, status: "Rejected" } : null
                );
              }
              setReviewingDocTarget(null);
              onToast("Specialist application flagged and rejected.");
            }}
            onToast={onToast}
          />
        );
      })()}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. DASHBOARD OVERVIEW VIEW (Screenshots 1 & 2)
// ─────────────────────────────────────────────────────────────────────────────
function DashboardOverviewView({
  onSelectTab,
  onToast,
}: {
  onSelectTab: (t: AdminTab) => void;
  onToast: (m: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5 max-w-[1400px] mx-auto">
      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {[
          { label: "Total Platform Users", value: "10", trend: "+12.4% vs last week", positive: true },
          { label: "Active Specialists", value: "2", trend: "+4.2% vs last week", positive: true },
          { label: "Bookings Completed", value: "3", trend: "+8.1% vs last week", positive: true },
          { label: "Pending Verifications", value: "4", trend: "-12.3% vs last week", positive: false },
          { label: "Open Concerns", value: "2", trend: "+3% vs last week", positive: true },
        ].map((k, i) => (
          <div
            key={i}
            className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-1 shadow-xs hover:border-[#0d9488]/40 transition-all"
          >
            <span className="text-[#64748b] text-[11px] font-medium">{k.label}</span>
            <span className="text-[#0f172a] text-2xl font-bold tracking-tight">{k.value}</span>
            <span
              className={`text-[11px] font-semibold ${
                k.positive ? "text-emerald-600" : "text-rose-500"
              }`}
            >
              {k.trend}
            </span>
          </div>
        ))}
      </div>

      {/* KPI Cards Row 2 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {[
          { label: "Users with Warnings", value: "1", color: "text-amber-500" },
          { label: "Restricted Accounts", value: "2", color: "text-orange-500" },
          { label: "Suspended/Banned", value: "1", color: "text-rose-600" },
          { label: "Pending Violations", value: "2", color: "text-orange-600" },
          { label: "Pending Appeals", value: "2", color: "text-blue-600" },
        ].map((k, i) => (
          <div
            key={i}
            className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-1 shadow-xs"
          >
            <span className="text-[#64748b] text-[11px] font-medium">{k.label}</span>
            <span className={`text-2xl font-bold tracking-tight ${k.color}`}>
              {k.value}
            </span>
          </div>
        ))}
      </div>

      {/* Middle Grid: Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bookings & Demand Trend (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-[#e2e8f0] rounded-2xl p-5 flex flex-col gap-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-[#0f172a] text-sm font-bold">Bookings & Demand Trend</h2>
            <span className="text-xs text-[#0d9488] font-bold">Past 7 Days</span>
          </div>

          {/* SVG Line Chart */}
          <div className="h-52 w-full pt-4">
            <svg viewBox="0 0 600 180" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Gridlines */}
              <line x1="20" y1="30" x2="580" y2="30" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="20" y1="75" x2="580" y2="75" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="20" y1="120" x2="580" y2="120" stroke="#f1f5f9" strokeWidth="1" />

              {/* Area path */}
              <path
                d="M 30 130 C 90 115, 120 70, 160 85 C 200 95, 230 110, 270 95 C 320 80, 370 70, 420 50 C 470 35, 520 25, 570 15 L 570 150 L 30 150 Z"
                fill="url(#trendGradient)"
              />

              {/* Line path */}
              <path
                d="M 30 130 C 90 115, 120 70, 160 85 C 200 95, 230 110, 270 95 C 320 80, 370 70, 420 50 C 470 35, 520 25, 570 15"
                fill="none"
                stroke="#0d9488"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              {[
                { x: 30, y: 130, val: "2" },
                { x: 120, y: 75, val: "5" },
                { x: 210, y: 88, val: "4" },
                { x: 300, y: 82, val: "6" },
                { x: 390, y: 62, val: "8" },
                { x: 480, y: 38, val: "11" },
                { x: 570, y: 15, val: "15" },
              ].map((pt, idx) => (
                <g key={idx} className="cursor-pointer group">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5.5"
                    fill="white"
                    stroke="#0d9488"
                    strokeWidth="3"
                    className="group-hover:scale-125 transition-transform"
                  />
                </g>
              ))}

              {/* X Axis Labels */}
              <g className="text-[11px] fill-[#94a3b8] font-medium">
                <text x="30" y="172" textAnchor="middle">Mon</text>
                <text x="120" y="172" textAnchor="middle">Tue</text>
                <text x="210" y="172" textAnchor="middle">Wed</text>
                <text x="300" y="172" textAnchor="middle">Thu</text>
                <text x="390" y="172" textAnchor="middle">Fri</text>
                <text x="480" y="172" textAnchor="middle">Sat</text>
                <text x="570" y="172" textAnchor="middle">Sun</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Service Distribution (1 col) */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 flex flex-col gap-3 shadow-xs">
          <h2 className="text-[#0f172a] text-sm font-bold">Service Distribution</h2>

          <div className="flex flex-col items-center justify-center py-2 relative">
            <svg viewBox="0 0 160 160" className="size-40">
              {/* Donut rings */}
              {/* Cleaning: 38% -> 0 to 136.8 deg */}
              <circle
                cx="80"
                cy="80"
                r="56"
                fill="transparent"
                stroke="#0d9488"
                strokeWidth="16"
                strokeDasharray="134 352"
                strokeDashoffset="0"
              />
              {/* Plumbing: 27% -> 136.8 to 234 deg */}
              <circle
                cx="80"
                cy="80"
                r="56"
                fill="transparent"
                stroke="#0284c7"
                strokeWidth="16"
                strokeDasharray="95 352"
                strokeDashoffset="-134"
              />
              {/* Electrical: 20% */}
              <circle
                cx="80"
                cy="80"
                r="56"
                fill="transparent"
                stroke="#f59e0b"
                strokeWidth="16"
                strokeDasharray="70 352"
                strokeDashoffset="-229"
              />
              {/* Gardening: 15% */}
              <circle
                cx="80"
                cy="80"
                r="56"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="16"
                strokeDasharray="53 352"
                strokeDashoffset="-299"
              />
            </svg>

            {/* Center label */}
            <div className="absolute flex flex-col items-center text-center">
              <span className="text-[10px] text-[#64748b] font-medium leading-none">
                Total Bookings
              </span>
              <span className="text-base font-bold text-[#0f172a] leading-tight">
                1,482
              </span>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="flex flex-col gap-1.5 pt-1 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-[#0d9488]" />
                <span className="text-[#334155] font-medium">Cleaning</span>
              </div>
              <span className="font-bold text-[#0f172a]">38%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-[#0284c7]" />
                <span className="text-[#334155] font-medium">Plumbing</span>
              </div>
              <span className="font-bold text-[#0f172a]">27%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-[#f59e0b]" />
                <span className="text-[#334155] font-medium">Electrical</span>
              </div>
              <span className="font-bold text-[#0f172a]">20%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-[#10b981]" />
                <span className="text-[#334155] font-medium">Gardening</span>
              </div>
              <span className="font-bold text-[#0f172a]">15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity & Community Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Booking Activity (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-[#e2e8f0] rounded-2xl p-5 flex flex-col gap-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-[#0f172a] text-sm font-bold">Recent Booking Activity</h2>
            <button
              onClick={() => onSelectTab("bookings")}
              className="text-xs text-[#0d9488] font-bold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[#64748b] border-b border-[#f1f5f9]">
                  <th className="py-2.5 font-semibold">Customer</th>
                  <th className="py-2.5 font-semibold">Service Type</th>
                  <th className="py-2.5 font-semibold">Provider</th>
                  <th className="py-2.5 font-semibold">Amount</th>
                  <th className="py-2.5 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f8fafc]">
                {[
                  { customer: "Carlo Santos", type: "Plumbing Repair", prov: "Kuya Reynaldo", amount: "₱350", status: "In Progress", badge: "bg-blue-50 text-blue-700" },
                  { customer: "Arianne Cruz", type: "House Cleaning", prov: "Ate Maria", amount: "₱280", status: "Completed", badge: "bg-emerald-50 text-emerald-700" },
                  { customer: "Gabriel Lim", type: "Electrical Check", prov: "Kuya Cardo", amount: "₱380", status: "Confirmed", badge: "bg-blue-50 text-blue-700" },
                  { customer: "Roselle Diaz", type: "Garden Weeding", prov: "Kuya Jose", amount: "₱300", status: "Cancelled", badge: "bg-rose-50 text-rose-700" },
                  { customer: "Rico Blanco", type: "General Cleaning", prov: "Ate Linda", amount: "₱450", status: "Completed", badge: "bg-emerald-50 text-emerald-700" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-3 font-semibold text-[#0f172a]">{row.customer}</td>
                    <td className="py-3 text-[#475569]">{row.type}</td>
                    <td className="py-3 text-[#475569]">{row.prov}</td>
                    <td className="py-3 font-bold text-[#0f172a]">{row.amount}</td>
                    <td className="py-3 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${row.badge}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Stack: Community Health & Violations (1 col) */}
        <div className="flex flex-col gap-4">
          {/* Community Health */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-[#0f172a] text-sm font-bold">Community Health</h2>
              <button
                onClick={() => onSelectTab("accounts")}
                className="text-xs text-[#0d9488] font-bold hover:underline"
              >
                View All
              </button>
            </div>

            <div className="flex flex-col gap-2 pt-1 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#334155] font-semibold">Good Standing</span>
                  <span className="font-bold text-[#0f172a]">9</span>
                </div>
                <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#0d9488] h-full w-[90%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#334155] font-semibold">Warning</span>
                  <span className="font-bold text-[#0f172a]">1</span>
                </div>
                <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[10%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#334155] font-semibold">Restricted</span>
                  <span className="font-bold text-[#0f172a]">2</span>
                </div>
                <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full w-[20%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#334155] font-semibold">Suspended</span>
                  <span className="font-bold text-[#0f172a]">1</span>
                </div>
                <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full w-[10%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Violations */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-[#0f172a] text-sm font-bold">Recent Violations</h2>
              <button
                onClick={() => onSelectTab("violations")}
                className="text-xs text-[#0d9488] font-bold hover:underline"
              >
                View All
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {[
                { name: "Arthur Pendragon", desc: "Accepted Booking Cancellation Abuse", status: "Confirmed", badge: "bg-blue-50 text-blue-700" },
                { name: "Roselle Diaz", desc: "Accepted Booking Cancellation Abuse", status: "Pending Review", badge: "bg-amber-50 text-amber-700" },
                { name: "Jose Rodriguez", desc: "Harassment", status: "Confirmed", badge: "bg-blue-50 text-blue-700" },
              ].map((v, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-[#f8fafc] border border-[#f1f5f9]">
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-xs font-bold text-[#0f172a]">{v.name}</span>
                    <span className="text-[10px] text-[#64748b] truncate">{v.desc}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${v.badge}`}>
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pending Appeals Banner */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 flex flex-col gap-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-[#0f172a] text-sm font-bold">Pending Appeals</h2>
          <button
            onClick={() => onSelectTab("appeals")}
            className="text-xs text-[#0d9488] font-bold hover:underline"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#0d9488]">#AP-003</span>
              <span className="text-xs font-bold text-[#0f172a]">Jose Rodriguez</span>
              <span className="text-[11px] text-[#64748b]">Harassment · Temporary Suspension (7 days)</span>
            </div>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
              Under Review
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#0d9488]">#AP-004</span>
              <span className="text-xs font-bold text-[#0f172a]">Roselle Diaz</span>
              <span className="text-[11px] text-[#64748b]">Cancellation Abuse · Warning</span>
            </div>
            <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
              Pending
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CREDENTIAL VERIFICATION VIEW (Screenshot 3)
// ─────────────────────────────────────────────────────────────────────────────
function CredentialsView({
  filter,
  onFilterChange,
  credentials,
  selectedItem,
  onSelectItem,
  onApprove,
  onReject,
  onOpenDocReview,
  search,
}: {
  filter: "All" | "Pending" | "Approved" | "Rejected";
  onFilterChange: (f: "All" | "Pending" | "Approved" | "Rejected") => void;
  credentials: CredentialItem[];
  selectedItem: CredentialItem | null;
  onSelectItem: (item: CredentialItem) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onOpenDocReview?: (item: CredentialItem, docIndex: number) => void;
  search: string;
}) {
  const filtered = credentials.filter((c) => {
    if (filter === "Pending" && c.status !== "Pending") return false;
    if (filter === "Approved" && c.status !== "Verified") return false;
    if (filter === "Rejected" && c.status !== "Rejected") return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.serviceType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = credentials.filter((c) => c.status === "Pending").length;
  const approvedCount = credentials.filter((c) => c.status === "Verified").length;
  const rejectedCount = credentials.filter((c) => c.status === "Rejected").length;

  const selectedVerifiedDocs =
    selectedItem?.docsList.filter((d) => d.status === "Verified").length || 0;
  const totalSelectedDocs = selectedItem?.docsList.length || 0;

  return (
    <div className="flex gap-5 h-full max-w-[1400px] mx-auto">
      {/* Left List Table */}
      <div className="flex-1 bg-white border border-[#e2e8f0] rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
        {/* Tabs Row */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "All", label: `All (${credentials.length})` },
            { id: "Pending", label: `Pending (${pendingCount})` },
            { id: "Approved", label: `Approved (${approvedCount})` },
            { id: "Rejected", label: `Rejected (${rejectedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === tab.id
                  ? "bg-[#0d9488] text-white shadow-2xs"
                  : "bg-[#f8fafc] text-[#64748b] hover:bg-slate-100 border border-[#e2e8f0]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table of Specialists */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#64748b] border-b border-[#f1f5f9]">
                <th className="py-2.5 font-semibold">Specialist Name</th>
                <th className="py-2.5 font-semibold">Service Type</th>
                <th className="py-2.5 font-semibold">Submitted Date</th>
                <th className="py-2.5 font-semibold">Submitted Docs (Click to Review)</th>
                <th className="py-2.5 font-semibold">Status</th>
                <th className="py-2.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className={`cursor-pointer transition-colors ${
                    selectedItem?.id === item.id
                      ? "bg-[#f0fdfa]"
                      : "hover:bg-[#f8fafc]"
                  }`}
                >
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`size-7 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0 ${item.avatarBg}`}
                      >
                        {item.initials}
                      </div>
                      <span className="font-bold text-[#0f172a]">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-[#475569]">{item.serviceType}</td>
                  <td className="py-3 text-[#64748b]">{item.submittedDate}</td>
                  <td className="py-3 font-medium">
                    <div className="flex flex-wrap items-center gap-1.5 max-w-[260px]">
                      {item.docsList.map((d, dIdx) => (
                        <button
                          key={d.id || dIdx}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectItem(item);
                            if (onOpenDocReview) onOpenDocReview(item, dIdx);
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded-lg font-medium border flex items-center gap-1 transition-all cursor-pointer ${
                            d.status === "Verified"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : d.status === "Needs Re-upload"
                              ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                              : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                          }`}
                          title={`Click to inspect ${d.title}`}
                        >
                          <span>{d.status === "Verified" ? "✓" : d.status === "Needs Re-upload" ? "⚠️" : "⏳"}</span>
                          <span className="truncate max-w-[110px]">{d.title.split(" ")[0]}</span>
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === "Pending"
                          ? "bg-amber-50 text-amber-700"
                          : item.status === "Verified"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectItem(item);
                          if (onOpenDocReview) onOpenDocReview(item, 0);
                        }}
                        className="bg-[#0f766e] hover:bg-[#115e59] text-white px-2.5 py-1 rounded-lg font-bold text-xs shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                        title="Check and inspect submitted documents"
                      >
                        <span>👁️</span> Inspect Docs
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectItem(item);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-[#334155] px-2 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Slide-over / Detail Review Panel */}
      <div className="w-[390px] shrink-0 bg-white border border-[#e2e8f0] rounded-2xl p-5 flex flex-col justify-between shadow-xs">
        {selectedItem ? (
          <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar">
            <div className="flex items-center gap-3 pb-3 border-b border-[#f1f5f9]">
              <div
                className={`size-12 rounded-full text-white text-base font-bold flex items-center justify-center shrink-0 ${selectedItem.avatarBg}`}
              >
                {selectedItem.initials}
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="text-sm font-bold text-[#0f172a] truncate">
                  {selectedItem.name}
                </h3>
                <span className="text-xs text-[#0d9488] font-semibold">
                  {selectedItem.serviceType}
                </span>
                <span className="text-[10px] text-[#94a3b8]">
                  Submitted {selectedItem.submittedDate}
                </span>
              </div>
            </div>

            {/* Contact info */}
            <div className="bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0] flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#64748b]">Phone:</span>
                <span className="font-semibold text-[#0f172a]">{selectedItem.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Email:</span>
                <span className="font-semibold text-[#0f172a] truncate ml-2">
                  {selectedItem.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Experience:</span>
                <span className="font-semibold text-[#0f172a]">{selectedItem.experience}</span>
              </div>
            </div>

            {/* Document Verification Checklist & Inspection */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
                  <span>📄</span> Submitted Documents ({totalSelectedDocs})
                </span>
                <button
                  onClick={() => onOpenDocReview && onOpenDocReview(selectedItem, 0)}
                  className="text-[11px] font-bold text-[#0d9488] hover:text-[#0f766e] flex items-center gap-0.5 hover:underline cursor-pointer"
                >
                  Inspect All 🔍
                </button>
              </div>

              {/* Document Audit Progress Bar */}
              <div className="bg-[#f8fafc] border border-[#e2e8f0] p-2.5 rounded-xl flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#64748b] font-medium">Verification Status:</span>
                  <span className="font-bold text-[#0f766e]">
                    {selectedVerifiedDocs} of {totalSelectedDocs} Verified
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0d9488] transition-all duration-300 rounded-full"
                    style={{
                      width: `${(selectedVerifiedDocs / Math.max(totalSelectedDocs, 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Document List Items */}
              <div className="flex flex-col gap-2">
                {selectedItem.docsList.map((doc, idx) => (
                  <div
                    key={doc.id || idx}
                    onClick={() => onOpenDocReview && onOpenDocReview(selectedItem, idx)}
                    className="p-3 rounded-xl border border-[#e2e8f0] bg-white hover:border-[#0d9488] hover:bg-[#f0fdfa]/40 cursor-pointer transition-all flex flex-col gap-2 group shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base shrink-0">
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
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-[#0f172a] group-hover:text-[#0d9488] transition-colors truncate block">
                            {doc.title}
                          </span>
                          <span className="text-[10px] text-[#64748b]">
                            {doc.type} • {doc.fileSize}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 border uppercase tracking-wider ${
                          doc.status === "Verified"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : doc.status === "Needs Re-upload"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {doc.status === "Verified"
                          ? "✓ Verified"
                          : doc.status === "Needs Re-upload"
                          ? "⚠️ Re-upload"
                          : "⏳ Pending"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#64748b] pt-1.5 border-t border-[#f1f5f9]">
                      <span className="truncate max-w-[200px] font-mono">
                        {doc.docNumber}
                      </span>
                      <span className="font-bold text-[#0d9488] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        Review Doc →
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Primary Review Documents CTA Button */}
              <button
                onClick={() => onOpenDocReview && onOpenDocReview(selectedItem, 0)}
                className="w-full mt-1 py-2.5 rounded-xl bg-[#0f766e] hover:bg-[#115e59] text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>🔍</span> Check & Inspect Submitted Documents
              </button>
            </div>

            {/* Status Badge */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-[#e2e8f0]">
              <span className="text-xs font-bold text-[#64748b]">Application Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedItem.status === "Pending"
                    ? "bg-amber-100 text-amber-800"
                    : selectedItem.status === "Verified"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {selectedItem.status}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center size-full text-center text-[#94a3b8] gap-2">
            <span className="text-3xl">📄</span>
            <p className="text-xs font-medium">Select a provider to review credentials</p>
          </div>
        )}

        {/* Action Buttons */}
        {selectedItem && (
          <div className="pt-4 border-t border-[#f1f5f9] flex gap-2">
            <button
              onClick={() => onReject(selectedItem.id)}
              className="flex-1 py-2.5 rounded-xl border border-rose-300 text-rose-600 text-xs font-bold hover:bg-rose-50 transition-colors cursor-pointer"
            >
              Reject Specialist
            </button>
            <button
              onClick={() => onApprove(selectedItem.id)}
              className="flex-1 py-2.5 rounded-xl bg-[#0d9488] text-white text-xs font-bold hover:bg-[#0f766e] transition-colors shadow-2xs cursor-pointer"
            >
              Approve Verification
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. USER & PROVIDER ACCOUNT MANAGEMENT VIEW (Screenshot 4)
// ─────────────────────────────────────────────────────────────────────────────
function AccountsView({
  filter,
  onFilterChange,
  users,
  selectedUser,
  onSelectUser,
  search,
  onUpdateStanding,
}: {
  filter: "All" | "Customer" | "Service Provider" | "Admin" | "Suspended";
  onFilterChange: (f: any) => void;
  users: UserAccountItem[];
  selectedUser: UserAccountItem | null;
  onSelectUser: (u: UserAccountItem) => void;
  search: string;
  onUpdateStanding: (
    userId: string,
    standing: UserAccountItem["standing"],
    status: "Active" | "Suspended"
  ) => void;
}) {
  const filtered = users.filter((u) => {
    if (filter === "Customer" && u.role !== "Customer") return false;
    if (filter === "Service Provider" && u.role !== "Service Provider") return false;
    if (filter === "Admin" && u.role !== "Admin") return false;
    if (filter === "Suspended" && u.status !== "Suspended") return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.userId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex gap-5 h-full max-w-[1400px] mx-auto">
      {/* Table container */}
      <div className="flex-1 bg-white border border-[#e2e8f0] rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {["All", "Customer", "Service Provider", "Admin", "Suspended"].map((tab) => (
            <button
              key={tab}
              onClick={() => onFilterChange(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === tab
                  ? "bg-[#0d9488] text-white shadow-2xs"
                  : "bg-[#f8fafc] text-[#64748b] hover:bg-slate-100 border border-[#e2e8f0]"
              }`}
            >
              {tab === "All" ? "All Accounts" : tab === "Customer" ? "Customers" : tab === "Service Provider" ? "Service Providers" : tab === "Admin" ? "Admins" : "Suspended"}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#64748b] border-b border-[#f1f5f9]">
                <th className="py-2.5 font-semibold">Name / User ID</th>
                <th className="py-2.5 font-semibold">Role</th>
                <th className="py-2.5 font-semibold">Email</th>
                <th className="py-2.5 font-semibold">Registered</th>
                <th className="py-2.5 font-semibold">Account Status</th>
                <th className="py-2.5 font-semibold">Standing</th>
                <th className="py-2.5 font-semibold">Last Active</th>
                <th className="py-2.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => onSelectUser(u)}
                  className={`cursor-pointer transition-colors ${
                    selectedUser?.id === u.id
                      ? "bg-[#f0fdfa]"
                      : "hover:bg-[#f8fafc]"
                  }`}
                >
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`size-7 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0 ${u.avatarBg}`}
                      >
                        {u.initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0f172a]">{u.name}</span>
                        <span className="text-[10px] text-[#94a3b8]">{u.userId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-[#475569]">{u.role}</td>
                  <td className="py-3 text-[#64748b] truncate max-w-[140px]">{u.email}</td>
                  <td className="py-3 text-[#64748b]">{u.registered}</td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        u.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        u.standing === "Good Standing"
                          ? "bg-emerald-50 text-emerald-700"
                          : u.standing === "Warning"
                          ? "bg-amber-50 text-amber-700"
                          : u.standing === "Restricted"
                          ? "bg-orange-50 text-orange-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {u.standing}
                    </span>
                  </td>
                  <td className="py-3 text-[#64748b]">{u.lastActive}</td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectUser(u);
                        }}
                        className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[#0f172a]"
                      >
                        Manage
                      </button>
                      {u.status === "Active" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStanding(u.id, "Temporarily Suspended", "Suspended");
                          }}
                          className="text-xs font-semibold px-2 py-1 rounded border border-rose-200 text-rose-600 hover:bg-rose-50"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateStanding(u.id, "Good Standing", "Active");
                          }}
                          className="text-xs font-semibold px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Drawer (User Details & Moderation) */}
      <div className="w-[360px] shrink-0 bg-white border border-[#e2e8f0] rounded-2xl p-5 flex flex-col justify-between shadow-xs overflow-y-auto no-scrollbar">
        {selectedUser ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col pb-3 border-b border-[#f1f5f9]">
              <span className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-wider">
                PHONE
              </span>
              <span className="text-xs font-bold text-[#0f172a] mb-2">{selectedUser.phone}</span>

              <span className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-wider">
                REGISTERED
              </span>
              <span className="text-xs font-bold text-[#0f172a] mb-2">{selectedUser.registered}</span>

              <span className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-wider">
                LAST ACTIVE
              </span>
              <span className="text-xs font-bold text-[#0f172a]">{selectedUser.lastActive}</span>
            </div>

            {/* Booking History */}
            {selectedUser.recentBooking && (
              <div className="flex flex-col gap-1.5 pb-3 border-b border-[#f1f5f9]">
                <span className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-wider">
                  BOOKING HISTORY
                </span>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#0f172a]">
                      {selectedUser.recentBooking.id}
                    </span>
                    <span className="text-[11px] text-[#64748b]">
                      {selectedUser.recentBooking.service}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    {selectedUser.recentBooking.status}
                  </span>
                </div>
              </div>
            )}

            {/* Account Standing Breakdown */}
            <div className="flex flex-col gap-2 pb-3 border-b border-[#f1f5f9]">
              <span className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-wider">
                ACCOUNT STANDING
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748b]">Current Status</span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    selectedUser.standing === "Good Standing"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {selectedUser.standing}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-center">
                <div className="p-2 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-sm font-bold text-[#0f172a] flex items-center justify-center gap-1">
                    <span>★</span>
                    <span>{selectedUser.rating}</span>
                  </span>
                  <span className="text-[10px] text-[#64748b]">Rating</span>
                </div>
                <div className="p-2 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-sm font-bold text-[#0f172a]">0</span>
                  <span className="text-[10px] text-[#64748b]">Points</span>
                </div>
                <div className="p-2 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-sm font-bold text-amber-600">
                    {selectedUser.warningsCount}
                  </span>
                  <span className="text-[10px] text-[#64748b]">Warnings</span>
                </div>
                <div className="p-2 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-sm font-bold text-rose-600">
                    {selectedUser.violationsCount}
                  </span>
                  <span className="text-[10px] text-[#64748b]">Violations</span>
                </div>
              </div>
            </div>

            {/* Moderation Actions */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-wider">
                MODERATION ACTIONS
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    onUpdateStanding(selectedUser.id, "Warning", "Active")
                  }
                  className="py-2 rounded-xl border border-amber-300 text-amber-700 bg-amber-50 text-xs font-bold hover:bg-amber-100 transition-colors"
                >
                  Issue Warning
                </button>
                <button
                  onClick={() =>
                    onUpdateStanding(selectedUser.id, "Restricted", "Active")
                  }
                  className="py-2 rounded-xl border border-orange-300 text-orange-700 bg-orange-50 text-xs font-bold hover:bg-orange-100 transition-colors"
                >
                  Restrict Account
                </button>
                <button
                  onClick={() =>
                    onUpdateStanding(selectedUser.id, "Good Standing", "Active")
                  }
                  className="py-2 rounded-xl border border-emerald-300 text-emerald-700 bg-emerald-50 text-xs font-bold hover:bg-emerald-100 transition-colors"
                >
                  Restore Account
                </button>
                <button
                  onClick={() =>
                    onUpdateStanding(selectedUser.id, "Permanent Ban", "Suspended")
                  }
                  className="py-2 rounded-xl border border-rose-300 text-rose-700 bg-rose-50 text-xs font-bold hover:bg-rose-100 transition-colors"
                >
                  Permanent Ban
                </button>
              </div>

              <button
                onClick={() =>
                  onUpdateStanding(
                    selectedUser.id,
                    "Temporarily Suspended",
                    selectedUser.status === "Active" ? "Suspended" : "Active"
                  )
                }
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-2xs transition-colors mt-1"
              >
                {selectedUser.status === "Active" ? "Suspend Account" : "Lift Suspension"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center size-full text-center text-[#94a3b8]">
            <p className="text-xs">Select an account to view moderation actions</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. BOOKING OVERSIGHT VIEW (Screenshot 5)
// ─────────────────────────────────────────────────────────────────────────────
function BookingOversightView({
  bookings,
  selectedBooking,
  onSelectBooking,
  statusFilter,
  onStatusFilterChange,
  serviceFilter,
  onServiceFilterChange,
  search,
  onUpdateBookingStatus,
}: {
  bookings: AdminBookingItem[];
  selectedBooking: AdminBookingItem | null;
  onSelectBooking: (b: AdminBookingItem) => void;
  statusFilter: string;
  onStatusFilterChange: (s: string) => void;
  serviceFilter: string;
  onServiceFilterChange: (s: string) => void;
  search: string;
  onUpdateBookingStatus: (
    id: string,
    status: AdminBookingItem["status"]
  ) => void;
}) {
  const filtered = bookings.filter((b) => {
    if (statusFilter !== "All" && b.status !== statusFilter) return false;
    if (serviceFilter !== "All" && b.serviceCategory !== serviceFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.id.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.providerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const total = bookings.length;
  const activeNow = bookings.filter((b) => b.status === "In Progress").length;
  const completed = bookings.filter((b) => b.status === "Completed").length;
  const cancelled = bookings.filter((b) => b.status === "Cancelled").length;

  return (
    <div className="flex gap-5 h-full max-w-[1400px] mx-auto">
      {/* Left List Table */}
      <div className="flex-1 bg-white border border-[#e2e8f0] rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-[#f0fdfa] border-2 border-[#0d9488] rounded-xl p-3 flex flex-col gap-0.5">
            <span className="text-[10px] text-[#0f766e] font-bold uppercase">Total Bookings</span>
            <span className="text-xl font-bold text-[#0f172a]">{total}</span>
          </div>
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-3 flex flex-col gap-0.5">
            <span className="text-[10px] text-[#64748b] font-medium uppercase">Active Now</span>
            <span className="text-xl font-bold text-[#0f172a]">{activeNow}</span>
          </div>
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-3 flex flex-col gap-0.5">
            <span className="text-[10px] text-[#64748b] font-medium uppercase">Completed</span>
            <span className="text-xl font-bold text-[#0f172a]">{completed}</span>
          </div>
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-3 flex flex-col gap-0.5">
            <span className="text-[10px] text-[#64748b] font-medium uppercase">Cancelled</span>
            <span className="text-xl font-bold text-[#0f172a]">{cancelled}</span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-3 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-[#475569]">
            <span className="font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-2 py-1 text-xs outline-none"
            >
              <option value="All">All</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Disputed">Disputed</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#475569]">
            <span className="font-semibold">Service:</span>
            <select
              value={serviceFilter}
              onChange={(e) => onServiceFilterChange(e.target.value)}
              className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-2 py-1 text-xs outline-none"
            >
              <option value="All">All</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Electrical">Electrical</option>
              <option value="Gardening">Gardening</option>
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#64748b] border-b border-[#f1f5f9]">
                <th className="py-2.5 font-semibold">Booking ID</th>
                <th className="py-2.5 font-semibold">Customer</th>
                <th className="py-2.5 font-semibold">Provider</th>
                <th className="py-2.5 font-semibold">Service</th>
                <th className="py-2.5 font-semibold">Date & Time</th>
                <th className="py-2.5 font-semibold">Gross</th>
                <th className="py-2.5 font-semibold text-[#0d9488]">10% Cut</th>
                <th className="py-2.5 font-semibold">Provider (90%)</th>
                <th className="py-2.5 font-semibold">Status</th>
                <th className="py-2.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {filtered.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => onSelectBooking(b)}
                  className={`cursor-pointer transition-colors ${
                    selectedBooking?.id === b.id
                      ? "bg-[#f0fdfa]"
                      : "hover:bg-[#f8fafc]"
                  }`}
                >
                  <td className="py-3 font-bold text-[#0d9488]">{b.id}</td>
                  <td className="py-3 font-medium text-[#0f172a]">{b.customerName}</td>
                  <td className="py-3 text-[#475569]">{b.providerName}</td>
                  <td className="py-3 text-[#475569]">{b.service}</td>
                  <td className="py-3 text-[#64748b]">{b.dateTime}</td>
                  <td className="py-3 font-bold text-[#0f172a]">₱{b.amount}</td>
                  <td className="py-3 font-bold text-[#0d9488]">
                    ₱{(b.amount * 0.1).toFixed(0)}
                    <span className="text-[9px] bg-teal-50 text-[#0f766e] px-1 py-0.2 rounded ml-1 font-semibold border border-teal-200">10%</span>
                  </td>
                  <td className="py-3 font-semibold text-[#475569]">
                    ₱{(b.amount * 0.9).toFixed(0)}
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.status === "In Progress"
                          ? "bg-blue-50 text-blue-700"
                          : b.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : b.status === "Confirmed"
                          ? "bg-blue-50 text-blue-700"
                          : b.status === "Cancelled"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBooking(b);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[#0f172a] font-semibold text-xs"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Drawer (Booking Details) */}
      <div className="w-[360px] shrink-0 bg-white border border-[#e2e8f0] rounded-2xl p-5 flex flex-col justify-between shadow-xs overflow-y-auto no-scrollbar">
        {selectedBooking ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-[#0f172a]">Booking Details</h3>
                <span className="text-[11px] text-[#64748b]">
                  {selectedBooking.id} · {selectedBooking.service}
                </span>
              </div>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {selectedBooking.status}
              </span>
            </div>

            {/* Participants */}
            <div className="flex flex-col gap-2 pb-3 border-b border-[#f1f5f9]">
              <span className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-wider">
                PARTICIPANTS
              </span>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#f8fafc] border border-[#f1f5f9]">
                <div className="size-8 rounded-full bg-slate-300 text-slate-700 font-bold flex items-center justify-center text-xs">
                  {selectedBooking.customerInitials}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#0f172a]">
                    {selectedBooking.customerName}
                  </span>
                  <span className="text-[10px] text-[#64748b]">
                    Customer · {selectedBooking.customerLocation}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#f8fafc] border border-[#f1f5f9]">
                <div className="size-8 rounded-full bg-[#0d9488] text-white font-bold flex items-center justify-center text-xs">
                  {selectedBooking.providerInitials}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#0f172a]">
                    {selectedBooking.providerName}
                  </span>
                  <span className="text-[10px] text-[#64748b]">
                    {selectedBooking.providerTitle}
                  </span>
                </div>
              </div>
            </div>

            {/* Details list */}
            <div className="flex flex-col gap-2 pb-3 border-b border-[#f1f5f9] text-xs">
              <div className="flex justify-between">
                <span className="text-[#64748b]">DATE & TIME</span>
                <span className="font-semibold text-[#0f172a]">{selectedBooking.dateTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">LOCATION</span>
                <span className="font-semibold text-[#0f172a]">{selectedBooking.customerLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">PAYMENT STATUS</span>
                <span className="font-bold text-emerald-600">{selectedBooking.paymentStatus}</span>
              </div>
              <div className="flex flex-col gap-1.5 pt-1 border-t border-[#f1f5f9]">
                <div className="flex justify-between">
                  <span className="text-[#64748b]">GROSS AMOUNT</span>
                  <span className="font-bold text-sm text-[#0f172a]">₱{selectedBooking.amount}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#0d9488] font-semibold flex items-center gap-1">
                    <span>TapServe 10% Platform Cut</span>
                    <span className="text-[9px] bg-teal-50 text-[#0f766e] px-1 rounded border border-teal-200 font-bold">10%</span>
                  </span>
                  <span className="font-bold text-[#0d9488]">-₱{(selectedBooking.amount * 0.1).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-dashed border-[#e2e8f0]">
                  <span className="text-[#475569] font-bold">PROVIDER PAYOUT (90%)</span>
                  <span className="font-extrabold text-sm text-[#0f766e]">₱{(selectedBooking.amount * 0.9).toFixed(0)}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-[#94a3b8] uppercase font-bold tracking-wider">
                TIMELINE
              </span>
              <div className="flex flex-col gap-2 text-xs">
                {selectedBooking.timeline.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-[#94a3b8] text-[11px] font-mono shrink-0 w-16">
                      {item.time}
                    </span>
                    <span className="text-[#334155]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#f1f5f9]">
              <button
                onClick={() => onUpdateBookingStatus(selectedBooking.id, "Completed")}
                className="w-full py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-xs shadow-2xs transition-colors"
              >
                Mark as Completed
              </button>
              <button
                onClick={() => onUpdateBookingStatus(selectedBooking.id, "Cancelled")}
                className="w-full py-2 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center size-full text-center text-[#94a3b8]">
            <p className="text-xs">Select a booking to view oversight details</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4.5. PLATFORM SALES & ANNUAL SUBSCRIPTIONS VIEW (10% Commission + ₱1,000 Annual Fee)
// ─────────────────────────────────────────────────────────────────────────────
interface ProviderSubscriptionRecord {
  id: string;
  invoiceNo: string;
  providerName: string;
  providerInitials: string;
  category: string;
  planName: string;
  amount: number;
  paymentMethod: "GCash" | "Maya" | "Bank Transfer" | "Cash on Verification";
  startDate: string;
  renewalDate: string;
  status: "Active (Paid)" | "Renewal Due Soon" | "Grace Period";
  receiptRef: string;
}

const INITIAL_SUBSCRIPTIONS: ProviderSubscriptionRecord[] = [
  {
    id: "sub-1",
    invoiceNo: "INV-SUB-2026-001",
    providerName: "Kuya Reynaldo Cruz",
    providerInitials: "RC",
    category: "Plumbing",
    planName: "TapServe Pro Annual License",
    amount: 1000,
    paymentMethod: "GCash",
    startDate: "Oct 15, 2026",
    renewalDate: "Oct 15, 2027",
    status: "Active (Paid)",
    receiptRef: "OR-SP-99101",
  },
  {
    id: "sub-2",
    invoiceNo: "INV-SUB-2026-002",
    providerName: "Ate Maria Santos",
    providerInitials: "MS",
    category: "Cleaning",
    planName: "TapServe Pro Annual License",
    amount: 1000,
    paymentMethod: "Maya",
    startDate: "Oct 10, 2026",
    renewalDate: "Oct 10, 2027",
    status: "Active (Paid)",
    receiptRef: "OR-SP-99102",
  },
  {
    id: "sub-3",
    invoiceNo: "INV-SUB-2026-003",
    providerName: "Kuya Jose Ramirez",
    providerInitials: "JR",
    category: "Electrical",
    planName: "TapServe Pro Annual License",
    amount: 1000,
    paymentMethod: "GCash",
    startDate: "Nov 01, 2026",
    renewalDate: "Nov 01, 2027",
    status: "Active (Paid)",
    receiptRef: "OR-SP-99103",
  },
  {
    id: "sub-4",
    invoiceNo: "INV-SUB-2026-004",
    providerName: "Cardo Santos",
    providerInitials: "CS",
    category: "Carpentry",
    planName: "TapServe Pro Monthly License",
    amount: 120,
    paymentMethod: "GCash",
    startDate: "Oct 01, 2026",
    renewalDate: "Nov 01, 2026",
    status: "Active (Paid)",
    receiptRef: "OR-SP-99104",
  },
  {
    id: "sub-5",
    invoiceNo: "INV-SUB-2026-005",
    providerName: "Grace De Leon",
    providerInitials: "GD",
    category: "Aircon Cleaning",
    planName: "TapServe Pro Annual License",
    amount: 1000,
    paymentMethod: "GCash",
    startDate: "Oct 05, 2026",
    renewalDate: "Oct 05, 2027",
    status: "Active (Paid)",
    receiptRef: "OR-SP-99105",
  },
  {
    id: "sub-6",
    invoiceNo: "INV-SUB-2026-006",
    providerName: "Rogelio Dela Cruz",
    providerInitials: "RD",
    category: "Roof & Gutter",
    planName: "TapServe Pro Annual License",
    amount: 1000,
    paymentMethod: "Cash on Verification",
    startDate: "Nov 12, 2025",
    renewalDate: "Nov 12, 2026",
    status: "Renewal Due Soon",
    receiptRef: "OR-SP-99088",
  },
  {
    id: "sub-7",
    invoiceNo: "INV-SUB-2026-007",
    providerName: "Elena Bautista",
    providerInitials: "EB",
    category: "Disinfection",
    planName: "TapServe Pro Annual License",
    amount: 1000,
    paymentMethod: "Maya",
    startDate: "Oct 18, 2026",
    renewalDate: "Oct 18, 2027",
    status: "Active (Paid)",
    receiptRef: "OR-SP-99107",
  },
  {
    id: "sub-8",
    invoiceNo: "INV-SUB-2026-008",
    providerName: "Benito Ramos",
    providerInitials: "BR",
    category: "Gardening",
    planName: "TapServe Pro Monthly License",
    amount: 120,
    paymentMethod: "GCash",
    startDate: "Oct 02, 2026",
    renewalDate: "Nov 02, 2026",
    status: "Active (Paid)",
    receiptRef: "OR-SP-99108",
  },
  {
    id: "sub-9",
    invoiceNo: "INV-SUB-2026-009",
    providerName: "Danilo Morales",
    providerInitials: "DM",
    category: "Appliance Repair",
    planName: "TapServe Pro Annual License",
    amount: 1000,
    paymentMethod: "GCash",
    startDate: "Oct 22, 2026",
    renewalDate: "Oct 22, 2027",
    status: "Active (Paid)",
    receiptRef: "OR-SP-99109",
  },
  {
    id: "sub-10",
    invoiceNo: "INV-SUB-2026-010",
    providerName: "Lourdes Garcia",
    providerInitials: "LG",
    category: "Cleaning",
    planName: "TapServe Pro Monthly License",
    amount: 120,
    paymentMethod: "Maya",
    startDate: "Oct 04, 2026",
    renewalDate: "Nov 04, 2026",
    status: "Active (Paid)",
    receiptRef: "OR-SP-99110",
  },
];

function SalesAndSubscriptionsView({
  bookings = [],
  onToast,
  globalSearch = "",
}: {
  bookings: AdminBookingItem[];
  onToast: (msg: string) => void;
  globalSearch?: string;
}) {
  const [salesSubTab, setSalesSubTab] = useState<
    "overview" | "commission" | "subscriptions" | "settings"
  >("overview");
  const [subscriptionsList, setSubscriptionsList] =
    useState<ProviderSubscriptionRecord[]>(INITIAL_SUBSCRIPTIONS);
  const [selectedInvoice, setSelectedInvoice] =
    useState<ProviderSubscriptionRecord | null>(null);
  const [commissionRate, setCommissionRate] = useState<number>(10);
  const [annualFee, setAnnualFee] = useState<number>(1000);
  const [subscriptionPlanFilter, setSubscriptionPlanFilter] = useState<
    "all" | "yearly" | "monthly"
  >("all");

  // Financial calculations
  const totalGrossBookingVolume = bookings.reduce((sum, b) => sum + b.amount, 0);
  const totalCommissionCut = Math.round(totalGrossBookingVolume * (commissionRate / 100));
  const totalProviderPayouts = totalGrossBookingVolume - totalCommissionCut;
  const totalSubscriptionRevenue = subscriptionsList.reduce((sum, s) => sum + s.amount, 0);
  const totalPlatformNetSales = totalCommissionCut + totalSubscriptionRevenue;

  const yearlySubsCount = subscriptionsList.filter((s) => s.planName.includes("Annual")).length;
  const monthlySubsCount = subscriptionsList.filter((s) => s.planName.includes("Monthly")).length;

  // Filter subscriptions based on search and plan
  const filteredSubscriptions = subscriptionsList.filter((s) => {
    const matchesSearch =
      s.providerName.toLowerCase().includes(globalSearch.toLowerCase()) ||
      s.category.toLowerCase().includes(globalSearch.toLowerCase()) ||
      s.invoiceNo.toLowerCase().includes(globalSearch.toLowerCase()) ||
      s.receiptRef.toLowerCase().includes(globalSearch.toLowerCase());

    if (!matchesSearch) return false;
    if (subscriptionPlanFilter === "yearly") return s.planName.includes("Annual");
    if (subscriptionPlanFilter === "monthly") return s.planName.includes("Monthly");
    return true;
  });

  const handleRenewSubscription = (subId: string) => {
    setSubscriptionsList((prev) =>
      prev.map((s) => {
        if (s.id !== subId) return s;
        const isYearly = s.planName.includes("Annual");
        return {
          ...s,
          status: "Active (Paid)",
          renewalDate: isYearly ? "Oct 2027" : "Nov 2026",
          amount: s.amount + (isYearly ? 1000 : 120),
        };
      })
    );
    onToast("Subscription renewed successfully!");
  };

  return (
    <div className="flex flex-col gap-5 max-w-[1400px] mx-auto select-none">
      {/* ─── Top Revenue Header KPIs ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Net Sales Card */}
        <div className="bg-gradient-to-br from-[#115E59] to-[#0F766E] text-white rounded-2xl p-5 shadow-sm border border-teal-600 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#CCFBF1] uppercase tracking-wider">
              Total Platform Sales
            </span>
            <span className="size-8 rounded-xl bg-white/15 flex items-center justify-center text-sm font-bold">
              💰
            </span>
          </div>
          <div className="my-2">
            <h2 className="text-3xl font-black tracking-tight">₱{totalPlatformNetSales.toLocaleString()}</h2>
            <span className="text-[11px] text-[#99F6E4] font-medium">
              10% Commission + ₱1,000 Annual Subscriptions
            </span>
          </div>
          <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px]">
            <span className="text-[#CCFBF1]">Q4 2026 Target:</span>
            <span className="font-bold text-white">92.4% Met</span>
          </div>
        </div>

        {/* 10% Booking Commission Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#0D9488]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              10% Booking Commission
            </span>
            <span className="size-8 rounded-xl bg-teal-50 text-[#0D9488] flex items-center justify-center text-xs font-bold border border-teal-100">
              10%
            </span>
          </div>
          <div className="my-2">
            <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">₱{totalCommissionCut.toLocaleString()}</h2>
            <span className="text-[11px] text-[#0D9488] font-bold">
              From ₱{totalGrossBookingVolume.toLocaleString()} Gross Volume
            </span>
          </div>
          <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Platform Fee Cut:</span>
            <span className="font-bold text-[#0F172A]">{commissionRate}% per service</span>
          </div>
        </div>

        {/* Specialist Subscriptions Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#0D9488]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Specialist Subscriptions
            </span>
            <span className="size-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold border border-emerald-100">
              💎
            </span>
          </div>
          <div className="my-2">
            <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">₱{totalSubscriptionRevenue.toLocaleString()}</h2>
            <span className="text-[11px] text-emerald-700 font-bold">
              {yearlySubsCount} Yearly (₱1k) • {monthlySubsCount} Monthly (₱120)
            </span>
          </div>
          <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Subscription Rates:</span>
            <span className="font-bold text-[#0F172A]">₱120/mo or ₱1,000/yr</span>
          </div>
        </div>

        {/* Provider Net Payouts (90%) Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#0D9488]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Provider Net Payouts
            </span>
            <span className="size-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-xs font-bold border border-indigo-100">
              90%
            </span>
          </div>
          <div className="my-2">
            <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">₱{totalProviderPayouts.toLocaleString()}</h2>
            <span className="text-[11px] text-[#64748B]">
              Direct cash settled to specialists
            </span>
          </div>
          <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Specialist Retained:</span>
            <span className="font-bold text-emerald-600">90% of job price</span>
          </div>
        </div>
      </div>

      {/* ─── Navigation Tabs Toolbar ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: "overview", label: "Financial Overview", icon: "📊" },
            { id: "subscriptions", label: `Subscriptions (${subscriptionsList.length})`, icon: "💎" },
            { id: "commission", label: `10% Commission Ledger (${bookings.length})`, icon: "🧾" },
            { id: "settings", label: "Monetization Rules", icon: "⚙️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSalesSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                salesSubTab === tab.id
                  ? "bg-[#115E59] text-white shadow-2xs"
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToast("Sales and subscription report exported to CSV!")}
            className="px-3 py-1.5 rounded-xl border border-[#CBD5E1] text-[#0F172A] text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>📥</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ─── SUB-TAB 1: FINANCIAL OVERVIEW ─── */}
      {salesSubTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Revenue Breakdown Card */}
          <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-[#0F172A]">Platform Monetization Breakdown</h3>
                <span className="text-xs text-[#64748B]">San Pablo City Certified Service Network</span>
              </div>
              <span className="text-xs font-bold text-[#0D9488] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                10% Cut + ₱1k Annual Fee
              </span>
            </div>

            {/* Visual Stream Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="bg-[#F8FAFA] border border-[#E2E8F0] p-4 rounded-xl flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A]">1. Booking Platform Fee (10%)</span>
                  <span className="text-xs font-black text-[#0D9488]">₱{totalCommissionCut.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0D9488] h-full rounded-full"
                    style={{
                      width: `${(totalCommissionCut / totalPlatformNetSales) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  Automatically deducted from every completed service appointment settled between client and provider.
                </p>
              </div>

              <div className="bg-[#F8FAFA] border border-[#E2E8F0] p-4 rounded-xl flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A]">2. Annual Pro Subscriptions</span>
                  <span className="text-xs font-black text-emerald-700">₱{totalSubscriptionRevenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{
                      width: `${(totalSubscriptionRevenue / totalPlatformNetSales) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  ₱1,000 annual platform accreditation fee paid by certified specialists for PhilSys/TESDA verification badge and AI matching.
                </p>
              </div>
            </div>

            {/* Quick Summary Table */}
            <div className="bg-[#F8FAFA] border border-[#E2E8F0] rounded-xl p-4 flex flex-col gap-2.5 text-xs">
              <span className="font-bold text-[#0F172A] uppercase tracking-wider text-[10px]">
                Platform Revenue Formula
              </span>
              <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Gross Client Bookings Volume</span>
                <span className="font-semibold text-[#0F172A]">₱{totalGrossBookingVolume.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Platform 10% Commission Deducted</span>
                <span className="font-bold text-[#0D9488]">+ ₱{totalCommissionCut.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Annual Provider Subscriptions ({subscriptionsList.length} × ₱1,000)</span>
                <span className="font-bold text-emerald-700">+ ₱{totalSubscriptionRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm">
                <span className="font-bold text-[#0F172A]">Total TapServe Platform Revenue</span>
                <span className="font-black text-base text-[#115E59]">₱{totalPlatformNetSales.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Subscriptions Summary Box */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
              <h3 className="text-sm font-bold text-[#0F172A]">Active Subscriptions</h3>
              <button
                onClick={() => setSalesSubTab("subscriptions")}
                className="text-xs text-[#0D9488] font-bold hover:underline"
              >
                View All →
              </button>
            </div>

            <div className="flex flex-col gap-2.5 divide-y divide-[#F1F5F9]">
              {subscriptionsList.slice(0, 5).map((sub) => (
                <div key={sub.id} className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="size-8 rounded-full bg-[#115E59] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {sub.providerInitials}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-[#0F172A] truncate">{sub.providerName}</span>
                      <span className="text-[10px] text-[#64748B]">{sub.category}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-[#0F172A]">₱{sub.amount}</span>
                    <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-md">
                      {sub.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onToast("All 18 active provider subscription accounts are compliant.")}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold transition-colors cursor-pointer text-center mt-auto"
            >
              Audit Specialist Subscriptions
            </button>
          </div>
        </div>
      )}

      {/* ─── SUB-TAB 2: SPECIALIST SUBSCRIPTIONS TABLE (Monthly & Yearly) ─── */}
      {salesSubTab === "subscriptions" && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F1F5F9]">
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-[#0F172A]">Specialist Subscriptions (Monthly & Yearly)</h3>
              <span className="text-xs text-[#64748B]">
                Registered and verified trade service providers with choice of Monthly (₱120) or Yearly (₱1,000) plans
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-[#F1F5F9] p-1 rounded-xl gap-1 text-xs">
                <button
                  onClick={() => setSubscriptionPlanFilter("all")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    subscriptionPlanFilter === "all"
                      ? "bg-white text-[#115E59] shadow-2xs"
                      : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  All ({subscriptionsList.length})
                </button>
                <button
                  onClick={() => setSubscriptionPlanFilter("yearly")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    subscriptionPlanFilter === "yearly"
                      ? "bg-white text-[#115E59] shadow-2xs"
                      : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  Yearly ₱1k ({yearlySubsCount})
                </button>
                <button
                  onClick={() => setSubscriptionPlanFilter("monthly")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    subscriptionPlanFilter === "monthly"
                      ? "bg-white text-[#115E59] shadow-2xs"
                      : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  Monthly ₱120 ({monthlySubsCount})
                </button>
              </div>
              <span className="text-xs font-bold text-[#0D9488] bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
                ₱{totalSubscriptionRevenue.toLocaleString()} Collected
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[#64748B] border-b border-[#F1F5F9]">
                  <th className="py-2.5 font-semibold">Invoice No</th>
                  <th className="py-2.5 font-semibold">Specialist Provider</th>
                  <th className="py-2.5 font-semibold">Trade Category</th>
                  <th className="py-2.5 font-semibold">Subscription Plan</th>
                  <th className="py-2.5 font-semibold">Annual Rate</th>
                  <th className="py-2.5 font-semibold">Payment</th>
                  <th className="py-2.5 font-semibold">Renewal Due</th>
                  <th className="py-2.5 font-semibold">Status</th>
                  <th className="py-2.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {filteredSubscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 font-mono font-bold text-[#0D9488]">{sub.invoiceNo}</td>
                    <td className="py-3 font-semibold text-[#0F172A]">{sub.providerName}</td>
                    <td className="py-3 text-[#475569]">{sub.category}</td>
                    <td className="py-3 text-[#64748B]">{sub.planName}</td>
                    <td className="py-3 font-black text-[#0F172A]">₱{sub.amount.toLocaleString()}</td>
                    <td className="py-3 text-[#475569]">{sub.paymentMethod}</td>
                    <td className="py-3 text-[#64748B]">{sub.renewalDate}</td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sub.status === "Active (Paid)"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedInvoice(sub)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-semibold text-xs cursor-pointer"
                        >
                          Invoice
                        </button>
                        {sub.status !== "Active (Paid)" && (
                          <button
                            onClick={() => handleRenewSubscription(sub.id)}
                            className="px-2.5 py-1 rounded bg-[#115E59] text-white font-bold text-xs hover:bg-[#0F766E] shadow-2xs cursor-pointer"
                          >
                            Renew
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── SUB-TAB 3: 10% COMMISSION LEDGER ─── */}
      {salesSubTab === "commission" && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F1F5F9]">
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-[#0F172A]">10% Platform Booking Commission Ledger</h3>
              <span className="text-xs text-[#64748B]">
                Itemized transaction fees deducted upon service completion across all bookings
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0D9488] bg-teal-50 px-3 py-1 rounded-xl border border-teal-200">
                10% Deducted: ₱{totalCommissionCut.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[#64748B] border-b border-[#F1F5F9]">
                  <th className="py-2.5 font-semibold">Booking ID</th>
                  <th className="py-2.5 font-semibold">Customer</th>
                  <th className="py-2.5 font-semibold">Provider</th>
                  <th className="py-2.5 font-semibold">Service</th>
                  <th className="py-2.5 font-semibold">Gross Price</th>
                  <th className="py-2.5 font-semibold text-[#0D9488]">10% Platform Cut</th>
                  <th className="py-2.5 font-semibold">Provider Net (90%)</th>
                  <th className="py-2.5 font-semibold">Status</th>
                  <th className="py-2.5 font-semibold text-right">Fee Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 font-bold text-[#0D9488]">{b.id}</td>
                    <td className="py-3 font-medium text-[#0F172A]">{b.customerName}</td>
                    <td className="py-3 text-[#475569]">{b.providerName}</td>
                    <td className="py-3 text-[#475569]">{b.service}</td>
                    <td className="py-3 font-bold text-[#0F172A]">₱{b.amount}</td>
                    <td className="py-3 font-black text-[#0D9488]">
                      ₱{(b.amount * (commissionRate / 100)).toFixed(0)}
                      <span className="text-[9px] bg-teal-50 text-[#0F766E] px-1 py-0.2 rounded ml-1 font-bold border border-teal-200">
                        10%
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-[#475569]">
                      ₱{(b.amount * ((100 - commissionRate) / 100)).toFixed(0)}
                    </td>
                    <td className="py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-[11px] font-bold text-emerald-600">✓ Deducted</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── SUB-TAB 4: MONETIZATION SETTINGS ─── */}
      {salesSubTab === "settings" && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs flex flex-col gap-5 max-w-2xl">
          <div className="flex flex-col gap-1 pb-3 border-b border-[#F1F5F9]">
            <h3 className="text-base font-bold text-[#0F172A]">Platform Monetization & Fee Controls</h3>
            <p className="text-xs text-[#64748B]">
              Configure platform fee percentages and annual subscription rates for certified service providers.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#0F172A]">Platform Booking Commission Deduction (%)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  min={1}
                  max={50}
                  className="w-24 bg-[#F8FAFA] border border-[#CBD5E1] p-2.5 rounded-xl font-bold text-[#0F172A] outline-none"
                />
                <span className="text-[#64748B]">Current: 10% deducted automatically per completed customer service</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[#0F172A]">Annual Provider Accreditation License (₱)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={annualFee}
                  onChange={(e) => setAnnualFee(Number(e.target.value))}
                  min={100}
                  max={10000}
                  step={100}
                  className="w-32 bg-[#F8FAFA] border border-[#CBD5E1] p-2.5 rounded-xl font-bold text-[#0F172A] outline-none"
                />
                <span className="text-[#64748B]">Current: ₱1,000 per specialist/year for PhilSys, TESDA compliance, and priority matching</span>
              </div>
            </div>

            <button
              onClick={() => onToast("Platform fee and subscription parameters updated successfully!")}
              className="py-3 px-5 rounded-xl bg-[#115E59] hover:bg-[#0F766E] text-white font-bold text-xs transition-colors shadow-2xs w-fit cursor-pointer mt-2"
            >
              Save Monetization Settings
            </button>
          </div>
        </div>
      )}

      {/* ─── INVOICE / OFFICIAL RECEIPT MODAL ─── */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 border border-[#E2E8F0]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-lg">
                  🧾
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#0F172A]">Official Platform Receipt</span>
                  <span className="text-[10px] text-[#64748B] font-mono">{selectedInvoice.invoiceNo}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="size-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Receipt Content */}
            <div className="bg-[#F8FAFA] border border-[#E2E8F0] rounded-2xl p-4 flex flex-col gap-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#64748B]">SPECIALIST:</span>
                <span className="font-bold text-[#0F172A]">{selectedInvoice.providerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">TRADE CATEGORY:</span>
                <span className="font-semibold text-[#0F172A]">{selectedInvoice.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">SUBSCRIPTION PLAN:</span>
                <span className="font-semibold text-[#0F172A]">{selectedInvoice.planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">VALIDITY PERIOD:</span>
                <span className="font-semibold text-[#0F172A]">{selectedInvoice.startDate} – {selectedInvoice.renewalDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">PAYMENT CHANNEL:</span>
                <span className="font-semibold text-[#0F172A]">{selectedInvoice.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E2E8F0] text-sm">
                <span className="font-bold text-[#0F172A]">ANNUAL FEE PAID:</span>
                <span className="font-black text-base text-[#115E59]">₱{selectedInvoice.amount.toLocaleString()}.00</span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
              <span>✓</span>
              <span>Accreditation Active: Verified Provider badge issued in San Pablo City.</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  onToast(`Printed copy generated for ${selectedInvoice.invoiceNo}`);
                  setSelectedInvoice(null);
                }}
                className="flex-1 py-2.5 rounded-xl border border-[#CBD5E1] text-[#0F172A] font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Print Receipt
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#115E59] text-white font-bold text-xs hover:bg-[#0F766E] cursor-pointer shadow-xs"
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

// ─────────────────────────────────────────────────────────────────────────────
// 5. CONCERNS & REPORTS OVERSIGHT VIEW (Screenshot 1)
// ─────────────────────────────────────────────────────────────────────────────
interface SupportTicket {
  id: string;
  customer: string;
  subject: string;
  bookingRef: string;
  serviceName: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "Under Review" | "Escalated" | "Resolved";
  assignedTo: string;
  reportedUser: string;
  date: string;
  description: string;
  evidence: { type: "photo" | "video"; title: string }[];
  timeline: { time: string; text: string }[];
}

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: "#TC-402",
    customer: "Arthur Pendragon",
    subject: "Water leakage issue",
    bookingRef: "Booking #BK-8835",
    serviceName: "Plumbing Repair",
    priority: "High",
    status: "Open",
    assignedTo: "Agent Sarah",
    reportedUser: "Kuya Reynaldo",
    date: "Oct 28, 2026",
    description:
      "The plumber left an hour ago but water is starting to leak heavily under the main sink. I need urgent help!",
    evidence: [
      { type: "photo", title: "Photo of leaking pipe" },
      { type: "video", title: "Video evidence" },
    ],
    timeline: [
      { time: "Oct 28, 2026 2:42 PM", text: "Ticket submitted" },
      { time: "Oct 28, 2026 2:45 PM", text: "Agent Sarah Alvarez joined the chat" },
    ],
  },
  {
    id: "#TC-401",
    customer: "Ginebra San",
    subject: "Refund request",
    bookingRef: "Booking #BK-8818",
    serviceName: "Electrical Repair",
    priority: "Medium",
    status: "Under Review",
    assignedTo: "Agent Sarah",
    reportedUser: "Rogelio Dela Cruz",
    date: "Oct 27, 2026",
    description:
      "The specialist completed the inspection but did not replace the faulty breaker module as agreed in the estimate.",
    evidence: [{ type: "photo", title: "Breaker panel photo" }],
    timeline: [
      { time: "Oct 27, 2026 10:14 AM", text: "Ticket submitted" },
      { time: "Oct 27, 2026 10:30 AM", text: "Under Review by Agent Sarah" },
    ],
  },
  {
    id: "#TC-400",
    customer: "Bong Go",
    subject: "Provider did not arrive",
    bookingRef: "Booking #BK-8804",
    serviceName: "Deep Cleaning",
    priority: "High",
    status: "Escalated",
    assignedTo: "Agent Sarah",
    reportedUser: "CleanPro Services",
    date: "Oct 26, 2026",
    description:
      "Waited for 2 hours at the residence. Provider failed to communicate or arrive for scheduled slot.",
    evidence: [{ type: "photo", title: "Call history screenshot" }],
    timeline: [
      { time: "Oct 26, 2026 3:15 PM", text: "Ticket submitted" },
      { time: "Oct 26, 2026 4:00 PM", text: "Escalated to Priority Resolution Team" },
    ],
  },
  {
    id: "#TC-399",
    customer: "Leni Robredo",
    subject: "App transaction issue",
    bookingRef: "Booking #BK-8798",
    serviceName: "Garden Maintenance",
    priority: "Low",
    status: "Resolved",
    assignedTo: "Agent Sarah",
    reportedUser: "GreenThumb Specialists",
    date: "Oct 25, 2026",
    description:
      "Card was debited twice due to network delay during confirmation. Duplicate charge reversal requested.",
    evidence: [{ type: "photo", title: "Digital invoice receipt" }],
    timeline: [
      { time: "Oct 25, 2026 1:00 PM", text: "Ticket submitted" },
      { time: "Oct 25, 2026 2:15 PM", text: "Duplicate authorization voided and resolved" },
    ],
  },
];

function ConcernsView({
  onToast,
  globalSearch,
}: {
  onToast: (m: string) => void;
  globalSearch?: string;
}) {
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    INITIAL_TICKETS[0]
  );
  const [filterTab, setFilterTab] = useState<
    "All" | "Open" | "Under Review" | "Resolved" | "Escalated"
  >("All");
  const [search, setSearch] = useState("");
  const [replyText, setReplyText] = useState("");
  const [previewMedia, setPreviewMedia] = useState<string | null>(null);

  const query = (search || globalSearch || "").toLowerCase();

  const filteredTickets = tickets.filter((t) => {
    if (filterTab !== "All" && t.status !== filterTab) return false;
    if (query) {
      const match =
        t.id.toLowerCase().includes(query) ||
        t.customer.toLowerCase().includes(query) ||
        t.subject.toLowerCase().includes(query) ||
        t.bookingRef.toLowerCase().includes(query);
      if (!match) return false;
    }
    return true;
  });

  const openCount = tickets.filter((t) => t.status === "Open").length;
  const inProgressCount = tickets.filter((t) => t.status === "Under Review").length;
  const resolvedCount = tickets.filter((t) => t.status === "Resolved").length;
  const escalatedCount = tickets.filter((t) => t.status === "Escalated").length;

  const handleUpdateStatus = (
    newStatus: "Open" | "Under Review" | "Escalated" | "Resolved"
  ) => {
    if (!selectedTicket) return;
    const updated = {
      ...selectedTicket,
      status: newStatus,
      timeline: [
        ...selectedTicket.timeline,
        {
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: `Status updated to ${newStatus} by Admin Maria`,
        },
      ],
    };
    setSelectedTicket(updated);
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    onToast(`Ticket ${updated.id} status changed to ${newStatus}`);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    const newMsg = replyText.trim();
    const updated = {
      ...selectedTicket,
      timeline: [
        ...selectedTicket.timeline,
        {
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: `Agent Sarah: "${newMsg}"`,
        },
      ],
    };
    setSelectedTicket(updated);
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setReplyText("");
    onToast("Reply sent to customer");
  };

  return (
    <div className="flex gap-5 max-w-[1440px] mx-auto h-[calc(100vh-112px)] overflow-hidden">
      {/* Left / Main Table Section */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar">
        {/* Top KPI Cards (4 cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-xs">
            <span className="text-[#64748b] text-xs font-medium">Open Tickets</span>
            <div className="text-2xl font-bold text-[#0f172a] mt-1">{openCount}</div>
          </div>
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-xs">
            <span className="text-[#64748b] text-xs font-medium">In Progress</span>
            <div className="text-2xl font-bold text-[#0f172a] mt-1">{inProgressCount}</div>
          </div>
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-xs">
            <span className="text-[#64748b] text-xs font-medium">Resolved</span>
            <div className="text-2xl font-bold text-[#0f172a] mt-1">{resolvedCount}</div>
          </div>
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-xs">
            <span className="text-[#64748b] text-xs font-medium">Escalated</span>
            <div className="text-2xl font-bold text-[#0f172a] mt-1">{escalatedCount}</div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {(["All", "Open", "Under Review", "Resolved", "Escalated"] as const).map((tab) => {
            const isActive = filterTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#0d9488] text-white shadow-xs"
                    : "bg-white border border-[#e2e8f0] text-[#64748b] hover:text-[#0f172a] hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#e2e8f0] rounded-xl text-xs text-[#0f172a] placeholder-[#94a3b8] outline-none focus:border-[#0d9488] transition-colors"
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
        </div>

        {/* Tickets Table */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[#64748b] border-b border-[#f1f5f9] bg-[#fafafa]">
                  <th className="py-3 px-4 font-semibold">Ticket ID</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Subject</th>
                  <th className="py-3 px-4 font-semibold">Priority</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Assigned To</th>
                  <th className="py-3 px-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filteredTickets.map((t) => {
                  const isSelected = selectedTicket?.id === t.id;
                  return (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-[#f0fdfa]" : "hover:bg-[#f8fafc]"
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-[#0d9488]">{t.id}</td>
                      <td className="py-3.5 px-4 font-medium text-[#0f172a]">{t.customer}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#0f172a]">{t.subject}</div>
                        <div className="text-[11px] text-[#94a3b8]">{t.bookingRef}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            t.priority === "High"
                              ? "bg-red-50 text-red-600"
                              : t.priority === "Medium"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            t.status === "Open"
                              ? "bg-teal-50 text-[#0d9488]"
                              : t.status === "Under Review"
                              ? "bg-blue-50 text-blue-600"
                              : t.status === "Escalated"
                              ? "bg-orange-50 text-orange-600"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#475569]">{t.assignedTo}</td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicket(t);
                          }}
                          className="px-3 py-1 rounded-lg bg-[#0d9488] hover:bg-[#0f766e] text-white font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Drawer: Ticket Conversation */}
      <div className="w-[380px] shrink-0 bg-white border border-[#e2e8f0] rounded-2xl flex flex-col shadow-xs overflow-hidden">
        {selectedTicket ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-[#f1f5f9] flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0f172a]">Ticket Conversation</h3>
                <p className="text-xs text-[#64748b] mt-0.5">
                  {selectedTicket.id} · {selectedTicket.subject}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedTicket.status === "Open"
                        ? "bg-teal-50 text-[#0d9488]"
                        : selectedTicket.status === "Under Review"
                        ? "bg-blue-50 text-blue-600"
                        : selectedTicket.status === "Escalated"
                        ? "bg-orange-50 text-orange-600"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {selectedTicket.status}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedTicket.priority === "High"
                        ? "bg-red-50 text-red-600"
                        : selectedTicket.priority === "Medium"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {selectedTicket.priority}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-[#94a3b8] hover:text-[#0f172a] text-sm p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                title="Close Drawer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs no-scrollbar">
              {/* Meta Info */}
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider block">
                    SUBMITTED BY
                  </span>
                  <span className="font-semibold text-[#0f172a]">{selectedTicket.customer}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider block">
                    REPORTED USER
                  </span>
                  <span className="font-semibold text-[#0f172a]">{selectedTicket.reportedUser}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider block">
                    DATE
                  </span>
                  <span className="text-[#475569]">{selectedTicket.date}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider block">
                    RELATED BOOKING
                  </span>
                  <span className="font-semibold text-[#0d9488]">
                    {selectedTicket.bookingRef} · {selectedTicket.serviceName}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider block mb-1.5">
                  DESCRIPTION
                </span>
                <div className="bg-[#f8fafc] border border-[#f1f5f9] rounded-xl p-3 text-[#334155] leading-relaxed">
                  <p>{selectedTicket.description}</p>
                  <p className="text-[10px] text-[#94a3b8] mt-2">
                    Customer · {selectedTicket.date}
                  </p>
                </div>
              </div>

              {/* Evidence */}
              <div>
                <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider block mb-1.5">
                  EVIDENCE
                </span>
                <div className="space-y-1.5">
                  {selectedTicket.evidence.map((ev, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setPreviewMedia(ev.title);
                        onToast(`Viewing ${ev.title}`);
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl border border-[#e2e8f0] bg-white hover:bg-slate-50 transition-colors cursor-pointer text-left"
                    >
                      <span className="text-base">{ev.type === "photo" ? "📄" : "🎥"}</span>
                      <span className="text-xs font-medium text-[#0f172a]">{ev.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Timeline */}
              <div>
                <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider block mb-1.5">
                  ACTIVITY TIMELINE
                </span>
                <div className="space-y-2 text-[11px] text-[#64748b]">
                  {selectedTicket.timeline.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <span className="text-[#0d9488] font-bold mt-0.5">•</span>
                      <div>
                        <span className="font-medium text-[#0f172a]">{item.time}</span> — {item.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Status Actions & Reply Box */}
            <div className="p-3 border-t border-[#f1f5f9] bg-white space-y-2">
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleUpdateStatus("Under Review")}
                  className="py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition-colors cursor-pointer"
                >
                  Under Review
                </button>
                <button
                  onClick={() => handleUpdateStatus("Escalated")}
                  className="py-1.5 px-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-[11px] transition-colors cursor-pointer"
                >
                  Escalate
                </button>
                <button
                  onClick={() => handleUpdateStatus("Resolved")}
                  className="py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] transition-colors cursor-pointer"
                >
                  Resolve
                </button>
              </div>

              {/* Reply Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendReply();
                  }}
                  placeholder="Type reply..."
                  className="flex-1 px-3 py-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-xs outline-none focus:border-[#0d9488]"
                />
                <button
                  onClick={handleSendReply}
                  className="px-4 py-1.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-xs cursor-pointer transition-colors shadow-2xs"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center size-full text-center text-[#94a3b8] p-6">
            <span className="text-3xl mb-2">💬</span>
            <p className="text-xs">Select a ticket from the table to view conversation details</p>
          </div>
        )}
      </div>

      {/* Media Preview Modal */}
      {previewMedia && (
        <div
          onClick={() => setPreviewMedia(null)}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-[#e2e8f0] flex flex-col gap-4"
          >
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <h3 className="text-sm font-bold text-[#0f172a]">{previewMedia}</h3>
              <button
                onClick={() => setPreviewMedia(null)}
                className="text-[#94a3b8] hover:text-[#0f172a] text-sm"
              >
                ✕
              </button>
            </div>
            <div className="h-64 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-slate-500 gap-2 border border-dashed border-slate-300">
              <span className="text-4xl">📷</span>
              <span className="text-xs font-semibold">{previewMedia}</span>
              <span className="text-[11px] text-[#94a3b8]">Verified cryptographic attachment preview</span>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setPreviewMedia(null)}
                className="px-4 py-1.5 rounded-xl bg-[#0d9488] text-white text-xs font-bold hover:bg-[#0f766e]"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. VIOLATIONS VIEW (Screenshot 2)
// ─────────────────────────────────────────────────────────────────────────────
interface ViolationItem {
  id: string;
  user: string;
  userInitials: string;
  avatarBg: string;
  email: string;
  violationType: string;
  source: string;
  category: "Booking Abuse" | "Communication Abuse" | "Platform Abuse";
  severity: "High" | "Medium" | "Low";
  points: number;
  dateDetected: string;
  accountStatus: "Restricted" | "Warning" | "Temporarily Suspended" | "Good Standing";
  reviewStatus: "Confirmed" | "Pending Review" | "Dismissed";
  detectionMethod: string;
  actionTaken: string;
  evidenceQuote: string;
  stats: {
    points: number;
    violations: number;
    warnings: number;
    cancellations: number;
  };
  activityLog: { date: string; text: string }[];
}

const INITIAL_VIOLATIONS: ViolationItem[] = [
  {
    id: "#V003",
    user: "Arthur Pendragon",
    userInitials: "AP",
    avatarBg: "bg-blue-600",
    email: "arthur.p@gmail.com",
    violationType: "Accepted Booking Cancellation Abuse",
    source: "Booking #BK-8835",
    category: "Booking Abuse",
    severity: "Medium",
    points: 1,
    dateDetected: "Oct 20, 2026",
    accountStatus: "Restricted",
    reviewStatus: "Confirmed",
    detectionMethod: "Automated System",
    actionTaken: "Warning issued",
    evidenceQuote: "User reached the configured accepted-booking cancellation threshold.",
    stats: { points: 2, violations: 2, warnings: 1, cancellations: 3 },
    activityLog: [
      { date: "Oct 20, 2026", text: "Violation detected by system" },
      { date: "Oct 20, 2026", text: "Warning issued automatically" },
    ],
  },
  {
    id: "#V002",
    user: "Roselle Diaz",
    userInitials: "RD",
    avatarBg: "bg-purple-600",
    email: "roselle.diaz@gmail.com",
    violationType: "Accepted Booking Cancellation Abuse",
    source: "Booking #BK-8837",
    category: "Booking Abuse",
    severity: "Medium",
    points: 1,
    dateDetected: "Oct 26, 2026",
    accountStatus: "Warning",
    reviewStatus: "Pending Review",
    detectionMethod: "Automated System",
    actionTaken: "Under admin investigation",
    evidenceQuote: "Client cancelled 2 bookings sequentially within 20 minutes of arrival window.",
    stats: { points: 1, violations: 1, warnings: 1, cancellations: 2 },
    activityLog: [
      { date: "Oct 26, 2026", text: "System flagged threshold breach" },
      { date: "Oct 26, 2026", text: "Queued for admin review" },
    ],
  },
  {
    id: "#V001",
    user: "Jose Rodriguez",
    userInitials: "JR",
    avatarBg: "bg-purple-600",
    email: "jose.rodriguez@gmail.com",
    violationType: "Harassment",
    source: "Message thread #MSG-1021",
    category: "Communication Abuse",
    severity: "High",
    points: 3,
    dateDetected: "Oct 24, 2026",
    accountStatus: "Temporarily Suspended",
    reviewStatus: "Confirmed",
    detectionMethod: "In-App Chat Heuristics",
    actionTaken: "Temporary Suspension (7 days)",
    evidenceQuote: "Offensive repeated remarks directed at provider during booking coordination.",
    stats: { points: 3, violations: 1, warnings: 0, cancellations: 0 },
    activityLog: [
      { date: "Oct 24, 2026", text: "Flagged by chat filter" },
      { date: "Oct 24, 2026", text: "Suspension enforced by Admin Maria" },
    ],
  },
  {
    id: "#V004",
    user: "John Santos",
    userInitials: "JS",
    avatarBg: "bg-purple-600",
    email: "john.santos@gmail.com",
    violationType: "Accepted Booking Cancellation Abuse",
    source: "Booking #BK-1025",
    category: "Booking Abuse",
    severity: "Medium",
    points: 1,
    dateDetected: "Sep 15, 2026",
    accountStatus: "Restricted",
    reviewStatus: "Confirmed",
    detectionMethod: "Automated System",
    actionTaken: "Account restricted",
    evidenceQuote: "Repeated cancellations within 30-day period.",
    stats: { points: 2, violations: 2, warnings: 1, cancellations: 4 },
    activityLog: [
      { date: "Sep 15, 2026", text: "Violation detected by system" },
      { date: "Sep 15, 2026", text: "Restriction applied" },
    ],
  },
  {
    id: "#V005",
    user: "Arthur Pendragon",
    userInitials: "AP",
    avatarBg: "bg-blue-600",
    email: "arthur.p@gmail.com",
    violationType: "Review Abuse",
    source: "Review #REV-334",
    category: "Platform Abuse",
    severity: "Low",
    points: 1,
    dateDetected: "Oct 15, 2026",
    accountStatus: "Restricted",
    reviewStatus: "Dismissed",
    detectionMethod: "Provider Dispute",
    actionTaken: "Review cleared following dispute review",
    evidenceQuote: "Review determined to reflect genuine customer feedback.",
    stats: { points: 2, violations: 2, warnings: 1, cancellations: 3 },
    activityLog: [
      { date: "Oct 15, 2026", text: "Dispute submitted by provider" },
      { date: "Oct 16, 2026", text: "Dismissed by Admin Maria" },
    ],
  },
  {
    id: "#V006",
    user: "Rico Blanco",
    userInitials: "RB",
    avatarBg: "bg-purple-600",
    email: "rico.blanco@gmail.com",
    violationType: "Spam",
    source: "Message thread #MSG-0987",
    category: "Communication Abuse",
    severity: "Low",
    points: 1,
    dateDetected: "Oct 28, 2026",
    accountStatus: "Good Standing",
    reviewStatus: "Pending Review",
    detectionMethod: "Spam Heuristic Filter",
    actionTaken: "Under review",
    evidenceQuote: "High volume of identical messages sent across multiple providers.",
    stats: { points: 0, violations: 1, warnings: 0, cancellations: 0 },
    activityLog: [{ date: "Oct 28, 2026", text: "Rate limit triggered" }],
  },
];

function ViolationsView({
  onToast,
  globalSearch,
}: {
  onToast: (m: string) => void;
  globalSearch?: string;
}) {
  const [violations, setViolations] = useState<ViolationItem[]>(INITIAL_VIOLATIONS);
  const [selectedViolation, setSelectedViolation] = useState<ViolationItem | null>(
    INITIAL_VIOLATIONS[0]
  );
  const [filterTab, setFilterTab] = useState<
    "All" | "Pending Review" | "Confirmed" | "Dismissed"
  >("All");
  const [severityFilter, setSeverityFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [search, setSearch] = useState("");

  const query = (search || globalSearch || "").toLowerCase();

  const filteredViolations = violations.filter((v) => {
    if (filterTab !== "All" && v.reviewStatus !== filterTab) return false;
    if (severityFilter !== "All" && v.severity !== severityFilter) return false;
    if (categoryFilter !== "All" && v.category !== categoryFilter) return false;
    if (query) {
      const match =
        v.id.toLowerCase().includes(query) ||
        v.user.toLowerCase().includes(query) ||
        v.violationType.toLowerCase().includes(query) ||
        v.source.toLowerCase().includes(query);
      if (!match) return false;
    }
    return true;
  });

  const allCount = violations.length;
  const pendingCount = violations.filter((v) => v.reviewStatus === "Pending Review").length;
  const confirmedCount = violations.filter((v) => v.reviewStatus === "Confirmed").length;
  const dismissedCount = violations.filter((v) => v.reviewStatus === "Dismissed").length;

  const handleUpdateReviewStatus = (status: "Confirmed" | "Dismissed") => {
    if (!selectedViolation) return;
    const updated = {
      ...selectedViolation,
      reviewStatus: status,
      activityLog: [
        ...selectedViolation.activityLog,
        {
          date: "Oct 28, 2026",
          text: `Marked as ${status} by Admin Maria`,
        },
      ],
    };
    setSelectedViolation(updated);
    setViolations((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    onToast(`Violation ${updated.id} marked as ${status}`);
  };

  return (
    <div className="flex gap-5 max-w-[1440px] mx-auto h-[calc(100vh-112px)] overflow-hidden">
      {/* Left / Main Section */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar">
        {/* KPI Cards (4 cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setFilterTab("All")}
            className={`bg-white border rounded-2xl p-4 shadow-xs text-left cursor-pointer transition-all ${
              filterTab === "All"
                ? "border-[#0d9488] ring-1 ring-[#0d9488]"
                : "border-[#e2e8f0]"
            }`}
          >
            <span className="text-[#64748b] text-xs font-medium">All Violations</span>
            <div className="text-2xl font-bold text-[#0f172a] mt-1">{allCount}</div>
          </button>
          <button
            onClick={() => setFilterTab("Pending Review")}
            className={`bg-white border rounded-2xl p-4 shadow-xs text-left cursor-pointer transition-all ${
              filterTab === "Pending Review"
                ? "border-[#0d9488] ring-1 ring-[#0d9488]"
                : "border-[#e2e8f0]"
            }`}
          >
            <span className="text-[#64748b] text-xs font-medium">Pending Review</span>
            <div className="text-2xl font-bold text-[#0f172a] mt-1">{pendingCount}</div>
          </button>
          <button
            onClick={() => setFilterTab("Confirmed")}
            className={`bg-white border rounded-2xl p-4 shadow-xs text-left cursor-pointer transition-all ${
              filterTab === "Confirmed"
                ? "border-[#0d9488] ring-1 ring-[#0d9488]"
                : "border-[#e2e8f0]"
            }`}
          >
            <span className="text-[#64748b] text-xs font-medium">Confirmed</span>
            <div className="text-2xl font-bold text-[#0f172a] mt-1">{confirmedCount}</div>
          </button>
          <button
            onClick={() => setFilterTab("Dismissed")}
            className={`bg-white border rounded-2xl p-4 shadow-xs text-left cursor-pointer transition-all ${
              filterTab === "Dismissed"
                ? "border-[#0d9488] ring-1 ring-[#0d9488]"
                : "border-[#e2e8f0]"
            }`}
          >
            <span className="text-[#64748b] text-xs font-medium">Dismissed</span>
            <div className="text-2xl font-bold text-[#0f172a] mt-1">{dismissedCount}</div>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {(["All", "Pending Review", "Confirmed", "Dismissed"] as const).map((tab) => {
            const isActive = filterTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#0d9488] text-white shadow-xs"
                    : "bg-white border border-[#e2e8f0] text-[#64748b] hover:text-[#0f172a] hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Filter Row: Severity, Category, Search */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white border border-[#e2e8f0] rounded-xl px-3 py-1.5 text-xs text-[#0f172a]">
            <span className="text-[#64748b]">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="outline-none bg-transparent font-medium cursor-pointer"
            >
              <option value="All">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-[#e2e8f0] rounded-xl px-3 py-1.5 text-xs text-[#0f172a]">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="outline-none bg-transparent font-medium cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Booking Abuse">Booking Abuse</option>
              <option value="Communication Abuse">Communication Abuse</option>
              <option value="Platform Abuse">Platform Abuse</option>
            </select>
          </div>

          <div className="flex-1 relative min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user, violation ID..."
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-[#e2e8f0] rounded-xl text-xs text-[#0f172a] placeholder-[#94a3b8] outline-none focus:border-[#0d9488]"
            />
            <svg
              className="size-4 text-[#94a3b8] absolute left-3 top-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Violations Table */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[#64748b] border-b border-[#f1f5f9] bg-[#fafafa]">
                  <th className="py-3 px-3 font-semibold">Violation ID</th>
                  <th className="py-3 px-3 font-semibold">User</th>
                  <th className="py-3 px-3 font-semibold">Violation Type</th>
                  <th className="py-3 px-3 font-semibold">Source</th>
                  <th className="py-3 px-3 font-semibold">Severity</th>
                  <th className="py-3 px-3 font-semibold text-center">Points</th>
                  <th className="py-3 px-3 font-semibold">Date Detected</th>
                  <th className="py-3 px-3 font-semibold">Account Status</th>
                  <th className="py-3 px-3 font-semibold">Review Status</th>
                  <th className="py-3 px-3 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filteredViolations.map((v) => {
                  const isSelected = selectedViolation?.id === v.id;
                  return (
                    <tr
                      key={v.id}
                      onClick={() => setSelectedViolation(v)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-[#f0fdfa]" : "hover:bg-[#f8fafc]"
                      }`}
                    >
                      <td className="py-3.5 px-3 font-bold text-[#0d9488]">{v.id}</td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`size-6 rounded-full ${v.avatarBg} text-white flex items-center justify-center text-[10px] font-bold shrink-0`}
                          >
                            {v.userInitials}
                          </div>
                          <span className="font-medium text-[#0f172a] whitespace-nowrap">
                            {v.user}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-medium text-[#0f172a]">
                        {v.violationType}
                      </td>
                      <td className="py-3.5 px-3 text-[#64748b] whitespace-nowrap">
                        {v.source}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            v.severity === "High"
                              ? "bg-red-50 text-red-600"
                              : v.severity === "Medium"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {v.severity}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-center text-[#0f172a]">
                        +{v.points}
                      </td>
                      <td className="py-3.5 px-3 text-[#64748b] whitespace-nowrap">
                        {v.dateDetected}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                            v.accountStatus === "Restricted"
                              ? "bg-orange-50 text-orange-700"
                              : v.accountStatus === "Warning"
                              ? "bg-amber-50 text-amber-700"
                              : v.accountStatus === "Temporarily Suspended"
                              ? "bg-red-50 text-red-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {v.accountStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                            v.reviewStatus === "Confirmed"
                              ? "bg-blue-50 text-blue-700"
                              : v.reviewStatus === "Pending Review"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {v.reviewStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedViolation(v);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#0d9488] hover:bg-[#0f766e] text-white font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Drawer: Violation Details */}
      <div className="w-[380px] shrink-0 bg-white border border-[#e2e8f0] rounded-2xl flex flex-col shadow-xs overflow-hidden">
        {selectedViolation ? (
          <div className="flex flex-col h-full">
            {/* Header with User Info */}
            <div className="p-4 border-b border-[#f1f5f9] flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`size-10 rounded-full ${selectedViolation.avatarBg} text-white flex items-center justify-center text-sm font-bold shrink-0`}
                >
                  {selectedViolation.userInitials}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0f172a]">{selectedViolation.user}</h3>
                  <p className="text-xs text-[#64748b]">{selectedViolation.email}</p>
                  <span
                    className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedViolation.accountStatus === "Restricted"
                        ? "bg-orange-50 text-orange-700"
                        : selectedViolation.accountStatus === "Warning"
                        ? "bg-amber-50 text-amber-700"
                        : selectedViolation.accountStatus === "Temporarily Suspended"
                        ? "bg-red-50 text-red-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {selectedViolation.accountStatus}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedViolation(null)}
                className="text-[#94a3b8] hover:text-[#0f172a] text-sm p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                title="Close Drawer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs no-scrollbar">
              {/* Violation Info */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider block">
                    VIOLATION TYPE
                  </span>
                  <span className="font-semibold text-[#0f172a]">
                    {selectedViolation.violationType}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider block">
                    SOURCE
                  </span>
                  <span className="font-semibold text-[#0d9488]">
                    {selectedViolation.source}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider block">
                    POINTS
                  </span>
                  <span className="font-bold text-[#0f172a]">-{selectedViolation.points}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider block">
                    DATE DETECTED
                  </span>
                  <span className="text-[#475569]">{selectedViolation.dateDetected}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider block">
                    DETECTION METHOD
                  </span>
                  <span className="text-[#475569]">{selectedViolation.detectionMethod}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider block">
                    ACTION TAKEN
                  </span>
                  <span className="text-[#475569]">{selectedViolation.actionTaken}</span>
                </div>
              </div>

              {/* Evidence Section */}
              <div>
                <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider block mb-1.5">
                  EVIDENCE
                </span>
                <div className="bg-[#f8fafc] border border-[#f1f5f9] rounded-xl p-3 space-y-2 text-xs">
                  <div className="flex justify-between text-[#64748b]">
                    <span>BOOKING ID</span>
                    <span className="font-semibold text-[#0f172a]">
                      {selectedViolation.source}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#64748b]">
                    <span>PREVIOUS ACCEPTED CANCELLATIONS</span>
                    <span className="font-bold text-[#0f172a]">
                      {selectedViolation.stats.cancellations}
                    </span>
                  </div>

                  {/* Callout Quote Box */}
                  <div className="bg-[#fefce8] border border-[#fef08a] rounded-xl p-2.5 text-amber-900 text-[11px] leading-relaxed italic">
                    "{selectedViolation.evidenceQuote}"
                  </div>
                </div>
              </div>

              {/* Current Account Standing Grid (2x2) */}
              <div>
                <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider block mb-1.5">
                  CURRENT ACCOUNT STANDING
                </span>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-[#f8fafc] border border-[#f1f5f9] p-3 rounded-xl">
                    <div className="text-lg font-bold text-[#0f172a]">
                      {selectedViolation.stats.points}
                    </div>
                    <div className="text-[10px] text-[#64748b] font-medium">Points</div>
                  </div>
                  <div className="bg-[#f8fafc] border border-[#f1f5f9] p-3 rounded-xl">
                    <div className="text-lg font-bold text-[#0f172a]">
                      {selectedViolation.stats.violations}
                    </div>
                    <div className="text-[10px] text-[#64748b] font-medium">Violations</div>
                  </div>
                  <div className="bg-[#f8fafc] border border-[#f1f5f9] p-3 rounded-xl">
                    <div className="text-lg font-bold text-[#0f172a]">
                      {selectedViolation.stats.warnings}
                    </div>
                    <div className="text-[10px] text-[#64748b] font-medium">Warnings</div>
                  </div>
                  <div className="bg-[#f8fafc] border border-[#f1f5f9] p-3 rounded-xl">
                    <div className="text-lg font-bold text-[#0f172a]">
                      {selectedViolation.stats.cancellations}
                    </div>
                    <div className="text-[10px] text-[#64748b] font-medium">Cancellations</div>
                  </div>
                </div>
              </div>

              {/* Activity Log */}
              <div>
                <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider block mb-1.5">
                  ACTIVITY LOG
                </span>
                <div className="space-y-1.5 text-[11px] text-[#64748b]">
                  {selectedViolation.activityLog.map((log, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <span className="text-[#0d9488] font-bold mt-0.5">•</span>
                      <div>
                        <span className="font-medium text-[#0f172a]">{log.date}</span> — {log.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-[#f1f5f9] bg-white flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleUpdateReviewStatus("Confirmed")}
                  className="py-2 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                >
                  Confirm Violation
                </button>
                <button
                  onClick={() => handleUpdateReviewStatus("Dismissed")}
                  className="py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-[#334155] font-bold text-xs transition-colors cursor-pointer"
                >
                  Dismiss Violation
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center size-full text-center text-[#94a3b8] p-6">
            <span className="text-3xl mb-2">⚠️</span>
            <p className="text-xs">Select a violation to view full evidence and account standing</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. APPEALS VIEW (Screenshot 3)
// ─────────────────────────────────────────────────────────────────────────────
interface AppealItem {
  id: string;
  user: string;
  userInitials: string;
  avatarBg: string;
  email: string;
  violation: string;
  originalAction: string;
  submittedDate: string;
  status: "Pending" | "Under Review" | "Approved" | "Rejected";
  reviewer: string;
  originalViolationId: string;
  originalViolationSeverity: "High" | "Medium" | "Low";
  originalViolationTitle: string;
  originalViolationSource: string;
  userStanding: "Warning" | "Restricted" | "Temporarily Suspended" | "Good Standing";
  userExplanation: string;
  activityTimeline: { date: string; text: string }[];
}

const INITIAL_APPEALS: AppealItem[] = [
  {
    id: "#AP-003",
    user: "Jose Rodriguez",
    userInitials: "JR",
    avatarBg: "bg-purple-600",
    email: "jose.rodriguez@gmail.com",
    violation: "Harassment",
    originalAction: "Temporary Suspension (7 days)",
    submittedDate: "Oct 25, 2026",
    status: "Under Review",
    reviewer: "Admin Maria",
    originalViolationId: "#V001",
    originalViolationSeverity: "High",
    originalViolationTitle: "Harassment",
    originalViolationSource: "Message thread #MSG-1021",
    userStanding: "Temporarily Suspended",
    userExplanation:
      "I apologize for the intense tone used in chat. We had a plumbing emergency flooding the bathroom and emotions ran high.",
    activityTimeline: [
      { date: "Oct 25, 2026", text: "Appeal submitted by user" },
      { date: "Oct 26, 2026", text: "Under review by Admin Maria" },
    ],
  },
  {
    id: "#AP-002",
    user: "Arthur Pendragon",
    userInitials: "AP",
    avatarBg: "bg-blue-600",
    email: "arthur.p@gmail.com",
    violation: "Cancellation Abuse",
    originalAction: "Account Restriction",
    submittedDate: "Oct 22, 2026",
    status: "Rejected",
    reviewer: "Admin Maria",
    originalViolationId: "#V003",
    originalViolationSeverity: "Medium",
    originalViolationTitle: "Accepted Booking Cancellation Abuse",
    originalViolationSource: "Booking #BK-8835",
    userStanding: "Restricted",
    userExplanation:
      "The service was cancelled due to unexpected family travel outside Metro Manila.",
    activityTimeline: [
      { date: "Oct 22, 2026", text: "Appeal submitted by user" },
      { date: "Oct 23, 2026", text: "Rejected: Threshold policy strictly enforced" },
    ],
  },
  {
    id: "#AP-001",
    user: "John Santos",
    userInitials: "JS",
    avatarBg: "bg-purple-600",
    email: "john.santos@gmail.com",
    violation: "Cancellation Abuse",
    originalAction: "Account Restriction",
    submittedDate: "Sep 16, 2026",
    status: "Approved",
    reviewer: "Admin Maria",
    originalViolationId: "#V004",
    originalViolationSeverity: "Medium",
    originalViolationTitle: "Accepted Booking Cancellation Abuse",
    originalViolationSource: "Booking #BK-1025",
    userStanding: "Good Standing",
    userExplanation:
      "Specialist advised cancellation because parts were unavailable locally. Logs verify mutual agreement.",
    activityTimeline: [
      { date: "Sep 16, 2026", text: "Appeal submitted by user" },
      { date: "Sep 17, 2026", text: "Verified with provider logs. Appeal approved" },
    ],
  },
  {
    id: "#AP-004",
    user: "Roselle Diaz",
    userInitials: "RD",
    avatarBg: "bg-purple-600",
    email: "roselle.diaz@gmail.com",
    violation: "Cancellation Abuse",
    originalAction: "Warning",
    submittedDate: "Oct 26, 2026",
    status: "Pending",
    reviewer: "—",
    originalViolationId: "#V002",
    originalViolationSeverity: "Medium",
    originalViolationTitle: "Accepted Booking Cancellation Abuse",
    originalViolationSource: "Booking #BK-8837",
    userStanding: "Warning",
    userExplanation:
      "I cancelled because the provider had poor reviews. Please reconsider.",
    activityTimeline: [{ date: "Oct 26, 2026", text: "Appeal submitted by user" }],
  },
];

function AppealsView({
  onToast,
  globalSearch,
}: {
  onToast: (m: string) => void;
  globalSearch?: string;
}) {
  const [appeals, setAppeals] = useState<AppealItem[]>(INITIAL_APPEALS);
  const [selectedAppeal, setSelectedAppeal] = useState<AppealItem | null>(
    INITIAL_APPEALS[3] // #AP-004 Roselle Diaz selected in screenshot
  );
  const [filterTab, setFilterTab] = useState<
    "All" | "Pending" | "Under Review" | "Approved" | "Rejected"
  >("All");
  const [search, setSearch] = useState("");

  const query = (search || globalSearch || "").toLowerCase();

  const filteredAppeals = appeals.filter((a) => {
    if (filterTab !== "All" && a.status !== filterTab) return false;
    if (query) {
      const match =
        a.id.toLowerCase().includes(query) ||
        a.user.toLowerCase().includes(query) ||
        a.violation.toLowerCase().includes(query) ||
        a.originalAction.toLowerCase().includes(query);
      if (!match) return false;
    }
    return true;
  });

  const allCount = appeals.length;
  const pendingCount = appeals.filter((a) => a.status === "Pending").length;
  const underReviewCount = appeals.filter((a) => a.status === "Under Review").length;
  const resolvedCount = appeals.filter((a) => a.status === "Approved" || a.status === "Rejected").length;

  const handleUpdateAppeal = (newStatus: "Approved" | "Rejected" | "Under Review") => {
    if (!selectedAppeal) return;
    const updated = {
      ...selectedAppeal,
      status: newStatus,
      reviewer: "Admin Maria",
      userStanding:
        newStatus === "Approved" ? ("Good Standing" as const) : selectedAppeal.userStanding,
      activityTimeline: [
        ...selectedAppeal.activityTimeline,
        {
          date: "Oct 28, 2026",
          text: `Appeal marked as ${newStatus} by Admin Maria`,
        },
      ],
    };
    setSelectedAppeal(updated);
    setAppeals((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    onToast(`Appeal ${updated.id} status changed to ${newStatus}`);
  };

  return (
    <div className="flex gap-5 max-w-[1440px] mx-auto h-[calc(100vh-112px)] overflow-hidden">
      {/* Left / Main Section */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar">
        {/* KPI Cards (4 cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setFilterTab("All")}
            className={`bg-white border rounded-2xl p-4 shadow-xs text-left cursor-pointer transition-all ${
              filterTab === "All"
                ? "border-[#0d9488] ring-1 ring-[#0d9488]"
                : "border-[#e2e8f0]"
            }`}
          >
            <span className="text-[#64748b] text-xs font-medium">All Appeals</span>
            <div className="text-2xl font-bold text-[#0f172a] mt-1">{allCount}</div>
          </button>
          <button
            onClick={() => setFilterTab("Pending")}
            className={`bg-white border rounded-2xl p-4 shadow-xs text-left cursor-pointer transition-all ${
              filterTab === "Pending"
                ? "border-[#0d9488] ring-1 ring-[#0d9488]"
                : "border-[#e2e8f0]"
            }`}
          >
            <span className="text-[#64748b] text-xs font-medium">Pending</span>
            <div className="text-2xl font-bold text-[#0f172a] mt-1">{pendingCount}</div>
          </button>
          <button
            onClick={() => setFilterTab("Under Review")}
            className={`bg-white border rounded-2xl p-4 shadow-xs text-left cursor-pointer transition-all ${
              filterTab === "Under Review"
                ? "border-[#0d9488] ring-1 ring-[#0d9488]"
                : "border-[#e2e8f0]"
            }`}
          >
            <span className="text-[#64748b] text-xs font-medium">Under Review</span>
            <div className="text-2xl font-bold text-[#0f172a] mt-1">{underReviewCount}</div>
          </button>
          <button
            onClick={() => setFilterTab("Approved")}
            className={`bg-white border rounded-2xl p-4 shadow-xs text-left cursor-pointer transition-all ${
              filterTab === "Approved" || filterTab === "Rejected"
                ? "border-[#0d9488] ring-1 ring-[#0d9488]"
                : "border-[#e2e8f0]"
            }`}
          >
            <span className="text-[#64748b] text-xs font-medium">Resolved</span>
            <div className="text-2xl font-bold text-[#0f172a] mt-1">{resolvedCount}</div>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {(["All", "Pending", "Under Review", "Approved", "Rejected"] as const).map(
            (tab) => {
              const isActive = filterTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0d9488] text-white shadow-xs"
                      : "bg-white border border-[#e2e8f0] text-[#64748b] hover:text-[#0f172a] hover:bg-slate-50"
                  }`}
                >
                  {tab}
                </button>
              );
            }
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search appeals..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#e2e8f0] rounded-xl text-xs text-[#0f172a] placeholder-[#94a3b8] outline-none focus:border-[#0d9488]"
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
        </div>

        {/* Appeals Table */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[#64748b] border-b border-[#f1f5f9] bg-[#fafafa]">
                  <th className="py-3 px-4 font-semibold">Appeal ID</th>
                  <th className="py-3 px-4 font-semibold">User</th>
                  <th className="py-3 px-4 font-semibold">Violation</th>
                  <th className="py-3 px-4 font-semibold">Original Action</th>
                  <th className="py-3 px-4 font-semibold">Submitted Date</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Reviewer</th>
                  <th className="py-3 px-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filteredAppeals.map((a) => {
                  const isSelected = selectedAppeal?.id === a.id;
                  return (
                    <tr
                      key={a.id}
                      onClick={() => setSelectedAppeal(a)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-[#f0fdfa]" : "hover:bg-[#f8fafc]"
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-[#0d9488]">{a.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`size-6 rounded-full ${a.avatarBg} text-white flex items-center justify-center text-[10px] font-bold shrink-0`}
                          >
                            {a.userInitials}
                          </div>
                          <span className="font-medium text-[#0f172a] whitespace-nowrap">
                            {a.user}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#0f172a]">
                        {a.violation}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748b]">{a.originalAction}</td>
                      <td className="py-3.5 px-4 text-[#64748b] whitespace-nowrap">
                        {a.submittedDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                            a.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700"
                              : a.status === "Rejected"
                              ? "bg-red-50 text-red-700"
                              : a.status === "Under Review"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#475569]">{a.reviewer}</td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppeal(a);
                          }}
                          className="px-3 py-1 rounded-lg bg-[#0d9488] hover:bg-[#0f766e] text-white font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Drawer: Appeal Details */}
      <div className="w-[380px] shrink-0 bg-white border border-[#e2e8f0] rounded-2xl flex flex-col shadow-xs overflow-hidden">
        {selectedAppeal ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-[#f1f5f9] flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0f172a]">Appeal Details</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-[#0d9488]">
                    {selectedAppeal.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedAppeal.status === "Approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : selectedAppeal.status === "Rejected"
                        ? "bg-red-50 text-red-700"
                        : selectedAppeal.status === "Under Review"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {selectedAppeal.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAppeal(null)}
                className="text-[#94a3b8] hover:text-[#0f172a] text-sm p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                title="Close Drawer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs no-scrollbar">
              {/* User Profile Info */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f8fafc] border border-[#f1f5f9]">
                <div
                  className={`size-10 rounded-full ${selectedAppeal.avatarBg} text-white flex items-center justify-center text-sm font-bold shrink-0`}
                >
                  {selectedAppeal.userInitials}
                </div>
                <div>
                  <h4 className="font-bold text-[#0f172a] text-xs">
                    {selectedAppeal.user}
                  </h4>
                  <p className="text-[11px] text-[#64748b]">{selectedAppeal.email}</p>
                  <span className="inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-50 text-amber-700">
                    {selectedAppeal.userStanding}
                  </span>
                </div>
              </div>

              {/* Appeal Meta */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider block">
                    VIOLATION
                  </span>
                  <span className="font-semibold text-[#0f172a]">
                    {selectedAppeal.violation}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider block">
                    ORIGINAL ACTION
                  </span>
                  <span className="text-[#475569]">{selectedAppeal.originalAction}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider block">
                    SUBMITTED
                  </span>
                  <span className="text-[#475569]">{selectedAppeal.submittedDate}</span>
                </div>
              </div>

              {/* Original Violation Card */}
              <div>
                <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider block mb-1.5">
                  ORIGINAL VIOLATION
                </span>
                <div className="bg-[#f8fafc] border border-[#f1f5f9] rounded-xl p-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0d9488]">
                      {selectedAppeal.originalViolationId}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                      {selectedAppeal.originalViolationSeverity}
                    </span>
                  </div>
                  <div className="font-medium text-[#0f172a]">
                    {selectedAppeal.originalViolationTitle}
                  </div>
                  <div className="text-[11px] text-[#64748b]">
                    {selectedAppeal.originalViolationSource}
                  </div>
                </div>
              </div>

              {/* User Explanation Card */}
              <div>
                <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider block mb-1.5">
                  USER EXPLANATION
                </span>
                <div className="bg-[#f0f9ff] border border-[#e0f2fe] rounded-xl p-3 text-[#0369a1] text-xs leading-relaxed italic">
                  "{selectedAppeal.userExplanation}"
                </div>
              </div>

              {/* Activity Timeline */}
              <div>
                <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider block mb-1.5">
                  ACTIVITY TIMELINE
                </span>
                <div className="space-y-1.5 text-[11px] text-[#64748b]">
                  {selectedAppeal.activityTimeline.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <span className="text-[#0d9488] font-bold mt-0.5">•</span>
                      <div>
                        <span className="font-medium text-[#0f172a]">{item.date}</span> — {item.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-[#f1f5f9] bg-white flex flex-col gap-2">
              <button
                onClick={() => handleUpdateAppeal("Approved")}
                className="w-full py-2.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
              >
                Approve Appeal
              </button>
              <button
                onClick={() => handleUpdateAppeal("Under Review")}
                className="w-full py-2 rounded-xl border border-[#cbd5e1] hover:bg-slate-50 text-[#334155] font-bold text-xs transition-colors cursor-pointer"
              >
                Request More Information
              </button>
              <button
                onClick={() => handleUpdateAppeal("Rejected")}
                className="w-full py-2 rounded-xl border border-rose-300 hover:bg-rose-50 text-rose-600 font-bold text-xs transition-colors cursor-pointer"
              >
                Reject Appeal
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center size-full text-center text-[#94a3b8] p-6">
            <span className="text-3xl mb-2">⚖️</span>
            <p className="text-xs">Select an appeal to review user explanation and resolution history</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. MODERATION RULES VIEW (Screenshot 4)
// ─────────────────────────────────────────────────────────────────────────────
interface ModerationRule {
  id: string;
  name: string;
  subtext: string;
  category:
    | "Booking Abuse"
    | "Communication Abuse"
    | "Platform Abuse"
    | "Quality Monitoring";
  threshold: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  points: number;
  automatedAction: string;
  suspension: string;
  enabled: boolean;
}

const INITIAL_RULES: ModerationRule[] = [
  {
    id: "rule-1",
    name: "Accepted Booking Cancellation",
    subtext: "Repeated cancellation after a serv...",
    category: "Booking Abuse",
    threshold: "3 occurrences",
    severity: "Medium",
    points: 1,
    automatedAction: "Warning",
    suspension: "—",
    enabled: true,
  },
  {
    id: "rule-2",
    name: "Hate Speech",
    subtext: "Use of language that attacks peop...",
    category: "Communication Abuse",
    threshold: "1 confirmed incident",
    severity: "High",
    points: 3,
    automatedAction: "Temporary Suspension + Admin Review",
    suspension: "7 days",
    enabled: true,
  },
  {
    id: "rule-3",
    name: "Harassment",
    subtext: "Repeated or severe unwanted con...",
    category: "Communication Abuse",
    threshold: "2 occurrences",
    severity: "High",
    points: 3,
    automatedAction: "Account Restriction + Admin Review",
    suspension: "—",
    enabled: true,
  },
  {
    id: "rule-4",
    name: "No-Show",
    subtext: "Provider accepts booking but fails...",
    category: "Booking Abuse",
    threshold: "2 occurrences",
    severity: "Medium",
    points: 2,
    automatedAction: "Warning",
    suspension: "—",
    enabled: true,
  },
  {
    id: "rule-5",
    name: "Spam",
    subtext: "Sending repetitive unsolicited mes...",
    category: "Communication Abuse",
    threshold: "3 occurrences",
    severity: "Low",
    points: 1,
    automatedAction: "Warning",
    suspension: "—",
    enabled: true,
  },
  {
    id: "rule-6",
    name: "Review Abuse",
    subtext: "Submitting false, malicious, or coo...",
    category: "Platform Abuse",
    threshold: "1 confirmed incident",
    severity: "Medium",
    points: 2,
    automatedAction: "Review Removal + Warning",
    suspension: "—",
    enabled: true,
  },
  {
    id: "rule-7",
    name: "Low Community Rating",
    subtext: "Provider or customer maintains a r...",
    category: "Quality Monitoring",
    threshold: "Below 4.0 average",
    severity: "Low",
    points: 0,
    automatedAction: "Flag for Monitoring",
    suspension: "—",
    enabled: true,
  },
  {
    id: "rule-8",
    name: "Threatening Language",
    subtext: "Direct or implied threats of harm.",
    category: "Communication Abuse",
    threshold: "1 confirmed incident",
    severity: "Critical",
    points: 5,
    automatedAction: "Immediate Admin Review",
    suspension: "—",
    enabled: true,
  },
];

function ModRulesView({
  onToast,
  globalSearch,
}: {
  onToast: (m: string) => void;
  globalSearch?: string;
}) {
  const [rules, setRules] = useState<ModerationRule[]>(INITIAL_RULES);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [editingRule, setEditingRule] = useState<ModerationRule | null>(null);

  const query = (search || globalSearch || "").toLowerCase();

  const filteredRules = rules.filter((r) => {
    if (categoryFilter !== "All" && r.category !== categoryFilter) return false;
    if (query) {
      const match =
        r.name.toLowerCase().includes(query) ||
        r.subtext.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query) ||
        r.automatedAction.toLowerCase().includes(query);
      if (!match) return false;
    }
    return true;
  });

  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextState = !r.enabled;
          onToast(`Rule "${r.name}" has been ${nextState ? "Enabled" : "Disabled"}`);
          return { ...r, enabled: nextState };
        }
        return r;
      })
    );
  };

  const handleSaveRule = () => {
    if (!editingRule) return;
    setRules((prev) => prev.map((r) => (r.id === editingRule.id ? editingRule : r)));
    onToast(`Rule "${editingRule.name}" configuration saved`);
    setEditingRule(null);
  };

  return (
    <div className="flex flex-col gap-5 max-w-[1400px] mx-auto pb-8">
      {/* Progressive Violation System Banner */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs flex flex-col gap-3">
        <h2 className="text-sm font-bold text-[#0f172a]">
          Progressive Violation System
        </h2>

        {/* 5-step flow with arrows */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          {/* Step 1 */}
          <div className="flex-1 min-w-[120px] bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl p-3 text-center">
            <div className="text-xs font-bold text-emerald-900">0 pts</div>
            <div className="text-[11px] font-medium text-emerald-800">Good Standing</div>
          </div>
          <span className="text-slate-400 font-bold px-1">→</span>

          {/* Step 2 */}
          <div className="flex-1 min-w-[120px] bg-[#fefce8] border border-[#fef08a] rounded-xl p-3 text-center">
            <div className="text-xs font-bold text-amber-900">1 pt</div>
            <div className="text-[11px] font-medium text-amber-800">Warning</div>
          </div>
          <span className="text-slate-400 font-bold px-1">→</span>

          {/* Step 3 */}
          <div className="flex-1 min-w-[120px] bg-[#fff7ed] border border-[#fed7aa] rounded-xl p-3 text-center">
            <div className="text-xs font-bold text-orange-900">2 pts</div>
            <div className="text-[11px] font-medium text-orange-800">Restricted</div>
          </div>
          <span className="text-slate-400 font-bold px-1">→</span>

          {/* Step 4 */}
          <div className="flex-1 min-w-[130px] bg-[#fef2f2] border border-[#fecaca] rounded-xl p-3 text-center">
            <div className="text-xs font-bold text-rose-900">3 pts</div>
            <div className="text-[11px] font-medium text-rose-800">Temp. Suspension</div>
          </div>
          <span className="text-slate-400 font-bold px-1">→</span>

          {/* Step 5 */}
          <div className="flex-1 min-w-[140px] bg-[#ffe4e6] border border-[#fecdd3] rounded-xl p-3 text-center">
            <div className="text-xs font-bold text-rose-950">5+ pts</div>
            <div className="text-[11px] font-medium text-rose-900">Admin Review / Ban</div>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap flex-1">
          <div className="flex items-center gap-1.5 bg-white border border-[#e2e8f0] rounded-xl px-3 py-1.5 text-xs text-[#0f172a]">
            <span className="text-[#64748b]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="outline-none bg-transparent font-medium cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Booking Abuse">Booking Abuse</option>
              <option value="Communication Abuse">Communication Abuse</option>
              <option value="Platform Abuse">Platform Abuse</option>
              <option value="Quality Monitoring">Quality Monitoring</option>
            </select>
          </div>

          <div className="relative min-w-[260px] flex-1 max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rules..."
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-[#e2e8f0] rounded-xl text-xs text-[#0f172a] placeholder-[#94a3b8] outline-none focus:border-[#0d9488]"
            />
            <svg
              className="size-4 text-[#94a3b8] absolute left-3 top-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <span className="text-xs text-[#64748b] font-medium">
          {filteredRules.length} rules
        </span>
      </div>

      {/* Rules Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#64748b] border-b border-[#f1f5f9] bg-[#fafafa]">
                <th className="py-3 px-4 font-semibold">Rule Name</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Threshold</th>
                <th className="py-3 px-4 font-semibold">Severity</th>
                <th className="py-3 px-4 font-semibold text-center">Points</th>
                <th className="py-3 px-4 font-semibold">Automated Action</th>
                <th className="py-3 px-4 font-semibold">Suspension</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredRules.map((r) => (
                <tr key={r.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#0f172a]">{r.name}</div>
                    <div className="text-[11px] text-[#94a3b8]">{r.subtext}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[#475569]">{r.category}</td>
                  <td className="py-3.5 px-4 font-medium text-[#0f172a]">{r.threshold}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        r.severity === "Critical"
                          ? "bg-rose-100 text-rose-800"
                          : r.severity === "High"
                          ? "bg-red-50 text-red-600"
                          : r.severity === "Medium"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {r.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-center text-[#0f172a]">
                    +{r.points}
                  </td>
                  <td className="py-3.5 px-4 text-[#0f172a] font-medium">
                    {r.automatedAction}
                  </td>
                  <td className="py-3.5 px-4 text-[#64748b]">{r.suspension}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                        r.enabled
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {r.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setEditingRule({ ...r })}
                        className="flex items-center gap-1 text-[#475569] hover:text-[#0d9488] font-medium transition-colors cursor-pointer"
                        title="Edit Rule Configuration"
                      >
                        <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleToggleRule(r.id)}
                        className={`font-semibold cursor-pointer transition-colors ${
                          r.enabled
                            ? "text-rose-600 hover:text-rose-700"
                            : "text-[#0d9488] hover:text-[#0f766e]"
                        }`}
                      >
                        {r.enabled ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Rule Modal */}
      {editingRule && (
        <div
          onClick={() => setEditingRule(null)}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-[#e2e8f0] flex flex-col gap-4"
          >
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#0f172a]">Edit Moderation Rule</h3>
                <p className="text-xs text-[#64748b]">{editingRule.name}</p>
              </div>
              <button
                onClick={() => setEditingRule(null)}
                className="text-[#94a3b8] hover:text-[#0f172a] text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                  Threshold
                </label>
                <input
                  type="text"
                  value={editingRule.threshold}
                  onChange={(e) =>
                    setEditingRule({ ...editingRule, threshold: e.target.value })
                  }
                  className="w-full px-3 py-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-xs outline-none focus:border-[#0d9488]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                  Severity
                </label>
                <select
                  value={editingRule.severity}
                  onChange={(e) =>
                    setEditingRule({
                      ...editingRule,
                      severity: e.target.value as "Critical" | "High" | "Medium" | "Low",
                    })
                  }
                  className="w-full px-3 py-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-xs outline-none focus:border-[#0d9488]"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                  Penalty Points
                </label>
                <input
                  type="number"
                  value={editingRule.points}
                  onChange={(e) =>
                    setEditingRule({
                      ...editingRule,
                      points: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-xs outline-none focus:border-[#0d9488]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                  Automated Action
                </label>
                <input
                  type="text"
                  value={editingRule.automatedAction}
                  onChange={(e) =>
                    setEditingRule({
                      ...editingRule,
                      automatedAction: e.target.value,
                    })
                  }
                  className="w-full px-3 py-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-xs outline-none focus:border-[#0d9488]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                  Suspension Period
                </label>
                <input
                  type="text"
                  value={editingRule.suspension}
                  onChange={(e) =>
                    setEditingRule({ ...editingRule, suspension: e.target.value })
                  }
                  className="w-full px-3 py-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-xs outline-none focus:border-[#0d9488]"
                  placeholder="e.g. 7 days or —"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#f1f5f9]">
              <button
                onClick={() => setEditingRule(null)}
                className="px-4 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRule}
                className="px-4 py-1.5 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold shadow-2xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
