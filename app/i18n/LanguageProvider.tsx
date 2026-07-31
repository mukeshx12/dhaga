"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "en" | "hi";

const messages = {
  en: {
    services: "Services",
    tailors: "Tailors",
    howItWorks: "How It Works",
    contact: "Contact",
    login: "Login",
    signUp: "Sign Up",
    dashboard: "Dashboard",
    tailorDashboard: "Tailor Dashboard",
    becomeTailor: "Become a Tailor",
    logout: "Logout",
    language: "Language",
    customerDashboard: "Customer dashboard",
    welcomeBack: "Welcome back",
    loadingBookings: "Loading your bookings...",
    noBookings: "No bookings yet",
    findTailor: "Find a tailor",
    delivered: "DELIVERED",
    quotation: "Quotation",
    noQuotationNotes: "No quotation notes provided.",
    acceptQuotation: "Accept quotation",
    rejectQuotation: "Reject quotation",
    tailorContact: "Tailor contact",
    callTailor: "Call tailor",
    chatWhatsApp: "Chat on WhatsApp",
    bookingSuccess: "Measurement request sent successfully.",
    bookingVisible: "The booking is now visible in your dashboard.",
    preferredDate: "Preferred Date",
    measurementAddress: "Measurement Address",
    notes: "Notes",
    confirmingBooking: "Confirming booking...",
    confirmBookingWith: "Confirm booking with",
    bookingReviewNote: "The tailor will review your request before sending a quotation.",
  },
  hi: {
    services: "सेवाएं",
    tailors: "दर्जी",
    howItWorks: "यह कैसे काम करता है",
    contact: "संपर्क",
    login: "लॉग इन",
    signUp: "साइन अप",
    dashboard: "डैशबोर्ड",
    tailorDashboard: "दर्जी डैशबोर्ड",
    becomeTailor: "दर्जी के रूप में जुड़ें",
    logout: "लॉग आउट",
    language: "भाषा",
    customerDashboard: "ग्राहक डैशबोर्ड",
    welcomeBack: "फिर से स्वागत है",
    loadingBookings: "आपकी बुकिंग लोड हो रही हैं...",
    noBookings: "अभी कोई बुकिंग नहीं है",
    findTailor: "दर्जी खोजें",
    delivered: "डिलीवर किया गया",
    quotation: "मूल्य प्रस्ताव",
    noQuotationNotes: "मूल्य प्रस्ताव के लिए कोई नोट नहीं।",
    acceptQuotation: "प्रस्ताव स्वीकार करें",
    rejectQuotation: "प्रस्ताव अस्वीकार करें",
    tailorContact: "दर्जी से संपर्क",
    callTailor: "दर्जी को कॉल करें",
    chatWhatsApp: "WhatsApp पर चैट करें",
    bookingSuccess: "माप का अनुरोध सफलतापूर्वक भेज दिया गया।",
    bookingVisible: "बुकिंग अब आपके डैशबोर्ड पर दिखाई दे रही है।",
    preferredDate: "पसंदीदा तारीख",
    measurementAddress: "माप लेने का पता",
    notes: "नोट्स",
    confirmingBooking: "बुकिंग की पुष्टि हो रही है...",
    confirmBookingWith: "बुकिंग की पुष्टि करें:",
    bookingReviewNote: "दर्जी मूल्य प्रस्ताव भेजने से पहले आपके अनुरोध की समीक्षा करेगा।",
  },
} as const;

type MessageKey = keyof typeof messages.en;
type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: MessageKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const savedLanguage = window.localStorage.getItem("dhaga-language");
      if (savedLanguage === "en" || savedLanguage === "hi") {
        // The persisted preference is available only after the client hydrates.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLanguageState(savedLanguage);
        document.documentElement.lang = savedLanguage;
      }
    } catch {
      // Some mobile/private browsers block storage. The app should still load.
      document.documentElement.lang = "en";
    }
  }, []);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage(nextLanguage) {
      setLanguageState(nextLanguage);
      document.documentElement.lang = nextLanguage;
      try {
        window.localStorage.setItem("dhaga-language", nextLanguage);
      } catch {
        // Keep the in-memory language active when persistence is unavailable.
      }
    },
    t(key) {
      return messages[language][key];
    },
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
