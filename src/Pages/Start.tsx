import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InstallBtn from "../Components/installBtn";
const StartScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/start1");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100 px-4">
      <InstallBtn />
      {/* Logo with improved scaling */}
      <img
        width={300} height={300}
        src="/Images/logo.png"
        alt="RideNITT Logo"
        className="w-[60%] sm:w-28 md:w-36 lg:w-44 xl:w-52 2xl:w-64 mb-4"
      />

      {/* RideNITT Title with better responsiveness */}
      <h1
        className="text-[#008955] font-bold text-center leading-snug whitespace-nowrap md:whitespace-normal"
        style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}
      >
        RideNITT
      </h1>

      {/* Tagline with improved text size */}
      <p
        className="text-gray-700 text-center mt-2 font-bold leading-snug"
        style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
      >
        Find your ride, your way!
      </p>
    </div>
  );
};

export default StartScreen;
