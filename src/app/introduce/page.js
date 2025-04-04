"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function IntroduceYourself() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!name.trim()) {
      setError("Please enter your first and last name.");
      return;
    }
    setError("");
    router.push(`/introduce/location?name=${encodeURIComponent(name)}`);
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
              Click to Type
            </p>

            {/* Name Input */}
            <input
              type="text"
              placeholder="Introduce Yourself"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className=" w-2xs text-4xl font-light mt-1 border-b border-[#1A1B1C] inline-block text-black text-center"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>

      {/* Next Button */}
      <div
        onClick={handleNext}
        className="absolute bottom-10 right-10 flex items-center space-x-2 cursor-pointer"
      >
        <div className="flex items-center justify-center hover:opacity-80 transform transition-transform duration-500 hover:scale-110">
          <Image
            src="/proceedbutton.svg"
            alt="proceed"
            width={130}
            height={130}
          />
        </div>
      </div>

      {/* Back Button */}
      <div onClick={() => router.back()} className="cursor-pointer">
        <div className="absolute bottom-10 left-10 flex items-center space-x-2 cursor-pointer hover:opacity-80">
          <div className="flex items-center justify-center transform transition-transform duration-500 hover:scale-110">
            <Image src="/backbutton.svg" alt="back" width={100} height={100} />
          </div>
        </div>
      </div>
    </div>
  );
}
