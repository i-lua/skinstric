import Link from "next/link";

export default function Home() {
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
        <button className="bg-[#1A1B1C] text-white px-4 py-2 text-xs uppercase">
          Enter Code
        </button>
      </div>

      {/* Centered Heading */}
      <h1 className="text-8xl font-light max-w-2xl text-center leading-[1.2]">
        Sophisticated skincare
      </h1>

      {/* Left Navigation */}
      <div className="absolute border-2 border-dotted border-[#A0A4AB] -left-72 h-[450px] w-[450px] rotate-45">
        <div className="absolute right-4 bottom-[350px] transform translate-y-1/2 flex justify-evenly w-40 items-center -rotate-45">
          <div className="border border-[#1A1B1C] w-10 h-10 flex items-center justify-center rotate-45">
            <span className="-rotate-45">◀</span>
          </div>
          <p className="text-xs uppercase font-semibold ml-3 opacity-70">
            Discover A.I.
          </p>
        </div>
      </div>

      {/* Right Navigation */}
      <Link
        href="/introduce/"
        className="absolute border-2 border-dotted border-[#A0A4AB] -right-72 h-[450px] w-[450px] rotate-45"
      >
        <div className="absolute left-4 top-[350px] transform -translate-y-1/2 flex justify-evenly w-40 items-center -rotate-45">
          <p className="text-xs uppercase font-semibold mr-3 opacity-70">
            Take Test
          </p>
          <div className="border border-[#1A1B1C] w-10 h-10 flex items-center justify-center rotate-45">
            <span className="-rotate-45">▶</span>
          </div>
        </div>
      </Link>

      {/* Bottom Left Description */}
      <div className="absolute bottom-4 left-10 max-w-xs text-xs text-[#1A1B1C] font-normal leading-[2]">
        SKINSTRIC DEVELOPED AN A.I. THAT CREATES A HIGHLY-PERSONALIZED ROUTINE
        TAILORED TO WHAT YOUR SKIN NEEDS.
      </div>
    </div>
  );
}
