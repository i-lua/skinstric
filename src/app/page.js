"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const discoverAIRef = useRef(null);
  const headingRef = useRef(null);
  const extraBoxesRef = useRef(null);
  const takeTestContainerRef = useRef(null);

  useEffect(() => {
    gsap.set(extraBoxesRef.current, { opacity: 0, scale: 0.8 });
  }, []);

  const handleHover = () => {
    const shiftValue = window.innerWidth < 900 ? "-25%" : "-50%";

    gsap.to(discoverAIRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });
    gsap.to(headingRef.current, {
      x: shiftValue,
      duration: 0.8,
      ease: "power2.out",
      onStart: () =>
        headingRef.current.classList.replace("text-center", "text-left"),
    });
    gsap.to(extraBoxesRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const handleHoverOut = () => {
    gsap.to(discoverAIRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    });
    gsap.to(headingRef.current, {
      x: "0%",
      duration: 0.8,
      ease: "power2.in",
      onMouseLeave: () =>
        headingRef.current.classList.replace("text-left", "text-center"),
    });
    gsap.to(extraBoxesRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.6,
      ease: "power2.in",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-[#1A1B1C] font-roobert">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 w-full border-t-2 border-purple-500 flex flex-col sm:flex-row justify-between items-center p-4 z-10 bg-white">
        <div className="mb-2 sm:mb-0">
          <span className="text-xs tracking-widest uppercase font-semibold">
            Skinstric
          </span>
          <span className="text-xs font-semibold uppercase opacity-60 ml-3">
            [ Intro ]
          </span>
        </div>
        <button className="bg-[#1A1B1C] text-white px-4 py-2 text-xs uppercase">
          Enter Code
        </button>
      </div>

      {/* Centered Heading */}
      <h1
        ref={headingRef}
        className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl sm:max-w font-light max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl text-center leading-[1.2] px-4 mt-16 sm:mt-0"
      >
        Sophisticated skincare
      </h1>

      {/* Left Navigation (Desktop) */}
      <div
        ref={discoverAIRef}
        className="hidden md:block absolute border-2 border-dotted border-[#A0A4AB] -left-48 md:-left-64 lg:-left-72 h-72 md:h-[400px] lg:h-[450px] w-72 md:w-[400px] lg:w-[450px] rotate-45"
      >
        <div className="absolute right-2 md:right-4 bottom-14 md:bottom-[300px] lg:bottom-[350px] transform translate-y-1/2 flex justify-evenly w-32 md:w-40 items-center -rotate-45">
          <div className="md:w-10 h-8 md:h-10 flex items-center justify-center"></div>
          <Image
            src="/discoverai.svg"
            alt="Discover A.I."
            width={140}
            height={140}
            className="ml-2 md:ml-3 opacity-70"
          />
        </div>
      </div>

      {/* Right Navigation (Desktop) */}
      <Link
        ref={takeTestContainerRef}
        onMouseEnter={handleHover}
        onMouseLeave={handleHoverOut}
        href="/introduce/"
        className="hidden md:block absolute border-2 border-dotted border-[#A0A4AB] -right-48 md:-right-64 lg:-right-72 h-72 md:h-[400px] lg:h-[450px] w-72 md:w-[400px] lg:w-[450px] rotate-45"
      >
        <div className="absolute left-2 md:left-4 top-14 md:top-[300px] lg:top-[350px] transform -translate-y-1/2 flex justify-evenly w-32 md:w-40 items-center -rotate-45">
          <Image
            src="/taketest.svg"
            alt="Take Test"
            width={140}
            height={140}
            className="mr-2 md:mr-3"
          />
          <div className="md:w-10 h-8 md:h-10 flex items-center justify-center rotate-45"></div>
        </div>
      </Link>

      {/* Additional Gray Boxes */}
      <Link
        href="/introduce/"
        ref={extraBoxesRef}
        onMouseEnter={handleHover}
        onMouseLeave={handleHoverOut}
        className="hidden md:flex absolute cursor-pointer -right-52"
      >
        <div className="w-[400px] h-[400px] border-2 border-dotted border-[#A0A4AB] rotate-45 opacity-50"></div>
        <div className="w-[420px] h-[420px] border-2 border-dotted border-[#A0A4AB] rotate-45 opacity-20 -top-2.5 -left-2 absolute"></div>
      </Link>

      {/* Mobile Navigation */}
      <div className="flex md:hidden justify-between w-full max-w-xs px-4 mt-8 space-x-4">
        <button className="flex items-center justify-center space-x-2 border border-[#1A1B1C] px-4 py-2 text-xs uppercase font-semibold opacity-70">
          <Image
            src="/discoverai.svg"
            alt="Discover A.I."
            width={120}
            height={120}
          />
        </button>
        <Link
          href="/introduce/"
          className="flex items-center justify-center space-x-2 border border-[#1A1B1C] px-4 py-2 text-xs uppercase font-semibold hover:opacity-70"
        >
          <Image src="/taketest.svg" alt="Take Test" width={100} height={100} />
        </Link>
      </div>

      {/* Bottom Left Description */}
      <div className="absolute bottom-4 left-4 md:left-10 max-w-[10rem] sm:max-w-xs text-xs text-[#1A1B1C] font-normal leading-[2] px-2">
        SKINSTRIC DEVELOPED AN A.I. THAT CREATES A HIGHLY-PERSONALIZED ROUTINE
        TAILORED TO WHAT YOUR SKIN NEEDS.
      </div>
    </div>
  );
}
