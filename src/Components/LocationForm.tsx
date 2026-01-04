"use client";

import { useState } from "react";
import { Calendar, Clock, HelpCircle } from "lucide-react";
import { DateTimeModal } from "./DateTimeModal";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import MapPage2 from "./MapPage2";
import Select from "./Select";

export default function ShareRide() {
  const navigate = useNavigate();
  const [isDateTimeModalOpen, setIsDateTimeModalOpen] = useState(false);
  const tmr = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const [page, setPage] = useState(1);

  const [datetimeInput, setDatetimeInput] = useState<{
    date: number
    month: number
    year: number
    startHour: number
    startMinute: number
    startAmPm: 'AM' | 'PM'
    endHour: number
    endMinute: number
    endAmPm: 'AM' | 'PM'
  }>({
    date: tmr.getDate(),
    month: tmr.getMonth(),
    year: tmr.getFullYear(),
    startHour: 10,
    startMinute: 0,
    startAmPm: 'AM',
    endHour: 11,
    endMinute: 0,
    endAmPm: 'AM'
  });
  const [selectedTransport, setSelectedTransport] = useState("");
  const [peopleCount, setPeopleCount] = useState<string>('1');
  const [loading, setLoading] = useState(false);
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [prefersGender, setPrefersGender] = useState<'Male' | 'Female' | 'Any' | ''>("");

  const handleDateTimeConfirm = (data: {
    date: number;
    month: number;
    year: number;
    startHour: number;
    startMinute: number;
    startAmPm: 'AM' | 'PM';
    endHour: number;
    endMinute: number;
    endAmPm: 'AM' | 'PM';
  }) => {
    setDatetimeInput(data);
  };

  const handleTransportSelect = (transport: string) => {
    setSelectedTransport(transport);
  };

  const handleSubmit = () => {
    if (Number(peopleCount) > 80) {
      toast.error("too many passengers");
      return;
    }
    setLoading(true);
    axios.post("/api/rides", {
      stops: [
        {
          name: pickup
        },
        {
          name: drop
        }
      ],
      vehicleType: selectedTransport,
      peopleCount: Number(peopleCount),
      prefersGender: prefersGender === "Any" ? "" : prefersGender.toUpperCase(),
      earliestDeparture: new Date(
        datetimeInput.year,
        datetimeInput.month,
        datetimeInput.date+1,
        datetimeInput.startAmPm === 'PM' ? datetimeInput.startHour + 12 : datetimeInput.startHour,
        datetimeInput.startMinute
      ).getTime(),
      latestDeparture: new Date(
        datetimeInput.year,
        datetimeInput.month,
        datetimeInput.date+1,
        datetimeInput.endAmPm === 'PM' ? datetimeInput.endHour + 12 : datetimeInput.endHour,
        datetimeInput.endMinute
      ).getTime()
    })
      .then(() => {
        toast.success("Ride posted successfully!");
        navigate("/");
      })
      .catch((error) => {
        console.error(error)
        toast.error(error.response?.data.error || "Failed to post ride!");
      })
      .finally(() => {
        setLoading(false);
      })
  }

  if (page === 1) {
    return (
      <MapPage2
        pickupLocation={pickup}
        setPickupLocation={setPickup}
        dropLocation={drop}
        setDropLocation={setDrop}
        onConfirm={() => setPage(2)}
      />
    )
  }

  return (
    <div
      className="relative w-full min-h-screen p-6 sm:p-6"
      style={{ background: "linear-gradient(180deg, #FFFFFF 0%, rgba(0, 204, 136, 0.75) 100%)" }}
    >
      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full h-10 pl-4 pr-10 rounded-full border-2 border-black focus:outline-none"
          />

          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <HelpCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#008955] mb-0.75">Share & Ride</h1>
      <p className="text-xl sm:text-2xl md:text-3xl mb-3  ">Post your ride!</p>

      {/* White Card */}
      <div className="w-full max-w-full mx-auto bg-white rounded-3xl py-4 px-4 shadow-lg border-2 border-black mb-20">
        {/* Departure Input */}
        <span className="ml-5 block mb-1">Departure</span>
        <button type="button" onClick={() => setPage(1)} className="mb-4 w-full p-4 rounded-full bg-[#E8F8F3] border-2 border-black focus:outline-none placeholder:text-gray-800">
          {pickup || "Select Pickup location"}
        </button>

        {/* Destination Input */}
        <span className="ml-5 block mb-1">Destination</span>
        <button type="button" onClick={() => setPage(1)} className="mb-4 w-full p-4 rounded-full bg-[#E8F8F3] border-2 border-black focus:outline-none placeholder:text-gray-800">
          {drop || "Select Drop location"}
        </button>

        {/* Date and Time Box */}
        <span className="block ml-5 mb-1">
          Ride Details
        </span>
        <button
          onClick={() => setIsDateTimeModalOpen(true)}
          className="flex flex-col w-full p-4 mb-4 rounded-2xl border-2 border-black bg-[#E8F8F3]"
        >
          <div className="flex flex-col items-start border-b border-solid border-black pb-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm md:text-base">
              <Calendar className="w-5 h-auto text-gray-500 -mt-2" />
              <span className="text-sm text-left">
                {months[datetimeInput.month]} {datetimeInput.date + 1}, {datetimeInput.year}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-start mt-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm md:text-base">
              <Clock className="w-5 h-auto text-gray-500" />
              <span className="text-sm text-left">
                {datetimeInput.startHour}:{datetimeInput.startMinute.toString().padStart(2, '0')} {datetimeInput.startAmPm} - {datetimeInput.endHour}:{datetimeInput.endMinute.toString().padStart(2, '0')} {datetimeInput.endAmPm}
              </span>
            </div>
          </div>
        </button>

        {/* Share Count Component */}

        <div className="flex justify-center mb-6">
          <div className="inline-flex items-start px-4 py-2 rounded-full bg-[#E8F8F3] w-max border-2 border-black">
            <span className="text-sm sm:text-base md:text-lg text-center flex-grow">Passenger Limit :</span>
            <input
              type="number"
              value={peopleCount}
              onChange={e => setPeopleCount(e.currentTarget.value)}
              className="w-16 text-center font-semibold text-sm sm:text-base md:text-lg border-0 bg-[#E8F8F3] focus:outline-none"
            />
          </div>
        </div>

        {/* Transport Options */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button
            type="button"
            onClick={() => handleTransportSelect("Car")}
            className={`flex flex-col items-center p-4 rounded-2xl border-2 border-[#08B783] cursor-pointer ${selectedTransport === "Car" ? "bg-[#008955] text-white" : "bg-[#E8F8F3]"}`}
          >
            <img width={32} height={32} src="/Images/CAR.png" alt="Auto" className="w-8 h-auto mb-1" />
            <span className="text-sm sm:text-base md:text-lg">Car</span>

          </button>
          <button
            type="button"
            onClick={() => handleTransportSelect("Auto")}
            className={`flex flex-col items-center p-4 rounded-2xl border-2 border-[#08B783] cursor-pointer ${selectedTransport === "Auto" ? "bg-[#008955] text-white" : "bg-[#E8F8F3]"}`}
          >
            <img width={32} height={32} src="/Images/AUTO.png" alt="Auto" className="w-8 h-auto mb-1" />
            <span className="text-sm sm:text-base md:text-lg">Auto</span>
          </button>
          <button
            type="button"
            onClick={() => handleTransportSelect("BUS")}
            className={`flex flex-col items-center p-4 rounded-2xl border-2 border-[#08B783] cursor-pointer ${selectedTransport === "BUS" ? "bg-[#008955] text-white" : "bg-[#E8F8F3]"}`}
          >
            <img width={32} height={32} src="/Images/BUS.png" alt="BUS" className="w-8 block scale-125 h-auto mb-1" />
            <span className="text-sm sm:text-base md:text-lg">BUS</span>
          </button>
        </div>

        {/* Preferred Gender */}
        {/*<div className="mb-5 ">
          <Select
            value={prefersGender}
            items={["", "Male", "Female", "Any"] as const}
            onChange={(v: any) => setPrefersGender(v)}
            Label={({ children }) => (
              children || "Select Preferred Gender"
            )}
          />
        </div>*/}

        {/* Post Button */}
        <button onClick={handleSubmit} disabled={loading} className="w-full disabled:opacity-75 py-4 bg-[#008955] text-white rounded-full text-lg sm:text-xl md:text-2xl font-semibold">
          Post your ride!
        </button>
      </div>

      {/* Date Time Modal */}
      <DateTimeModal
        isOpen={isDateTimeModalOpen}
        initialValue={datetimeInput}
        onConfirm={handleDateTimeConfirm}
        onClose={() => setIsDateTimeModalOpen(false)}
      />
    </div>
  );
}

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]
