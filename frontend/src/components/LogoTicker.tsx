'use client';

import acmeLogo from "../assets/images/acme.png";
import quantumLogo from "../assets/images/quantum.png";
import echoLogo from "../assets/images/echo.png";
import celestialLogo from "../assets/images/celestial.png";
import pulseLogo from "../assets/images/pulse.png";
import apexLogo from "../assets/images/apex.png";
import Image from "next/image";
import { motion } from 'framer-motion';

const images = [
  { src: acmeLogo, alt: "Acme Logo" },
  { src: quantumLogo, alt: "Quantum Logo" },
  { src: echoLogo, alt: "Echo Logo" },
  { src: celestialLogo, alt: "Celestial Logo" },
  { src: pulseLogo, alt: "Pulse Logo" },
  { src: apexLogo, alt: "Apex Logo" },
];

export const LogoTicker = () => {
  return (
  <div className="relative text-white py-8 sm:py-20 overflow-hidden bg-gradient-to-b from-[#5D2CA8] via-[#4F21A1] to-black w-full">
      {/* Gradient Background */}
      <div
    className="absolute inset-0 w-full h-full z-[12] rotate-180 
          bg-[linear-gradient(to_top,#0e1111_0%,#200D42_10%,#4F21A1_65%,#000000_100%)]
          pointer-events-none opacity-80"
      />

      {/* Smooth transition gradient at the top */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#5D2CA8] to-transparent z-[1] pointer-events-none"></div>

  {/* Circular Background (hidden on mobile) */}
  <div className="absolute inset-0 hidden sm:flex items-center justify-center z-[2] pointer-events-none">
        <div className="h-[250px] w-[500px] sm:w-[1536px] sm:h-[768px] lg:w-[0px] lg:h-[0px] rounded-[100%] bg-black border-[#B48CDE] bg-[radial-gradient(closest-side,#000_22%,#9560EB)]" />
      </div>

  <div className="container relative z-[20]">
        {/* Heading */}
        <h2 className="text-xl sm:text-2xl text-center text-white-70 mb-2 sm:mb-8">
          Trusted by the World's most reputable health professionals
        </h2>

        {/* Logo Ticker */}
        <div
          className="flex overflow-hidden mt-4 sm:mt-9 relative 
            before:content-[''] before:z-10 after:content-[''] before:absolute after:absolute 
            before:h-full after:h-full before:w-5 after:w-20 before:left-0 after:right-0 
            before:top-0 after:top-0 after:bg-[linear-gradient(to_left,#000,rgb(0,0,0,0))]"
        >
          <motion.div
            transition={{
              duration: 30,
              ease: "linear",
              repeat: Infinity,
            }}
            initial={{ translateX: 0 }}
            animate={{ translateX: "-50%" }}
            className="flex gap-16 flex-none pr-16"
          >
            {images.map(({ src, alt }) => (
              <Image
                key={alt}
                src={src}
                alt={alt}
                className="flex-none h-8 w-auto"
              />
            ))}
            {images.map(({ src, alt }) => (
              <Image
                key={`${alt}-duplicate`}
                src={src}
                alt={alt}
                className="flex-none h-8 w-auto"
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
