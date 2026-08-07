"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PwaContextType {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isStandalone: boolean;
  isIOS: boolean;
  clearPrompt: () => void;
}

const PwaContext = createContext<PwaContextType>({
  deferredPrompt: null,
  isStandalone: true,
  isIOS: false,
  clearPrompt: () => {},
});

export const usePwa = () => useContext(PwaContext);

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(true);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneMedia = window.matchMedia("(display-mode: standalone)").matches;
      // @ts-ignore
      const isStandaloneNavigator = !!window.navigator.standalone;
      const isStandaloneNow = isStandaloneMedia || isStandaloneNavigator;
      setIsStandalone(isStandaloneNow);
      
      if (!isStandaloneNow) {
        const userAgent = window.navigator.userAgent.toLowerCase();
        setIsIOS(/iphone|ipad|ipod/.test(userAgent));
      }
    };
    
    checkStandalone();

    // Check if the event was already captured by the inline script in layout.tsx
    // @ts-ignore
    if (window.deferredPwaPrompt) {
      // @ts-ignore
      setDeferredPrompt(window.deferredPwaPrompt);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // @ts-ignore
      window.deferredPwaPrompt = e;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    
    window.addEventListener("appinstalled", () => {
      setDeferredPrompt(null);
      // @ts-ignore
      window.deferredPwaPrompt = null;
      setIsStandalone(true);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const clearPrompt = () => {
    setDeferredPrompt(null);
  };

  return (
    <PwaContext.Provider value={{ deferredPrompt, isStandalone, isIOS, clearPrompt }}>
      {children}
    </PwaContext.Provider>
  );
}
