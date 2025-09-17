'use client'

import React, { useRef } from 'react'
import { useRouter } from "next/navigation";
import { useScroll, useTransform } from "framer-motion";
import { authentication } from "@/constant/routes";
import { Check } from 'lucide-react';

const SummarySection = () => {
    const containerRef = useRef(null);
    const router = useRouter();

    // Track scroll progress
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Animations
    const yText = useTransform(scrollYProgress, [0, 1], [0, 10]);
    const yButton = useTransform(scrollYProgress, [0, 1], [0, 10]);
    const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scaleImages = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
    const yImages = useTransform(scrollYProgress, [0, 1], [0, 10]);
    const yCircle = useTransform(scrollYProgress, [0, 1], [0, -400]);
    const scaleCircle = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

    const handleGetStarted = () => {
        router.push(authentication);
    };

    return (
        <div
            className="relative flex justify-center items-center text-white py-16 sm:py-24 md:min-h-screen overflow-hidden"
        >
            {/* Background gradient behind */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,#000,#200D42_34%,#4F21A1_65%,#A46EDB_82%)]" />

            {/* Foreground content */}
            <div
                ref={containerRef}
                className="relative z-[20] container px-4 sm:px-6 lg:px-8"
            >
                {/* Title */}
                <div className="flex justify-center mt-8">
                    <div className="inline-flex w-full md:w-3/4 lg:w-1/2">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center leading-tight">
                            Finally solve your content creation
                            by simply saying what you think.
                        </h1>
                    </div>
                </div>

                {/* Features */}
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-7 mt-6 text-center sm:text-left">
                    <p className="flex items-center gap-2 justify-center sm:justify-start text-base sm:text-lg">
                        <Check className="h-5 w-5 text-green-400 shrink-0" />
                        No Writing Skills Required
                    </p>
                    <p className="flex items-center gap-2 justify-center sm:justify-start text-base sm:text-lg">
                        <Check className="h-5 w-5 text-green-400 shrink-0" />
                        Post Creation in Seconds
                    </p>
                    <p className="flex items-center gap-2 justify-center sm:justify-start text-base sm:text-lg">
                        <Check className="h-5 w-5 text-green-400 shrink-0" />
                        Personalized Strategy
                    </p>
                </div>

                {/* Button */}
                <div className="flex justify-center mt-8">
                    <button
                        className="bg-white text-black py-3 px-6 rounded-lg font-medium text-base sm:text-lg 
                                   hover:bg-gray-100 hover:scale-105 active:scale-95 transition-transform duration-200"
                        onClick={handleGetStarted}
                    >
                        Get Started for Free
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SummarySection;
