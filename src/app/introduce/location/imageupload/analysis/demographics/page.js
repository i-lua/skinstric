"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function DemographicsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dataString = searchParams.get("data");
  const responseData = dataString ? JSON.parse(dataString) : null;

  const analysisData = responseData?.data;

  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("race");

  useEffect(() => {
    if (analysisData) {
      const races = analysisData.race || {};
      const primaryRaceKey = Object.keys(races).reduce((a, b) => (races[a] > races[b] ? a : b), "unknown");
      const aiPredictedRace = primaryRaceKey
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      const aiPredictedRaceConfidence = Math.round((races[primaryRaceKey] || 0) * 100);

      const ages = analysisData.age || {};
      const primaryAgeKey = Object.keys(ages).reduce((a, b) => (ages[a] > ages[b] ? a : b), "Unknown");
      const aiPredictedAge = primaryAgeKey;
      const aiPredictedAgeConfidence = Math.round((ages[primaryAgeKey] || 0) * 100);

      const genderData = analysisData.gender || {};
      const primaryGenderKey = Object.keys(genderData).reduce((a, b) => (genderData[a] > genderData[b] ? a : b), "unknown");
      const aiPredictedGender = primaryGenderKey.charAt(0).toUpperCase() + primaryGenderKey.slice(1);
      const aiPredictedGenderConfidence = Math.round((genderData[primaryGenderKey] || 0) * 100);

      if (!selectedRace) setSelectedRace({ race: aiPredictedRace, confidence: aiPredictedRaceConfidence });
      if (!selectedAge) setSelectedAge({ age: aiPredictedAge, confidence: aiPredictedAgeConfidence });
      if (!selectedGender) setSelectedGender({ gender: aiPredictedGender, confidence: aiPredictedGenderConfidence });
    }
  }, [analysisData, selectedRace, selectedAge, selectedGender]);

  if (!analysisData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-[#1A1B1C] font-roobert">
        <p className="text-lg font-semibold">No analysis data available</p>
        <button
          onClick={() => router.push("/introduce/location/imageupload")}
          className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
        >
          Return to Upload
        </button>
      </div>
    );
  }

  const races = analysisData.race || {};
  const primaryRaceKey = Object.keys(races).reduce((a, b) => (races[a] > races[b] ? a : b), "unknown");
  const aiPredictedRace = primaryRaceKey
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const aiPredictedRaceConfidence = Math.round((races[primaryRaceKey] || 0) * 100);

  const sortedRaces = Object.entries(races)
    .sort(([, a], [, b]) => b - a)
    .map(([race, confidence]) => ({
      race: race
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      confidence: Math.round(confidence * 100),
    }));

  const ages = analysisData.age || {};
  const primaryAgeKey = Object.keys(ages).reduce((a, b) => (ages[a] > ages[b] ? a : b), "Unknown");
  const aiPredictedAge = primaryAgeKey;
  const aiPredictedAgeConfidence = Math.round((ages[primaryAgeKey] || 0) * 100);

  const sortedAges = Object.entries(ages)
    .sort(([, a], [, b]) => b - a)
    .map(([age, confidence]) => ({
      age,
      confidence: Math.round(confidence * 100),
    }));

  const genderData = analysisData.gender || {};
  const primaryGenderKey = Object.keys(genderData).reduce((a, b) => (genderData[a] > genderData[b] ? a : b), "unknown");
  const aiPredictedGender = primaryGenderKey.charAt(0).toUpperCase() + primaryGenderKey.slice(1);
  const aiPredictedGenderConfidence = Math.round((genderData[primaryGenderKey] || 0) * 100);

  const sortedGenders = Object.entries(genderData)
    .sort(([, a], [, b]) => b - a)
    .map(([gender, confidence]) => ({
      gender: gender.charAt(0).toUpperCase() + gender.slice(1),
      confidence: Math.round(confidence * 100),
    }));

  const displayedRace = selectedRace ? selectedRace.race : aiPredictedRace;
  const displayedAge = selectedAge ? selectedAge.age : aiPredictedAge;
  const displayedGender = selectedGender ? selectedGender.gender : aiPredictedGender;

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

  const handleBack = () => {
    router.back();
    setTimeout(() => {
      if (window.history.length <= 1) {
        router.push("/introduce/location/imageupload/analysis");
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1A1B1C] font-roobert">
      {/* Top Bar */}
      <div className="w-full border-t-2 border-purple-500 flex justify-between p-4 fixed top-0 left-0 z-10 bg-white">
        <div>
          <span className="text-xs tracking-widest uppercase font-semibold">Skinstric</span>
          <span className="text-xs font-semibold uppercase opacity-60 ml-3">[ Analysis ]</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 pt-16 px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <p className="text-xs md:text-sm font-semibold uppercase">A. I. Analysis</p>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-normal uppercase mt-2">Demographics</h1>
          <p className="text-xs md:text-sm font-normal uppercase opacity-70">Predicted Race & Age</p>
        </div>

        {/* Main Data Display */}
        <div className="flex flex-col md:flex-row flex-1 gap-4 md:gap-6">
          {/* Left Side - Primary Prediction */}
          <div className="flex flex-col space-y-4 md:w-1/4 lg:w-1/6">
            <div
              className={`w-full max-w-[13rem] h-20 border-2 border-gray-200 border-t-black p-2 uppercase font-semibold text-sm flex flex-col items-start justify-between cursor-pointer transition-colors ${
                selectedCategory === "race" ? "bg-black text-white" : "bg-gray-200 text-black hover:bg-gray-400"
              }`}
              onClick={() => handleCategorySelect("race")}
            >
              {displayedRace}
              <p className="text-xs">Race</p>
            </div>
            <div
              className={`w-full max-w-[13rem] h-20 border-2 border-gray-200 border-t-black p-2 uppercase font-semibold text-sm flex flex-col items-start justify-between cursor-pointer transition-colors ${
                selectedCategory === "age" ? "bg-black text-white" : "bg-gray-200 text-black hover:bg-gray-400"
              }`}
              onClick={() => handleCategorySelect("age")}
            >
              {displayedAge}
              <p className="text-xs">Age</p>
            </div>
            <div
              className={`w-full max-w-[13rem] h-20 border-2 border-gray-200 border-t-black p-2 uppercase font-semibold text-sm flex flex-col items-start justify-between cursor-pointer transition-colors ${
                selectedCategory === "sex" ? "bg-black text-white" : "bg-gray-200 text-black hover:bg-gray-400"
              }`}
              onClick={() => handleCategorySelect("sex")}
            >
              {displayedGender}
              <p className="text-xs">Sex</p>
            </div>
          </div>

          {/* Right Side - Confidence Circle and Dynamic List */}
          <div className="flex flex-col md:flex-row flex-1 gap-4 md:gap-6">
            {/* Confidence Circle Container */}
            <div className="relative bg-gray-200 border-t-black border-2 border-gray-200 w-full md:w-2/3 h-[300px] md:h-[400px] lg:h-[450px] flex flex-col justify-between p-4">
              <div className="text-lg md:text-2xl">{displayedLabel}</div>
              <div className="self-end w-40 h-40 md:w-64 md:h-64 lg:w-80 lg:h-80 border-2 border-black rounded-full flex items-center justify-center">
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold">{displayedConfidence}%</p>
              </div>
            </div>

            {/* Dynamic List */}
            <div className="w-full md:w-1/3 lg:w-80 h-[300px] md:h-[400px] lg:h-[450px] bg-gray-200 border-2 border-gray-200 border-t-black overflow-y-auto">
              {selectedCategory === "race" && (
                <>
                  <div className="flex justify-between mb-4 px-4 pt-4 sticky top-0 bg-gray-200">
                    <p className="text-xs md:text-sm font-bold uppercase">Race</p>
                    <p className="text-xs md:text-sm font-bold uppercase">A. I. Confidence</p>
                  </div>
                  {sortedRaces.length > 0 ? (
                    sortedRaces.map(({ race, confidence }) => (
                      <div
                        key={race}
                        className={`flex justify-between items-center py-2 px-4 cursor-pointer transition-colors ${
                          selectedRace && selectedRace.race === race ? "bg-black text-white hover:bg-gray-800" : "hover:bg-gray-300"
                        }`}
                        onClick={() => handleRaceSelect(race, confidence)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 border-[1px] rotate-45 mr-2 ${
                              selectedRace && selectedRace.race === race ? "border-white bg-white" : "border-black"
                            }`}
                          ></div>
                          <p className="text-xs md:text-sm">{race}</p>
                        </div>
                        <p className="text-xs md:text-sm">{confidence}%</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs md:text-sm text-gray-500 px-4">No race data available</p>
                  )}
                </>
              )}
              {selectedCategory === "age" && (
                <>
                  <div className="flex justify-between mb-4 px-4 pt-4 sticky top-0 bg-gray-200">
                    <p className="text-xs md:text-sm font-bold uppercase">Age</p>
                    <p className="text-xs md:text-sm font-bold uppercase">A. I. Confidence</p>
                  </div>
                  {sortedAges.length > 0 ? (
                    sortedAges.map(({ age, confidence }) => (
                      <div
                        key={age}
                        className={`flex justify-between items-center py-2 px-4 cursor-pointer transition-colors ${
                          selectedAge && selectedAge.age === age ? "bg-black text-white hover:bg-gray-800" : "hover:bg-gray-300"
                        }`}
                        onClick={() => handleAgeSelect(age, confidence)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 border-[1px] rotate-45 mr-2 ${
                              selectedAge && selectedAge.age === age ? "border-white bg-white" : "border-black"
                            }`}
                          ></div>
                          <p className="text-xs md:text-sm">{age}</p>
                        </div>
                        <p className="text-xs md:text-sm">{confidence}%</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs md:text-sm text-gray-500 px-4">No age data available</p>
                  )}
                </>
              )}
              {selectedCategory === "sex" && (
                <>
                  <div className="flex justify-between mb-4 px-4 pt-4 sticky top-0 bg-gray-200">
                    <p className="text-xs md:text-sm font-bold uppercase">Sex</p>
                    <p className="text-xs md:text-sm font-bold uppercase">A. I. Confidence</p>
                  </div>
                  {sortedGenders.length > 0 ? (
                    sortedGenders.map(({ gender, confidence }) => (
                      <div
                        key={gender}
                        className={`flex justify-between items-center py-2 px-4 cursor-pointer transition-colors ${
                          selectedGender && selectedGender.gender === gender ? "bg-black text-white hover:bg-gray-800" : "hover:bg-gray-300"
                        }`}
                        onClick={() => handleGenderSelect(gender, confidence)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 border-[1px] rotate-45 mr-2 ${
                              selectedGender && selectedGender.gender === gender ? "border-white bg-white" : "border-black"
                            }`}
                          ></div>
                          <p className="text-xs md:text-sm">{gender}</p>
                        </div>
                        <p className="text-xs md:text-sm">{confidence}%</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs md:text-sm text-gray-500 px-4">No gender data available</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center py-4">
          <button onClick={handleBack} className="flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer">
            <Image src="/backbutton.svg" alt="Back" width={100} height={100} className="select-none" />
          </button>
          <p className="text-xs opacity-70 text-center md:text-left my-2 md:my-0">
            If A.I. estimate is wrong, select the correct one.
          </p>
          <div className="w-[75px] md:w-auto"></div> {/* Spacer */}
        </div>
      </div>
    </div>
  );
}