"use client";

import { useEffect, useState } from "react";
import { FiDownload, FiShare } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { usePwa } from "./PwaProvider";

export default function PwaInstallPrompt() {
  const { deferredPrompt, isStandalone, isIOS, clearPrompt } = usePwa();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if dismissed previously
    const dismissedAt = localStorage.getItem("pwa-prompt-dismissed");
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      const currentTime = new Date().getTime();
      const daysPassed = (currentTime - dismissedTime) / (1000 * 60 * 60 * 24);
      
      if (daysPassed < 7) {
        return; // Don't show if dismissed within the last 7 days
      }
    }

    if (!isStandalone) {
      // Show prompt if we are on iOS or if we have a valid deferredPrompt
      // Wait for a small delay to ensure deferredPrompt is captured if available
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isStandalone]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    clearPrompt();
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
  };

  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-[#121820]/95 backdrop-blur-md border-b border-[#2a3441] px-4 py-3 shadow-lg z-50 flex items-center justify-between animate-in slide-in-from-top-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
          {/* Using next/image would be better, but img is fine for a 192x192 icon */}
          <img src="/icons/192.png" alt="Sync App Icon" className="w-full h-full object-cover" />
        </div>
        
        <div className="flex flex-col">
          <span className="font-semibold text-white text-sm leading-tight">Install Sync</span>
          <span className="text-xs text-gray-400">Add to home screen</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3">
        {isIOS ? (
          <div className="flex items-center gap-1.5 text-xs text-gray-300 bg-[#1a222d] px-2 py-1.5 rounded-lg border border-[#2a3441]">
            <span>Tap</span>
            <span className="p-0.5 bg-gray-800 rounded text-white"><FiShare size={12} /></span>
            <span className="hidden sm:inline">then <strong>Add to Home Screen</strong></span>
          </div>
        ) : (
          <button
            onClick={handleInstallClick}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
          >
            Install
          </button>
        )}
        
        <button 
          onClick={handleDismiss}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded-md"
          aria-label="Close"
        >
          <IoClose size={20} />
        </button>
      </div>
    </div>
  );
}
