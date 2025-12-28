
import { useState, useEffect } from "react";

let deferredPrompt: any = null;


export const usePWAInstall = () => {
  const [isInstallable, setIsInstallable] = useState(!!deferredPrompt);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      deferredPrompt = e;
      setIsInstallable(true);
    };

     const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstallable(false);
      return;
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
      deferredPrompt = null;
    }
  };

  return { isInstallable, install };
};