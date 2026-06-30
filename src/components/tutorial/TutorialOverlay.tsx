import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Joyride, type Step, type EventData } from "react-joyride";
import { useAuth } from "../../hooks/use-auth";
import { isAgent } from "../sidebar/nav-config";

const DEV_TRIGGER_KEY = "dd_tutorial_dev_trigger";
const ACTIVE_KEY = "dd_tutorial_active";
const PAGES_KEY = "dd_tutorial_pages";
const DONE_KEY = "dd_tutorial_done";

const TOUR_PATHS = [
  "/agent/dashboard",
  "/agent/dashboard/packages",
  "/agent/dashboard/orders",
  "/agent/dashboard/wallet",
  "/agent/dashboard/commissions",
  "/agent/dashboard/profile",
] as const;

const TOUR_PREFIXES = ["/agent/dashboard/packages/"] as const;

/* ─── Desktop step definitions ────────────────────────────── */

const DASHBOARD_STEPS_DESKTOP: Step[] = [
  {
    target: "body",
    content:
      "Welcome to DirectData! You can sell data and earn through your storefront here. Let's take a quick tour.",
    placement: "center",
    skipBeacon: true,
    title: "Welcome",
  },
  {
    target: '[data-tour="dashboard-packages"]',
    content:
      "Browse available packages from your providers. Click any card to get started.",
    placement: "bottom",
    title: "All Packages",
  },
  {
    target: '[data-tour="dashboard-overview"]',
    content:
      "Track your orders, spending, sales, and analytics all in one place.",
    placement: "bottom",
    title: "Account Overview",
  },
  {
    target: '[data-tour="sidebar-packages"]',
    content:
      "Click 'Packages' in the sidebar to explore available packages.",
    placement: "right",
    title: "Next: Packages",
    locale: { last: "Got it" },
  },
];

const PACKAGES_STEPS_DESKTOP: Step[] = [
  {
    target: "body",
    content:
      "Here you can browse all available data bundles for this provider.",
    placement: "center",
    skipBeacon: true,
    title: "Available Bundles",
  },
  {
    target: '[data-tour="packages-search"]',
    content:
      "Use the search bar and filters to find specific bundles.",
    placement: "bottom",
    title: "Search & Filter",
  },
  {
    target: '[data-tour="packages-bundles"]',
    content:
      "Each card shows a bundle. Click 'Order Now' to purchase.",
    placement: "bottom",
    title: "Bundle Cards",
  },
  {
    target: '[data-tour="packages-bulk"]',
    content:
      "Need multiple bundles? Use this button for a bulk order.",
    placement: "top",
    title: "Bulk Order",
  },
  {
    target: '[data-tour="sidebar-orders"]',
    content: "Now let's check your Orders. Click it in the sidebar.",
    placement: "right",
    title: "Next: Orders",
    locale: { last: "Got it" },
  },
];

const ORDERS_STEPS_DESKTOP: Step[] = [
  {
    target: "body",
    content:
      "Here you can track and manage all your orders in one place.",
    placement: "center",
    skipBeacon: true,
    title: "Order Overview",
  },
  {
    target: '[data-tour="orders-analytics"]',
    content:
      "View your order metrics — totals, pending, and completed at a glance.",
    placement: "bottom",
    title: "Order Analytics",
  },
  {
    target: '[data-tour="orders-list"]',
    content:
      "Each card shows an order. Track status, update, or cancel as needed.",
    placement: "bottom",
    title: "Order Cards",
  },
  {
    target: '[data-tour="sidebar-wallet"]',
    content: "Now let's check your Wallet. Click it in the sidebar.",
    placement: "right",
    title: "Next: Wallet",
    locale: { last: "Got it" },
  },
];

const WALLET_STEPS_DESKTOP: Step[] = [
  {
    target: "body",
    content:
      "Manage your wallet — check your balance, add funds, and review transactions.",
    placement: "center",
    skipBeacon: true,
    title: "Wallet",
  },
  {
    target: '[data-tour="wallet-balance"]',
    content: "Your current balance. Funds are available for purchases.",
    placement: "bottom",
    title: "Current Balance",
  },
  {
    target: '[data-tour="wallet-funding"]',
    content: "Add funds via Request Top-up (admin approval) or Instant Claim (immediate MoMo credit).",
    placement: "top",
    title: "Add Funds",
  },
  {
    target: '[data-tour="wallet-history"]',
    content: "Review all your past transactions and track your spending.",
    placement: "top",
    title: "Transaction History",
  },
  {
    target: '[data-tour="sidebar-commission"]',
    content:
      "Now let's check your Commissions. Click it in the sidebar.",
    placement: "right",
    title: "Next: Commission",
    locale: { last: "Got it" },
  },
];

const COMMISSION_STEPS_DESKTOP: Step[] = [
  {
    target: "body",
    content:
      "Earn commissions by sharing your referral code with new users. You earn from every completed order they make.",
    placement: "center",
    skipBeacon: true,
    title: "Commissions & Referrals",
  },
  {
    target: '[data-tour="commissions-referral-section"]',
    content:
      "Your unique referral code and referral statistics are displayed here. Share your code to start earning.",
    placement: "bottom",
    skipBeacon: true,
    title: "Referral Overview",
  },
  {
    target: '[data-tour="commissions-withdraw-btn"]',
    content:
      "Once you've earned enough, withdraw your commissions directly from here.",
    placement: "left",
    skipBeacon: true,
    title: "Withdraw",
  },
  {
    target: '[data-tour="sidebar-profile"]',
    content:
      "Next, let's set up your profile.",
    placement: "right",
    skipBeacon: true,
    hideOverlay: true,
    title: "Profile",
    locale: { last: "Finish" },
  },
];

const PROFILE_STEPS_DESKTOP: Step[] = [
  {
    target: '[data-tour="profile-heading"]',
    content:
      "View and manage your personal details, contact information, and account settings all in one place. You can update your profile photo, edit your name and email, change your password, and manage notification preferences from this page.",
    placement: "bottom",
    skipBeacon: true,
    title: "Your Profile",
  },
  {
    target: "body",
    content:
      "You've completed the tour! You now know the key areas of the platform. Explore the rest at your own pace. If you ever need help, check the support section in your profile.",
    placement: "center",
    title: "Tour Complete",
    locale: { last: "Finish" },
  },
];

/* ─── Mobile step definitions (hamburger instead of sidebar) ─ */

const DASHBOARD_STEPS_MOBILE: Step[] = [
  {
    target: "body",
    content:
      "Welcome to DirectData! You can sell data and earn through your storefront here. Let's take a quick tour.",
    placement: "center",
    skipBeacon: true,
    title: "Welcome",
  },
  {
    target: '[data-tour="dashboard-packages"]',
    content:
      "Browse available packages from your providers. Tap any card to get started.",
    placement: "bottom",
    title: "All Packages",
  },
  {
    target: '[data-tour="dashboard-overview"]',
    content:
      "Track your orders, spending, sales, and analytics all in one place.",
    placement: "bottom",
    title: "Account Overview",
  },
  {
    target: '[data-tour="header-menu"]',
    content:
      "Tap the menu button to open the sidebar.",
    placement: "bottom",
    hideOverlay: true,
    title: "Open Navigation",
  },
  {
    target: '[data-tour="sidebar-packages"]',
    content: "Select 'Packages' to continue the tour.",
    placement: "right",
    title: "Next: Packages",
    locale: { last: "Got it" },
  },
];

const PACKAGES_STEPS_MOBILE: Step[] = [
  {
    target: "body",
    content:
      "Here you can browse all available data bundles for this provider.",
    placement: "center",
    skipBeacon: true,
    title: "Available Bundles",
  },
  {
    target: '[data-tour="packages-search"]',
    content:
      "Use the search bar and filters to find specific bundles.",
    placement: "bottom",
    title: "Search & Filter",
  },
  {
    target: '[data-tour="packages-bundles"]',
    content:
      "Each card shows a bundle. Tap 'Order Now' to purchase.",
    placement: "bottom",
    title: "Bundle Cards",
  },
  {
    target: '[data-tour="packages-bulk"]',
    content:
      "Need multiple bundles? Use this button for a bulk order.",
    placement: "top",
    title: "Bulk Order",
  },
  {
    target: '[data-tour="header-menu"]',
    content: "Tap the menu button to open the sidebar.",
    placement: "bottom",
    hideOverlay: true,
    title: "Open Navigation",
  },
  {
    target: '[data-tour="sidebar-orders"]',
    content: "Select 'Orders' to continue.",
    placement: "right",
    title: "Next: Orders",
    locale: { last: "Got it" },
  },
];

const ORDERS_STEPS_MOBILE: Step[] = [
  {
    target: "body",
    content:
      "Here you can track and manage all your orders in one place.",
    placement: "center",
    skipBeacon: true,
    title: "Order Overview",
  },
  {
    target: '[data-tour="orders-analytics"]',
    content:
      "View your order metrics — totals, pending, and completed at a glance.",
    placement: "bottom",
    title: "Order Analytics",
  },
  {
    target: '[data-tour="orders-list"]',
    content:
      "Each card shows an order. Tap to track status or update.",
    placement: "bottom",
    title: "Order Cards",
  },
  {
    target: '[data-tour="header-menu"]',
    content: "Tap the menu button to open the sidebar.",
    placement: "bottom",
    hideOverlay: true,
    title: "Open Navigation",
  },
  {
    target: '[data-tour="sidebar-wallet"]',
    content: "Select 'Wallet' to continue.",
    placement: "right",
    title: "Next: Wallet",
    locale: { last: "Got it" },
  },
];

const WALLET_STEPS_MOBILE: Step[] = [
  {
    target: "body",
    content:
      "Manage your wallet — check your balance, add funds, and review transactions.",
    placement: "center",
    skipBeacon: true,
    title: "Wallet",
  },
  {
    target: '[data-tour="wallet-balance"]',
    content: "Your current balance. Funds are available for purchases.",
    placement: "bottom",
    title: "Current Balance",
  },
  {
    target: '[data-tour="wallet-funding"]',
    content: "Add funds via Request Top-up (admin approval) or Instant Claim (immediate MoMo credit).",
    placement: "top",
    title: "Add Funds",
  },
  {
    target: '[data-tour="wallet-history"]',
    content: "Review all your past transactions and track your spending.",
    placement: "top",
    title: "Transaction History",
  },
  {
    target: '[data-tour="header-menu"]',
    content: "Tap the menu button to open the sidebar.",
    placement: "bottom",
    hideOverlay: true,
    title: "Open Navigation",
  },
  {
    target: '[data-tour="sidebar-commission"]',
    content: "Select 'Commission' to continue.",
    placement: "right",
    title: "Next: Commission",
    locale: { last: "Got it" },
  },
];

const COMMISSION_STEPS_MOBILE: Step[] = [
  {
    target: "body",
    content:
      "Earn commissions by sharing your referral code with new users. You earn from every completed order they make.",
    placement: "center",
    skipBeacon: true,
    title: "Commissions & Referrals",
  },
  {
    target: '[data-tour="commissions-referral-section"]',
    content:
      "Your unique referral code and referral stats are right here — share your code to start earning.",
    placement: "bottom",
    skipBeacon: true,
    title: "Referral Overview",
  },
  {
    target: '[data-tour="commissions-withdraw-btn"]',
    content:
      "Withdraw your earnings directly from here once you've accumulated enough.",
    placement: "left",
    skipBeacon: true,
    title: "Withdraw",
  },
  {
    target: '[data-tour="header-menu"]',
    content:
      "Open the menu to navigate to your profile.",
    placement: "bottom",
    skipBeacon: true,
    hideOverlay: true,
    title: "Navigation",
  },
  {
    target: '[data-tour="sidebar-profile"]',
    content:
      "Let's set up your profile.",
    placement: "right",
    skipBeacon: true,
    hideOverlay: true,
    title: "Profile",
    locale: { last: "Finish" },
  },
];

const PROFILE_STEPS_MOBILE: Step[] = [
  {
    target: '[data-tour="profile-heading"]',
    content:
      "View and manage your personal details, contact info, account settings, and notifications here.",
    placement: "bottom",
    skipBeacon: true,
    title: "Your Profile",
  },
  {
    target: "body",
    content:
      "Tour complete! Explore the rest of the platform at your own pace.",
    placement: "center",
    title: "Tour Complete",
    locale: { last: "Finish" },
  },
];

/* ─── Step selector ───────────────────────────────────────── */

const STEPS_BY_PATH_DESKTOP: Record<string, Step[]> = {
  "/agent/dashboard": DASHBOARD_STEPS_DESKTOP,
  "/agent/dashboard/packages": PACKAGES_STEPS_DESKTOP,
  "/agent/dashboard/orders": ORDERS_STEPS_DESKTOP,
  "/agent/dashboard/wallet": WALLET_STEPS_DESKTOP,
  "/agent/dashboard/commissions": COMMISSION_STEPS_DESKTOP,
  "/agent/dashboard/profile": PROFILE_STEPS_DESKTOP,
};

const STEPS_BY_PATH_MOBILE: Record<string, Step[]> = {
  "/agent/dashboard": DASHBOARD_STEPS_MOBILE,
  "/agent/dashboard/packages": PACKAGES_STEPS_MOBILE,
  "/agent/dashboard/orders": ORDERS_STEPS_MOBILE,
  "/agent/dashboard/wallet": WALLET_STEPS_MOBILE,
  "/agent/dashboard/commissions": COMMISSION_STEPS_MOBILE,
  "/agent/dashboard/profile": PROFILE_STEPS_MOBILE,
};

/* ─── Persistence helpers ─────────────────────────────────── */

const loadPagesCompleted = (): Set<string> => {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(PAGES_KEY) ?? "[]"));
  } catch {
    return new Set<string>();
  }
};

const savePagesCompleted = (pages: Set<string>) => {
  localStorage.setItem(PAGES_KEY, JSON.stringify([...pages]));
};

/* ─── Component ───────────────────────────────────────────── */

export const TutorialOverlay = () => {
  const location = useLocation();
  const { authState, updateFirstTimeFlag } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [isMobile] = useState(() => window.innerWidth < 768);
  const [devTrigger, setDevTrigger] = useState(
    () => localStorage.getItem(DEV_TRIGGER_KEY) === "true",
  );

  const currentPath: string | undefined =
    TOUR_PATHS.find((p) => location.pathname === p) ??
    (TOUR_PREFIXES.some((p) => location.pathname.startsWith(p))
      ? "/agent/dashboard/packages"
      : undefined);

  const steps =
    currentPath && !loadPagesCompleted().has(currentPath)
      ? (isMobile ? STEPS_BY_PATH_MOBILE : STEPS_BY_PATH_DESKTOP)[currentPath]
      : undefined;

  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    const shouldShow =
      authState.isAuthenticated &&
      isAgent(authState.user?.userType) &&
      (
        (authState.user?.isFirstTime && localStorage.getItem(DONE_KEY) !== "true") ||
        devTrigger
      );

    if (shouldShow) {
      setIsActive(true);
      localStorage.setItem(ACTIVE_KEY, "true");
    }
  }, [authState.isAuthenticated, authState.user, devTrigger]);

  useEffect(() => {
    if (!isActive || !currentPath || !steps) {
      setPageReady(true);
      return;
    }

    setPageReady(false);

    const firstRealTarget = steps.find((s) => s.target !== "body");
    if (!firstRealTarget) {
      setPageReady(true);
      return;
    }

    const targetSelector = firstRealTarget.target as string;
    let attempts = 0;
    const maxAttempts = 100;
    let rafId: number;

    const poll = () => {
      attempts++;
      if (document.querySelector(targetSelector)) {
        setPageReady(true);
        return;
      }
      if (attempts >= maxAttempts) {
        setPageReady(true);
        return;
      }
      rafId = requestAnimationFrame(poll);
    };

    rafId = requestAnimationFrame(poll);

    return () => cancelAnimationFrame(rafId);
  }, [currentPath, isActive, steps]);

  const resetTutorial = () => {
    localStorage.removeItem(DONE_KEY);
    localStorage.removeItem(PAGES_KEY);
    localStorage.removeItem(ACTIVE_KEY);
    localStorage.setItem(DEV_TRIGGER_KEY, "true");
    setDevTrigger(true);
  };

  const finishTour = () => {
    localStorage.setItem(DONE_KEY, "true");
    localStorage.removeItem(ACTIVE_KEY);
    localStorage.removeItem(PAGES_KEY);
    localStorage.removeItem(DEV_TRIGGER_KEY);
    setDevTrigger(false);
    setIsActive(false);
    updateFirstTimeFlag();
  };

  const isDev = import.meta.env.DEV;

  const handleEvent = (data: EventData) => {
    if (data.action === "skip" || data.action === "close") {
      finishTour();
      return;
    }

    if (data.type === "tour:end") {
      const pagesCompleted = loadPagesCompleted();
      pagesCompleted.add(currentPath!);
      savePagesCompleted(pagesCompleted);

      if (pagesCompleted.size === TOUR_PATHS.length) {
        finishTour();
      }
    }
  };

  return (
    <>
      {isDev && (
        <button
          onClick={resetTutorial}
          style={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 9999,
            padding: "8px 16px",
            fontSize: 12,
            borderRadius: 8,
            border: "1px dashed #6366f1",
            backgroundColor: "rgba(99,102,241,0.08)",
            color: "#6366f1",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Restart Tutorial
        </button>
      )}
      {isActive && currentPath && steps && (
        <Joyride
          key={currentPath}
          steps={steps}
          run={pageReady}
          continuous
          options={{
            buttons: ["close", "primary", "skip"],
            overlayClickAction: false,
            primaryColor: "var(--color-secondary-500, #6366f1)",
            textColor: "#333",
            width: isMobile ? "calc(100vw - 40px)" : 340,
            zIndex: 10000,
            showProgress: true,
          }}
          locale={{
            skip: "Skip tour",
            last: "Got it",
            next: "Next",
            back: "Back",
          }}
          styles={{
            buttonPrimary: {
              backgroundColor: "var(--color-secondary-500, #6366f1)",
              fontSize: isMobile ? 15 : 13,
              minHeight: isMobile ? 44 : undefined,
              minWidth: isMobile ? 80 : undefined,
            },
            buttonSkip: {
              color: "#999",
              fontSize: isMobile ? 14 : 13,
              minHeight: isMobile ? 44 : undefined,
            },
            buttonClose: {
              fontSize: isMobile ? 16 : 14,
              minHeight: isMobile ? 44 : undefined,
              minWidth: isMobile ? 44 : undefined,
            },
        tooltip: {
          borderRadius: 12,
        },
        tooltipContainer: {
          textAlign: "left",
        },
        tooltipContent: {
          padding: isMobile ? "16px 12px" : "20px 10px",
          fontSize: isMobile ? 15 : 14,
          lineHeight: isMobile ? 1.5 : 1.4,
          maxHeight: isMobile ? "40vh" : "50vh",
          overflowY: "auto",
        },
        tooltipTitle: {
          fontSize: isMobile ? 18 : 16,
        },
      }}
      onEvent={handleEvent}
    />
  )}
    </>
  );
};
