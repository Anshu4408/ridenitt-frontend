
import { usePWAInstall } from "./useInstallBtn";
import { useLocation } from "react-router-dom";

const InstallBtn = () => {
    const HIDDEN_ROUTES = [
 "/create-ride",
];
  const { isInstallable, install } = usePWAInstall();
  const location = useLocation();
   if (HIDDEN_ROUTES.some(route => location.pathname.startsWith(route))) {
  return null;
}

  if (!isInstallable) return null;

  return (
    <button onClick={install} 
       className="bg-green-700 rounded-full p-2"
      style={{
        position: "fixed",
        bottom: "86px",
        left: "20px",
        zIndex: 1000,
      }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    </button>
  );
};

export default InstallBtn;