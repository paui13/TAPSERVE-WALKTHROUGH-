import React, { useState, useRef, useEffect } from "react";
import { Screen } from "../types";
import { TappyIcon, A } from "../components/SharedUI";

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
  actionButtons?: { label: string; action: () => void }[];
}

export function ChatbotScreen({
  nav,
  goBack,
}: {
  nav: (s: Screen) => void;
  goBack: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "bot",
      text: "Kumusta! I am Tappy, your TapServe AI Assistant. How can I help you today in San Pablo City?",
    },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickActions = [
    "How do I book a service?",
    "Find a Service Provider",
    "How do I cancel?",
    "Apply as Service Provider",
    "Where is my booking?",
    "Contact Support",
  ];

  const handleQuickAction = (question: string) => {
    const userMsg: Message = { id: Date.now(), from: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      let botReply = "";
      let buttons: { label: string; action: () => void }[] | undefined = undefined;

      switch (question) {
        case "How do I book a service?":
          botReply =
            "To book a service, select a category or search for a specialist on the Home screen. Pick your preferred provider, choose your date and available time slot, confirm your address, and tap 'Confirm Booking'!";
          buttons = [
            { label: "Browse Categories →", action: () => nav("all-categories") },
            { label: "View Plumbers →", action: () => nav("browse") },
          ];
          break;

        case "Find a Service Provider":
          botReply =
            "We have verified plumbers, cleaners, electricians, gardeners, carpenters, and appliance technicians in San Pablo City. Let me take you to our categories directory.";
          buttons = [{ label: "View All Categories →", action: () => nav("all-categories") }];
          break;

        case "How do I cancel?":
          botReply =
            "You can cancel an upcoming booking from your 'My Bookings' tab. Simply locate the booking, tap 'Cancel', and state your reason. Your provider's time slot will immediately become available again.";
          buttons = [{ label: "Go to My Bookings →", action: () => nav("bookings") }];
          break;

        case "Apply as Service Provider":
          botReply =
            "Want to earn with your trade skills? TapServe allows skilled specialists to register, upload credentials for verification, and manage incoming job requests in Provider Mode!";
          buttons = [
            { label: "Start Application →", action: () => nav("provider-apply") },
            { label: "Provider Terms →", action: () => nav("provider-terms") },
          ];
          break;

        case "Where is my booking?":
          botReply =
            "You can track ongoing and upcoming bookings in real-time under 'My Bookings'. When your specialist is 'On the Way', you can tap 'Track Provider' for live ETA and route mapping!";
          buttons = [{ label: "View My Bookings →", action: () => nav("bookings") }];
          break;

        case "Contact Support":
          botReply =
            "Our San Pablo City customer support team is available to assist with any questions or issues. You can send a ticket or browse helpful FAQs.";
          buttons = [{ label: "Open Help & Support →", action: () => nav("help-support") }];
          break;

        default:
          botReply = "I am happy to assist you with your household service needs!";
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, from: "bot", text: botReply, actionButtons: buttons },
      ]);
    }, 600);
  };

  const handleSend = () => {
    const q = input.trim();
    if (!q) return;

    const userMsg: Message = { id: Date.now(), from: "user", text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const lower = q.toLowerCase();
      let botReply = "";
      let buttons: { label: string; action: () => void }[] | undefined = undefined;

      if (lower.includes("plumb") || lower.includes("tubo") || lower.includes("leak") || lower.includes("sink")) {
        botReply =
          "For plumbing issues like sink leaks, pipe bursts, and drain clogs, we recommend Kuya Reynaldo or Kuya Cardo in San Pablo City!";
        buttons = [{ label: "View Plumbing Providers →", action: () => nav("browse") }];
      } else if (lower.includes("clean") || lower.includes("linis") || lower.includes("disinfect")) {
        botReply =
          "Looking for deep cleaning or disinfection? Ate Maria and Ate Elena are top-rated cleaning specialists in San Pablo City.";
        buttons = [{ label: "Browse Cleaning Services →", action: () => nav("browse") }];
      } else if (lower.includes("electric") || lower.includes("kuryente") || lower.includes("breaker") || lower.includes("wire")) {
        botReply =
          "For electrical wiring, panel upgrades, and short circuit issues, Kuya Jose is a registered master electrician available today.";
        buttons = [{ label: "View Electricians →", action: () => nav("browse") }];
      } else if (lower.includes("aircon") || lower.includes("inverter") || lower.includes("freon")) {
        botReply =
          "Need aircon chemical cleaning or freon replenishment? Ate Grace services split-type and window-type inverter units.";
        buttons = [{ label: "Find Aircon Specialist →", action: () => nav("all-categories") }];
      } else if (lower.includes("pay") || lower.includes("cash") || lower.includes("price") || lower.includes("rate") || lower.includes("magkano")) {
        botReply =
          "TapServe uses direct Cash Payment upon job completion. Provider rates start from ₱250–₱380 per hour depending on the service specialization.";
      } else if (lower.includes("cancel") || lower.includes("bawi") || lower.includes("refund")) {
        botReply =
          "You can cancel your booking anytime before completion in the 'My Bookings' section. The slot will be released back to the provider.";
        buttons = [{ label: "Check Bookings →", action: () => nav("bookings") }];
      } else if (lower.includes("track") || lower.includes("nasaan") || lower.includes("location") || lower.includes("eta")) {
        botReply =
          "Live GPS tracking is simulated when your specialist's status is 'On the Way'. You'll see their animated progress across San Pablo City with an estimated arrival time!";
        buttons = [{ label: "Open Tracking →", action: () => nav("tracking") }];
      } else {
        botReply =
          "I understand! TapServe matches you with certified household service providers in San Pablo City. You can browse categories, check booking status, or speak with our support team.";
        buttons = [
          { label: "Browse Categories", action: () => nav("all-categories") },
          { label: "My Bookings", action: () => nav("bookings") },
        ];
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, from: "bot", text: botReply, actionButtons: buttons },
      ]);
    }, 700);
  };

  return (
    <div className="bg-[#f8fafc] flex flex-col size-full">
      {/* Header */}
      <div className="bg-[#115e59] flex items-center gap-3 px-5 pt-12 pb-4 shrink-0 shadow-sm">
        <button
          onClick={goBack}
          className="bg-white/15 flex items-center justify-center rounded-xl size-9 active:bg-white/25 touch-manipulation text-white"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <TappyIcon size={34} />

        <div className="flex flex-col flex-1">
          <span className="text-white text-sm font-bold tracking-tight">
            Tappy — TapServe AI Assistant
          </span>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[#ccfbf1] text-[10px] font-semibold">
              Online · AI-Driven Matching
            </span>
          </div>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-3.5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col gap-1.5 ${
              m.from === "user" ? "ml-auto items-end max-w-[80%]" : "mr-auto items-start max-w-[85%]"
            }`}
          >
            {m.from === "bot" ? (
              <div className="flex gap-2 items-start">
                <TappyIcon size={24} className="shrink-0 mt-1" />
                <div className="bg-white border border-[#e2e8f0] p-3.5 rounded-2xl rounded-tl-xs shadow-xs text-xs text-[#0f172a] leading-relaxed">
                  {m.text}
                </div>
              </div>
            ) : (
              <div className="bg-[#0d9488] text-white p-3.5 rounded-2xl rounded-tr-xs shadow-xs text-xs leading-relaxed">
                {m.text}
              </div>
            )}

            {/* Optional action buttons attached to bot reply */}
            {m.actionButtons && m.actionButtons.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pl-8 pt-0.5">
                {m.actionButtons.map((btn) => (
                  <button
                    key={btn.label}
                    onClick={btn.action}
                    className="bg-[#f0fdfa] border border-[#ccfbf1] text-[#0f766e] text-[11px] font-bold px-3 py-1 rounded-full active:bg-[#ccfbf1] touch-manipulation shadow-2xs"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Quick Action Chips */}
      <div className="bg-white/80 border-t border-[#f1f5f9] px-4 py-2.5 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
        {quickActions.map((action) => (
          <button
            key={action}
            onClick={() => handleQuickAction(action)}
            className="bg-[#f0fdfa] border border-[#ccfbf1] text-[#0f766e] text-[11px] font-bold px-3 py-1.5 rounded-full shrink-0 touch-manipulation hover:bg-[#ccfbf1] active:scale-95 transition-all shadow-2xs"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="bg-white border-t border-[#e2e8f0] p-3 flex gap-2 items-center shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask Tappy anything about household services..."
          className="bg-[#f8fafc] border border-[#e2e8f0] flex-1 h-11 px-4 rounded-xl text-xs text-[#0f172a] outline-none focus:border-[#0d9488]"
        />
        <button
          onClick={handleSend}
          className="bg-[#0d9488] text-white size-11 rounded-xl flex items-center justify-center shrink-0 active:brightness-90 touch-manipulation shadow-xs"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
