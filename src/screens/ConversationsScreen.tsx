import React, { useState, useMemo } from "react";
import { Screen } from "../types";
import { BottomNav, TappyAvatar, A } from "../components/SharedUI";
import { Booking, Provider } from "../data/mockData";

export interface ConversationItem {
  id: string;
  providerId: string;
  providerName: string;
  providerPhoto: string;
  serviceCategory: string;
  specialization: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  statusBadge?: string;
  statusColor?: string;
  providerObj: Provider;
}

export function ConversationsScreen({
  nav,
  bookings,
  providers,
  onSelectProvider,
  onToast,
}: {
  nav: (s: Screen) => void;
  bookings: Booking[];
  providers: Provider[];
  onSelectProvider: (p: Provider) => void;
  onToast: (msg: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Build conversations list based on people the user has a transaction/booking with
  const conversations: ConversationItem[] = useMemo(() => {
    const list: ConversationItem[] = [];
    const seenProviderIds = new Set<string>();

    // 1. Process bookings in chronological order (most recent first)
    bookings.forEach((b) => {
      if (seenProviderIds.has(b.providerId)) return;
      seenProviderIds.add(b.providerId);

      const prov = providers.find((p) => p.id === b.providerId) || {
        id: b.providerId,
        name: b.providerName,
        photo: b.providerPhoto,
        category: b.serviceCategory,
        categoryId: "plumbing",
        specialization: b.serviceDetail,
        rating: 4.9,
        reviewCount: 142,
        completedJobs: 140,
        yearsExperience: 10,
        hourlyRate: b.estimatedCost,
        area: "San Pablo City, Laguna",
        distance: "1.2 km away",
        isVerified: true,
        description: "",
        services: [b.serviceDetail],
        workingDays: [],
        workingHours: "",
        isAcceptingBookings: true,
        availableSlots: {},
        reviews: [],
      };

      let lastMsg = "Salamat po sa inyong booking request.";
      let timeStr = "Recently";
      let unread = 0;
      let statusBadge = "Confirmed";
      let statusColor = "bg-[#ccfbf1] text-[#0f766e]";

      if (b.providerId === "p-reynaldo") {
        lastMsg = "Magandang araw po! Naka-alis na po ako patungo sa inyo.";
        timeStr = "2:05 PM";
        unread = 1;
        statusBadge = "In Progress";
        statusColor = "bg-[#fef3c7] text-[#d97706]";
      } else if (b.providerId === "p-maria") {
        lastMsg = "Confirmed po for tomorrow 9:00 AM. May dala po akong supplies.";
        timeStr = "Yesterday";
        statusBadge = "Confirmed";
        statusColor = "bg-[#ccfbf1] text-[#0f766e]";
      } else if (b.providerId === "p-jose") {
        lastMsg = "Salamat po sa tiwala sir Carlo! Ayos na po ang breaker.";
        timeStr = "Oct 10";
        statusBadge = "Completed";
        statusColor = "bg-[#dcfce7] text-[#15803d]";
      } else if (b.status === "In Progress" || b.status === "On the Way") {
        lastMsg = "Papunta na po ako para sa service appointment.";
        timeStr = b.time || "Today";
        statusBadge = "In Progress";
        statusColor = "bg-[#fef3c7] text-[#d97706]";
      } else if (b.status === "Completed") {
        lastMsg = "Service completed! Maraming salamat po.";
        timeStr = b.date || "Completed";
        statusBadge = "Completed";
        statusColor = "bg-[#dcfce7] text-[#15803d]";
      }

      list.push({
        id: `conv-${b.providerId}`,
        providerId: b.providerId,
        providerName: b.providerName,
        providerPhoto: b.providerPhoto,
        serviceCategory: b.serviceCategory,
        specialization: b.serviceDetail || `${b.serviceCategory} Specialist`,
        lastMessage: lastMsg,
        time: timeStr,
        unreadCount: unread,
        statusBadge,
        statusColor,
        providerObj: prov as Provider,
      });
    });

    return list;
  }, [bookings, providers]);

  // Filter and search
  const filteredList = useMemo(() => {
    return conversations.filter((c) => {
      const matchesSearch =
        c.providerName.toLowerCase().includes(search.toLowerCase()) ||
        c.specialization.toLowerCase().includes(search.toLowerCase()) ||
        c.lastMessage.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (filter === "active") {
        return c.statusBadge === "In Progress" || c.statusBadge === "Confirmed";
      }
      if (filter === "completed") {
        return c.statusBadge === "Completed";
      }
      return true;
    });
  }, [conversations, search, filter]);

  const handleOpenConversation = (prov: Provider) => {
    onSelectProvider(prov);
    nav("messaging");
  };

  return (
    <div className="bg-[#f8fafc] flex flex-col justify-between size-full relative">
      <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex flex-col gap-1 px-6 pt-7 pb-4 bg-white border-b border-[#e2e8f0]/80">
          <div className="flex items-center justify-between">
            <h1
              className="text-[#0f172a] text-2xl font-bold tracking-tight"
              style={{ fontFamily: "Lexend Deca, sans-serif" }}
            >
              Messages
            </h1>
            <span className="bg-[#f0fdfa] border border-[#ccfbf1] text-[#0f766e] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {conversations.length} Active Chats
            </span>
          </div>
          <p className="text-[#64748b] text-xs font-normal">
            Specialists and service providers you have bookings with
          </p>

          {/* Search bar */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl mt-2 focus-within:border-[#0d9488]">
            <svg
              className="size-4 text-[#94a3b8] shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations by name or service..."
              className="bg-transparent text-xs text-[#0f172a] outline-none w-full placeholder:text-[#94a3b8]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-[#94a3b8] text-xs hover:text-[#0f172a]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-5 py-3 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: "all", label: "All Chats" },
            { id: "active", label: "Active Bookings" },
            { id: "completed", label: "Past Services" },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilter(pill.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all touch-manipulation cursor-pointer ${
                filter === pill.id
                  ? "bg-[#0d9488] text-white shadow-xs font-bold"
                  : "bg-white border border-[#e2e8f0] text-[#64748b] hover:border-[#94a3b8]"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Pinned TapServe AI Assistant Card */}
        <div className="px-5 pb-3">
          <div
            onClick={() => nav("chatbot")}
            className="bg-gradient-to-r from-[#115e59] to-[#0f766e] text-white p-3.5 rounded-2xl flex items-center justify-between shadow-xs cursor-pointer active:brightness-95 transition-all touch-manipulation"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <TappyAvatar size={42} />
                <span className="absolute bottom-0 right-0 size-2.5 bg-emerald-400 border-2 border-[#115e59] rounded-full" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-white text-xs font-bold">Tappy AI Assistant</span>
                  <span className="bg-white/20 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                    BOT
                  </span>
                </div>
                <span className="text-[#ccfbf1] text-[11px] truncate">
                  Ask anything about bookings, rates, or finding a specialist!
                </span>
              </div>
            </div>
            <span className="text-[#5eead4] text-xs font-bold shrink-0 ml-2">Chat →</span>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex flex-col px-5 pb-6 gap-2">
          <span className="text-[#94a3b8] text-[11px] font-bold uppercase tracking-wider px-1">
            Service Specialists
          </span>

          {filteredList.length === 0 ? (
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-8 text-center flex flex-col items-center gap-2 mt-2">
              <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center text-xl">
                💬
              </div>
              <h3 className="text-sm font-bold text-[#0f172a]">No conversations found</h3>
              <p className="text-xs text-[#64748b] max-w-[220px]">
                When you book a service specialist, their chat thread will appear here.
              </p>
              <button
                onClick={() => nav("all-categories")}
                className="mt-2 bg-[#0d9488] text-white text-xs font-bold px-4 py-2 rounded-xl active:brightness-90 touch-manipulation"
              >
                Browse Services
              </button>
            </div>
          ) : (
            filteredList.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleOpenConversation(conv.providerObj)}
                className="bg-white border border-[#e2e8f0] rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs hover:border-[#99f6e4] transition-all cursor-pointer active:scale-[0.99] touch-manipulation"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={conv.providerPhoto}
                      className="size-13 rounded-2xl object-cover border border-slate-100 bg-slate-50"
                      alt={conv.providerName}
                    />
                    <span className="absolute bottom-0 right-0 size-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#0f172a] text-sm font-bold truncate">
                        {conv.providerName}
                      </span>
                      {conv.statusBadge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md shrink-0 ${conv.statusColor}`}
                        >
                          {conv.statusBadge}
                        </span>
                      )}
                    </div>
                    <span className="text-[#0d9488] text-[11px] font-medium truncate">
                      {conv.specialization}
                    </span>
                    <p className="text-[#64748b] text-xs truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0 self-start mt-0.5">
                  <span className="text-[#94a3b8] text-[10px] whitespace-nowrap">
                    {conv.time}
                  </span>
                  {conv.unreadCount && conv.unreadCount > 0 ? (
                    <span className="size-4 bg-[#0d9488] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  ) : (
                    <svg
                      className="size-4 text-[#cbd5e1]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        active="messaging"
        nav={nav}
        bookingCount={bookings.filter(b => b.status === "Pending" || b.status === "Accepted" || b.status === "On the Way" || b.status === "In Progress").length}
      />
    </div>
  );
}
