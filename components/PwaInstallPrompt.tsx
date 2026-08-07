"use client";

import { useState, useEffect } from "react";
import { FiDownload, FiShare } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true);

  useEffect(() => {
    // Check if dismissed previously
    const hasDismissed = localStorage.getItem("pwa-prompt-dismissed");
    if (hasDismissed) return;

    const checkStandalone = () => {
      const isStandaloneMedia = window.matchMedia("(display-mode: standalone)").matches;
      // @ts-ignore
      const isStandaloneNavigator = !!window.navigator.standalone;
      const isStandaloneNow = isStandaloneMedia || isStandaloneNavigator;
      setIsStandalone(isStandaloneNow);
      
      if (!isStandaloneNow) {
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIosDevice);
        
        if (isIosDevice) {
          setShowPrompt(true);
        }
      }
    };
    
    checkStandalone();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    
    window.addEventListener("appinstalled", () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed", "true");
  };

  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-[#121820] border border-[#2a3441] rounded-2xl p-4 shadow-2xl z-50 flex flex-col gap-3 animate-in slide-in-from-bottom-5">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center shrink-0">
            <FiDownload size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-white">Install Sync</h3>
            <p className="text-sm text-gray-400">Add to your home screen for quick access.</p>
          </div>
        </div>
        <button 
          onClick={handleDismiss}
          className="text-gray-400 hover:text-white transition-colors p-1"
          aria-label="Close"
        >
          <IoClose size={20} />
        </button>
      </div>
      
      {isIOS ? (
        <div className="bg-[#1a222d] rounded-xl p-3 text-sm text-gray-300 flex items-center gap-2">
          <span>Tap</span>
          <span className="p-1.5 bg-gray-800 rounded-md text-white"><FiShare size={14} /></span>
          <span>and then <strong className="text-white">"Add to Home Screen"</strong></span>
        </div>
      ) : (
        <button
          onClick={handleInstallClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors mt-1"
        >
          Install App
        </button>
      )}
    </div>
  );
}
