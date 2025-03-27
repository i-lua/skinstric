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

  // State for user-selected race, age, and gender, initialized with default values
  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);

  // State for the currently selected category (race, age, or sex)
  const [selectedCategory, setSelectedCategory] = useState("race");

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

  // Extract primary race and confidence (AI-predicted)
  const races = analysisData.race || {};
  const primaryRaceKey = Object.keys(races).reduce((a, b) => races[a] > races[b] ? a : b, "unknown");
  const aiPredictedRace = primaryRaceKey
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const aiPredictedRaceConfidence = Math.round((races[primaryRaceKey] || 0) * 100);

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

  // Extract primary age range and confidence (AI-predicted)
  const ages = analysisData.age || {};
  const primaryAgeKey = Object.keys(ages).reduce((a, b) => ages[a] > ages[b] ? a : b, "Unknown");
  const aiPredictedAge = primaryAgeKey;
  const aiPredictedAgeConfidence = Math.round((ages[primaryAgeKey] || 0) * 100);

  // Sort ages by confidence for the list
  const sortedAges = Object.entries(ages)
    .sort(([, a], [, b]) => b - a)
    .map(([age, confidence]) => ({
      age,
      confidence: Math.round(confidence * 100)
    }));

  // Extract primary gender and confidence (AI-predicted)
  const genderData = analysisData.gender || {};
  const primaryGenderKey = Object.keys(genderData).reduce((a, b) => genderData[a] > genderData[b] ? a : b, "unknown");
  const aiPredictedGender = primaryGenderKey.charAt(0).toUpperCase() + primaryGenderKey.slice(1);
  const aiPredictedGenderConfidence = Math.round((genderData[primaryGenderKey] || 0) * 100);

  // Sort genders by confidence for the list
  const sortedGenders = Object.entries(genderData)
    .sort(([, a], [, b]) => b - a)
    .map(([gender, confidence]) => ({
      gender: gender.charAt(0).toUpperCase() + gender.slice(1),
      confidence: Math.round(confidence * 100)
    }));

  // Initialize selected states with AI-predicted values if not already set
  if (!selectedRace) {
    setSelectedRace({ race: aiPredictedRace, confidence: aiPredictedRaceConfidence });
  }
  if (!selectedAge) {
    setSelectedAge({ age: aiPredictedAge, confidence: aiPredictedAgeConfidence });
  }
  if (!selectedGender) {
    setSelectedGender({ gender: aiPredictedGender, confidence: aiPredictedGenderConfidence });
  }

  // Use the selected values if available, otherwise fall back to AI-predicted values
  const displayedRace = selectedRace ? selectedRace.race : aiPredictedRace;
  const displayedAge = selectedAge ? selectedAge.age : aiPredictedAge;
  const displayedGender = selectedGender ? selectedGender.gender : aiPredictedGender;

  // Determine the label and confidence to display in the circle based on the selected category
  let displayedLabel;
  let displayedConfidence;
  switch (selectedCategory) {
    case "race":
      displayedLabel = displayedRace;
      displayedConfidence = selectedRace ? selectedRace.confidence : aiPredictedRaceConfidence;
      break;
    case "age":
      displayedLabel = displayedAge;
      displayedConfidence = selectedAge ? selectedAge.confidence : aiPredictedAgeConfidence;
      break;
    case "sex":
      displayedLabel = displayedGender;
      displayedConfidence = selectedGender ? selectedGender.confidence : aiPredictedGenderConfidence;
      break;
    default:
      displayedLabel = displayedRace;
      displayedConfidence = selectedRace ? selectedRace.confidence : aiPredictedRaceConfidence;
  }

  const handleRaceSelect = (race, confidence) => {
    setSelectedRace({ race, confidence });
  };

  const handleAgeSelect = (age, confidence) => {
    setSelectedAge({ age, confidence });
  };

  const handleGenderSelect = (gender, confidence) => {
    setSelectedGender({ gender, confidence });
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleReset = () => {
    setEditedData(analysisData);
    setSelectedRace({ race: aiPredictedRace, confidence: aiPredictedRaceConfidence });
    setSelectedAge({ age: aiPredictedAge, confidence: aiPredictedAgeConfidence });
    setSelectedGender({ gender: aiPredictedGender, confidence: aiPredictedGenderConfidence });
    setSelectedCategory("race"); // Default back to race category
  };

  const handleConfirm = () => {
    // Optionally, save the selected values (race, age, gender) here before navigating
    router.push("/introduce/location/imageupload/analysis/selection");
  };

  // Handle back button click with a fallback
  const handleBack = () => {
    console.log("Back button clicked"); // Debugging
    // Try to go back in history
    router.back();
    // Fallback: If no history, navigate to the upload page
    setTimeout(() => {
      if (window.history.length <= 1) {
        console.log("No history found, navigating to fallback route");
        router.push("/introduce/location/imageupload");
      }
    }, 100); // Small delay to check if router.back() worked
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
          <div className="relative flex-1 flex flex-col top-[50px]">
            <div className="flex items-center mb-4">
              <div
                className={`w-52 h-20 border-2 border-gray-200 border-t-black p-2 uppercase font-semibold text-sm flex flex-col items-start justify-between cursor-pointer ${
                  selectedCategory === "race" ? "bg-black text-white" : "bg-gray-200 text-black hover:bg-gray-400"
                }`}
                onClick={() => handleCategorySelect("race")}
              >
                {displayedRace}
                <p className="text-xs">Race</p>
              </div>
            </div>

            <div className="flex items-center mb-4">
              <div
                className={`w-52 h-20 border-2 border-gray-200 border-t-black p-2 uppercase font-semibold text-sm flex flex-col items-start justify-between cursor-pointer ${
                  selectedCategory === "age"
                    ? "bg-black text-white"
                    : "bg-gray-200 text-black hover:bg-gray-400"
                }`}
                onClick={() => handleCategorySelect("age")}
              >
                {displayedAge}
                <p className="text-xs">Age</p>
              </div>
            </div>

            <div className="flex items-center">
              <div
                className={`w-52 h-20 border-2 border-gray-200 border-t-black p-2 uppercase font-semibold text-sm flex flex-col items-start justify-between cursor-pointer ${
                  selectedCategory === "sex"
                    ? "bg-black text-white"
                    : "bg-gray-200 text-black hover:bg-gray-400"
                }`}
                onClick={() => handleCategorySelect("sex")}
              >
                {displayedGender}
                <p className="text-xs">Sex</p>
              </div>
            </div>
          </div>

          {/* Right Side - Confidence Circle and Dynamic List */}
          <div className="flex items-center">
            {/* Confidence Circle Container */}
            <div className="relative bg-gray-200 border-t-black border-2 border-gray-200 w-[915px] h-[450px] mr-3">
              <div className="absolute top-4 left-4 text-2xl">{displayedLabel}</div>
              <div className="absolute bottom-4 right-4 w-80 h-80 border-2 border-black rounded-full flex items-center justify-center">
                <p className="text-4xl font-bold">{displayedConfidence}%</p>
              </div>
            </div>

            {/* Dynamic List Based on Selected Category */}
            <div className="w-80 h-[450px] bg-gray-200 border-2 border-gray-200 border-t-black">
              {selectedCategory === "race" && (
                <>
                  <div className="flex justify-between mb-4">
                    <p className="text-sm font-bold uppercase pr-4 pl-4 pt-4">Race</p>
                    <p className="text-sm font-bold uppercase pr-4 pl-4 pt-4">A. I. Confidence</p>
                  </div>
                  {sortedRaces.length > 0 ? (
                    sortedRaces.map(({ race, confidence }) => (
                      <div
                        key={race}
                        className={`flex justify-between items-center py-2 px-4 cursor-pointer ${
                          selectedRace && selectedRace.race === race
                            ? "bg-black text-white hover:bg-gray-800"
                            : "hover:bg-gray-300"
                        }`}
                        onClick={() => handleRaceSelect(race, confidence)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 border-[1px] rotate-45 mr-2 ${
                              selectedRace && selectedRace.race === race
                                ? "border-white bg-white"
                                : "border-black"
                            }`}
                          ></div>
                          <p className="text-sm">{race}</p>
                        </div>
                        <p className="text-sm">{confidence}%</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 px-4">No race data available</p>
                  )}
                </>
              )}

              {selectedCategory === "age" && (
                <>
                  <div className="flex justify-between mb-4">
                    <p className="text-sm font-bold uppercase pr-4 pl-4 pt-4">Age</p>
                    <p className="text-sm font-bold uppercase pr-4 pl-4 pt-4">A. I. Confidence</p>
                  </div>
                  {sortedAges.length > 0 ? (
                    sortedAges.map(({ age, confidence }) => (
                      <div
                        key={age}
                        className={`flex justify-between items-center py-2 px-4 cursor-pointer ${
                          selectedAge && selectedAge.age === age
                            ? "bg-black text-white hover:bg-gray-800"
                            : "hover:bg-gray-300"
                        }`}
                        onClick={() => handleAgeSelect(age, confidence)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 border-[1px] rotate-45 mr-2 ${
                              selectedAge && selectedAge.age === age
                                ? "border-white bg-white"
                                : "border-black"
                            }`}
                          ></div>
                          <p className="text-sm">{age}</p>
                        </div>
                        <p className="text-sm">{confidence}%</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 px-4">No age data available</p>
                  )}
                </>
              )}

              {selectedCategory === "sex" && (
                <>
                  <div className="flex justify-between mb-4">
                    <p className="text-sm font-bold uppercase pr-4 pl-4 pt-4">Sex</p>
                    <p className="text-sm font-bold uppercase pr-4 pl-4 pt-4">A. I. Confidence</p>
                  </div>
                  {sortedGenders.length > 0 ? (
                    sortedGenders.map(({ gender, confidence }) => (
                      <div
                        key={gender}
                        className={`flex justify-between items-center py-2 px-4 cursor-pointer ${
                          selectedGender && selectedGender.gender === gender
                            ? "bg-black text-white hover:bg-gray-800"
                            : "hover:bg-gray-300"
                        }`}
                        onClick={() => handleGenderSelect(gender, confidence)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 border-[1px] rotate-45 mr-2 ${
                              selectedGender && selectedGender.gender === gender
                                ? "border-white bg-white"
                                : "border-black"
                            }`}
                          ></div>
                          <p className="text-sm">{gender}</p>
                        </div>
                        <p className="text-sm">{confidence}%</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 px-4">No gender data available</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center py-4">
          <div onClick={handleBack} className="flex items-center cursor-pointer">
            <Image src="/backbutton.svg" alt="Back" width={100} height={100} />
          </div>

          <p className="text-xs opacity-70">If A.I. estimate is wrong, select the correct one.</p>

          <div className="flex space-x-4">
            <button 
              onClick={handleReset}
              className="border border-black px-6 py-2 uppercase font-semibold text-sm hover:bg-gray-100 cursor-pointer"
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