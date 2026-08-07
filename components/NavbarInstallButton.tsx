"use client";

import { FiDownload } from "react-icons/fi";
import { usePwa } from "./PwaProvider";

export default function NavbarInstallButton() {
  const { deferredPrompt, isStandalone, isIOS, clearPrompt } = usePwa();

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        clearPrompt();
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
      className="flex w-full md:w-auto justify-center items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300 hover:bg-blue-500/20 transition-colors"
      title="Install App"
    >
      <FiDownload size={14} />
      <span>Install App</span>
    </button>
  );
}
