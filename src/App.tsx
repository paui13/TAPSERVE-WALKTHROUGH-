import React, { useState, useEffect, useRef } from "react";
import { Screen } from "./types";
import {
  UserAccount,
  ServiceCategory,
  Provider,
  Booking,
  BookingStatus,
  SavedAddress,
  NotificationSettings,
  ProviderApplicationData,
  AppStorage,
  INITIAL_USER,
  INITIAL_CATEGORIES,
  INITIAL_PROVIDERS,
  INITIAL_BOOKINGS,
  INITIAL_ADDRESSES,
  INITIAL_NOTIFICATION_SETTINGS,
} from "./data/mockData";

// Screens imports
import {
  SplashScreen,
  LoginScreen,
  TermsConditionsScreen,
  PrivacyPolicyScreen,
  ProviderTermsScreen,
} from "./screens/AuthScreens";

import {
  HomeScreen,
  AllCategoriesScreen,
  BrowseScreen,
} from "./screens/HomeScreens";

import {
  ProviderProfileScreen,
  BookingScreen,
  BookingSuccessScreen,
  TrackingScreen,
  MessagingScreen,
  ReviewScreen,
} from "./screens/ProviderProfileAndBooking";

import { BookingsScreen } from "./screens/BookingsScreen";
import { BookingCompletedScreen } from "./screens/BookingCompletedScreen";
import { ConversationsScreen } from "./screens/ConversationsScreen";
import { AccountStatusScreen } from "./screens/AccountStatusScreen";

import {
  UserProfileScreen,
  FavoritesScreen,
  SavedAddressesScreen,
  PaymentMethodsScreen,
  NotificationSettingsScreen,
  PrivacySecurityScreen,
  HelpSupportScreen,
} from "./screens/ProfileScreens";

import {
  ProviderApplyScreen,
  ProviderDashboardScreen,
  ProviderAvailabilityScreen,
  ProviderBookingRequestScreen,
  ProviderReviewsScreen,
  ProviderServicesScreen,
} from "./screens/ProviderModeScreens";

import { ChatbotScreen } from "./screens/ChatbotScreen";
import { AdminPortal } from "./screens/AdminPortal";

export default function App() {
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [history, setHistory] = useState<Screen[]>([]);
  const [animClass, setAnimClass] = useState("fade-in");

  // View mode toggle: "mobile" app or "admin" web portal
  const [viewMode, setViewMode] = useState<"mobile" | "admin">(() => {
    return (
      (localStorage.getItem("tapserve_view_mode") as "mobile" | "admin") ||
      "mobile"
    );
  });

  const handleToggleViewMode = (mode: "mobile" | "admin") => {
    setViewMode(mode);
    localStorage.setItem("tapserve_view_mode", mode);
    showToast(
      mode === "admin"
        ? "Switched to TapServe Admin Web Portal"
        : "Switched to TapServe Mobile App"
    );
  };

  // Global persistent data states
  const [currentUser, setCurrentUser] = useState<UserAccount>(() =>
    AppStorage.getUser()
  );
  const [categories, setCategories] = useState<ServiceCategory[]>(() =>
    AppStorage.getCategories()
  );
  const [providers, setProviders] = useState<Provider[]>(() =>
    AppStorage.getProviders()
  );
  const [bookings, setBookings] = useState<Booking[]>(() =>
    AppStorage.getBookings()
  );
  const [favorites, setFavorites] = useState<string[]>(() =>
    AppStorage.getFavorites()
  );
  const [addresses, setAddresses] = useState<SavedAddress[]>(() =>
    AppStorage.getAddresses()
  );
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>(() => AppStorage.getNotificationSettings());

  // Active selections
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("plumbing");
  const [selectedProvider, setSelectedProvider] = useState<Provider>(
    () => providers[0] || INITIAL_PROVIDERS[0]
  );
  const [selectedBooking, setSelectedBooking] = useState<Booking | undefined>(
    () => bookings[0]
  );

  // Demo helper & toast
  const [toast, setToast] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const navigate = (screen: Screen) => {
    setAnimClass("slide-forward");
    setHistory((prev) => [...prev, currentScreen]);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    if (history.length === 0) return;
    setAnimClass("slide-back");
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrentScreen(prev);
  };

  // ─── Actions & Handlers ─────────────────────────────────────────────────────

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    AppStorage.saveUser(user);
  };

  const handleLogout = () => {
    setHistory([]);
    setCurrentScreen("login");
    showToast("Logged out successfully.");
  };

  const handleToggleFavorite = (providerId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId];
      AppStorage.saveFavorites(updated);
      return updated;
    });
  };

  const handleBookingConfirmed = (newBooking: Booking) => {
    setSelectedBooking(newBooking);
    setBookings((prev) => {
      const updated = [newBooking, ...prev];
      AppStorage.saveBookings(updated);
      return updated;
    });
  };

  const handleCancelBooking = (bookingId: string, reason: string) => {
    setBookings((prev) => {
      const updated = prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: "Cancelled" as BookingStatus, cancellationReason: reason }
          : b
      );
      AppStorage.saveBookings(updated);
      return updated;
    });
    showToast("Booking cancelled. Specialist time slot released.");
  };

  const handleProgressStatus = (
    bookingId: string,
    nextStatus: BookingStatus
  ) => {
    setBookings((prev) => {
      const updated = prev.map((b) =>
        b.id === bookingId ? { ...b, status: nextStatus } : b
      );
      AppStorage.saveBookings(updated);
      return updated;
    });
    showToast(`Booking status advanced to: ${nextStatus}`);
  };

  const handleSaveAddress = (address: SavedAddress) => {
    setAddresses((prev) => {
      let updated: SavedAddress[];
      if (prev.some((a) => a.id === address.id)) {
        updated = prev.map((a) => (a.id === address.id ? address : a));
      } else {
        updated = [...prev, address];
      }
      if (address.isDefault) {
        updated = updated.map((a) => ({
          ...a,
          isDefault: a.id === address.id,
        }));
      }
      AppStorage.saveAddresses(updated);
      return updated;
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    setAddresses((prev) => {
      const updated = prev.filter((a) => a.id !== addressId);
      AppStorage.saveAddresses(updated);
      return updated;
    });
  };

  const handleSetDefaultAddress = (addressId: string) => {
    setAddresses((prev) => {
      const updated = prev.map((a) => ({
        ...a,
        isDefault: a.id === addressId,
      }));
      AppStorage.saveAddresses(updated);
      return updated;
    });
  };

  const handleSaveNotificationSettings = (settings: NotificationSettings) => {
    setNotificationSettings(settings);
    AppStorage.saveNotificationSettings(settings);
  };

  const handleSubmitProviderApplication = (
    appData: ProviderApplicationData
  ) => {
    AppStorage.saveProviderApplication(appData);
    const updatedUser: UserAccount = {
      ...currentUser,
      providerApplicationStatus: "Submitted",
    };
    setCurrentUser(updatedUser);
    AppStorage.saveUser(updatedUser);
  };

  const handleSwitchToProviderMode = () => {
    AppStorage.saveActiveRole("provider");
    // Ensure active provider matches user or first provider
    navigate("provider-dashboard");
    showToast("Switched to Service Provider Mode.");
  };

  const handleSwitchToUserMode = () => {
    AppStorage.saveActiveRole("user");
    navigate("home");
    showToast("Returned to User Mode.");
  };

  const handleAcceptBooking = (bookingId: string) => {
    setBookings((prev) => {
      const updated = prev.map((b) =>
        b.id === bookingId ? { ...b, status: "Accepted" as BookingStatus } : b
      );
      AppStorage.saveBookings(updated);
      return updated;
    });
    showToast("Booking request accepted! Reserved in schedule.");
  };

  const handleDeclineBooking = (bookingId: string) => {
    setBookings((prev) => {
      const updated = prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: "Cancelled" as BookingStatus,
              cancellationReason: "Declined by Service Provider",
            }
          : b
      );
      AppStorage.saveBookings(updated);
      return updated;
    });
    showToast("Booking request declined.");
  };

  const handleSaveProviderSchedule = (
    workingDays: string[],
    hours: string
  ) => {
    setProviders((prev) => {
      const updated = prev.map((p) =>
        p.id === selectedProvider.id
          ? { ...p, workingDays, workingHours: hours }
          : p
      );
      AppStorage.saveProviders(updated);
      return updated;
    });
    setSelectedProvider((prev) => ({
      ...prev,
      workingDays,
      workingHours: hours,
    }));
  };

  const handleSaveProviderServices = (
    category: string,
    specialization: string,
    hourlyRate: number,
    description: string
  ) => {
    setProviders((prev) => {
      const updated = prev.map((p) =>
        p.id === selectedProvider.id
          ? { ...p, category, specialization, hourlyRate, description }
          : p
      );
      AppStorage.saveProviders(updated);
      return updated;
    });
    setSelectedProvider((prev) => ({
      ...prev,
      category,
      specialization,
      hourlyRate,
      description,
    }));
  };

  const handleSubmitReview = (
    bookingId: string,
    rating: number,
    comment: string,
    isAnon: boolean
  ) => {
    // 1. Update booking
    setBookings((prev) => {
      const updated = prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              reviewed: true,
              userRating: rating,
              userReviewText: comment,
            }
          : b
      );
      AppStorage.saveBookings(updated);
      return updated;
    });

    // 2. Add review to provider
    setProviders((prev) => {
      const updated = prev.map((p) => {
        if (p.id === selectedProvider.id) {
          const newReview = {
            id: `rev-${Date.now()}`,
            userName: isAnon ? "Anonymous Client" : currentUser.name,
            rating,
            date: "Just now",
            comment,
            isAnonymous: isAnon,
          };
          const newReviews = [newReview, ...p.reviews];
          const newAvg = parseFloat(
            (
              newReviews.reduce((sum, r) => sum + r.rating, 0) /
              newReviews.length
            ).toFixed(1)
          );
          return {
            ...p,
            reviews: newReviews,
            reviewCount: newReviews.length,
            rating: newAvg,
          };
        }
        return p;
      });
      AppStorage.saveProviders(updated);
      return updated;
    });

    showToast("Thank you! Review submitted and added to provider profile.");
  };

  // Reset demo data helper
  const handleResetDemoData = () => {
    AppStorage.resetToDefaults();
    setCurrentUser(INITIAL_USER);
    setCategories(INITIAL_CATEGORIES);
    setProviders(INITIAL_PROVIDERS);
    setBookings(INITIAL_BOOKINGS);
    setFavorites(["p-reynaldo", "p-maria"]);
    setAddresses(INITIAL_ADDRESSES);
    setNotificationSettings(INITIAL_NOTIFICATION_SETTINGS);
    setSelectedProvider(INITIAL_PROVIDERS[0]);
    setSelectedBooking(INITIAL_BOOKINGS[0]);
    setShowResetConfirm(false);
    showToast("Demo data reset to default presentation state!");
    navigate("home");
  };

  // Active active booking count for badges
  const activeBookingCount = bookings.filter(
    (b) =>
      b.status === "Pending" ||
      b.status === "Accepted" ||
      b.status === "On the Way" ||
      b.status === "In Progress"
  ).length;

  // ─── Render Active Screen ───────────────────────────────────────────────────
  const renderScreen = () => {
    switch (currentScreen) {
      case "splash":
        return <SplashScreen nav={navigate} />;

      case "login":
        return (
          <LoginScreen
            nav={navigate}
            onLoginSuccess={handleLoginSuccess}
            onToast={showToast}
          />
        );

      case "home":
        return (
          <HomeScreen
            nav={navigate}
            currentUser={currentUser}
            categories={categories}
            providers={providers}
            favorites={favorites}
            toggleFavorite={handleToggleFavorite}
            onSelectCategory={(catId) => setSelectedCategoryId(catId)}
            onSelectProvider={(p) => setSelectedProvider(p)}
            onToast={showToast}
            bookingCount={activeBookingCount}
            bookings={bookings}
            onSelectBooking={(b) => setSelectedBooking(b)}
          />
        );

      case "all-categories":
        return (
          <AllCategoriesScreen
            nav={navigate}
            goBack={goBack}
            categories={categories}
            onSelectCategory={(catId) => setSelectedCategoryId(catId)}
          />
        );

      case "browse":
        return (
          <BrowseScreen
            nav={navigate}
            goBack={goBack}
            selectedCategoryId={selectedCategoryId}
            categories={categories}
            providers={providers}
            favorites={favorites}
            toggleFavorite={handleToggleFavorite}
            onSelectProvider={(p) => setSelectedProvider(p)}
            onToast={showToast}
            bookingCount={activeBookingCount}
          />
        );

      case "provider-profile":
        return (
          <ProviderProfileScreen
            nav={navigate}
            goBack={goBack}
            provider={selectedProvider}
            favorites={favorites}
            toggleFavorite={handleToggleFavorite}
            onToast={showToast}
          />
        );

      case "booking":
        return (
          <BookingScreen
            nav={navigate}
            goBack={goBack}
            provider={selectedProvider}
            addresses={addresses}
            bookings={bookings}
            currentUser={currentUser}
            onBookingConfirmed={handleBookingConfirmed}
            onToast={showToast}
          />
        );

      case "booking-success":
        return (
          <BookingSuccessScreen nav={navigate} booking={selectedBooking} />
        );

      case "tracking":
        return (
          <TrackingScreen
            nav={navigate}
            goBack={goBack}
            booking={selectedBooking}
            onCompleteBooking={(bookingId) => {
              handleProgressStatus(bookingId, "Completed");
              showToast("Service marked as completed! ₱ Cash settled.");
            }}
          />
        );

      case "booking-completed":
        return (
          <BookingCompletedScreen
            nav={navigate}
            goBack={goBack}
            booking={selectedBooking || bookings.find((b) => b.status === "Completed") || null}
            provider={providers.find((p) => p.id === (selectedBooking?.providerId || "p-jose"))}
            onSelectProvider={(p) => setSelectedProvider(p)}
            onSubmitReview={handleSubmitReview}
            onToast={showToast}
          />
        );

      case "conversations":
        return (
          <ConversationsScreen
            nav={navigate}
            bookings={bookings}
            providers={providers}
            onSelectProvider={(p) => setSelectedProvider(p)}
            onToast={showToast}
          />
        );

      case "messaging":
        return (
          <MessagingScreen
            nav={navigate}
            goBack={() => navigate("conversations")}
            provider={selectedProvider || providers.find((p) => p.id === "p-reynaldo")}
            onToast={showToast}
          />
        );

      case "review":
        return (
          <ReviewScreen
            nav={navigate}
            goBack={goBack}
            booking={selectedBooking}
            onSubmitReview={handleSubmitReview}
          />
        );

      case "bookings":
        return (
          <BookingsScreen
            nav={navigate}
            goBack={goBack}
            bookings={bookings}
            providers={providers}
            onCancelBooking={handleCancelBooking}
            onProgressStatus={handleProgressStatus}
            onSelectBooking={(b) => setSelectedBooking(b)}
            onSelectProvider={(p) => setSelectedProvider(p)}
            onToast={showToast}
          />
        );

      case "user-profile":
        return (
          <UserProfileScreen
            nav={navigate}
            goBack={goBack}
            currentUser={currentUser}
            bookingCount={bookings.length}
            onLogout={handleLogout}
            onSwitchToProviderMode={handleSwitchToProviderMode}
          />
        );

      case "favorites":
        return (
          <FavoritesScreen
            nav={navigate}
            goBack={goBack}
            providers={providers}
            favorites={favorites}
            toggleFavorite={handleToggleFavorite}
            onSelectProvider={(p) => setSelectedProvider(p)}
            onToast={showToast}
          />
        );

      case "saved-addresses":
        return (
          <SavedAddressesScreen
            goBack={goBack}
            addresses={addresses}
            onSaveAddress={handleSaveAddress}
            onDeleteAddress={handleDeleteAddress}
            onSetDefaultAddress={handleSetDefaultAddress}
            onToast={showToast}
          />
        );

      case "payment-methods":
        return <PaymentMethodsScreen goBack={goBack} />;

      case "notifications-settings":
        return (
          <NotificationSettingsScreen
            goBack={goBack}
            settings={notificationSettings}
            onSaveSettings={handleSaveNotificationSettings}
            onToast={showToast}
          />
        );

      case "privacy-security":
        return <PrivacySecurityScreen goBack={goBack} onToast={showToast} />;

      case "account-status":
        return (
          <AccountStatusScreen
            nav={navigate}
            goBack={goBack}
            onToast={showToast}
          />
        );

      case "help-support":
        return (
          <HelpSupportScreen
            nav={navigate}
            goBack={goBack}
            onToast={showToast}
          />
        );

      case "chatbot":
        return <ChatbotScreen nav={navigate} goBack={goBack} />;

      case "terms-conditions":
        return <TermsConditionsScreen goBack={goBack} />;

      case "privacy-policy":
        return <PrivacyPolicyScreen goBack={goBack} />;

      case "provider-terms":
        return <ProviderTermsScreen goBack={goBack} />;

      case "provider-apply":
      case "provider-apply-status":
        return (
          <ProviderApplyScreen
            nav={navigate}
            goBack={goBack}
            currentUser={currentUser}
            onSubmitApplication={handleSubmitProviderApplication}
            onToast={showToast}
          />
        );

      case "provider-dashboard":
        return (
          <ProviderDashboardScreen
            nav={navigate}
            goBack={goBack}
            provider={selectedProvider}
            bookings={bookings}
            onSwitchToUserMode={handleSwitchToUserMode}
          />
        );

      case "provider-availability":
        return (
          <ProviderAvailabilityScreen
            nav={navigate}
            goBack={goBack}
            provider={selectedProvider}
            onSaveSchedule={handleSaveProviderSchedule}
            onToast={showToast}
          />
        );

      case "provider-booking-request":
        return (
          <ProviderBookingRequestScreen
            nav={navigate}
            goBack={goBack}
            provider={selectedProvider}
            bookings={bookings}
            onAcceptBooking={handleAcceptBooking}
            onDeclineBooking={handleDeclineBooking}
            onProgressJobStatus={handleProgressStatus}
          />
        );

      case "provider-reviews":
        return (
          <ProviderReviewsScreen
            nav={navigate}
            goBack={goBack}
            provider={selectedProvider}
          />
        );

      case "provider-services":
        return (
          <ProviderServicesScreen
            goBack={goBack}
            provider={selectedProvider}
            onSaveServices={handleSaveProviderServices}
            onToast={showToast}
          />
        );

      default:
        return <HomeScreen
          nav={navigate}
          currentUser={currentUser}
          categories={categories}
          providers={providers}
          favorites={favorites}
          toggleFavorite={handleToggleFavorite}
          onSelectCategory={(catId) => setSelectedCategoryId(catId)}
          onSelectProvider={(p) => setSelectedProvider(p)}
          onToast={showToast}
          bookingCount={activeBookingCount}
        />;
    }
  };

  // Render Admin Web Portal if selected
  if (viewMode === "admin") {
    return (
      <div className="relative w-screen h-screen overflow-hidden">
        <AdminPortal
          onSwitchToMobile={() => handleToggleViewMode("mobile")}
          onToast={showToast}
        />
        {/* Global Toast Overlay */}
        {toast && (
          <div className="fixed top-4 right-4 z-[200] flex justify-center pointer-events-none">
            <div className="bg-[#0f172a] text-white px-4 py-2.5 rounded-2xl shadow-xl scale-in text-center border border-white/10">
              <span className="text-xs font-semibold">{toast}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render Mobile Application View
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center sm:p-4 select-none relative">
      {/* Top Floating View Switcher Bar */}
      <div className="fixed top-3 z-50 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/80 shadow-2xl">
        <span className="text-[11px] font-semibold text-slate-400 mr-1">View:</span>
        <button
          onClick={() => handleToggleViewMode("mobile")}
          className="px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 bg-[#0d9488] text-white shadow-xs cursor-pointer"
        >
          <span>📱</span>
          <span>Mobile App</span>
        </button>
        <button
          onClick={() => handleToggleViewMode("admin")}
          className="px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
        >
          <span>💻</span>
          <span>Admin Web Portal</span>
        </button>
      </div>

      {/* Mobile Shell */}
      <div className="relative w-full max-w-[400px] h-screen sm:h-[844px] overflow-hidden bg-[#f8fafc] sm:rounded-[40px] shadow-2xl sm:border-[8px] sm:border-slate-800 flex flex-col mt-7 sm:mt-8">
        {/* Dynamic Screen Component with Animation */}
        <div key={currentScreen} className={`size-full flex flex-col ${animClass}`}>
          {renderScreen()}
        </div>

        {/* Global Toast Overlay */}
        {toast && (
          <div className="absolute top-12 left-4 right-4 z-[100] flex justify-center pointer-events-none">
            <div className="bg-[#0f172a] text-white px-4 py-2.5 rounded-2xl shadow-xl scale-in max-w-[320px] text-center border border-white/10">
              <span className="text-xs font-semibold">{toast}</span>
            </div>
          </div>
        )}
      </div>

      {/* Discreet Demo Presentation Control Bar (outside phone frame) */}
      <div className="hidden sm:flex items-center gap-3 mt-3 px-4 py-1.5 bg-slate-800/80 rounded-full border border-slate-700 text-xs text-slate-300">
        <span className="font-semibold text-slate-400">Capstone Demo Tools:</span>
        <button
          onClick={() => handleToggleViewMode("admin")}
          className="text-[#5eead4] hover:underline font-bold flex items-center gap-1"
        >
          <span>💻</span> Switch to Admin Web
        </button>
        <span className="text-slate-600">|</span>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="text-slate-300 hover:text-white"
        >
          Reset Demo Data
        </button>
        <span className="text-slate-600">|</span>
        <button
          onClick={() => {
            handleLoginSuccess({
              name: "Carlo Santos",
              email: "user@tapserve.demo",
              phone: "+63 917 555 1234",
              address: "123 Sample Street, Brgy. San Roque, San Pablo City",
              rating: 4.9,
              memberSince: "2026",
              isProvider: true,
              providerApplicationStatus: "Approved",
            });
            showToast("Demo user set with approved provider status.");
          }}
          className="text-slate-300 hover:text-white"
        >
          Unlock Provider Mode
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[200]">
          <div className="bg-white rounded-3xl p-6 max-w-[340px] w-full flex flex-col gap-4 text-center scale-in shadow-2xl">
            <div className="size-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto">
              🔄
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold text-[#0f172a]">Reset All Demo Data?</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                This will reset categories, providers, sample bookings, saved addresses, and availability to their original initial presentation state.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-slate-100 text-slate-700 text-xs font-bold py-2.5 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleResetDemoData}
                className="flex-1 bg-[#0d9488] text-white text-xs font-bold py-2.5 rounded-xl shadow-xs active:brightness-90"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
