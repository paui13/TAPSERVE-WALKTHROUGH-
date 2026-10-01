import React, { useState, useRef, useEffect } from "react";
import { Screen } from "../types";
import {
  ProviderBottomNav,
  A,
  TapServeLogo,
  TapServeIcon,
  FloatingAIButton,
  TappyAvatar,
  TappyIcon,
} from "../components/SharedUI";
import {
  Booking,
  BookingStatus,
  Provider,
  ProviderApplicationData,
  UserAccount,
  AppStorage,
} from "../data/mockData";

// ─── THEME CONSTANTS ───────────────────────────────────────────────────────────
const THEME = {
  primary: "#115E59", // Teal-800
  secondary: "#0F766E", // Teal-700
  accent: "#14B8A6", // Teal-500
  bg: "#F8FAFA",
  card: "#FFFFFF",
  textMain: "#1F2937",
  textSub: "#6B7280",
  border: "#E5E7EB",
  success: "#16A34A",
  warning: "#F59E0B",
  error: "#DC2626",
};

// ─── DEMO DATA DEFAULTS ────────────────────────────────────────────────────────
interface ProviderServiceItem {
  id: string;
  name: string;
  category: string;
  startingPrice: number;
  duration: string;
  status: "Active" | "Inactive";
  description: string;
}

const INITIAL_SERVICES: ProviderServiceItem[] = [
  {
    id: "srv-1",
    name: "House Cleaning",
    category: "Cleaning",
    startingPrice: 500,
    duration: "2 hours",
    status: "Active",
    description: "Standard room swept, mopped, dusted, and kitchen sanitized.",
  },
  {
    id: "srv-2",
    name: "Deep Cleaning & Disinfection",
    category: "Cleaning",
    startingPrice: 1200,
    duration: "3.5 hours",
    status: "Active",
    description: "Heavy grime removal, antibacterial steam, and tile scrub.",
  },
  {
    id: "srv-3",
    name: "Move-in / Move-out Cleaning",
    category: "Cleaning",
    startingPrice: 1800,
    duration: "4 hours",
    status: "Active",
    description: "Comprehensive home turnover sanitizing before key handover.",
  },
];

interface ChatMessage {
  id: string;
  sender: "customer" | "provider";
  text: string;
  time: string;
}

interface ChatConversation {
  id: string;
  clientName: string;
  serviceTitle: string;
  bookingId: string;
  avatarBg: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  messages: ChatMessage[];
}

const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: "conv-1",
    clientName: "Juan Dela Cruz",
    serviceTitle: "House Cleaning",
    bookingId: "TS-1024",
    avatarBg: "bg-teal-600",
    lastMessage: "Thank you, see you tomorrow at 10:30 AM!",
    time: "2m ago",
    unreadCount: 2,
    messages: [
      { id: "m1", sender: "customer", text: "Hello! Confirming our booking for tomorrow morning.", time: "10:14 AM" },
      { id: "m2", sender: "provider", text: "Yes, I will be there at 10:30 AM sharp with all cleaning equipment.", time: "10:16 AM" },
      { id: "m3", sender: "customer", text: "Thank you, see you tomorrow at 10:30 AM!", time: "10:18 AM" },
    ],
  },
  {
    id: "conv-2",
    clientName: "Angela Reyes",
    serviceTitle: "Deep Cleaning",
    bookingId: "TS-1029",
    avatarBg: "bg-purple-600",
    lastMessage: "Can you bring extra disinfectant for the pet area?",
    time: "1h ago",
    unreadCount: 1,
    messages: [
      { id: "m4", sender: "customer", text: "Hi Angela here! Just sent a booking request.", time: "9:10 AM" },
      { id: "m5", sender: "customer", text: "Can you bring extra disinfectant for the pet area?", time: "9:12 AM" },
    ],
  },
  {
    id: "conv-3",
    clientName: "Miguel Santos",
    serviceTitle: "Home Sanitizing",
    bookingId: "TS-1018",
    avatarBg: "bg-blue-600",
    lastMessage: "Salamat Kuya! Napaka-linis ng condo.",
    time: "Yesterday",
    unreadCount: 0,
    messages: [
      { id: "m6", sender: "provider", text: "Completed the deep clean of the living room and bathrooms.", time: "4:30 PM" },
      { id: "m7", sender: "customer", text: "Salamat Kuya! Napaka-linis ng condo.", time: "4:45 PM" },
    ],
  },
];

interface NotificationItem {
  id: string;
  category: "Bookings" | "Messages" | "System";
  title: string;
  description: string;
  time: string;
  read: boolean;
  icon: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    category: "Bookings",
    title: "New booking request received",
    description: "Angela Reyes requested House Cleaning for Tomorrow at 9:00 AM.",
    time: "15m ago",
    read: false,
    icon: "📋",
  },
  {
    id: "notif-2",
    category: "Bookings",
    title: "Upcoming booking reminder",
    description: "Your booking with Juan Dela Cruz starts in 1 hour in San Pablo City.",
    time: "1h ago",
    read: false,
    icon: "⏰",
  },
  {
    id: "notif-3",
    category: "Messages",
    title: "New customer message",
    description: "Juan Dela Cruz: 'Thank you, see you tomorrow at 10:30 AM!'",
    time: "2m ago",
    read: false,
    icon: "💬",
  },
  {
    id: "notif-4",
    category: "System",
    title: "Credentials Approved",
    description: "Your Philippine ID and TESDA credentials were authenticated by Admin.",
    time: "1d ago",
    read: true,
    icon: "✓",
  },
  {
    id: "notif-5",
    category: "System",
    title: "Customer left a 5-star review",
    description: "Sonia Mercado rated your plumbing repair 5.0 stars.",
    time: "2d ago",
    read: true,
    icon: "⭐",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SERVICE PROVIDER DASHBOARD (The 5-Tab Marketplace Hub)
// ─────────────────────────────────────────────────────────────────────────────
export function ProviderDashboardScreen({
  nav,
  goBack,
  provider,
  providers = [],
  onSelectProvider,
  bookings,
  onSwitchToUserMode,
}: {
  nav: (s: Screen) => void;
  goBack: () => void;
  provider: Provider;
  providers?: Provider[];
  onSelectProvider?: (p: Provider) => void;
  bookings: Booking[];
  onSwitchToUserMode: () => void;
}) {
  // Navigation tabs: Home | Jobs | Bookings | Messages | Profile
  const [activeTab, setActiveTab] = useState<"home" | "jobs" | "bookings" | "messages" | "profile">("home");

  // Availability & Vacation Mode State
  const [isAvailable, setIsAvailable] = useState<boolean>(provider.isAcceptingBookings ?? true);
  const [vacationMode, setVacationMode] = useState<boolean>(false);

  // Local interactive jobs / bookings state
  const [localBookings, setLocalBookings] = useState<Booking[]>(() => {
    // If no provider bookings exist, seed realistic Philippine capstone records
    const existing = bookings.filter((b) => b.providerId === provider.id);
    if (existing.length >= 2) return existing;

    const seedJobs: Booking[] = [
      {
        id: "TS-1024",
        providerId: provider.id,
        providerName: provider.name,
        providerPhoto: provider.photo,
        serviceCategory: provider.category,
        serviceDetail: `${provider.category} Service & Maintenance`,
        date: "Today, Oct 12",
        time: "10:30 AM",
        address: "124 Rizal St., Brgy. San Roque, San Pablo City, Laguna",
        clientName: "Juan Dela Cruz",
        clientPhone: "+63 917 882 1432",
        problemDescription: "Standard maintenance checkup, please ring front gate doorbell.",
        urgencyLevel: "Medium",
        estimatedCost: 850,
        paymentMethod: "Cash Payment",
        status: "Accepted",
        createdAt: "2026-10-11",
      },
      {
        id: "TS-1029",
        providerId: provider.id,
        providerName: provider.name,
        providerPhoto: provider.photo,
        serviceCategory: provider.category,
        serviceDetail: `Comprehensive ${provider.category} Session`,
        date: "Tomorrow, Oct 13",
        time: "9:00 AM",
        address: "Blk 4 Lot 12 Villa San Pablo, Laguna",
        clientName: "Angela Reyes",
        clientPhone: "+63 920 334 9912",
        problemDescription: "Special attention to pet areas and disinfection of tiled floors.",
        urgencyLevel: "High",
        estimatedCost: 900,
        paymentMethod: "Cash Payment",
        status: "Pending",
        createdAt: "2026-10-12",
      },
      {
        id: "TS-1033",
        providerId: provider.id,
        providerName: provider.name,
        providerPhoto: provider.photo,
        serviceCategory: provider.category,
        serviceDetail: "Urgent Diagnostic & Repairs",
        date: "Wed, Oct 14",
        time: "1:00 PM",
        address: "Brgy. Concepcion, San Pablo City, Laguna",
        clientName: "Miguel Santos",
        clientPhone: "+63 918 554 1209",
        problemDescription: "Needs immediate on-site inspection for leak pressure issues.",
        urgencyLevel: "High",
        estimatedCost: 1200,
        paymentMethod: "Cash Payment",
        status: "Pending",
        createdAt: "2026-10-12",
      },
      {
        id: "TS-1018",
        providerId: provider.id,
        providerName: provider.name,
        providerPhoto: provider.photo,
        serviceCategory: provider.category,
        serviceDetail: `General ${provider.category}`,
        date: "Yesterday, Oct 11",
        time: "3:00 PM",
        address: "Mabini St., Brgy. IV-A, San Pablo City",
        clientName: "Sonia Mercado",
        clientPhone: "+63 919 778 2211",
        problemDescription: "Service was completed cleanly. Client praised prompt arrival.",
        urgencyLevel: "Low",
        estimatedCost: 1400,
        paymentMethod: "Cash Payment",
        status: "Completed",
        createdAt: "2026-10-11",
      },
    ];
    return [...existing, ...seedJobs];
  });

  // Active sub-views & modals
  const [selectedJobDetails, setSelectedJobDetails] = useState<Booking | null>(null);
  const [jobToCancel, setJobToCancel] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState<string>("Schedule Conflict");
  const [completedCelebration, setCompletedCelebration] = useState<Booking | null>(null);
  const [activeSubView, setActiveSubView] = useState<
    | null
    | "earnings"
    | "services"
    | "availability"
    | "areas"
    | "reviews"
    | "performance"
    | "verification"
    | "standing"
    | "support"
    | "notifications"
    | "ai-assistant"
    | "subscription"
  >(null);

  // Subscription & Plan Choice state (Monthly ₱120 vs Yearly ₱1,000)
  const [subscriptionPlan, setSubscriptionPlan] = useState<"monthly" | "yearly">("yearly");
  const [subscriptionPaymentMethod, setSubscriptionPaymentMethod] = useState<
    "GCash" | "Maya" | "In-App Earnings" | "Bank Transfer"
  >("GCash");
  const [subscriptionStatus, setSubscriptionStatus] = useState<"Active" | "Renewal Due">("Active");
  const [showSubscriptionReceipt, setShowSubscriptionReceipt] = useState(false);

  // Messages & Live Chat state
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);
  const [activeChat, setActiveChat] = useState<ChatConversation | null>(null);
  const [chatInput, setChatInput] = useState("");

  // Services list state
  const [services, setServices] = useState<ProviderServiceItem[]>(INITIAL_SERVICES);
  const [editingService, setEditingService] = useState<ProviderServiceItem | null>(null);
  const [showAddService, setShowAddService] = useState(false);

  // Service Areas list state
  const [areas, setAreas] = useState<string[]>([
    "San Pablo City (All 80 Barangays)",
    "Calauan, Laguna",
    "Alaminos, Laguna",
    "Los Baños, Laguna",
    "Bay, Laguna",
  ]);
  const [newAreaInput, setNewAreaInput] = useState("");

  // Weekly Working Days & Hours
  const [workingSchedule, setWorkingSchedule] = useState<{
    days: Record<string, boolean>;
    startTime: string;
    endTime: string;
  }>({
    days: {
      Monday: true,
      Tuesday: true,
      Wednesday: true,
      Thursday: true,
      Friday: true,
      Saturday: true,
      Sunday: false,
    },
    startTime: "8:00 AM",
    endTime: "5:00 PM",
  });

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [notifCategory, setNotifCategory] = useState<"All" | "Bookings" | "Messages" | "System">("All");

  // Schedule Screen Date selection
  const [selectedScheduleDay, setSelectedScheduleDay] = useState<number>(29);
  const [scheduleViewMode, setScheduleViewMode] = useState<"list" | "calendar">("list");
  const [scheduleFilterTab, setScheduleFilterTab] = useState<"Today" | "Upcoming" | "Completed" | "Cancelled">("Today");

  // Toast feedback state
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // ─── Booking Actions ────────────────────────────────────────────────────────
  const handleAcceptJob = (jobId: string) => {
    setLocalBookings((prev) =>
      prev.map((b) => (b.id === jobId ? { ...b, status: "Accepted" } : b))
    );
    if (selectedJobDetails?.id === jobId) {
      setSelectedJobDetails((prev) => (prev ? { ...prev, status: "Accepted" } : null));
    }
    triggerToast("✓ Booking request accepted! Added to upcoming jobs.");
  };

  const handleDeclineJob = (jobId: string) => {
    setLocalBookings((prev) =>
      prev.map((b) => (b.id === jobId ? { ...b, status: "Cancelled", cancellationReason: "Provider Unavailable" } : b))
    );
    if (selectedJobDetails?.id === jobId) {
      setSelectedJobDetails(null);
    }
    triggerToast("Booking request declined.");
  };

  const handleAdvanceStatus = (jobId: string, nextStatus: BookingStatus) => {
    setLocalBookings((prev) =>
      prev.map((b) => (b.id === jobId ? { ...b, status: nextStatus } : b))
    );
    if (selectedJobDetails?.id === jobId) {
      setSelectedJobDetails((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
    if (nextStatus === "Completed") {
      const match = localBookings.find((b) => b.id === jobId);
      if (match) setCompletedCelebration(match);
      triggerToast("🎉 Service completed! Cash payment confirmed.");
    } else {
      triggerToast(`Status updated to ${nextStatus}`);
    }
  };

  const handleConfirmCancellation = () => {
    if (!jobToCancel) return;
    setLocalBookings((prev) =>
      prev.map((b) =>
        b.id === jobToCancel.id
          ? { ...b, status: "Cancelled", cancellationReason: cancelReason }
          : b
      )
    );
    if (selectedJobDetails?.id === jobToCancel.id) {
      setSelectedJobDetails((prev) =>
        prev ? { ...prev, status: "Cancelled", cancellationReason: cancelReason } : null
      );
    }
    setJobToCancel(null);
    triggerToast(`Booking ${jobToCancel.id} cancelled: ${cancelReason}`);
  };

  // ─── Messaging Actions ───────────────────────────────────────────────────────
  const handleSendMessage = () => {
    if (!chatInput.trim() || !activeChat) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "provider",
      text: chatInput.trim(),
      time: "Just now",
    };
    const updatedMessages = [...activeChat.messages, newMsg];
    setActiveChat({
      ...activeChat,
      messages: updatedMessages,
      lastMessage: newMsg.text,
      time: "Just now",
    });
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeChat.id
          ? { ...c, messages: updatedMessages, lastMessage: newMsg.text, time: "Just now" }
          : c
      )
    );
    setChatInput("");
  };

  const handleQuickReply = (text: string) => {
    if (!activeChat) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "provider",
      text,
      time: "Just now",
    };
    const updatedMessages = [...activeChat.messages, newMsg];
    setActiveChat({
      ...activeChat,
      messages: updatedMessages,
      lastMessage: text,
      time: "Just now",
    });
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeChat.id
          ? { ...c, messages: updatedMessages, lastMessage: text, time: "Just now" }
          : c
      )
    );
  };

  // ─── Derived Counts ──────────────────────────────────────────────────────────
  const pendingRequests = localBookings.filter((b) => b.status === "Pending");
  const upcomingJobs = localBookings.filter(
    (b) => b.status === "Accepted" || b.status === "On the Way" || b.status === "In Progress"
  );
  const completedJobs = localBookings.filter((b) => b.status === "Completed");
  const nextBooking = upcomingJobs[0] || localBookings.find((b) => b.status === "Accepted");
  const unreadMessagesTotal = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const unreadNotifsTotal = notifications.filter((n) => !n.read).length;

  return (
    <div className="bg-[#F8FAFA] text-[#1F2937] flex flex-col size-full overflow-hidden font-sans select-none relative">
      {/* ─── TOAST NOTIFICATION OVERLAY ─── */}
      {toastMsg && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[100] max-w-xs w-full px-4 animate-in fade-in slide-in-from-top-3">
          <div className="bg-[#062E28] text-white px-4 py-2.5 rounded-2xl shadow-xl border border-[#14B8A6]/40 flex items-center justify-between text-xs font-semibold">
            <span>{toastMsg}</span>
            <button onClick={() => setToastMsg(null)} className="text-[#5EEAD4] ml-2 font-bold">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ─── VACATION MODE WARNING BANNER ─── */}
      {vacationMode && (
        <div className="bg-amber-500 text-amber-950 px-4 py-1.5 text-[11px] font-bold flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-1.5">
            <span>🌴</span>
            <span>Vacation Mode Active: Profile is hidden from new client bookings</span>
          </div>
          <button
            onClick={() => {
              setVacationMode(false);
              triggerToast("Vacation mode turned off! You are now visible to clients.");
            }}
            className="underline text-[10px] uppercase font-black"
          >
            Turn Off
          </button>
        </div>
      )}

      {/* ─── TOP APP HEADER (TapServe Provider Pro) ─── */}
      <header className="bg-[#115E59] text-white px-4 pt-11 pb-3 shrink-0 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="size-10 rounded-2xl bg-white p-1 flex items-center justify-center shadow-xs shrink-0 border border-white/40">
            <TapServeIcon size={34} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black text-white tracking-tight leading-none">TapServe</span>
              <span className="bg-[#14B8A6] text-[#042F2E] text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md tracking-wider">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-[#CCFBF1] font-medium mt-0.5">Provider Service Console</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications Bell */}
          <button
            onClick={() => setActiveSubView("notifications")}
            className="size-9 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/15 flex items-center justify-center relative transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadNotifsTotal > 0 && (
              <span className="absolute -top-1 -right-1 size-4 bg-[#DC2626] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifsTotal}
              </span>
            )}
          </button>

          {/* Specialist Avatar / Switcher */}
          <button
            onClick={() => setActiveTab("profile")}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 pl-1 pr-2.5 py-1 rounded-full cursor-pointer transition-colors"
          >
            <div className="size-7 rounded-full bg-[#0F766E] border border-white/40 flex items-center justify-center text-xs font-bold text-white relative">
              {provider.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              <span
                className={`absolute bottom-0 right-0 size-2 rounded-full border border-white ${
                  isAvailable && !vacationMode ? "bg-[#16A34A]" : "bg-slate-400"
                }`}
              />
            </div>
            <span className="text-xs font-semibold text-white truncate max-w-[80px]">
              {provider.name.split(" ")[0]}
            </span>
          </button>
        </div>
      </header>

      {/* ─── DYNAMIC TAB BODY CONTAINER ─── */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-6 flex flex-col">
        {activeTab === "home" && (
          <ProviderHomeView
            provider={provider}
            isAvailable={isAvailable}
            onToggleAvailability={() => {
              const next = !isAvailable;
              setIsAvailable(next);
              triggerToast(next ? "● Available: Clients can book your service" : "○ Currently Unavailable for new bookings");
            }}
            vacationMode={vacationMode}
            onOpenSubView={(v) => setActiveSubView(v)}
            onSwitchTab={(t) => setActiveTab(t)}
            pendingCount={pendingRequests.length}
            todayJobsCount={upcomingJobs.length}
            nextBooking={nextBooking}
            pendingRequests={pendingRequests}
            subscriptionPlan={subscriptionPlan}
            onOpenSubscription={() => setActiveSubView("subscription")}
            onAcceptJob={handleAcceptJob}
            onDeclineJob={(id) => {
              const match = localBookings.find((b) => b.id === id);
              if (match) setJobToCancel(match);
            }}
            onViewJobDetails={(job) => setSelectedJobDetails(job)}
            onStartChatWithClient={(clientName, serviceTitle, bookingId) => {
              const existingConv = conversations.find((c) => c.clientName === clientName);
              if (existingConv) {
                setActiveChat(existingConv);
              } else {
                const newConv: ChatConversation = {
                  id: `conv-${Date.now()}`,
                  clientName,
                  serviceTitle,
                  bookingId,
                  avatarBg: "bg-teal-600",
                  lastMessage: "Chat started",
                  time: "Just now",
                  unreadCount: 0,
                  messages: [
                    { id: "m-start", sender: "provider", text: "Hello! I am preparing for your service.", time: "Just now" },
                  ],
                };
                setConversations((prev) => [newConv, ...prev]);
                setActiveChat(newConv);
              }
            }}
          />
        )}

        {activeTab === "jobs" && (
          <ProviderJobsView
            bookings={localBookings}
            onAcceptJob={handleAcceptJob}
            onDeclineJob={(id) => {
              const match = localBookings.find((b) => b.id === id);
              if (match) setJobToCancel(match);
            }}
            onAdvanceStatus={handleAdvanceStatus}
            onViewDetails={(job) => setSelectedJobDetails(job)}
            onOpenChat={(job) => {
              const match = conversations.find((c) => c.clientName === job.clientName) || conversations[0];
              setActiveChat(match);
            }}
          />
        )}

        {activeTab === "bookings" && (
          <ProviderBookingsScheduleView
            bookings={localBookings}
            selectedDate={selectedScheduleDay}
            onSelectDate={setSelectedScheduleDay}
            viewMode={scheduleViewMode}
            onToggleViewMode={setScheduleViewMode}
            filterTab={scheduleFilterTab}
            onSelectFilterTab={setScheduleFilterTab}
            onViewDetails={(job) => setSelectedJobDetails(job)}
            onAdvanceStatus={handleAdvanceStatus}
          />
        )}

        {activeTab === "messages" && (
          <ProviderMessagesListView
            conversations={conversations}
            onOpenConversation={(conv) => {
              // Clear unread count on open
              setConversations((prev) =>
                prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
              );
              setActiveChat({ ...conv, unreadCount: 0 });
            }}
          />
        )}

        {activeTab === "profile" && (
          <ProviderProfileView
            provider={provider}
            providers={providers}
            onSelectProvider={onSelectProvider}
            onSwitchToUserMode={onSwitchToUserMode}
            onOpenSubView={(v) => setActiveSubView(v)}
            servicesCount={services.length}
            isAvailable={isAvailable}
            vacationMode={vacationMode}
            subscriptionPlan={subscriptionPlan}
            onSelectSubscriptionPlan={(newPlan) => {
              setSubscriptionPlan(newPlan);
              triggerToast(
                newPlan === "yearly"
                  ? "Switched to Yearly Plan (₱1,000/yr)! You save 30%."
                  : "Switched to Monthly Plan (₱120/mo). Flexible monthly billing enabled."
              );
            }}
            onOpenSubscription={() => setActiveSubView("subscription")}
          />
        )}
      </main>

      {/* ─── SUB-VIEW SLIDE-OVER / MODAL DRAWERS ─── */}
      {/* 1. Job Details Modal */}
      {selectedJobDetails && (
        <JobDetailsModal
          job={selectedJobDetails}
          onClose={() => setSelectedJobDetails(null)}
          onAccept={() => handleAcceptJob(selectedJobDetails.id)}
          onDecline={() => {
            setJobToCancel(selectedJobDetails);
            setSelectedJobDetails(null);
          }}
          onAdvanceStatus={(next) => handleAdvanceStatus(selectedJobDetails.id, next)}
          onOpenChat={() => {
            const match = conversations.find((c) => c.clientName === selectedJobDetails.clientName) || conversations[0];
            setActiveChat(match);
            setSelectedJobDetails(null);
          }}
          onCancelPrompt={() => {
            setJobToCancel(selectedJobDetails);
          }}
          onToast={triggerToast}
        />
      )}

      {/* 2. Interactive Live Chat Modal */}
      {activeChat && (
        <ProviderChatModal
          conversation={activeChat}
          onClose={() => setActiveChat(null)}
          messageInput={chatInput}
          onChangeInput={setChatInput}
          onSend={handleSendMessage}
          onQuickReply={handleQuickReply}
          onToast={triggerToast}
        />
      )}

      {/* 3. Cancellation Confirmation Modal */}
      {jobToCancel && (
        <CancellationConfirmModal
          job={jobToCancel}
          reason={cancelReason}
          onChangeReason={setCancelReason}
          onConfirm={handleConfirmCancellation}
          onClose={() => setJobToCancel(null)}
        />
      )}

      {/* 4. Service Completion Celebration Modal */}
      {completedCelebration && (
        <JobCompletedCelebrationModal
          job={completedCelebration}
          onClose={() => setCompletedCelebration(null)}
          onToast={triggerToast}
        />
      )}

      {/* 5. Sub-Views: Earnings */}
      {activeSubView === "earnings" && (
        <ProviderEarningsModal
          onClose={() => setActiveSubView(null)}
          completedJobs={completedJobs}
          onToast={triggerToast}
        />
      )}

      {/* 6. Sub-Views: My Services */}
      {activeSubView === "services" && (
        <ProviderServicesManagementModal
          services={services}
          onClose={() => setActiveSubView(null)}
          onToggleStatus={(id) => {
            setServices((prev) =>
              prev.map((s) => (s.id === id ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s))
            );
            triggerToast("Service status updated");
          }}
          onEditService={(srv) => setEditingService(srv)}
          onOpenAdd={() => setShowAddService(true)}
        />
      )}

      {/* 7. Sub-Views: Availability & Vacation Mode */}
      {activeSubView === "availability" && (
        <ProviderAvailabilityModal
          schedule={workingSchedule}
          onSaveSchedule={(sched) => {
            setWorkingSchedule(sched);
            triggerToast("Weekly schedule saved!");
            setActiveSubView(null);
          }}
          vacationMode={vacationMode}
          onToggleVacation={(v) => {
            setVacationMode(v);
            triggerToast(v ? "Vacation mode enabled" : "Vacation mode disabled");
          }}
          onClose={() => setActiveSubView(null)}
        />
      )}

      {/* 8. Sub-Views: Service Areas */}
      {activeSubView === "areas" && (
        <ProviderServiceAreasModal
          areas={areas}
          newAreaInput={newAreaInput}
          onChangeInput={setNewAreaInput}
          onAddArea={() => {
            if (!newAreaInput.trim()) return;
            setAreas((prev) => [...prev, newAreaInput.trim()]);
            setNewAreaInput("");
            triggerToast("New service area added!");
          }}
          onRemoveArea={(a) => {
            setAreas((prev) => prev.filter((item) => item !== a));
            triggerToast(`Removed ${a}`);
          }}
          onClose={() => setActiveSubView(null)}
        />
      )}

      {/* 9. Sub-Views: Ratings & Reviews */}
      {activeSubView === "reviews" && (
        <ProviderReviewsModal
          provider={provider}
          onClose={() => setActiveSubView(null)}
        />
      )}

      {/* 10. Sub-Views: Performance */}
      {activeSubView === "performance" && (
        <ProviderPerformanceModal
          provider={provider}
          onClose={() => setActiveSubView(null)}
        />
      )}

      {/* 11. Sub-Views: Provider Verification */}
      {activeSubView === "verification" && (
        <ProviderVerificationModal
          onClose={() => setActiveSubView(null)}
        />
      )}

      {/* 12. Sub-Views: Account Standing */}
      {activeSubView === "standing" && (
        <ProviderAccountStandingModal
          onClose={() => setActiveSubView(null)}
        />
      )}

      {/* 13. Sub-Views: Help & Support */}
      {activeSubView === "support" && (
        <ProviderHelpSupportModal
          onClose={() => setActiveSubView(null)}
          onOpenAI={() => setActiveSubView("ai-assistant")}
          onToast={triggerToast}
        />
      )}

      {/* 14. Sub-Views: Notifications Drawer */}
      {activeSubView === "notifications" && (
        <ProviderNotificationsModal
          notifications={notifications}
          category={notifCategory}
          onSelectCategory={setNotifCategory}
          onMarkRead={(id) => {
            setNotifications((prev) =>
              prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
          }}
          onMarkAllRead={() => {
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            triggerToast("All notifications marked as read");
          }}
          onClose={() => setActiveSubView(null)}
        />
      )}

      {/* 15. Add/Edit Service Modal */}
      {(showAddService || editingService) && (
        <AddEditServiceModal
          initial={editingService}
          onSave={(srv) => {
            if (editingService) {
              setServices((prev) => prev.map((s) => (s.id === srv.id ? srv : s)));
              triggerToast(`Updated ${srv.name}`);
            } else {
              setServices((prev) => [...prev, srv]);
              triggerToast(`Added ${srv.name}`);
            }
            setShowAddService(false);
            setEditingService(null);
          }}
          onClose={() => {
            setShowAddService(false);
            setEditingService(null);
          }}
        />
      )}

      {/* 16. Sub-Views: Provider AI Assistant Modal (Tappy Copilot) */}
      {activeSubView === "ai-assistant" && (
        <ProviderAIAssistantModal
          provider={provider}
          onClose={() => setActiveSubView(null)}
          onOpenSubView={(v) => setActiveSubView(v)}
          onToast={triggerToast}
        />
      )}

      {/* 17. Sub-Views: Specialist Subscription & Plan Choice Modal */}
      {activeSubView === "subscription" && (
        <ProviderSubscriptionModal
          provider={provider}
          plan={subscriptionPlan}
          onSelectPlan={(newPlan) => {
            setSubscriptionPlan(newPlan);
            triggerToast(
              newPlan === "yearly"
                ? "Switched to Yearly Plan (₱1,000/yr)! You save 30%."
                : "Switched to Monthly Plan (₱120/mo). Flexible monthly billing enabled."
            );
          }}
          paymentMethod={subscriptionPaymentMethod}
          onChangePaymentMethod={setSubscriptionPaymentMethod}
          status={subscriptionStatus}
          onRenew={() => {
            setSubscriptionStatus("Active");
            triggerToast(
              subscriptionPlan === "yearly"
                ? "₱1,000 Annual Subscription renewed! Valid for another 12 months."
                : "₱120 Monthly Subscription renewed! Valid for another 30 days."
            );
          }}
          onViewReceipt={() => setShowSubscriptionReceipt(true)}
          onClose={() => setActiveSubView(null)}
          onToast={triggerToast}
        />
      )}

      {/* 18. Official Subscription Digital Receipt Modal */}
      {showSubscriptionReceipt && (
        <ProviderSubscriptionReceiptModal
          provider={provider}
          plan={subscriptionPlan}
          paymentMethod={subscriptionPaymentMethod}
          onClose={() => setShowSubscriptionReceipt(false)}
          onToast={triggerToast}
        />
      )}

      {/* ─── FLOATING AI ASSISTANT BUTTON (Tappy) ─── */}
      <FloatingAIButton onClick={() => setActiveSubView("ai-assistant")} />

      {/* ─── BOTTOM MARKETPLACE NAVIGATION (5 Tabs) ─── */}
      <ProviderBottomNav
        active={activeTab}
        requestCount={pendingRequests.length}
        unreadMessagesCount={unreadMessagesTotal}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          // Close sub-views when switching tabs
          setActiveSubView(null);
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. PROVIDER HOME VIEW COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function ProviderHomeView({
  provider,
  isAvailable,
  onToggleAvailability,
  vacationMode,
  onOpenSubView,
  onSwitchTab,
  pendingCount,
  todayJobsCount,
  nextBooking,
  pendingRequests,
  subscriptionPlan = "yearly",
  onOpenSubscription,
  onAcceptJob,
  onDeclineJob,
  onViewJobDetails,
  onStartChatWithClient,
}: {
  provider: Provider;
  isAvailable: boolean;
  onToggleAvailability: () => void;
  vacationMode: boolean;
  onOpenSubView: (view: any) => void;
  onSwitchTab: (tab: any) => void;
  pendingCount: number;
  todayJobsCount: number;
  nextBooking?: Booking;
  pendingRequests: Booking[];
  subscriptionPlan?: "monthly" | "yearly";
  onOpenSubscription?: () => void;
  onAcceptJob: (id: string) => void;
  onDeclineJob: (id: string) => void;
  onViewJobDetails: (job: Booking) => void;
  onStartChatWithClient: (name: string, service: string, id: string) => void;
}) {
  const firstName = provider.name.split(" ")[0] || "Maria";

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* ── Top Greeting Card ── */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-white border border-teal-100 p-1 flex items-center justify-center shadow-xs shrink-0">
            <TapServeIcon size={36} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[#6B7280] font-medium">Good morning,</span>
            <h2 className="text-base font-bold text-[#1F2937] tracking-tight">{firstName} 👋</h2>
            <p className="text-[11px] text-[#0F766E] font-semibold mt-0.5">
              Ready for your next booking?
            </p>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold ${
                isAvailable && !vacationMode ? "text-[#16A34A]" : "text-[#6B7280]"
              }`}
            >
              {isAvailable && !vacationMode ? "Available" : "Unavailable"}
            </span>
            <button
              onClick={onToggleAvailability}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isAvailable && !vacationMode ? "bg-[#115E59]" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isAvailable && !vacationMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <span className="text-[10px] text-[#6B7280]">
            {isAvailable && !vacationMode
              ? "● Accepting new bookings"
              : "○ Not accepting bookings"}
          </span>
        </div>
      </div>

      {/* ── Compact Provider Summary KPIs ── */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-2.5 flex flex-col items-center text-center shadow-2xs">
          <span className="text-base font-bold text-[#1F2937]">{todayJobsCount}</span>
          <span className="text-[10px] text-[#6B7280] font-medium leading-tight mt-0.5">
            Today&apos;s Jobs
          </span>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-2.5 flex flex-col items-center text-center shadow-2xs relative">
          <span className="text-base font-bold text-[#0F766E]">{pendingCount}</span>
          <span className="text-[10px] text-[#6B7280] font-medium leading-tight mt-0.5">
            Pending
          </span>
          {pendingCount > 0 && (
            <span className="size-2 rounded-full bg-amber-500 absolute top-2 right-2 animate-ping" />
          )}
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-2.5 flex flex-col items-center text-center shadow-2xs">
          <span className="text-base font-bold text-[#16A34A]">₱2,450</span>
          <span className="text-[10px] text-[#6B7280] font-medium leading-tight mt-0.5">
            Earnings Today
          </span>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-2.5 flex flex-col items-center text-center shadow-2xs">
          <span className="text-base font-bold text-amber-600 flex items-center gap-0.5">
            <span>4.8</span>
            <span className="text-xs">★</span>
          </span>
          <span className="text-[10px] text-[#6B7280] font-medium leading-tight mt-0.5">
            Rating
          </span>
        </div>
      </div>

      {/* ── Specialist Subscription & Membership Status Card ── */}
      <div className="bg-gradient-to-r from-teal-900 via-[#115E59] to-[#0F766E] text-white p-3.5 rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <div className="size-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-lg shrink-0">
            💎
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">
                {subscriptionPlan === "yearly" ? "Annual Plan (₱1,000/yr)" : "Monthly Plan (₱120/mo)"}
              </span>
              <span className="text-[9px] bg-emerald-400 text-teal-950 font-extrabold px-1.5 py-0.2 rounded-full">
                Active
              </span>
            </div>
            <span className="text-[10px] text-teal-100 font-medium">
              {subscriptionPlan === "yearly" ? "Save 30% • Verified Specialist Status Active" : "Flexible Monthly • Verified Specialist Status Active"}
            </span>
          </div>
        </div>
        <button
          onClick={onOpenSubscription}
          className="relative z-10 bg-white hover:bg-teal-50 text-[#115E59] text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer active:scale-95"
        >
          Manage Plan →
        </button>
      </div>

      {/* ── Next Booking Hero Card (Prominent Focus Point) ── */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#1F2937] uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-teal-600">⚡</span> Next Booking
          </span>
          <span className="text-[10px] font-bold text-[#0F766E] bg-[#CCFBF1] px-2 py-0.5 rounded-full border border-[#99F6E4]">
            Confirmed
          </span>
        </div>

        {nextBooking ? (
          <div className="bg-white border-2 border-[#115E59]/30 rounded-2xl p-4 shadow-sm flex flex-col gap-3 relative overflow-hidden">
            {/* Top decorative stripe */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#115E59]" />

            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#1F2937]">
                  {nextBooking.serviceDetail || "House Cleaning"}
                </span>
                <span className="text-xs text-[#0F766E] font-semibold mt-0.5">
                  Client: {nextBooking.clientName}
                </span>
                <span className="text-[11px] text-[#6B7280] mt-0.5 flex items-center gap-1">
                  <span>📍</span>
                  <span className="truncate max-w-[200px]">{nextBooking.address}</span>
                </span>
              </div>

              <div className="text-right">
                <span className="text-base font-black text-[#115E59] block">
                  ₱{nextBooking.estimatedCost || 850}
                </span>
                <span className="text-[9px] text-[#6B7280] uppercase tracking-wider">
                  Cash on Service
                </span>
              </div>
            </div>

            {/* Time schedule chip */}
            <div className="bg-[#F8FAFA] border border-[#E5E7EB] px-3 py-1.5 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#1F2937] font-semibold">
                <span>📅</span>
                <span>{nextBooking.date}</span>
                <span>•</span>
                <span className="text-[#0F766E]">{nextBooking.time}</span>
              </div>
              <span className="text-[10px] text-[#16A34A] font-bold">In 45 mins</span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                onClick={() => onViewJobDetails(nextBooking)}
                className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1F2937] text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Details
              </button>
              <button
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(nextBooking.address)}`, "_blank")}
                className="py-2 px-2 rounded-xl border border-[#115E59]/30 text-[#115E59] text-xs font-bold hover:bg-teal-50 transition-colors cursor-pointer text-center"
              >
                Directions
              </button>
              <button
                onClick={() => onStartChatWithClient(nextBooking.clientName, nextBooking.serviceDetail, nextBooking.id)}
                className="py-2 px-2 rounded-xl bg-[#115E59] hover:bg-[#0F766E] text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer text-center"
              >
                Message
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 text-center text-xs text-[#6B7280] shadow-xs">
            <span className="text-2xl block mb-1">📅</span>
            <span className="font-bold text-[#1F2937] block">No upcoming bookings right now</span>
            <span>New customer jobs will be featured here once confirmed.</span>
          </div>
        )}
      </div>

      {/* ── Quick Actions ── */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">
          Quick Actions
        </span>

        <div className="grid grid-cols-5 gap-1.5">
          <button
            onClick={() => onSwitchTab("jobs")}
            className="bg-white border border-[#E5E7EB] rounded-2xl p-2.5 flex flex-col items-center text-center gap-1 hover:border-[#115E59] hover:bg-teal-50/30 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="size-9 rounded-xl bg-teal-50 text-[#115E59] flex items-center justify-center text-base group-hover:scale-110 transition-transform">
              🧰
            </div>
            <span className="text-[10px] font-bold text-[#1F2937] leading-tight">Requests</span>
          </button>

          <button
            onClick={() => onSwitchTab("bookings")}
            className="bg-white border border-[#E5E7EB] rounded-2xl p-2.5 flex flex-col items-center text-center gap-1 hover:border-[#115E59] hover:bg-teal-50/30 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="size-9 rounded-xl bg-teal-50 text-[#115E59] flex items-center justify-center text-base group-hover:scale-110 transition-transform">
              📅
            </div>
            <span className="text-[10px] font-bold text-[#1F2937] leading-tight">Schedule</span>
          </button>

          <button
            onClick={() => onOpenSubView("earnings")}
            className="bg-white border border-[#E5E7EB] rounded-2xl p-2.5 flex flex-col items-center text-center gap-1 hover:border-[#115E59] hover:bg-teal-50/30 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="size-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-base group-hover:scale-110 transition-transform">
              💰
            </div>
            <span className="text-[10px] font-bold text-[#1F2937] leading-tight">Earnings</span>
          </button>

          <button
            onClick={() => onOpenSubView("services")}
            className="bg-white border border-[#E5E7EB] rounded-2xl p-2.5 flex flex-col items-center text-center gap-1 hover:border-[#115E59] hover:bg-teal-50/30 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="size-9 rounded-xl bg-teal-50 text-[#115E59] flex items-center justify-center text-base group-hover:scale-110 transition-transform">
              🛠️
            </div>
            <span className="text-[10px] font-bold text-[#1F2937] leading-tight">Services</span>
          </button>

          <button
            onClick={() => onOpenSubView("performance")}
            className="bg-white border border-[#E5E7EB] rounded-2xl p-2.5 flex flex-col items-center text-center gap-1 hover:border-[#115E59] hover:bg-teal-50/30 transition-all cursor-pointer shadow-2xs group"
          >
            <div className="size-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-base group-hover:scale-110 transition-transform">
              📈
            </div>
            <span className="text-[10px] font-bold text-[#1F2937] leading-tight">Rating</span>
          </button>
        </div>

        {/* Tappy AI Assistant Smart Card */}
        <div
          onClick={() => onOpenSubView("ai-assistant")}
          className="bg-gradient-to-r from-[#0F766E] to-[#115E59] text-white p-3 rounded-2xl flex items-center justify-between shadow-xs cursor-pointer active:scale-98 transition-all hover:brightness-105"
        >
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-full bg-white/20 p-1 flex items-center justify-center shrink-0 border border-white/40 shadow-xs">
              <TappyAvatar size={34} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">Ask Tappy AI Copilot</span>
                <span className="bg-[#14B8A6] text-[#042F2E] text-[9px] font-black px-1.5 py-0.2 rounded-md uppercase">PRO AI</span>
              </div>
              <span className="text-[10px] text-[#CCFBF1]">Tips on earnings, schedule, rates & reviews</span>
            </div>
          </div>
          <span className="text-xs font-bold bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-xl border border-white/20">Chat →</span>
        </div>
      </div>

      {/* ── New Booking Requests Section ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">
              New Requests
            </span>
            <span className="size-5 rounded-full bg-[#115E59] text-white text-[10px] font-bold flex items-center justify-center">
              {pendingRequests.length}
            </span>
          </div>

          <button
            onClick={() => onSwitchTab("jobs")}
            className="text-[11px] font-bold text-[#0F766E] hover:underline cursor-pointer"
          >
            See all ({pendingRequests.length})
          </button>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 text-center flex flex-col items-center gap-1 text-[#6B7280] shadow-xs">
            <span className="text-2xl">🎉</span>
            <span className="text-xs font-bold text-[#1F2937]">You&apos;re all caught up!</span>
            <span className="text-[11px]">New customer booking requests will appear here immediately.</span>
          </div>
        ) : (
          pendingRequests.slice(0, 2).map((req) => (
            <div
              key={req.id}
              className="bg-white border border-[#E5E7EB] hover:border-[#115E59]/40 rounded-2xl p-4 shadow-xs flex flex-col gap-2.5 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#1F2937]">{req.serviceDetail}</span>
                  <span className="text-xs font-semibold text-[#0F766E]">Customer: {req.clientName}</span>
                  <span className="text-[11px] text-[#6B7280]">
                    {req.date} • {req.time}
                  </span>
                  <span className="text-[11px] text-[#6B7280] truncate max-w-[210px]">
                    📍 {req.address}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-[#115E59]">₱{req.estimatedCost}</span>
                  <span className="text-[10px] text-[#6B7280] block">Est. 3 hrs</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-[#F3F4F6]">
                <button
                  onClick={() => onViewJobDetails(req)}
                  className="py-1.5 px-2.5 rounded-xl text-[11px] font-bold text-[#6B7280] hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  View Details
                </button>
                <button
                  onClick={() => onDeclineJob(req.id)}
                  className="flex-1 py-1.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  Decline
                </button>
                <button
                  onClick={() => onAcceptJob(req.id)}
                  className="flex-1 py-1.5 rounded-xl bg-[#115E59] hover:bg-[#0F766E] text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                >
                  Accept
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. PROVIDER JOBS VIEW (Tabs: Requests | Upcoming | In Progress | Completed)
// ─────────────────────────────────────────────────────────────────────────────
function ProviderJobsView({
  bookings,
  onAcceptJob,
  onDeclineJob,
  onAdvanceStatus,
  onViewDetails,
  onOpenChat,
}: {
  bookings: Booking[];
  onAcceptJob: (id: string) => void;
  onDeclineJob: (id: string) => void;
  onAdvanceStatus: (id: string, nextStatus: BookingStatus) => void;
  onViewDetails: (job: Booking) => void;
  onOpenChat: (job: Booking) => void;
}) {
  const [subTab, setSubTab] = useState<"requests" | "upcoming" | "in-progress" | "completed">("requests");

  const requests = bookings.filter((b) => b.status === "Pending");
  const upcoming = bookings.filter((b) => b.status === "Accepted");
  const inProgress = bookings.filter((b) => b.status === "On the Way" || b.status === "In Progress");
  const completed = bookings.filter((b) => b.status === "Completed");

  const currentList =
    subTab === "requests"
      ? requests
      : subTab === "upcoming"
      ? upcoming
      : subTab === "in-progress"
      ? inProgress
      : completed;

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* ── Sub Tabs Bar ── */}
      <div className="flex bg-[#E5E7EB]/60 p-1 rounded-2xl gap-1">
        {[
          { id: "requests", label: "Requests", count: requests.length },
          { id: "upcoming", label: "Upcoming", count: upcoming.length },
          { id: "in-progress", label: "Active", count: inProgress.length },
          { id: "completed", label: "Completed", count: completed.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              subTab === tab.id
                ? "bg-white text-[#115E59] shadow-xs"
                : "text-[#6B7280] hover:text-[#1F2937]"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                  subTab === tab.id
                    ? "bg-[#115E59] text-white"
                    : "bg-slate-300 text-slate-700"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── List of Jobs ── */}
      <div className="flex flex-col gap-3">
        {currentList.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center flex flex-col items-center gap-2 text-[#6B7280] shadow-xs my-4">
            <span className="text-3xl">📭</span>
            <span className="text-sm font-bold text-[#1F2937]">No jobs in this category</span>
            <span className="text-xs">
              {subTab === "requests"
                ? "New client booking requests will appear here."
                : subTab === "upcoming"
                ? "Accept pending requests to schedule upcoming appointments."
                : subTab === "in-progress"
                ? "No service currently in progress."
                : "Your completed customer jobs will be archived here."}
            </span>
          </div>
        ) : (
          currentList.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xs flex flex-col gap-3 hover:border-[#115E59]/40 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-xl shrink-0">
                    🛠️
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-[#1F2937] leading-tight">
                      {job.serviceDetail}
                    </span>
                    <span className="text-xs font-semibold text-[#0F766E] mt-0.5">
                      {job.clientName}
                    </span>
                    <span className="text-[11px] text-[#6B7280]">
                      {job.date} • {job.time}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-[#115E59] block">
                    ₱{job.estimatedCost}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 border ${
                      job.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : job.status === "Pending"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : job.status === "In Progress" || job.status === "On the Way"
                        ? "bg-teal-50 text-teal-800 border-teal-200 animate-pulse"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
              </div>

              {/* Location & notes */}
              <div className="bg-[#F8FAFA] p-2.5 rounded-xl border border-[#E5E7EB] text-xs flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 text-[#6B7280]">
                  <span>📍</span>
                  <span className="truncate">{job.address}</span>
                </div>
                {job.problemDescription && (
                  <span className="text-[#475569] italic text-[11px] line-clamp-1 mt-0.5">
                    &quot;{job.problemDescription}&quot;
                  </span>
                )}
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-[#F3F4F6]">
                <button
                  onClick={() => onViewDetails(job)}
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1F2937] text-xs font-bold transition-colors cursor-pointer"
                >
                  View Details
                </button>

                {job.status === "Pending" && (
                  <>
                    <button
                      onClick={() => onDeclineJob(job.id)}
                      className="flex-1 py-2 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => onAcceptJob(job.id)}
                      className="flex-1 py-2 rounded-xl bg-[#115E59] hover:bg-[#0F766E] text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                    >
                      Accept
                    </button>
                  </>
                )}

                {job.status === "Accepted" && (
                  <>
                    <button
                      onClick={() => onOpenChat(job)}
                      className="py-2 px-3 rounded-xl border border-teal-200 text-[#0F766E] text-xs font-bold hover:bg-teal-50 transition-colors cursor-pointer"
                    >
                      Message
                    </button>
                    <button
                      onClick={() => onAdvanceStatus(job.id, "On the Way")}
                      className="flex-1 py-2 rounded-xl bg-[#115E59] hover:bg-[#0F766E] text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                    >
                      Start: On the Way →
                    </button>
                  </>
                )}

                {job.status === "On the Way" && (
                  <button
                    onClick={() => onAdvanceStatus(job.id, "In Progress")}
                    className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                  >
                    I&apos;ve Arrived • Start Job
                  </button>
                )}

                {job.status === "In Progress" && (
                  <button
                    onClick={() => onAdvanceStatus(job.id, "Completed")}
                    className="flex-1 py-2 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                  >
                    Complete Service (Collect ₱{job.estimatedCost})
                  </button>
                )}

                {job.status === "Completed" && (
                  <div className="flex-1 text-right">
                    <span className="text-[11px] font-bold text-[#16A34A] flex items-center justify-end gap-1">
                      <span>✓ Cash Settled</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PROVIDER BOOKINGS / SCHEDULE VIEW (Date Strip & Timeline)
// ─────────────────────────────────────────────────────────────────────────────
function ProviderBookingsScheduleView({
  bookings,
  selectedDate,
  onSelectDate,
  viewMode,
  onToggleViewMode,
  filterTab,
  onSelectFilterTab,
  onViewDetails,
  onAdvanceStatus,
}: {
  bookings: Booking[];
  selectedDate: number;
  onSelectDate: (d: number) => void;
  viewMode: "list" | "calendar";
  onToggleViewMode: (v: "list" | "calendar") => void;
  filterTab: "Today" | "Upcoming" | "Completed" | "Cancelled";
  onSelectFilterTab: (t: any) => void;
  onViewDetails: (b: Booking) => void;
  onAdvanceStatus: (id: string, s: BookingStatus) => void;
}) {
  const daysStrip = [
    { day: "MON", num: 28 },
    { day: "TUE", num: 29 },
    { day: "WED", num: 30 },
    { day: "THU", num: 1 },
    { day: "FRI", num: 2 },
    { day: "SAT", num: 3 },
    { day: "SUN", num: 4 },
  ];

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* ── Header Bar with Schedule Controls ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">📅</span>
          <div>
            <h2 className="text-base font-bold text-[#1F2937]">My Schedule</h2>
            <span className="text-[11px] text-[#6B7280]">October 2026 • Laguna</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSelectDate(29)}
            className="px-2.5 py-1 rounded-xl bg-teal-50 text-[#0F766E] border border-teal-200 text-xs font-bold hover:bg-teal-100 transition-colors cursor-pointer"
          >
            Today
          </button>
          <button
            onClick={() => onToggleViewMode(viewMode === "list" ? "calendar" : "list")}
            className="p-1.5 rounded-xl border border-[#E5E7EB] bg-white text-[#1F2937] hover:bg-slate-50 transition-colors cursor-pointer"
            title="Toggle Calendar/List View"
          >
            {viewMode === "list" ? "📆" : "📋"}
          </button>
        </div>
      </div>

      {/* ── Interactive Date Strip ── */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-1">
        {daysStrip.map((d) => {
          const isSelected = d.num === selectedDate;
          return (
            <button
              key={`${d.day}-${d.num}`}
              onClick={() => onSelectDate(d.num)}
              className={`flex-1 min-w-[42px] py-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#115E59] text-white shadow-sm ring-2 ring-[#14B8A6]/40"
                  : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-slate-50"
              }`}
            >
              <span className={`text-[10px] font-bold uppercase ${isSelected ? "text-[#CCFBF1]" : "text-[#9CA3AF]"}`}>
                {d.day}
              </span>
              <span className="text-sm font-black leading-none">{d.num}</span>
              <span
                className={`size-1.5 rounded-full ${
                  isSelected ? "bg-white" : d.num === 29 || d.num === 30 ? "bg-[#115E59]" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* ── Status Filter Tabs ── */}
      <div className="flex bg-[#E5E7EB]/50 p-1 rounded-xl gap-1">
        {(["Today", "Upcoming", "Completed", "Cancelled"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onSelectFilterTab(tab)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterTab === tab
                ? "bg-white text-[#115E59] shadow-2xs"
                : "text-[#6B7280] hover:text-[#1F2937]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Calendar Grid Mode (Simulated Functional Calendar) ── */}
      {viewMode === "calendar" ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6] text-xs font-bold text-[#1F2937]">
            <span>October 2026</span>
            <div className="flex gap-2 text-[#0F766E]">
              <span>◀</span>
              <span>▶</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <span key={i} className="text-[10px] font-bold text-[#9CA3AF] py-1">
                {d}
              </span>
            ))}
            {Array.from({ length: 31 }).map((_, i) => {
              const day = i + 1;
              const isSelected = day === selectedDate;
              const hasJobs = day === 28 || day === 29 || day === 30 || day === 14;
              return (
                <button
                  key={day}
                  onClick={() => onSelectDate(day)}
                  className={`size-8 rounded-xl mx-auto flex flex-col items-center justify-center text-xs font-semibold relative transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#115E59] text-white font-bold"
                      : "hover:bg-slate-100 text-[#1F2937]"
                  }`}
                >
                  <span>{day}</span>
                  {hasJobs && !isSelected && (
                    <span className="size-1 rounded-full bg-[#115E59] absolute bottom-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* ── Today's Schedule Timeline Cards ── */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">
          Scheduled Appointments
        </span>

        {bookings.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 text-center text-xs text-[#6B7280] shadow-xs">
            No bookings scheduled for this date.
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {bookings.slice(0, 3).map((b, idx) => (
              <div
                key={b.id}
                className="bg-white border border-[#E5E7EB] hover:border-[#115E59]/40 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3 transition-all cursor-pointer"
                onClick={() => onViewDetails(b)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-teal-50 border border-teal-100 text-[#115E59] font-bold text-xs shrink-0 w-16 text-center">
                    <span className="text-[10px] text-[#0F766E] uppercase">TIME</span>
                    <span className="text-xs leading-tight">{b.time.split(" ")[0]}</span>
                    <span className="text-[9px] text-[#6B7280]">{b.time.split(" ")[1]}</span>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#1F2937] truncate">{b.serviceDetail}</span>
                    <span className="text-[11px] text-[#0F766E] font-semibold">{b.clientName}</span>
                    <span className="text-[10px] text-[#6B7280] truncate">📍 {b.address}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs font-bold text-[#115E59]">₱{b.estimatedCost}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      b.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700"
                        : b.status === "Pending"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-teal-50 text-teal-800"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PROVIDER MESSAGES LIST VIEW
// ─────────────────────────────────────────────────────────────────────────────
function ProviderMessagesListView({
  conversations,
  onOpenConversation,
}: {
  conversations: ChatConversation[];
  onOpenConversation: (conv: ChatConversation) => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter(
    (c) =>
      c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      c.serviceTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col gap-3">
      {/* ── Search Bar ── */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer chats or services..."
          className="w-full bg-white border border-[#E5E7EB] rounded-2xl pl-9 pr-4 py-2.5 text-xs text-[#1F2937] placeholder-[#9CA3AF] outline-none focus:border-[#115E59] shadow-2xs transition-colors"
        />
        <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
      </div>

      {/* ── Conversation Cards List ── */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center flex flex-col items-center gap-1.5 text-[#6B7280] shadow-xs my-4">
            <span className="text-3xl">💬</span>
            <span className="text-sm font-bold text-[#1F2937]">No conversations found</span>
            <span className="text-xs">Incoming messages from booking clients will appear here.</span>
          </div>
        ) : (
          filtered.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onOpenConversation(conv)}
              className="bg-white border border-[#E5E7EB] hover:border-[#115E59]/40 rounded-2xl p-3.5 shadow-xs flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-slate-50/50"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`size-12 rounded-2xl text-white font-bold text-sm flex items-center justify-center shrink-0 ${conv.avatarBg}`}
                >
                  {conv.clientName.split(" ").map((n) => n[0]).join("")}
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1F2937] truncate">{conv.clientName}</span>
                    <span className="text-[10px] text-[#0F766E] font-semibold bg-teal-50 px-1.5 py-0.2 rounded">
                      {conv.serviceTitle}
                    </span>
                  </div>
                  <span className="text-xs text-[#475569] truncate mt-0.5 max-w-[210px]">
                    {conv.lastMessage}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-[10px] text-[#9CA3AF]">{conv.time}</span>
                {conv.unreadCount > 0 && (
                  <span className="size-5 rounded-full bg-[#115E59] text-white text-[10px] font-bold flex items-center justify-center shadow-2xs">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PROVIDER PROFILE VIEW & MANAGEMENT MENU
// ─────────────────────────────────────────────────────────────────────────────
function ProviderProfileView({
  provider,
  providers = [],
  onSelectProvider,
  onSwitchToUserMode,
  onOpenSubView,
  servicesCount,
  isAvailable,
  vacationMode,
  subscriptionPlan = "yearly",
  onSelectSubscriptionPlan,
  onOpenSubscription,
}: {
  provider: Provider;
  providers?: Provider[];
  onSelectProvider?: (p: Provider) => void;
  onSwitchToUserMode: () => void;
  onOpenSubView: (view: any) => void;
  servicesCount: number;
  isAvailable: boolean;
  vacationMode: boolean;
  subscriptionPlan?: "monthly" | "yearly";
  onSelectSubscriptionPlan?: (plan: "monthly" | "yearly") => void;
  onOpenSubscription?: () => void;
}) {
  return (
    <div className="p-4 flex flex-col gap-4">
      {/* ── Top Profile Card ── */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-2xl bg-[#0F766E] text-white text-2xl font-bold flex items-center justify-center shrink-0 shadow-inner relative overflow-hidden">
            {provider.name.split(" ").map((n) => n[0]).join("")}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-[#1F2937] truncate">{provider.name}</h2>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-md shrink-0">
                ✓ Verified
              </span>
            </div>
            <span className="text-xs text-[#0F766E] font-semibold">{provider.specialization}</span>
            <div className="flex items-center gap-2 text-xs text-[#6B7280] mt-1">
              <span className="text-amber-500 font-bold flex items-center gap-0.5">
                <span>⭐</span> {provider.rating || 4.9}
              </span>
              <span>•</span>
              <span>{provider.completedJobs || 142} completed jobs</span>
            </div>
          </div>
        </div>

        {/* Pro Switcher Helper (Essential for Capstone Demo) */}
        {providers.length > 0 && onSelectProvider && (
          <div className="bg-[#F8FAFA] p-2.5 rounded-xl border border-[#E5E7EB] flex items-center justify-between text-xs mt-1">
            <span className="text-[#6B7280] font-medium">Switch Specialist Demo:</span>
            <select
              value={provider.id}
              onChange={(e) => {
                const match = providers.find((p) => p.id === e.target.value);
                if (match) onSelectProvider(match);
              }}
              className="bg-white border border-[#CBD5E1] rounded-lg text-xs font-semibold px-2 py-1 outline-none text-[#1F2937] cursor-pointer"
            >
              {providers.slice(0, 10).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ── Specialist Subscription & Membership Management Card ── */}
      <div className="bg-white border-2 border-teal-600/30 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💎</span>
            <div>
              <span className="text-xs font-bold text-[#1F2937] block">
                TapServe Specialist Accreditation
              </span>
              <span className="text-[10px] text-[#0F766E] font-medium">
                San Pablo City Certified Service Partner
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
            Active Verified
          </span>
        </div>

        {/* Current Plan Indicator & Quick Plan Toggle */}
        <div className="bg-[#F8FAFA] p-3 rounded-xl border border-[#E5E7EB] flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6B7280]">Current Plan:</span>
            <span className="font-extrabold text-[#115E59]">
              {subscriptionPlan === "yearly" ? "Yearly Plan (₱1,000 / year)" : "Monthly Plan (₱120 / month)"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelectSubscriptionPlan && onSelectSubscriptionPlan("monthly")}
              className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center cursor-pointer ${
                subscriptionPlan === "monthly"
                  ? "bg-[#115E59] text-white border-[#115E59] shadow-xs"
                  : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#115E59]/40"
              }`}
            >
              <span>Monthly Plan</span>
              <span className="text-[10px] font-semibold opacity-90">₱120 / month</span>
            </button>

            <button
              onClick={() => onSelectSubscriptionPlan && onSelectSubscriptionPlan("yearly")}
              className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center relative cursor-pointer ${
                subscriptionPlan === "yearly"
                  ? "bg-[#115E59] text-white border-[#115E59] shadow-xs"
                  : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#115E59]/40"
              }`}
            >
              <span className="absolute -top-2 right-2 bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full shadow-2xs">
                SAVE 30%
              </span>
              <span>Yearly Plan</span>
              <span className="text-[10px] font-semibold opacity-90">₱1,000 / year</span>
            </button>
          </div>
        </div>

        <button
          onClick={onOpenSubscription || (() => onOpenSubView("subscription"))}
          className="w-full py-2 bg-[#F0FDFA] hover:bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>📑</span> View Subscription Benefits & Official Receipts →
        </button>
      </div>

      {/* ── Profile Sections List ── */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs divide-y divide-[#F3F4F6] text-xs">
        {[
          { label: "Subscription & Membership Plans", icon: "💎", sub: subscriptionPlan === "yearly" ? "Yearly Plan (₱1,000/yr) • Active (Save 30%)" : "Monthly Plan (₱120/mo) • Active", action: onOpenSubscription || (() => onOpenSubView("subscription")) },
          { label: "Tappy AI Business Copilot", icon: "🤖", sub: "Instant tips, schedule advice & earnings", action: () => onOpenSubView("ai-assistant") },
          { label: "My Services & Pricing", icon: "🛠️", sub: `${servicesCount} active offerings`, action: () => onOpenSubView("services") },
          { label: "Availability & Vacation Mode", icon: "📅", sub: vacationMode ? "Vacation Active" : "8:00 AM - 5:00 PM", action: () => onOpenSubView("availability") },
          { label: "Service Area Coverage", icon: "📍", sub: "San Pablo City & nearby", action: () => onOpenSubView("areas") },
          { label: "Earnings & Payouts", icon: "💰", sub: "₱12,450 available", action: () => onOpenSubView("earnings") },
          { label: "Ratings & Client Reviews", icon: "⭐", sub: `${provider.rating || 4.9} based on ${provider.reviewCount || 142} reviews`, action: () => onOpenSubView("reviews") },
          { label: "Performance & Quality Metrics", icon: "📈", sub: "96% completion rate", action: () => onOpenSubView("performance") },
          { label: "Documents & Verification", icon: "📑", sub: "Government ID, TESDA verified", action: () => onOpenSubView("verification") },
          { label: "Account Standing", icon: "🛡️", sub: "Good Standing (0 points)", action: () => onOpenSubView("standing") },
          { label: "Help & Support Center", icon: "❓", sub: "FAQs, hotline & issue reporting", action: () => onOpenSubView("support") },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-base">{item.icon}</span>
              <div className="flex flex-col">
                <span className="font-bold text-[#1F2937]">{item.label}</span>
                <span className="text-[10px] text-[#6B7280]">{item.sub}</span>
              </div>
            </div>
            <span className="text-slate-400 font-bold text-sm">→</span>
          </button>
        ))}
      </div>

      {/* ── Switch to User App & Logout ── */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onSwitchToUserMode}
          className="w-full py-3 bg-[#115E59] hover:bg-[#0F766E] text-white text-xs font-bold rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>📱</span> Switch to Customer Mode
        </button>

        <button
          onClick={() => {
            AppStorage.resetToDefaults();
            window.location.reload();
          }}
          className="w-full py-2.5 text-xs text-[#DC2626] font-semibold hover:bg-rose-50 rounded-2xl transition-colors cursor-pointer"
        >
          Reset Demo Data / Logout
        </button>

        {/* Official Brand Badge */}
        <div className="flex flex-col items-center justify-center gap-1.5 pt-4 pb-2 text-center border-t border-[#E5E7EB]/60 mt-1">
          <div className="bg-white border border-[#E5E7EB] p-2 rounded-2xl shadow-xs">
            <TapServeLogo size={52} />
          </div>
          <span className="text-xs font-bold text-[#115E59]">TapServe Provider Console</span>
          <span className="text-[10px] text-[#9CA3AF]">Official Certified Service Platform • San Pablo City</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// JOB DETAILS MODAL / SCREEN WITH PROGRESSION TIMELINE
// ─────────────────────────────────────────────────────────────────────────────
function JobDetailsModal({
  job,
  onClose,
  onAccept,
  onDecline,
  onAdvanceStatus,
  onOpenChat,
  onCancelPrompt,
  onToast,
}: {
  job: Booking;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
  onAdvanceStatus: (next: BookingStatus) => void;
  onOpenChat: () => void;
  onCancelPrompt: () => void;
  onToast: (msg: string) => void;
}) {
  const steps: BookingStatus[] = ["Pending", "Accepted", "On the Way", "In Progress", "Completed"];
  const currentStepIdx = steps.indexOf(job.status);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-[#E5E7EB]">
        {/* Header */}
        <div className="bg-[#115E59] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#CCFBF1] uppercase font-bold tracking-wider">
              Booking Ref #{job.id}
            </span>
            <h3 className="text-sm font-bold text-white">{job.serviceDetail}</h3>
          </div>
          <button
            onClick={onClose}
            className="size-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4 text-xs">
          {/* Booking Progress Timeline */}
          <div className="bg-[#F8FAFA] p-3.5 rounded-2xl border border-[#E5E7EB] flex flex-col gap-2">
            <span className="font-bold text-[#1F2937] text-[11px] uppercase tracking-wider">
              Service Status Lifecycle
            </span>
            <div className="flex items-center justify-between relative mt-1">
              <div className="absolute top-2 left-3 right-3 h-0.5 bg-slate-200 z-0" />
              {steps.map((st, i) => {
                const isPassed = currentStepIdx >= i;
                const isCurrent = job.status === st;
                return (
                  <div key={st} className="flex flex-col items-center gap-1 z-10">
                    <div
                      className={`size-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                        isCurrent
                          ? "bg-[#115E59] text-white ring-3 ring-teal-200"
                          : isPassed
                          ? "bg-[#16A34A] text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isPassed && !isCurrent ? "✓" : i + 1}
                    </div>
                    <span className="text-[8px] font-semibold text-[#6B7280] text-center max-w-[50px] leading-tight">
                      {st}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer Card */}
          <div className="bg-white p-3 rounded-2xl border border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-sm">
                {job.clientName.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[#1F2937]">{job.clientName}</span>
                <span className="text-[#6B7280] text-[11px]">{job.clientPhone}</span>
              </div>
            </div>

            <div className="flex gap-1.5">
              <button
                onClick={() => window.open(`tel:${job.clientPhone}`)}
                className="size-8 rounded-xl bg-teal-50 border border-teal-200 text-[#0F766E] flex items-center justify-center"
                title="Call client"
              >
                📞
              </button>
              <button
                onClick={onOpenChat}
                className="size-8 rounded-xl bg-[#115E59] text-white flex items-center justify-center"
                title="Message client"
              >
                💬
              </button>
            </div>
          </div>

          {/* Schedule & Price */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#F8FAFA] p-3 rounded-xl border border-[#E5E7EB]">
              <span className="text-[#6B7280] block text-[10px]">Schedule</span>
              <span className="font-bold text-[#1F2937]">{job.date}</span>
              <span className="text-[#0F766E] block font-semibold">{job.time}</span>
            </div>

            <div className="bg-[#F8FAFA] p-3 rounded-xl border border-[#E5E7EB]">
              <span className="text-[#6B7280] block text-[10px]">Service Fee</span>
              <span className="text-base font-black text-[#115E59]">₱{job.estimatedCost}</span>
              <span className="text-[#6B7280] block text-[9px]">Cash on completion</span>
            </div>
          </div>

          {/* Address & Directions */}
          <div className="bg-white p-3 rounded-xl border border-[#E5E7EB] flex flex-col gap-1.5">
            <span className="font-bold text-[#1F2937] text-[11px]">Service Location</span>
            <p className="text-[#475569] text-xs">📍 {job.address}</p>
            <button
              onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(job.address)}`, "_blank")}
              className="py-1.5 px-3 rounded-lg border border-[#115E59]/30 text-[#115E59] text-xs font-bold hover:bg-teal-50 w-full text-center"
            >
              Open in Google Maps / Waze ↗
            </button>
          </div>

          {/* Instructions */}
          {job.problemDescription && (
            <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 flex flex-col gap-1">
              <span className="font-bold text-amber-950 text-[11px]">Client Instructions</span>
              <p className="text-amber-900 text-xs italic">&quot;{job.problemDescription}&quot;</p>
            </div>
          )}
        </div>

        {/* Modal Action Controls Footer */}
        <div className="p-4 bg-white border-t border-[#E5E7EB] flex flex-col gap-2 shrink-0">
          {job.status === "Pending" && (
            <div className="flex gap-2">
              <button
                onClick={onDecline}
                className="flex-1 py-2.5 rounded-xl border border-rose-300 text-rose-600 font-bold text-xs"
              >
                Decline Request
              </button>
              <button
                onClick={onAccept}
                className="flex-1 py-2.5 rounded-xl bg-[#115E59] text-white font-bold text-xs shadow-xs"
              >
                Accept Booking
              </button>
            </div>
          )}

          {job.status === "Accepted" && (
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => onAdvanceStatus("On the Way")}
                className="w-full py-2.5 rounded-xl bg-[#115E59] text-white font-bold text-xs shadow-xs"
              >
                I&apos;m On the Way →
              </button>
              <button
                onClick={onCancelPrompt}
                className="text-center text-xs text-rose-600 font-semibold hover:underline"
              >
                Cancel Booking
              </button>
            </div>
          )}

          {job.status === "On the Way" && (
            <button
              onClick={() => onAdvanceStatus("In Progress")}
              className="w-full py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-xs"
            >
              I&apos;ve Arrived • Start Job
            </button>
          )}

          {job.status === "In Progress" && (
            <button
              onClick={() => onAdvanceStatus("Completed")}
              className="w-full py-2.5 rounded-xl bg-[#16A34A] text-white font-bold text-xs shadow-xs"
            >
              Mark as Completed (Collect ₱{job.estimatedCost})
            </button>
          )}

          {job.status === "Completed" && (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#F8FAFA] border border-[#E5E7EB] text-[#1F2937] font-bold text-xs"
            >
              Close Summary
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERACTIVE LIVE CHAT MODAL WITH QUICK REPLIES
// ─────────────────────────────────────────────────────────────────────────────
function ProviderChatModal({
  conversation,
  onClose,
  messageInput,
  onChangeInput,
  onSend,
  onQuickReply,
  onToast,
}: {
  conversation: ChatConversation;
  onClose: () => void;
  messageInput: string;
  onChangeInput: (val: string) => void;
  onSend: () => void;
  onQuickReply: (text: string) => void;
  onToast: (msg: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="bg-white w-full max-w-sm h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E5E7EB]">
        {/* Chat Header */}
        <div className="bg-[#115E59] text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <button onClick={onClose} className="text-white text-base font-bold pr-1">
              ←
            </button>
            <div className="size-9 rounded-full bg-teal-700 text-white font-bold flex items-center justify-center text-xs">
              {conversation.clientName.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">{conversation.clientName}</span>
              <span className="text-[10px] text-[#CCFBF1]">{conversation.serviceTitle} • Ref #{conversation.bookingId}</span>
            </div>
          </div>

          <button
            onClick={() => onToast("Calling customer hotline…")}
            className="size-8 rounded-full bg-white/15 flex items-center justify-center text-xs font-bold"
            title="Call Client"
          >
            📞
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5 bg-[#F8FAFA]">
          <div className="text-center my-1">
            <span className="text-[10px] text-[#9CA3AF] bg-white px-2.5 py-1 rounded-full border border-[#E5E7EB]">
              TapServe Encrypted Client Communication
            </span>
          </div>

          {conversation.messages.map((m) => {
            const isMe = m.sender === "provider";
            return (
              <div
                key={m.id}
                className={`flex flex-col max-w-[80%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? "bg-[#115E59] text-white rounded-br-xs shadow-2xs"
                      : "bg-[#F1F5F9] text-[#1F2937] rounded-bl-xs border border-[#E2E8F0]"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-[#9CA3AF] mt-0.5 px-1">{m.time}</span>
              </div>
            );
          })}
        </div>

        {/* Quick Replies Bar */}
        <div className="bg-white border-t border-[#E5E7EB] px-3 py-1.5 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
          {[
            "I'm on my way.",
            "I've arrived.",
            "I'll be there in 10 minutes.",
            "Thank you for booking with TapServe.",
          ].map((quick) => (
            <button
              key={quick}
              onClick={() => onQuickReply(quick)}
              className="text-[10px] whitespace-nowrap bg-teal-50 hover:bg-teal-100 text-[#0F766E] border border-teal-200 px-2.5 py-1 rounded-full font-semibold cursor-pointer"
            >
              {quick}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#E5E7EB] flex items-center gap-2 shrink-0">
          <button
            onClick={() => onToast("Photo upload simulated.")}
            className="text-slate-400 hover:text-slate-600 text-lg px-1 cursor-pointer"
            title="Upload photo"
          >
            📷
          </button>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => onChangeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSend();
            }}
            placeholder="Type your message..."
            className="flex-1 bg-[#F8FAFA] border border-[#E5E7EB] rounded-2xl px-3.5 py-2 text-xs outline-none focus:border-[#115E59] text-[#1F2937]"
          />
          <button
            onClick={onSend}
            disabled={!messageInput.trim()}
            className="size-8 rounded-full bg-[#115E59] hover:bg-[#0F766E] disabled:opacity-40 text-white flex items-center justify-center font-bold text-xs shadow-xs cursor-pointer"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CANCELLATION CONFIRMATION MODAL WITH REASONS & STANDING WARNING
// ─────────────────────────────────────────────────────────────────────────────
function CancellationConfirmModal({
  job,
  reason,
  onChangeReason,
  onConfirm,
  onClose,
}: {
  job: Booking;
  reason: string;
  onChangeReason: (r: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const reasons = [
    "Emergency",
    "Schedule Conflict",
    "Unable to Perform Service",
    "Customer Request",
    "Other",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5 border border-[#E5E7EB]">
        <div className="size-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-2xl mx-auto">
          ⚠️
        </div>

        <div className="text-center flex flex-col gap-1">
          <h3 className="text-base font-bold text-[#1F2937]">Cancel Booking?</h3>
          <p className="text-xs text-[#DC2626] font-semibold bg-rose-50 p-2 rounded-xl border border-rose-200">
            Cancelling confirmed bookings affects your provider completion rating and platform standing.
          </p>
        </div>

        <div className="flex flex-col gap-1.5 text-xs">
          <span className="font-bold text-[#1F2937]">Select Cancellation Reason:</span>
          {reasons.map((r) => (
            <label
              key={r}
              className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-colors ${
                reason === r ? "bg-teal-50 border-[#115E59] font-bold text-[#115E59]" : "border-[#E5E7EB] text-[#475569]"
              }`}
            >
              <input
                type="radio"
                name="cancelReason"
                checked={reason === r}
                onChange={() => onChangeReason(r)}
                className="accent-[#115E59]"
              />
              <span>{r}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-[#6B7280] font-bold text-xs"
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-[#DC2626] text-white font-bold text-xs shadow-xs"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// JOB COMPLETED CELEBRATION MODAL
// ─────────────────────────────────────────────────────────────────────────────
function JobCompletedCelebrationModal({
  job,
  onClose,
  onToast,
}: {
  job: Booking;
  onClose: () => void;
  onToast: (m: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center gap-3 border border-[#E5E7EB]">
        <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl shadow-sm">
          🎉
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-[#0F766E] uppercase tracking-wider">
            Job Successfully Completed
          </span>
          <h3 className="text-lg font-black text-[#1F2937]">{job.serviceDetail}</h3>
          <p className="text-xs text-[#6B7280]">Client: {job.clientName}</p>
        </div>

        <div className="bg-[#F0FDF4] border border-[#BBF7D0] p-4 rounded-2xl w-full flex flex-col gap-1">
          <span className="text-[11px] text-emerald-800 font-semibold">Total Amount Collected (Cash):</span>
          <span className="text-2xl font-black text-[#16A34A]">₱{job.estimatedCost}</span>
          <span className="text-[10px] text-emerald-700">Payment received in full directly from client</span>
        </div>

        <button
          onClick={() => {
            onClose();
            onToast("Payment recorded into your earnings ledger.");
          }}
          className="w-full py-3 bg-[#115E59] hover:bg-[#0F766E] text-white text-xs font-bold rounded-2xl shadow-xs transition-colors mt-2"
        >
          Done & Close Summary
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-VIEW: EARNINGS MODAL (KPIs, Bar Graph, Recent Transactions)
// ─────────────────────────────────────────────────────────────────────────────
function ProviderEarningsModal({
  onClose,
  completedJobs,
  onToast,
}: {
  onClose: () => void;
  completedJobs: Booking[];
  onToast: (m: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="bg-white w-full max-w-sm max-h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E5E7EB]">
        <div className="bg-[#115E59] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#CCFBF1] uppercase font-bold tracking-wider">Revenue Ledger</span>
            <h3 className="text-base font-bold text-white">My Earnings</h3>
          </div>
          <button onClick={onClose} className="size-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs font-bold">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4 text-xs">
          {/* Main Balance Hero Card */}
          <div className="bg-gradient-to-br from-[#115E59] to-[#0F766E] text-white p-5 rounded-2xl shadow-sm flex flex-col gap-2">
            <span className="text-xs text-[#CCFBF1] font-semibold">Available Platform Balance</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black tracking-tight">₱12,450</span>
              <span className="text-xs bg-[#14B8A6]/30 px-2 py-0.5 rounded-full border border-teal-300/40 text-white font-bold">
                ✓ Settled
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/15 text-center mt-1">
              <div>
                <span className="text-[9px] text-[#CCFBF1] block">This Week</span>
                <span className="font-bold text-sm">₱6,200</span>
              </div>
              <div>
                <span className="text-[9px] text-[#CCFBF1] block">This Month</span>
                <span className="font-bold text-sm">₱21,800</span>
              </div>
              <div>
                <span className="text-[9px] text-[#CCFBF1] block">Completed</span>
                <span className="font-bold text-sm">28 jobs</span>
              </div>
            </div>
          </div>

          {/* Clean Visual Bar Graph */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col gap-2 shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#1F2937]">Weekly Earnings Trend</span>
              <span className="text-[10px] text-[#0F766E] font-bold">Peak: Sat (₱2,800)</span>
            </div>
            <div className="flex items-end justify-between gap-2 h-28 pt-4 pb-1 px-1">
              {[
                { day: "M", val: 35, amt: "₱850" },
                { day: "T", val: 55, amt: "₱1,200" },
                { day: "W", val: 40, amt: "₱900" },
                { day: "T", val: 65, amt: "₱1,450" },
                { day: "F", val: 80, amt: "₱1,900" },
                { day: "S", val: 100, amt: "₱2,800" },
                { day: "S", val: 50, amt: "₱1,150" },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full bg-slate-100 rounded-lg h-20 flex items-end overflow-hidden">
                    <div
                      className="w-full bg-[#115E59] group-hover:bg-[#14B8A6] transition-all rounded-lg"
                      style={{ height: `${bar.val}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#6B7280] font-semibold">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Earnings List */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-[#1F2937] text-xs uppercase tracking-wider">
              Recent Transactions
            </span>
            {[
              { service: "House Cleaning", client: "Juan Dela Cruz", date: "Sep 29", amount: "₱850" },
              { service: "Electrical Repair", client: "Miguel Reyes", date: "Sep 28", amount: "₱1,200" },
              { service: "AC Deep Cleaning", client: "Angela Cruz", date: "Sep 26", amount: "₱1,500" },
              { service: "Plumbing Leak Fix", client: "Carlos Mendoza", date: "Sep 24", amount: "₱650" },
            ].map((tx, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E5E7EB] p-3 rounded-xl flex items-center justify-between shadow-2xs"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-[#1F2937]">{tx.service}</span>
                  <span className="text-[10px] text-[#6B7280]">
                    {tx.client} • {tx.date}
                  </span>
                </div>
                <span className="text-xs font-black text-[#16A34A]">+{tx.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-VIEW: MY SERVICES MANAGEMENT MODAL
// ─────────────────────────────────────────────────────────────────────────────
function ProviderServicesManagementModal({
  services,
  onClose,
  onToggleStatus,
  onEditService,
  onOpenAdd,
}: {
  services: ProviderServiceItem[];
  onClose: () => void;
  onToggleStatus: (id: string) => void;
  onEditService: (s: ProviderServiceItem) => void;
  onOpenAdd: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="bg-white w-full max-w-sm max-h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E5E7EB]">
        <div className="bg-[#115E59] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#CCFBF1] uppercase font-bold tracking-wider">Service Catalog</span>
            <h3 className="text-base font-bold text-white">My Services</h3>
          </div>
          <button onClick={onClose} className="size-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs font-bold">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-3 text-xs">
          <button
            onClick={onOpenAdd}
            className="w-full py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-[#0F766E] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-teal-100 transition-colors"
          >
            <span>+</span> Add New Service Offering
          </button>

          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-col gap-2.5 shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-[#1F2937]">{srv.name}</span>
                  <span className="text-[10px] text-[#6B7280]">
                    Category: {srv.category} • Est. {srv.duration}
                  </span>
                </div>
                <button
                  onClick={() => onToggleStatus(srv.id)}
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                    srv.status === "Active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-100 text-slate-500 border-slate-300"
                  }`}
                >
                  {srv.status}
                </button>
              </div>

              <p className="text-[#475569] text-xs leading-relaxed">{srv.description}</p>

              <div className="flex items-center justify-between pt-2 border-t border-[#F3F4F6]">
                <span className="text-xs font-bold text-[#115E59]">
                  Starting: ₱{srv.startingPrice}
                </span>
                <button
                  onClick={() => onEditService(srv)}
                  className="text-xs font-bold text-[#0F766E] hover:underline"
                >
                  Edit Service ✏️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-VIEW: AVAILABILITY & VACATION MODE MODAL
// ─────────────────────────────────────────────────────────────────────────────
function ProviderAvailabilityModal({
  schedule,
  onSaveSchedule,
  vacationMode,
  onToggleVacation,
  onClose,
}: {
  schedule: {
    days: Record<string, boolean>;
    startTime: string;
    endTime: string;
  };
  onSaveSchedule: (s: any) => void;
  vacationMode: boolean;
  onToggleVacation: (v: boolean) => void;
  onClose: () => void;
}) {
  const [days, setDays] = useState(schedule.days);
  const [startTime, setStartTime] = useState(schedule.startTime);
  const [endTime, setEndTime] = useState(schedule.endTime);

  const toggleDay = (d: string) => {
    setDays((prev) => ({ ...prev, [d]: !prev[d] }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="bg-white w-full max-w-sm max-h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E5E7EB]">
        <div className="bg-[#115E59] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#CCFBF1] uppercase font-bold tracking-wider">Working Hours</span>
            <h3 className="text-base font-bold text-white">Availability Settings</h3>
          </div>
          <button onClick={onClose} className="size-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs font-bold">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4 text-xs">
          {/* Vacation Mode Toggle */}
          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-amber-950 text-xs">🌴 Vacation Mode</span>
              <span className="text-[10px] text-amber-800">Temporarily pause new customer booking requests</span>
            </div>
            <input
              type="checkbox"
              checked={vacationMode}
              onChange={(e) => onToggleVacation(e.target.checked)}
              className="accent-amber-600 size-5 rounded"
            />
          </div>

          {/* Weekly Days Toggle */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-[#1F2937] uppercase tracking-wider text-[11px]">
              Weekly Working Days
            </span>
            <div className="flex flex-col gap-1.5">
              {Object.entries(days).map(([day, enabled]) => (
                <div
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    enabled ? "bg-teal-50/50 border-[#115E59]/30" : "bg-[#F8FAFA] border-[#E5E7EB]"
                  }`}
                >
                  <span className={`font-semibold ${enabled ? "text-[#115E59]" : "text-[#6B7280]"}`}>{day}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      enabled ? "bg-[#115E59] text-white" : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {enabled ? "Available" : "Off"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Operating Hours */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-[#6B7280] font-semibold text-[10px]">Start Time</span>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-[#F8FAFA] border border-[#E5E7EB] p-2 rounded-xl text-xs font-medium outline-none"
              >
                <option>7:00 AM</option>
                <option>8:00 AM</option>
                <option>9:00 AM</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[#6B7280] font-semibold text-[10px]">End Time</span>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-[#F8FAFA] border border-[#E5E7EB] p-2 rounded-xl text-xs font-medium outline-none"
              >
                <option>4:00 PM</option>
                <option>5:00 PM</option>
                <option>6:00 PM</option>
                <option>8:00 PM</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => onSaveSchedule({ days, startTime, endTime })}
            className="w-full py-2.5 rounded-xl bg-[#115E59] text-white font-bold text-xs shadow-xs mt-2"
          >
            Save Working Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-VIEW: SERVICE AREAS COVERAGE MODAL
// ─────────────────────────────────────────────────────────────────────────────
function ProviderServiceAreasModal({
  areas,
  newAreaInput,
  onChangeInput,
  onAddArea,
  onRemoveArea,
  onClose,
}: {
  areas: string[];
  newAreaInput: string;
  onChangeInput: (s: string) => void;
  onAddArea: () => void;
  onRemoveArea: (a: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="bg-white w-full max-w-sm max-h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E5E7EB]">
        <div className="bg-[#115E59] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#CCFBF1] uppercase font-bold tracking-wider">Territory</span>
            <h3 className="text-base font-bold text-white">Service Area Coverage</h3>
          </div>
          <button onClick={onClose} className="size-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs font-bold">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4 text-xs">
          <div className="bg-teal-50 border border-teal-200 p-3 rounded-2xl flex flex-col gap-1">
            <span className="font-bold text-[#115E59]">📍 Coverage Radius</span>
            <p className="text-[#0F766E] text-[11px] leading-relaxed">
              Customers in these towns and barangays will see your profile in search results.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newAreaInput}
              onChange={(e) => onChangeInput(e.target.value)}
              placeholder="e.g. Liliw, Laguna"
              className="flex-1 bg-[#F8FAFA] border border-[#E5E7EB] px-3 py-2 rounded-xl text-xs outline-none focus:border-[#115E59]"
            />
            <button
              onClick={onAddArea}
              className="px-3 py-2 bg-[#115E59] text-white rounded-xl font-bold text-xs"
            >
              Add
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-bold text-[#1F2937] uppercase tracking-wider text-[11px]">
              Active Locations ({areas.length})
            </span>
            <div className="flex flex-col gap-1.5">
              {areas.map((a) => (
                <div
                  key={a}
                  className="bg-white border border-[#E5E7EB] p-2.5 rounded-xl flex items-center justify-between"
                >
                  <span className="font-semibold text-[#1F2937]">{a}</span>
                  <button
                    onClick={() => onRemoveArea(a)}
                    className="text-rose-500 font-bold text-xs hover:bg-rose-50 px-2 py-0.5 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-VIEW: RATINGS & REVIEWS BREAKDOWN MODAL
// ─────────────────────────────────────────────────────────────────────────────
function ProviderReviewsModal({
  provider,
  onClose,
}: {
  provider: Provider;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="bg-white w-full max-w-sm max-h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E5E7EB]">
        <div className="bg-[#115E59] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#CCFBF1] uppercase font-bold tracking-wider">Reputation</span>
            <h3 className="text-base font-bold text-white">Ratings & Reviews</h3>
          </div>
          <button onClick={onClose} className="size-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs font-bold">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4 text-xs">
          {/* Rating Breakdown Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center gap-4 shadow-2xs">
            <div className="flex flex-col items-center justify-center border-r border-[#E5E7EB] pr-4 shrink-0">
              <span className="text-3xl font-black text-[#1F2937]">{provider.rating || 4.9}</span>
              <div className="flex text-amber-500 text-xs my-0.5">★★★★★</div>
              <span className="text-[10px] text-[#6B7280]">{provider.reviewCount || 142} reviews</span>
            </div>

            <div className="flex-1 flex flex-col gap-1 text-[10px]">
              {[
                { stars: "5★", count: 90, pct: "75%" },
                { stars: "4★", count: 20, pct: "17%" },
                { stars: "3★", count: 7, pct: "6%" },
                { stars: "2★", count: 2, pct: "1.5%" },
                { stars: "1★", count: 1, pct: "0.5%" },
              ].map((r) => (
                <div key={r.stars} className="flex items-center gap-2">
                  <span className="w-5 text-[#6B7280] font-bold">{r.stars}</span>
                  <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#115E59] h-full" style={{ width: r.pct }} />
                  </div>
                  <span className="w-6 text-right text-[#9CA3AF]">{r.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Reviews List */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-[#1F2937] uppercase tracking-wider text-[11px]">
              Recent Verified Client Feedback
            </span>
            {[
              { name: "Juan Dela Cruz", rating: 5, date: "Sep 28, 2026", service: "House Cleaning", comment: "Very professional and arrived on time. Completed the deep scrub of the kitchen without any hassle." },
              { name: "Angela Reyes", rating: 5, date: "Sep 22, 2026", service: "Deep Cleaning", comment: "Super bait and brought complete disinfection materials. Recommended to all in San Pablo!" },
              { name: "Miguel Garcia", rating: 4, date: "Sep 15, 2026", service: "Appliance Cleaning", comment: "Good quality work. Arrived 10 minutes late due to traffic, but apologized and worked swiftly." },
            ].map((rev, idx) => (
              <div key={idx} className="bg-white border border-[#E5E7EB] p-3 rounded-2xl flex flex-col gap-1 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1F2937]">{rev.name}</span>
                  <span className="text-[10px] text-[#9CA3AF]">{rev.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-500 text-xs">★★★★★</div>
                  <span className="text-[10px] text-[#0F766E] font-semibold">• {rev.service}</span>
                </div>
                <p className="text-[#475569] text-xs leading-relaxed mt-0.5">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-VIEW: PERFORMANCE METRICS MODAL
// ─────────────────────────────────────────────────────────────────────────────
function ProviderPerformanceModal({
  provider,
  onClose,
}: {
  provider: Provider;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="bg-white w-full max-w-sm max-h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E5E7EB]">
        <div className="bg-[#115E59] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#CCFBF1] uppercase font-bold tracking-wider">Quality Score</span>
            <h3 className="text-base font-bold text-white">Performance Metrics</h3>
          </div>
          <button onClick={onClose} className="size-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs font-bold">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4 text-xs">
          {/* Standing Badge */}
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-center gap-3">
            <div className="size-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-lg">
              ✓
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-emerald-900 text-sm">Excellent Standing</span>
              <span className="text-emerald-700 text-[11px]">Eligible for top-tier marketplace priority matching</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: "Community Rating", val: `${provider.rating || 4.9} / 5.0`, target: "Target: >4.5 ★", ok: true },
              { label: "Completed Bookings", val: `${provider.completedJobs || 142} jobs`, target: "Top 5% in San Pablo", ok: true },
              { label: "Completion Rate", val: "96%", target: "Target: >90%", ok: true },
              { label: "Cancellation Rate", val: "2%", target: "Target: <5%", ok: true },
              { label: "Response Rate", val: "98%", target: "Target: >95%", ok: true },
              { label: "Avg Response Time", val: "~5 min", target: "Fast Responder", ok: true },
            ].map((m, idx) => (
              <div key={idx} className="bg-white border border-[#E5E7EB] p-3 rounded-xl flex flex-col gap-1 shadow-2xs">
                <span className="text-[#6B7280] text-[10px] font-medium">{m.label}</span>
                <span className="text-base font-black text-[#1F2937]">{m.val}</span>
                <span className="text-[9px] font-bold text-[#16A34A]">{m.target}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-VIEW: PROVIDER VERIFICATION CHECKLIST MODAL
// ─────────────────────────────────────────────────────────────────────────────
function ProviderVerificationModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="bg-white w-full max-w-sm max-h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E5E7EB]">
        <div className="bg-[#115E59] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#CCFBF1] uppercase font-bold tracking-wider">Compliance</span>
            <h3 className="text-base font-bold text-white">Provider Verification</h3>
          </div>
          <button onClick={onClose} className="size-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs font-bold">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4 text-xs">
          <div className="bg-teal-50 border border-teal-200 p-3.5 rounded-2xl flex flex-col gap-1">
            <span className="font-bold text-[#115E59]">Badge Status: Fully Verified Provider</span>
            <p className="text-[#0F766E] text-[11px] leading-relaxed">
              Completing your verification improves customer trust and visibility in search results.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { title: "Identity Verification", status: "Verified", date: "Jan 2026", icon: "🪪" },
              { title: "Government ID (PhilSys/UMID)", status: "Verified", date: "Jan 2026", icon: "✓" },
              { title: "Service Credentials (TESDA NC II)", status: "Verified", date: "Feb 2026", icon: "🎖️" },
              { title: "Profile & Background Review", status: "Approved", date: "Feb 2026", icon: "📜" },
            ].map((v, i) => (
              <div key={i} className="bg-white border border-[#E5E7EB] p-3 rounded-xl flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{v.icon}</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#1F2937]">{v.title}</span>
                    <span className="text-[10px] text-[#6B7280]">Validated: {v.date}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  ✓ {v.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-VIEW: ACCOUNT STANDING MODAL
// ─────────────────────────────────────────────────────────────────────────────
function ProviderAccountStandingModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="bg-white w-full max-w-sm max-h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E5E7EB]">
        <div className="bg-[#115E59] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#CCFBF1] uppercase font-bold tracking-wider">Moderation</span>
            <h3 className="text-base font-bold text-white">Account Standing</h3>
          </div>
          <button onClick={onClose} className="size-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs font-bold">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex flex-col gap-1 text-center">
            <span className="text-2xl">🛡️</span>
            <span className="text-sm font-bold text-emerald-950">Good Standing</span>
            <p className="text-[11px] text-emerald-800 leading-relaxed mt-1">
              Your provider account is in good standing with 0 active penalty points and no unresolved disputes.
            </p>
          </div>

          <div className="bg-[#F8FAFA] p-3 rounded-xl border border-[#E5E7EB] flex flex-col gap-2">
            <span className="font-bold text-[#1F2937]">Standing Policy Highlights</span>
            <p className="text-[#6B7280] leading-relaxed">
              • Maintain cancellation rate below 5% to avoid booking restrictions.
            </p>
            <p className="text-[#6B7280] leading-relaxed">
              • Ensure punctual arrival and polite client interaction for every service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-VIEW: HELP & SUPPORT MODAL
// ─────────────────────────────────────────────────────────────────────────────
function ProviderHelpSupportModal({
  onClose,
  onOpenAI,
  onToast,
}: {
  onClose: () => void;
  onOpenAI?: () => void;
  onToast: (m: string) => void;
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "How do I receive payments?", a: "Clients pay you in cash directly upon job completion. TapServe does not withhold your earnings." },
    { q: "What if a customer cancels?", a: "Cancellations made within 2 hours of schedule are recorded and do not affect your rating." },
    { q: "How do I change my service rates?", a: "Go to Profile > My Services & Pricing to update your hourly rate and duration anytime." },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="bg-white w-full max-w-sm max-h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E5E7EB]">
        <div className="bg-[#115E59] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#CCFBF1] uppercase font-bold tracking-wider">Assistance</span>
            <h3 className="text-base font-bold text-white">Help & Support</h3>
          </div>
          <button onClick={onClose} className="size-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs font-bold">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4 text-xs">
          {/* Tappy AI Copilot Prominent Banner */}
          {onOpenAI && (
            <button
              onClick={() => {
                onClose();
                onOpenAI();
              }}
              className="bg-gradient-to-r from-[#0F766E] to-[#115E59] text-white p-3.5 rounded-2xl flex items-center justify-between shadow-xs cursor-pointer active:scale-98 transition-all hover:brightness-105"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-white/20 p-1 flex items-center justify-center shrink-0 border border-white/40">
                  <TappyAvatar size={34} />
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Tappy AI Provider Copilot</span>
                    <span className="bg-[#14B8A6] text-[#042F2E] text-[8px] font-black px-1.5 py-0.2 rounded-md uppercase">PRO AI</span>
                  </div>
                  <span className="text-[10px] text-[#CCFBF1]">Get 24/7 instant guidance for your business</span>
                </div>
              </div>
              <span className="text-[11px] font-bold bg-white/15 px-2.5 py-1 rounded-xl">Ask AI →</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onToast("Hotline dialer opened: +63 (049) 562-1100")}
              className="bg-white border border-[#E5E7EB] p-3 rounded-xl flex flex-col items-center gap-1 text-center shadow-2xs hover:bg-slate-50"
            >
              <span className="text-lg">📞</span>
              <span className="font-bold text-[#1F2937]">Hotline</span>
              <span className="text-[9px] text-[#6B7280]">San Pablo Help Desk</span>
            </button>
            <button
              onClick={() => onToast("Support ticket draft created.")}
              className="bg-white border border-[#E5E7EB] p-3 rounded-xl flex flex-col items-center gap-1 text-center shadow-2xs hover:bg-slate-50"
            >
              <span className="text-lg">📩</span>
              <span className="font-bold text-[#1F2937]">Report Issue</span>
              <span className="text-[9px] text-[#6B7280]">Direct Admin Ticket</span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-bold text-[#1F2937] uppercase tracking-wider text-[11px]">
              Frequently Asked Questions
            </span>
            <div className="flex flex-col gap-1.5">
              {faqs.map((f, i) => (
                <div key={i} className="border border-[#E5E7EB] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-3 text-left font-bold text-[#1F2937] flex justify-between items-center bg-white hover:bg-slate-50"
                  >
                    <span>{f.q}</span>
                    <span className="text-slate-400 font-bold">{openFaq === i ? "▲" : "▼"}</span>
                  </button>
                  {openFaq === i && (
                    <div className="p-3 bg-[#F8FAFA] border-t border-[#E5E7EB] text-[#475569] leading-relaxed">
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-VIEW: NOTIFICATIONS DRAWER MODAL
// ─────────────────────────────────────────────────────────────────────────────
function ProviderNotificationsModal({
  notifications,
  category,
  onSelectCategory,
  onMarkRead,
  onMarkAllRead,
  onClose,
}: {
  notifications: NotificationItem[];
  category: "All" | "Bookings" | "Messages" | "System";
  onSelectCategory: (c: any) => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClose: () => void;
}) {
  const filtered = notifications.filter(
    (n) => category === "All" || n.category === category
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="bg-white w-full max-w-sm max-h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E5E7EB]">
        <div className="bg-[#115E59] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#CCFBF1] uppercase font-bold tracking-wider">Alerts</span>
            <h3 className="text-base font-bold text-white">Provider Notifications</h3>
          </div>
          <button onClick={onClose} className="size-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs font-bold">
            ✕
          </button>
        </div>

        {/* Filter categories & Mark all read */}
        <div className="p-3 bg-[#F8FAFA] border-b border-[#E5E7EB] flex items-center justify-between gap-1 text-xs">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {(["All", "Bookings", "Messages", "System"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-2.5 py-1 rounded-xl font-bold text-[10px] transition-colors ${
                  category === cat ? "bg-[#115E59] text-white" : "bg-white text-[#6B7280] border border-[#E5E7EB]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button onClick={onMarkAllRead} className="text-[10px] font-bold text-[#0F766E] hover:underline whitespace-nowrap">
            Mark all read
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-2 text-xs">
          {filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => onMarkRead(n.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 items-start ${
                n.read ? "bg-white border-[#E5E7EB]" : "bg-teal-50/50 border-[#115E59]/40 shadow-2xs"
              }`}
            >
              <div className="size-8 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center text-base shrink-0 shadow-2xs">
                {n.icon}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1F2937] truncate">{n.title}</span>
                  <span className="text-[9px] text-[#9CA3AF] shrink-0">{n.time}</span>
                </div>
                <p className="text-[#475569] text-[11px] leading-relaxed mt-0.5">{n.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADD OR EDIT SERVICE MODAL
// ─────────────────────────────────────────────────────────────────────────────
function AddEditServiceModal({
  initial,
  onSave,
  onClose,
}: {
  initial: ProviderServiceItem | null;
  onSave: (s: ProviderServiceItem) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [category, setCategory] = useState(initial?.category || "Cleaning");
  const [startingPrice, setStartingPrice] = useState(initial?.startingPrice?.toString() || "600");
  const [duration, setDuration] = useState(initial?.duration || "2 hours");
  const [desc, setDesc] = useState(initial?.description || "");

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: initial?.id || `srv-${Date.now()}`,
      name: name.trim(),
      category,
      startingPrice: parseInt(startingPrice) || 500,
      duration,
      status: initial?.status || "Active",
      description: desc.trim() || "Professional service performed to highest TapServe standards.",
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5 border border-[#E5E7EB]">
        <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-2">
          <h3 className="font-bold text-sm text-[#1F2937]">
            {initial ? "Edit Service Offering" : "Add New Service Offering"}
          </h3>
          <button onClick={onClose} className="text-slate-400 font-bold text-sm">✕</button>
        </div>

        <div className="flex flex-col gap-2.5 text-xs">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-[#1F2937]">Service Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Deep Sofa Cleaning"
              className="bg-[#F8FAFA] border border-[#E5E7EB] p-2.5 rounded-xl outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <span className="font-bold text-[#1F2937]">Starting Price (₱)</span>
              <input
                type="number"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                className="bg-[#F8FAFA] border border-[#E5E7EB] p-2.5 rounded-xl outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-[#1F2937]">Est. Duration</span>
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 2.5 hours"
                className="bg-[#F8FAFA] border border-[#E5E7EB] p-2.5 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-bold text-[#1F2937]">Description</span>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Explain scope of work included in this rate..."
              rows={3}
              className="bg-[#F8FAFA] border border-[#E5E7EB] p-2.5 rounded-xl outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-[#6B7280] font-bold text-xs">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-[#115E59] text-white font-bold text-xs shadow-xs">
            Save Service
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 16. PROVIDER AI ASSISTANT MODAL (Tappy — Provider Business Copilot)
// ─────────────────────────────────────────────────────────────────────────────
interface ProviderAIMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  actionButtons?: { label: string; action: () => void }[];
}

function ProviderAIAssistantModal({
  provider,
  onClose,
  onOpenSubView,
  onToast,
}: {
  provider: Provider;
  onClose: () => void;
  onOpenSubView: (view: any) => void;
  onToast: (msg: string) => void;
}) {
  const firstName = provider.name.split(" ")[0] || "Specialist";
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ProviderAIMessage[]>([
    {
      id: "msg-1",
      sender: "bot",
      text: `Kumusta, ${firstName}! 👋 I'm Tappy, your TapServe AI Business Assistant. How can I help you optimize your bookings, schedule, rates, or earnings today in San Pablo City?`,
      time: "Just now",
      actionButtons: [
        { label: "💰 View Earnings", action: () => { onClose(); onOpenSubView("earnings"); } },
        { label: "📅 Set Availability", action: () => { onClose(); onOpenSubView("availability"); } },
        { label: "🛠️ Manage Services", action: () => { onClose(); onOpenSubView("services"); } },
      ],
    },
  ]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickQuestions = [
    "How do I maximize my earnings?",
    "How to set schedule & vacation mode?",
    "How to add or update services?",
    "How does Account Standing work?",
    "What documents do I need to get verified?",
    "How to get more 5-star reviews?",
  ];

  const handleAskQuestion = (question: string) => {
    const userMsg: ProviderAIMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: question,
      time: "Just now",
    };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      let botReply = "";
      let buttons: { label: string; action: () => void }[] | undefined = undefined;

      switch (question) {
        case "How do I maximize my earnings?":
          botReply =
            "To maximize earnings in San Pablo City: (1) Keep your availability active during weekend peak hours (8 AM - 4 PM), (2) Accept booking requests within 5 minutes, (3) Maintain a 4.8+ rating to get prioritized matching, and (4) Offer specialized add-ons like deep disinfection or premium materials!";
          buttons = [
            { label: "Open Earnings Ledger →", action: () => { onClose(); onOpenSubView("earnings"); } },
            { label: "View Performance Stats →", action: () => { onClose(); onOpenSubView("performance"); } },
          ];
          break;

        case "How to set schedule & vacation mode?":
          botReply =
            "You can enable or disable working days (Mon-Sat) and set custom daily shift hours under 'Availability'. If you are resting or away, toggle 'Vacation Mode' on so clients won't be able to book you while you take time off!";
          buttons = [
            { label: "Configure Availability →", action: () => { onClose(); onOpenSubView("availability"); } },
          ];
          break;

        case "How to add or update services?":
          botReply =
            "Head to 'My Services' to add new trade packages, set starting prices in ₱ Philippine Peso, provide expected job durations, and describe what's included in each service package.";
          buttons = [
            { label: "Manage Services & Rates →", action: () => { onClose(); onOpenSubView("services"); } },
          ];
          break;

        case "How does Account Standing work?":
          botReply =
            "TapServe evaluates provider quality based on: (1) Completion Rate (>90%), (2) Low Cancellations (<5%), and (3) Punctuality. Accounts in 'Good Standing' with 0 violation points enjoy maximum client exposure and instant job notifications!";
          buttons = [
            { label: "View Account Standing →", action: () => { onClose(); onOpenSubView("standing"); } },
            { label: "Review Rating & Feedback →", action: () => { onClose(); onOpenSubView("reviews"); } },
          ];
          break;

        case "What documents do I need to get verified?":
          botReply =
            "TapServe verification requires: (1) Valid Government ID (PhilSys National ID, Driver's License, or Voter's Certificate), (2) TESDA NC II Trade Certificate or PRC License, and (3) Barangay Clearance in San Pablo City.";
          buttons = [
            { label: "Check Verification Status →", action: () => { onClose(); onOpenSubView("verification"); } },
          ];
          break;

        case "How to get more 5-star reviews?":
          botReply =
            "Clients love: (1) Arriving 5-10 minutes early, (2) Sending quick message updates ('On the way', 'I have arrived'), (3) Cleaning up tools after work, and (4) Polite, professional communication throughout the service.";
          buttons = [
            { label: "View Client Reviews →", action: () => { onClose(); onOpenSubView("reviews"); } },
          ];
          break;

        default:
          botReply = "I am here to support your service business on TapServe! Feel free to ask about jobs, schedule, rates, or customer tips.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: botReply,
          time: "Just now",
          actionButtons: buttons,
        },
      ]);
    }, 550);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ProviderAIMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text,
      time: "Just now",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const lower = text.toLowerCase();
      let botReply = "";
      let buttons: { label: string; action: () => void }[] | undefined = undefined;

      if (lower.includes("earning") || lower.includes("pera") || lower.includes("kita") || lower.includes("rate") || lower.includes("presyo") || lower.includes("payout")) {
        botReply =
          "Cash payments are settled directly with the client right after you mark the job completed. You can inspect your weekly and monthly earnings breakdown in your Earnings dashboard!";
        buttons = [{ label: "Open Earnings →", action: () => { onClose(); onOpenSubView("earnings"); } }];
      } else if (lower.includes("sched") || lower.includes("oras") || lower.includes("time") || lower.includes("vacation") || lower.includes("day") || lower.includes("off")) {
        botReply =
          "You have complete control over your calendar! Set your daily hours or toggle Vacation Mode so you never receive surprise bookings when you're busy.";
        buttons = [{ label: "Set Availability →", action: () => { onClose(); onOpenSubView("availability"); } }];
      } else if (lower.includes("service") || lower.includes("linis") || lower.includes("repair") || lower.includes("gawa") || lower.includes("rate")) {
        botReply =
          "You can configure your service packages, prices, and job descriptions under 'My Services'. Clear descriptions lead to higher customer bookings!";
        buttons = [{ label: "My Services →", action: () => { onClose(); onOpenSubView("services"); } }];
      } else if (lower.includes("cancel") || lower.includes("tanggihan") || lower.includes("decline")) {
        botReply =
          "Frequent cancellations after accepting can affect your completion rating and standing. If you have an emergency, please notify the customer via chat first before cancelling.";
        buttons = [{ label: "Check Standing →", action: () => { onClose(); onOpenSubView("standing"); } }];
      } else if (lower.includes("verify") || lower.includes("clearance") || lower.includes("tesda") || lower.includes("id")) {
        botReply =
          "Verified providers carry the green Verified Pro Badge and appear first in customer search results across San Pablo City.";
        buttons = [{ label: "View Credentials →", action: () => { onClose(); onOpenSubView("verification"); } }];
      } else {
        botReply =
          `I got that! As your TapServe Copilot, I can help optimize your bookings, schedule, and client ratings in San Pablo City. What would you like to check?`;
        buttons = [
          { label: "💰 Earnings", action: () => { onClose(); onOpenSubView("earnings"); } },
          { label: "📅 Schedule", action: () => { onClose(); onOpenSubView("availability"); } },
          { label: "🛠️ Services", action: () => { onClose(); onOpenSubView("services"); } },
        ];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: botReply,
          time: "Just now",
          actionButtons: buttons,
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="bg-white w-full max-w-sm h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E5E7EB]">
        {/* Header */}
        <div className="bg-[#115E59] text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <button onClick={onClose} className="text-white text-base font-bold pr-1 hover:opacity-80 cursor-pointer">
              ←
            </button>
            <div className="size-9 rounded-full bg-white/20 p-1 flex items-center justify-center shrink-0 border border-white/40 shadow-xs">
              <TappyAvatar size={32} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-tight">Tappy — Provider Copilot</span>
                <span className="bg-[#14B8A6] text-[#042F2E] text-[8px] font-black uppercase px-1 py-0.2 rounded-md">
                  AI PRO
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[10px] text-[#CCFBF1]">Online · Business Assistant</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="size-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-3 bg-[#F8FAFA]">
          <div className="text-center my-0.5">
            <span className="text-[10px] text-[#0F766E] bg-teal-50 px-3 py-1 rounded-full border border-teal-200 font-semibold">
              ✨ TapServe AI Specialist Copilot · San Pablo City
            </span>
          </div>

          {messages.map((m) => {
            const isMe = m.sender === "user";
            return (
              <div
                key={m.id}
                className={`flex flex-col gap-1.5 max-w-[85%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`}
              >
                <div className="flex items-end gap-1.5">
                  {!isMe && (
                    <div className="size-6 rounded-full bg-teal-100 p-0.5 shrink-0 mb-1 border border-teal-200">
                      <TappyAvatar size={20} />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? "bg-[#115E59] text-white rounded-br-xs shadow-2xs"
                        : "bg-white text-[#1F2937] rounded-bl-xs border border-[#E5E7EB] shadow-xs"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>

                {/* Optional Action Deep-Link Buttons from AI */}
                {m.actionButtons && m.actionButtons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pl-7 mt-0.5">
                    {m.actionButtons.map((btn, bIdx) => (
                      <button
                        key={bIdx}
                        onClick={btn.action}
                        className="bg-white border border-[#115E59] text-[#115E59] hover:bg-teal-50 px-2.5 py-1 rounded-xl text-[10px] font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}
                <span className="text-[9px] text-[#9CA3AF] px-1">{m.time}</span>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-white border-t border-[#E5E7EB] px-3 pt-2 pb-1.5 shrink-0 flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
            Suggested Provider Inquiries
          </span>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleAskQuestion(q)}
                className="bg-[#F8FAFA] hover:bg-teal-50 border border-[#E5E7EB] hover:border-[#115E59]/40 text-[#1F2937] hover:text-[#115E59] text-[10px] font-semibold px-2.5 py-1 rounded-xl whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#E5E7EB] flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask Tappy anything about your provider business..."
            className="flex-1 bg-[#F8FAFA] border border-[#E5E7EB] focus:border-[#115E59] px-3 py-2 rounded-xl text-xs text-[#1F2937] outline-none transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="size-8 rounded-full bg-[#115E59] hover:bg-[#0F766E] disabled:opacity-40 text-white flex items-center justify-center font-bold text-xs shadow-xs cursor-pointer"
            aria-label="Send message to Tappy"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPECIALIST SUBSCRIPTION & MEMBERSHIP MODAL (Monthly vs Yearly Choice)
// ─────────────────────────────────────────────────────────────────────────────
function ProviderSubscriptionModal({
  provider,
  plan,
  onSelectPlan,
  paymentMethod,
  onChangePaymentMethod,
  status,
  onRenew,
  onViewReceipt,
  onClose,
  onToast,
}: {
  provider: Provider;
  plan: "monthly" | "yearly";
  onSelectPlan: (plan: "monthly" | "yearly") => void;
  paymentMethod: "GCash" | "Maya" | "In-App Earnings" | "Bank Transfer";
  onChangePaymentMethod: (pm: "GCash" | "Maya" | "In-App Earnings" | "Bank Transfer") => void;
  status: "Active" | "Renewal Due";
  onRenew: () => void;
  onViewReceipt: () => void;
  onClose: () => void;
  onToast: (msg: string) => void;
}) {
  const [selectedMethod, setSelectedMethod] = useState(paymentMethod);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="bg-white w-full max-w-sm max-h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E5E7EB]">
        {/* Header */}
        <div className="bg-[#115E59] text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#CCFBF1] uppercase font-bold tracking-wider">
              Accreditation & Plans
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              <span>💎</span> Specialist Subscription
            </h3>
          </div>
          <button
            onClick={onClose}
            className="size-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4 text-xs">
          {/* Active Status Banner */}
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                Current Status
              </span>
              <span className="text-xs font-bold text-[#115E59] mt-0.5">
                {plan === "yearly" ? "Annual License (₱1,000 / yr)" : "Monthly License (₱120 / mo)"}
              </span>
              <span className="text-[10px] text-[#0F766E]">
                Valid for {provider.name} in San Pablo City
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
              Active Verified
            </span>
          </div>

          {/* Interactive Plan Choice: Monthly vs Yearly */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1F2937] text-xs">
                Choose Subscription Plan:
              </span>
              <span className="text-[10px] text-[#0F766E] font-semibold">
                Switch anytime
              </span>
            </div>

            {/* Plan Card 1: Monthly (₱120 / month) */}
            <div
              onClick={() => onSelectPlan("monthly")}
              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-2 relative ${
                plan === "monthly"
                  ? "bg-teal-50/50 border-[#115E59] shadow-xs"
                  : "bg-white border-[#E5E7EB] hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`size-4 rounded-full border-2 flex items-center justify-center ${
                      plan === "monthly"
                        ? "border-[#115E59] bg-[#115E59]"
                        : "border-slate-300"
                    }`}
                  >
                    {plan === "monthly" && (
                      <span className="size-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-[#1F2937] text-xs block">
                      Monthly Subscription
                    </span>
                    <span className="text-[10px] text-[#6B7280]">
                      Flexible month-to-month billing
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-[#115E59]">
                    ₱120
                  </span>
                  <span className="text-[10px] text-[#6B7280]"> / month</span>
                </div>
              </div>

              {/* Monthly Features Checklist */}
              <div className="grid grid-cols-2 gap-1 text-[10px] text-[#4B5563] pt-1 border-t border-[#E5E7EB]/70">
                <span className="flex items-center gap-1">✓ Verified Specialist Badge</span>
                <span className="flex items-center gap-1">✓ Unlimited Booking Leads</span>
                <span className="flex items-center gap-1">✓ 10% Platform Commission</span>
                <span className="flex items-center gap-1">✓ Cancel or switch anytime</span>
              </div>
            </div>

            {/* Plan Card 2: Yearly (₱1,000 / year - Best Value) */}
            <div
              onClick={() => onSelectPlan("yearly")}
              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-2 relative ${
                plan === "yearly"
                  ? "bg-gradient-to-br from-teal-50/70 to-emerald-50/70 border-[#115E59] shadow-xs"
                  : "bg-white border-[#E5E7EB] hover:border-slate-300"
              }`}
            >
              {/* Badge: Best Value & Save 30% */}
              <div className="absolute -top-2.5 right-4 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                <span>⭐</span> BEST VALUE • SAVE 30%
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`size-4 rounded-full border-2 flex items-center justify-center ${
                      plan === "yearly"
                        ? "border-[#115E59] bg-[#115E59]"
                        : "border-slate-300"
                    }`}
                  >
                    {plan === "yearly" && (
                      <span className="size-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-[#1F2937] text-xs block">
                      Yearly Subscription
                    </span>
                    <span className="text-[10px] text-[#0F766E] font-medium">
                      2+ Months FREE (Only ~₱83.33/mo)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-[#115E59]">
                    ₱1,000
                  </span>
                  <span className="text-[10px] text-[#6B7280]"> / year</span>
                </div>
              </div>

              {/* Yearly Features Checklist */}
              <div className="grid grid-cols-2 gap-1 text-[10px] text-[#4B5563] pt-1 border-t border-[#E5E7EB]/70">
                <span className="flex items-center gap-1 font-semibold text-[#115E59]">
                  ✓ Priority Search Ranking
                </span>
                <span className="flex items-center gap-1 font-semibold text-[#115E59]">
                  ✓ Save ₱440 per year
                </span>
                <span className="flex items-center gap-1">✓ BIR Official Tax Receipt</span>
                <span className="flex items-center gap-1">✓ Priority Dispute Support</span>
                <span className="flex items-center gap-1">✓ 10% Platform Commission</span>
                <span className="flex items-center gap-1">✓ 1 Full Year Peace of Mind</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-[#1F2937] text-xs">
              Payment Method:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "GCash", label: "GCash", detail: "0917-***-1234", icon: "📱" },
                { id: "Maya", label: "Maya", detail: "0917-***-1234", icon: "💳" },
                { id: "In-App Earnings", label: "In-App Balance", detail: "₱12,450 Available", icon: "💰" },
                { id: "Bank Transfer", label: "BDO / BPI", detail: "Direct Transfer", icon: "🏦" },
              ].map((pm) => (
                <button
                  key={pm.id}
                  onClick={() => {
                    setSelectedMethod(pm.id as any);
                    onChangePaymentMethod(pm.id as any);
                    onToast(`Payment method set to ${pm.label}`);
                  }}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                    selectedMethod === pm.id
                      ? "bg-[#115E59] text-white border-[#115E59] shadow-2xs"
                      : "bg-white text-[#1F2937] border-[#E5E7EB] hover:bg-slate-50"
                  }`}
                >
                  <span className="text-base">{pm.icon}</span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-bold truncate">{pm.label}</span>
                    <span
                      className={`text-[9px] truncate ${
                        selectedMethod === pm.id ? "text-teal-200" : "text-[#6B7280]"
                      }`}
                    >
                      {pm.detail}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Platform Fee & Commission Rules Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex flex-col gap-1 text-[11px] text-amber-950">
            <span className="font-bold flex items-center gap-1">
              <span>ℹ️</span> TapServe Dual Revenue Model
            </span>
            <p className="text-[10px] leading-relaxed text-amber-900">
              TapServe deducts a <strong>10% service commission</strong> on each completed job plus your chosen subscription (<strong>₱120 monthly</strong> or <strong>₱1,000 yearly</strong>) to maintain certified specialist background verification and platform operations in San Pablo City.
            </p>
          </div>

          {/* Actions: Renew & View Receipt */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={onRenew}
              className="w-full py-3 bg-[#115E59] hover:bg-[#0F766E] text-white font-bold rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>💳</span>
              <span>
                {plan === "yearly"
                  ? "Pay ₱1,000 Annual Subscription"
                  : "Pay ₱120 Monthly Subscription"}
              </span>
            </button>

            <button
              onClick={onViewReceipt}
              className="w-full py-2.5 bg-white border border-[#CBD5E1] hover:bg-slate-50 text-[#1F2937] font-semibold rounded-2xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-[11px]"
            >
              <span>📄</span> View & Download Official BIR Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OFFICIAL DIGITAL SUBSCRIPTION RECEIPT MODAL (BIR Form Demo)
// ─────────────────────────────────────────────────────────────────────────────
function ProviderSubscriptionReceiptModal({
  provider,
  plan,
  paymentMethod,
  onClose,
  onToast,
}: {
  provider: Provider;
  plan: "monthly" | "yearly";
  paymentMethod: string;
  onClose: () => void;
  onToast: (msg: string) => void;
}) {
  const isYearly = plan === "yearly";
  const amount = isYearly ? 1000 : 120;
  const orNumber = `OR-SP-2026-${Math.floor(10000 + Math.random() * 90000)}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="bg-white w-full max-w-sm max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E5E7EB]">
        {/* Header */}
        <div className="bg-[#0F172A] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 text-base">✓</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Official Platform Receipt
            </span>
          </div>
          <button
            onClick={onClose}
            className="size-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs font-bold text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Receipt Document Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4 text-xs font-mono bg-[#FAFAFA]">
          {/* Top Receipt Header */}
          <div className="border-b border-dashed border-[#CBD5E1] pb-3 text-center flex flex-col items-center gap-1">
            <span className="font-sans font-black text-base text-[#0F172A] tracking-tight">
              Tap<span className="text-[#0D9488]">Serve</span> Laguna Inc.
            </span>
            <span className="text-[10px] text-[#64748B] font-sans">
              San Pablo City Service Provider Accreditation
            </span>
            <span className="text-[9px] text-[#94A3B8]">
              TIN: 432-881-992-000 • VAT Registered
            </span>
            <div className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-1 font-sans">
              ✓ OFFICIAL DIGITAL RECEIPT
            </div>
          </div>

          {/* Receipt Info */}
          <div className="flex flex-col gap-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Receipt No:</span>
              <span className="font-bold text-[#0F172A]">{orNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Date & Time:</span>
              <span className="font-semibold text-[#0F172A]">Oct 12, 2026 • 10:24 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Specialist Name:</span>
              <span className="font-bold text-[#0F172A]">{provider.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Trade Category:</span>
              <span className="font-semibold text-[#0F172A]">{provider.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Service Jurisdiction:</span>
              <span className="font-semibold text-[#0F172A]">San Pablo City, Laguna</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Payment Channel:</span>
              <span className="font-bold text-[#0F766E]">{paymentMethod}</span>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border-t border-b border-dashed border-[#CBD5E1] py-2.5 flex flex-col gap-2">
            <div className="flex justify-between font-bold text-[#0F172A]">
              <span>Description</span>
              <span>Amount</span>
            </div>
            <div className="flex justify-between text-[#334155]">
              <span>
                {isYearly
                  ? "TapServe Pro Annual Accreditation Pass (12 Mos)"
                  : "TapServe Pro Monthly Accreditation Pass (30 Days)"}
              </span>
              <span>₱{amount.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between text-[10px] text-[#64748B]">
              <span>12% Value Added Tax (VAT)</span>
              <span>Included</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-baseline font-bold text-sm text-[#0F172A]">
            <span>TOTAL PAID:</span>
            <span className="text-base font-black text-emerald-700">₱{amount.toLocaleString()}.00</span>
          </div>

          {/* Validity Period */}
          <div className="bg-white border border-[#E2E8F0] p-2.5 rounded-xl flex items-center justify-between text-[10px] font-sans">
            <span className="text-[#64748B]">Accreditation Valid Until:</span>
            <span className="font-bold text-[#115E59]">
              {isYearly ? "Oct 12, 2027 (1 Year)" : "Nov 12, 2026 (30 Days)"}
            </span>
          </div>

          <div className="text-center text-[9px] text-[#94A3B8] font-sans leading-tight">
            Thank you for being a certified TapServe provider. For business tax verification, present this official receipt.
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-white border-t border-[#E5E7EB] flex gap-2 shrink-0">
          <button
            onClick={() => {
              onToast("Receipt saved to device / Print triggered!");
            }}
            className="flex-1 py-2.5 bg-[#115E59] hover:bg-[#0F766E] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>🖨️</span> Print / Save Receipt
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#1F2937] font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPATIBILITY EXPORTS FOR EXISTING ROUTES
// ─────────────────────────────────────────────────────────────────────────────
export function ProviderBookingRequestScreen(props: any) {
  return <ProviderDashboardScreen {...props} />;
}

export function ProviderAvailabilityScreen(props: any) {
  return <ProviderDashboardScreen {...props} />;
}

export function ProviderReviewsScreen(props: any) {
  return <ProviderDashboardScreen {...props} />;
}

export function ProviderServicesScreen(props: any) {
  return <ProviderDashboardScreen {...props} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER APPLICATION & REGISTRATION FLOW (See ProviderRegistrationFlow.tsx)
// ─────────────────────────────────────────────────────────────────────────────
export {
  ProviderApplyScreen,
  ProviderApplyStatusScreen,
} from "./ProviderRegistrationFlow";
