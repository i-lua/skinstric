"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function DemographicsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dataString = searchParams.get("data");
  const responseData = dataString ? JSON.parse(dataString) : null;
  
  // Access the nested data field
  const analysisData = responseData?.data;

  // State for edited values (for reset functionality)
  const [editedData, setEditedData] = useState(analysisData);

  // If no data is available, show an error state
  if (!analysisData) {
    return (
      <div className="relative h-screen flex flex-col items-center justify-center bg-white text-[#1A1B1C]" style={{ fontFamily: 'Roobert Trial, sans-serif' }}>
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

  // Extract primary race and confidence
  const races = analysisData.race || {};
  const primaryRaceKey = Object.keys(races).reduce((a, b) => races[a] > races[b] ? a : b, "unknown");
  const primaryRace = primaryRaceKey
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const primaryConfidence = Math.round((races[primaryRaceKey] || 0) * 100);

  // Sort races by confidence for the list
  const sortedRaces = Object.entries(races)
    .sort(([, a], [, b]) => b - a)
    .map(([race, confidence]) => ({
      race: race
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      confidence: Math.round(confidence * 100)
    }));

  // Determine primary age range
  const ages = analysisData.age || {};
  const primaryAge = Object.keys(ages).reduce((a, b) => ages[a] > ages[b] ? a : b, "Unknown");

  // Determine primary gender based on higher percentage
  const genderData = analysisData.gender || {};
  const primaryGenderKey = Object.keys(genderData).reduce((a, b) => genderData[a] > genderData[b] ? a : b, "unknown");
  const primaryGender = primaryGenderKey.charAt(0).toUpperCase() + primaryGenderKey.slice(1);

  const handleReset = () => {
    setEditedData(analysisData);
  };

  const handleConfirm = () => {
    router.push("/introduce/location/imageupload/analysis/selection");
  };

  return (
    <div className="relative h-screen flex flex-col bg-white text-[#1A1B1C]" style={{ fontFamily: 'Roobert Trial, sans-serif' }}>
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full border-t-2 border-purple-500 flex justify-between p-4">
        <div>
          <span className="text-xs tracking-widest uppercase font-semibold">Skinstric</span>
          <span className="text-xs font-semibold uppercase opacity-60 ml-3">[ Analysis ]</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col h-full pt-16 px-4">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[14px] font-semibold uppercase">A. I. Analysis</p>
          <h1 className="text-7xl font-normal uppercase mt-2">Demographics</h1>
          <p className="text-sm font-normal uppercase opacity-70">Predicted Race & Age</p>
        </div>

        {/* Main Data Display */}
        <div className="flex flex-1">
          {/* Left Side - Primary Prediction */}
          <div className="relative flex-1 flex flex-col top-14">
            <div className="flex items-center mb-4">
              <div className="w-52 h-20 bg-black text-white p-2 uppercase font-semibold text-sm flex flex-col items-start justify-between">
                {primaryRace}
                <p className="text-xs">Race</p>
              </div>
            </div>

            <div className="flex items-center mb-4">
              <div className="w-52 h-20 bg-gray-200 border-2 border-gray-200 border-t-black p-2 uppercase font-semibold text-sm flex flex-col items-start justify-between">
                {primaryAge}
                <p className="text-xs">Age</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-52 h-20 bg-gray-200 border-2 border-gray-200 border-t-black p-2 uppercase font-semibold text-sm flex flex-col items-start justify-between">
                {primaryGender}
                <p className="text-xs">Sex</p>
              </div>
            </div>
          </div>

          {/* Right Side - Confidence Circle and Race List */}
          <div className="flex items-center">
            {/* Confidence Circle Container */}
            <div className="relative bg-gray-200 border-t-black border-2 border-gray-200 w-[915px] h-[450px] mr-3">
              <div className="absolute top-4 left-4 text-2xl">{primaryRace}</div>
              <div className="absolute bottom-4 right-4 w-80 h-80 border-2 border-black rounded-full flex items-center justify-center">
                <p className="text-4xl font-bold">{primaryConfidence}%</p>
              </div>
            </div>

            {/* Race List */}
            <div className="w-80 h-[450px] bg-gray-200 border-2 border-gray-200 border-t-black p-4">
              <div className="flex justify-between mb-4">
                <p className="text-sm font-bold uppercase">Race</p>
                <p className="text-sm font-bold uppercase">A. I. Confidence</p>
              </div>
              {sortedRaces.length > 0 ? (
                sortedRaces.map(({ race, confidence }) => (
                  <div key={race} className="flex justify-between items-center py-2">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-black rotate-45 mr-2"></div>
                      <p className="text-sm">{race}</p>
                    </div>
                    <p className="text-sm">{confidence}%</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No race data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center py-4">
          <div onClick={() => router.back()} className="flex items-center cursor-pointer">
            <Image src="/backbutton.svg" alt="Back" width={100} height={100} />
          </div>

          <p className="text-xs opacity-70">If A.I. estimate is wrong, select the correct one.</p>

          <div className="flex space-x-4">
            <button 
              onClick={handleReset}
              className="border border-black px-6 py-2 uppercase font-semibold text-sm hover:bg-gray-100"
            >
              Reset
            </button>
            <button 
              onClick={handleConfirm}
              className="bg-black text-white px-6 py-2 uppercase font-semibold text-sm hover:bg-gray-800"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}