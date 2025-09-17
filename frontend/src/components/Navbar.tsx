"use client";

import Image from "next/image";
import logoImage from "../assets/images/logosaas.png";
import MenuIcon from "../assets/icons/menu.svg";
import { useRouter } from "next/navigation";
import { authentication } from "@/constant/routes";
import { useState } from "react";
import { X } from "lucide-react";

export const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleGetStarted = () => {
    router.push(authentication);
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-black sticky top-0 z-50">
      <div className="px-4">
        <div className="py-4 px-10 flex items-center justify-between">
          {/* Logo */}
          <div className="relative">
            <div className="absolute w-full top-2 bottom-0 bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] blur-md"></div>
            <Image src={logoImage} alt="Saas logo" className="h-12 w-12 relative" />
          </div>

          {/* Mobile Menu Button */}
          <div className="border border-white border-opacity-30 h-10 w-10 inline-flex justify-center items-center rounded-lg sm:hidden">
            {isMenuOpen ? (
              <X onClick={() => setIsMenuOpen((prev) => !prev)} className="text-white cursor-pointer" />
            ) : (
              <MenuIcon onClick={() => setIsMenuOpen((prev) => !prev)} className="text-white cursor-pointer" />
            )}
          </div>

          {/* Desktop Nav */}
          <nav className="flex gap-6 items-center hidden sm:flex">
            <a 
              href="#pricing" 
              className="text-opacity-60 text-white hover:text-opacity-100 transition"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('pricing')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
            >
              Pricing
            </a>
            <a
              href="/authentication"
              className="text-opacity-60 text-white hover:text-opacity-100 transition"
            >
              Login
            </a>
            <button className="bg-white py-2 px-4 rounded-lg" onClick={handleGetStarted}>
              Get Started
            </button>
          </nav>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="sm:hidden flex flex-col gap-4 py-4 border-t border-white border-opacity-20">
            <a
              href="#pricing"
              className="text-white text-opacity-80 hover:text-opacity-100 transition"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('pricing')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
                setIsMenuOpen(false);
              }}
            >
              Pricing
            </a>
            <a
              href="/authentication"
              className="text-white text-opacity-80 hover:text-opacity-100 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </a>
            <button
              className="bg-white py-2 px-4 rounded-lg w-fit"
              onClick={handleGetStarted}
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
