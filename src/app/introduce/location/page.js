"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function LocationInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!location.trim()) {
      setError("Please enter your location.");
      return;
    }
    setError("");
    setLoading(true);

    const payload = { name, location: location.trim() };

    try {
      const response = await fetch(
        "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);
      setLoading(false);
      router.push(`/introduce/location/imageupload?name${encodeURIComponent(name)}&location=${encodeURIComponent(location)}`);
    } catch (error) {
      console.error("Error submitting data:", error);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="relative h-screen flex flex-col items-center justify-center bg-white text-[#1A1B1C]"
      style={{ fontFamily: "Roobert Trial, sans-serif" }}
    >
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full border-t-2 border-purple-500 flex justify-between p-4">
        <div>
          <span className="text-xs tracking-widest uppercase font-semibold">
            Skinstric
          </span>
          <span className="text-xs font-semibold uppercase opacity-60 ml-3">
            [ Intro ]
          </span>
        </div>
      </div>

      {/* Left Top Text */}
      <div className="absolute top-24 left-4">
        <p className="text-xs font-semibold uppercase">To Start Analysis</p>
      </div>

      {/* Centered Dotted Box with Text */}
      <div className="relative flex items-center justify-center">
        {/* Outer Dotted Box */}
        <div className="absolute border-2 border-dotted border-[#A0A4AB] h-[400px] w-[400px] rotate-45 opacity-15"></div>
        {/* Middle Dotted Box */}
        <div className="absolute border-2 border-dotted border-[#A0A4AB] h-[350px] w-[350px] rotate-45 opacity-40"></div>
        {/* Inner Dotted Box */}
        <div className="absolute border-2 border-dotted border-[#A0A4AB] h-[300px] w-[300px] rotate-45 opacity-70 flex items-center justify-center">
          <div className="-rotate-45 text-center">
            <p className="text-xs uppercase opacity-50 tracking-wide">
              Where you From?
            </p>

            {/* Location Input */}
            <input
            type="text"
            className="text-4xl font-light mt-1 border-b border-[#1A1B1C] outline-none text-center bg-transparent w-full"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>

    {/* Next Button */}
    <div onClick={handleSubmit} className="absolute bottom-10 right-10 flex items-center space-x-2 cursor-pointer">
        <p className="text-xs uppercase font-semibold opacity-70 mr-4">
          {loading ? "Submitting..." :""}
        </p>
        <div className="flex items-center justify-center hover:opacity-80">
          <Image src="/proceedbutton.svg" alt="proceed" width={130} height={130} />
        </div>
      </div>

      {/* Back Button */}
      <div onClick={() => router.back()} className="cursor-pointer">
        <div className="absolute bottom-10 left-10 flex items-center space-x-2 cursor-pointer hover:opacity-80">
          <div className="flex items-center justify-center">
            <Image src="/backbutton.svg" alt="back" width={100} height={100} />
          </div>
        </div>
      </div>
    </div>
  );
}
