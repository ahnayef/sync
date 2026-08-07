"use client";

import { useState, useEffect } from "react";
import { FiDownload } from "react-icons/fi";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function NavbarInstallButton() {
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

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    
    window.addEventListener("appinstalled", () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      if (window.toast) {
        window.toast.info("Tap the Share button and select 'Add to Home Screen'");
      } else {
        alert("Tap the Share button and select 'Add to Home Screen'");
      }
    } else {
      if (window.toast) {
        window.toast.info("Install from your browser menu (usually top right)");
      } else {
        alert("Install from your browser menu (usually top right)");
      }
    }
  };

  // Only hide if we are sure it's already installed
  if (isStandalone) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300 hover:bg-blue-500/20 transition-colors"
      title="Install App"
    >
      <FiDownload size={14} />
      <span>Install App</span>
    </button>
  );
}
