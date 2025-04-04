"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UploadOrCapturePhoto() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const base64 = await convertToBase64(file);

      const response = await fetch(
        "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64 }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setLoading(false);

      // Modified routing approach
      const queryString = new URLSearchParams({
        data: JSON.stringify(data),
      }).toString();

      router.push(`/introduce/location/imageupload/analysis?${queryString}`);
    } catch (error) {
      console.error("Error processing image upload:", error);
      setLoading(false);
      alert("Failed to process image. Please try again.");
    }
  };

  const handleOpenCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = document.createElement("video");
      videoElement.srcObject = stream;
      videoElement.play();

      // Style the video to cover the screen
      videoElement.style.position = "fixed";
      videoElement.style.top = "0";
      videoElement.style.left = "0";
      videoElement.style.width = `${window.innerWidth}px`;
      videoElement.style.height = `${window.innerHeight}px`;
      videoElement.style.objectFit = "cover";
      videoElement.style.zIndex = "1000";

      // back button
      const backButton = document.createElement("img");
      backButton.src = "/backbutton.svg";
      backButton.style.position = "absolute";
      backButton.style.bottom = "20px";
      backButton.style.left = "20px";
      backButton.style.width = "100px";
      backButton.style.height = "100px";
      backButton.style.cursor = "pointer";
      backButton.style.zIndex = "1001";
      backButton.style.filter = "invert(1)";
      backButton.style.transition = "transform 0.5s ease-in-out";

      backButton.addEventListener("mouseenter", () => {
        backButton.style.transform = "scale(1.1)";
      });
      backButton.addEventListener("mouseleave", () => {
        backButton.style.transform = "scale(1)";
      });

      // Close the camera when back button is clicked
      backButton.addEventListener("click", () => {
        stream.getTracks().forEach((track) => track.stop());
        document.body.removeChild(videoElement);
        document.body.removeChild(backButton);
        document.body.removeChild(cameraButton);
      });

      // Create camera button
      const cameraButton = document.createElement("img");
      cameraButton.src = "/takepic.svg";
      cameraButton.style.position = "absolute";
      cameraButton.style.top = "50%";
      cameraButton.style.right = "20px";
      cameraButton.style.transform = "translateY(-50%)";
      cameraButton.style.width = "140px";
      cameraButton.style.height = "140px";
      cameraButton.style.cursor = "pointer";
      cameraButton.style.zIndex = "1001";
      cameraButton.style.transition = "opactiy 1s ease-in-out";

      cameraButton.addEventListener("mouseenter", () => {
        cameraButton.style.opacity = ".5";
      });
      cameraButton.addEventListener("mouseleave", () => {
        cameraButton.style.opacity = "1";
      });

      // Capture image when camera button is clicked
      cameraButton.addEventListener("click", () => {
        const canvas = document.createElement("canvas");
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        canvas.getContext("2d").drawImage(videoElement, 0, 0);
        const base64 = canvas.toDataURL("image/jpeg").split(",")[1];

        stream.getTracks().forEach((track) => track.stop());
        document.body.removeChild(videoElement);
        document.body.removeChild(backButton);
        document.body.removeChild(cameraButton);

        handleCameraImage(base64);
      });

      // Append elements to the document
      document.body.appendChild(videoElement);
      document.body.appendChild(backButton);
      document.body.appendChild(cameraButton);
    } catch (error) {
      console.error("Camera access error:", error);
      alert("Unable to access camera. Please ensure permissions are granted.");
    }
  };

  const handleCameraImage = async (base64) => {
    setLoading(true);

    try {
      const response = await fetch(
        "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64 }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setLoading(false);

      const queryString = new URLSearchParams({
        data: JSON.stringify(data),
      }).toString();

      router.push(`/introduce/location/imageupload/analysis?${queryString}`);
    } catch (error) {
      console.error("Error processing camera image:", error);
      setLoading(false);
      alert("Failed to process camera image. Please try again.");
    }
  };

  return (
    <div
      className="relative h-screen flex flex-col items-center justify-center bg-white text-[#1A1B1C]"
      style={{ fontFamily: "Roobert Trial, sans-serif" }}
    >
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
          <div className="relative flex flex-col items-center justify-center">
            <div className="absolute border-2 border-dotted border-[#A0A4AB] h-[400px] w-[400px] rotate-[35deg] animate-spin opacity-15"></div>
            <div className="absolute border-2 border-dotted border-[#A0A4AB] h-[350px] w-[350px] rotate-45 animate-spin opacity-40"></div>
            <div className="absolute border-2 border-dotted border-[#A0A4AB] h-[300px] w-[300px] -rotate-[35deg] animate-spin opacity-70"></div>
          </div>
          <p className="text-md font-semibold tracking-wider">
            PREPARING YOUR ANALYSIS...
          </p>
        </div>
      )}

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

      <div className="absolute top-24 left-4">
        <p className="text-xs font-semibold uppercase">To Start Analysis</p>
      </div>

      <div className="relative flex w-full justify-around">
        <div
          onClick={handleOpenCamera}
          className="relative flex items-center justify-center cursor-pointer"
        >
          <div className="bg-white p-3 rounded-full flex items-center justify-center transform transition-transform duration-500 hover:scale-110">
            <Image src="/camera.svg" alt="Camera" width={500} height={460} />
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-center cursor-pointer">
          <label
            htmlFor="upload"
            className="bg-white p-3 rounded-full cursor-pointer flex items-center justify-center transform transition-transform duration-500 hover:scale-110"
          >
            <Image
              src="/gallery.svg"
              alt="Upload Image"
              width={480}
              height={440}
            />
          </label>
          <input
            type="file"
            id="upload"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      <div
        onClick={() => router.back()}
        className="absolute bottom-10 left-10 flex items-center space-x-2 cursor-pointer hover:opacity-80"
      >
        <div className="flex items-center justify-center transform transition-transform duration-500 hover:scale-110">
          <Image src="/backbutton.svg" alt="back" width={100} height={100} />
        </div>
      </div>
    </div>
  );
}
