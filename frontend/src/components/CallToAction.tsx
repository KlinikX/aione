'use client';

import helixImage from "../assets/images/helix2.png";
import emojiStarImage from "../assets/images/emojistar.png";
import Image from "next/image";
import { useScroll, useTransform, motion } from "framer-motion";
import { useEffect, useRef } from "react";

export const CallToAction = () => {

  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]

  });

  useEffect(() => {
    scrollYProgress.on('change', (value) => console.log('value', value))
  }, [scrollYProgress]);

  const translateY = useTransform(scrollYProgress, [0, 1], [-150, 150]);

  return (
    <div className="relative bg-black text-white py-[72px] sm:py-80 text-center"
      ref={containerRef}>
      <div className="container max-w-xl relative z-[20]">
        <motion.div
          style={{ translateY }}
        >
          <Image
            src={helixImage}
            alt=""
            className="absolute top-6 left-[calc(100%+80px)] hidden sm:inline"
          />
        </motion.div>
        <motion.div
          style={{ translateY }}>
          <Image
            src={emojiStarImage}
            alt=""
            className="absolute -top-[120px] right-[calc(100%+72px)] hidden sm:inline"
          />
        </motion.div>
        <h2 className="font-bold text-3xl tracking-tighter sm:text-4xl ">
          Get early access to powerful AI tools - launching soon.
        </h2>
        <p className=" text-xl text-wite/70 mt-5">
          {" "}
          Enter your email to get latest updates and Special offers.
        </p>
        <form className="mt-10 flex flex-col gap-2.5 max-w-m mx-auto sm:flex-row">
          <input
            type="email"
            placeholder="your@email.com"
            className="h-12 bg-white/20 rounded-lg px-5 font-medium placeholder:text-[#9CA3AF] sm:flex-1"
          />
          <button className="bg-white text-black h-12 rounded-lg px-5  ">
            Stay Updated!
          </button>
        </form>
      </div>
    </div>
  );
};
