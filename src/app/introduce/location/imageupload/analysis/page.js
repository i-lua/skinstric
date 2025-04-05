"use client"; // Mark as Client Component

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

// Client-side component with hooks
function AnalysisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dataString = searchParams.get("data");
  const analysisData = dataString ? JSON.parse(dataString) : null;
  const [selected, setSelected] = useState(false);

  const handleDemographicsSelect = () => {
    if (!analysisData) {
      alert("No analysis data available");
      return;
    }

    setSelected(true);
    // Enable the Get Summary button but don't navigate yet
  };

  const handleGetSummary = () => {
    if (!selected || !analysisData) return;

    try {
      const queryString = new URLSearchParams({
        data: JSON.stringify(analysisData),
        type: "demographics",
      }).toString();

      router.push(
        `/introduce/location/imageupload/analysis/demographics?${queryString}`
      );
    } catch (error) {
      console.error("Error navigating to demographics:", error);
      alert("Error processing selection. Please try again.");
    }
  };

  // If no data is available, show an error state
  if (!analysisData) {
    return (
      <div
        className="relative h-screen flex flex-col items-center justify-center bg-white text-[#1A1B1C]"
        style={{ fontFamily: "Roobert Trial, sans-serif" }}
      >
        <p className="text-lg font-semibold">No analysis data available</p>
        <div
          onClick={() => router.push("/introduce/location/imageupload")}
          className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 cursor-pointer"
        >
          Return to Upload
        </div>
      </div>
    );
  }

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
            [ Analysis ]
          </span>
        </div>
      </div>

      {/* Left Top Text */}
      <div className="absolute top-24 left-4">
        <p className="text-xs font-bold uppercase">A. I. Analysis</p>
        <p className="text-xs opacity-70 mt-1 leading-[2]">
          A. I. HAS ESTIMATED THE FOLLOWING. <br />
          FIX ESTIMATED INFORMATION IF NEEDED.
        </p>
      </div>

      {/* Diamond Grid */}
      <div className="relative flex items-center justify-center">
        {/* Outer Rotating Dotted Box */}
        <div className="absolute border-2 border-dotted border-[#A0A4AB] h-[400px] w-[400px] rotate-45 opacity-15"></div>
        <div className="absolute border-2 border-dotted border-[#A0A4AB] h-[350px] w-[350px] rotate-45 opacity-40"></div>
        <div className="absolute border-2 border-dotted border-[#A0A4AB] h-[300px] w-[300px] rotate-45 opacity-70"></div>

        {/* Inner Grid */}
        <div className="relative grid grid-cols-2 grid-rows-2 w-[200px] h-[200px] gap-1 rotate-45">
          {/* Demographics - Clickable */}
          <div
            className={`flex items-center justify-center text-sm font-semibold cursor-pointer transition ${
              selected ? "bg-gray-300" : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={handleDemographicsSelect}
          >
            <p className="text-[12px] font-semibold -rotate-45">DEMOGRAPHICS</p>
          </div>

          {/* Cosmetic Concerns - Not Clickable */}
          <div className="bg-gray-100 flex items-center justify-center text-sm font-semibold opacity-50">
            <p className="text-[12px] -rotate-45 text-center">
              COSMETIC CONCERNS
            </p>
          </div>

          {/* Skin Type Details - Not Clickable */}
          <div className="bg-gray-100 flex items-center justify-center text-sm font-semibold opacity-50">
            <p className="text-[12px] -rotate-45 text-center">
              SKIN TYPE DETAILS
            </p>
          </div>

          {/* Weather - Not Clickable */}
          <div className="bg-gray-100 flex items-center justify-center text-sm font-semibold opacity-50">
            <p className="text-[12px] -rotate-45 text-center">WEATHER</p>
          </div>
        </div>
      </div>

      {/* Back Button (Bottom Left) */}
      <div
        onClick={() => router.back()}
        className="absolute bottom-10 left-10 flex items-center space-x-2 cursor-pointer hover:opacity-80"
      >
        <div className="flex items-center justify-center transform transition-transform duration-500 hover:scale-110">
          <Image src="/backbutton.svg" alt="Back" height={100} width={100} />
        </div>
      </div>

      {/* Get Summary Button (Bottom Right) */}
      <div
        className={`absolute bottom-10 right-10 flex items-center space-x-2 transition ${
          selected
            ? "opacity-100 cursor-pointer"
            : "opacity-50 pointer-events-none"
        }`}
        onClick={handleGetSummary}
      >
        <div className="flex items-center justify-center hover:opacity-80 transform transition-transform duration-500 hover:scale-110">
          <Image
            src="/getsummarybutton.svg"
            alt="Get Summary"
            width={160}
            height={160}
          />
        </div>
      </div>
    </div>
  );
}

// Default export with Suspense wrapper
export default function AnalysisPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-white text-[#1A1B1C]">Loading analysis...</div>}>
      <AnalysisContent />
    </Suspense>
  );
}