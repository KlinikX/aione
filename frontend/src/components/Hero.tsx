'use client'
// 'use client';

// import ArroWIcon from "../assets/icons/arrow-w.svg";
// import cursorImage from "../assets/images/cursor.png";
// import messageImage from "../assets/images/message.png";
// import Image from "next/image";
// import {motion} from "framer-motion";

// export const Hero = () => {
//   return (
//     <div className="bg-black text-white bg-[linear-gradient(to_bottom,#000,#200D42_34%,#4F21A1_65%,#A46EDB_82%)] py-[72px] sm:py-24 relative overflow-clip">
//       <div className="absolute h-[375px] w-[750px] sm:w-[1536px] sm:h-[768px] lg:w-[2900px] lg:h-[1200px] rounded-[100%] bg-black left-1/2 -translate-x-1/2 border-[#B48CDE] bg-[radial-gradient(closest-side,#000_82%,#9560EB)] top-[calc(100%-96px)] sm:top[calc(100%-120px)]"></div>
//       <div className="container relative">
//         <div className="flex items-center justify-center">
//           <a
//             href="#"
//             className=" inline-flex gap-3 border py-1 px-2 rounded-lg border-white/30 "
//           >
//             <span className="bg-[linear-gradient(to_right,#F87AFF,#FB93D0,#FFDD99,#C3F0B2,#2FD8FE)] text-transparent bg-clip-text [-webkit-background-clip:text">
//               LinkedIn Health? LinkedAI
//             </span>
//             <span className="inline-flex items-center gap-1">
//               <span>Read More</span>
//               <ArroWIcon />
//             </span>
//           </a>
//         </div>
//         <div className="flex justify-center mt-8">
//           <div className="inline-flex relative">
//             <h1 className="text-7xl  font-bold tracking-tighter text-center  inline-flex">
//               Maximize Reach, Minimize Effort:
//               <br /> LinkedAI
//             </h1>
//             <motion.div className="absolute  top-[108px] left-[1000px] hidden sm:inline"
//             drag
//             dragSnapToOrigin>
//             <Image
//               src={cursorImage}
//               alt=""
//               height="200"
//               width="200"
//               className="max-w-none"
//               draggable="false"
//             />
//             </motion.div>
//             <motion.div className="absolute  top-[200px] right-[900px] hidden sm:inline"
//             drag
//             dragSnapToOrigin
//             >
//             <Image
//               src={messageImage}
//               alt=""
//               height="200"
//               width="200"
//               className="max-w-none"
//               draggable="false"
//             />
//             </motion.div>
//           </div>
//         </div>
//         <div className="flex justify-center">
//           <p className="text-center text-xl mt-8 max-w-md">
//             Elevate your LinkedIn health presence with LinkedAI.
//           </p>
//         </div>
//         <div className="flex justify-center mt-8">
//           <button className="bg-white text-black py-3 px-5 rounded-lg font-medium">
//             Get Started
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };






// 'use client';

// import ArroWIcon from "../assets/icons/arrow-w.svg";
// import cursorImage from "../assets/images/cursor.png";
// import messageImage from "../assets/images/message.png";
// import Image from "next/image";
// import { motion, useScroll, useTransform } from "framer-motion";
// import { useRef } from "react";

// export const Hero = () => {
//   const containerRef = useRef(null);

//   // Track scroll progress
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end start"]
//   });

//   // Transform values based on scroll position
//   const yText = useTransform(scrollYProgress, [0, 1], [0, 10]);
//   const yButton = useTransform(scrollYProgress, [0, 1], [0, 10]);
//   const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
//   const scaleImages = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
//   const yImages = useTransform(scrollYProgress, [0, 1], [0, 10]);

//   return (
//     <div 
//       className="bg-black text-white bg-[linear-gradient(to_bottom,#000,#200D42_34%,#4F21A1_65%,#A46EDB_82%)] py-[72px] sm:py-24 relative overflow-clip"
//     >
//       <div className="absolute h-[375px] w-[750px] sm:w-[1536px] sm:h-[768px] lg:w-[2900px] lg:h-[1200px] rounded-[100%] bg-black left-1/2 
//                        -translate-x-1/2 border-[#B48CDE]
//                          bg-[radial-gradient(closest-side,#000_82%,#9560EB)] top-[calc(100%-96px)] sm:top[calc(100%-120px)]"></div>

//       <div 
//         ref={containerRef}
//         className="container relative"
//       >
//         <motion.div 
//           className="flex items-center justify-center"
//           style={{ opacity: opacityText }}
//         >
//           <a
//             href="#"
//             className="inline-flex gap-3 border py-1 px-2 rounded-lg border-white/30"
//           >
//             <span className="bg-[linear-gradient(to_right,#F87AFF,#FB93D0,#FFDD99,#C3F0B2,#2FD8FE)] text-transparent bg-clip-text [-webkit-background-clip:text">
//               LinkedIn Health? LinkedAI
//             </span>
//             <span className="inline-flex items-center gap-1">
//               <span>Read More</span>
//               <ArroWIcon />
//             </span>
//           </a>
//         </motion.div>

//         <div className="flex justify-center mt-8">
//           <div className="inline-flex relative">
//             <motion.h1 
//               className="text-7xl font-bold tracking-tighter text-center inline-flex"
//               style={{ y: yText, opacity: opacityText }}
//             >
//               Maximize Reach, Minimize Effort:
//               <br /> LinkedAI
//             </motion.h1>
//             <motion.div 
//               className="absolute top-[108px] left-[1000px] hidden sm:inline"
//               style={{ y: yImages, scale: scaleImages }}
//               drag
//               dragSnapToOrigin
//             >
//               <Image
//                 src={cursorImage}
//                 alt=""
//                 height="200"
//                 width="200"
//                 className="max-w-none"
//                 draggable="false"
//               />
//             </motion.div>
//             <motion.div 
//               className="absolute top-[200px] right-[900px] hidden sm:inline"
//               style={{ y: yImages, scale: scaleImages }}
//               drag
//               dragSnapToOrigin
//             >
//               <Image
//                 src={messageImage}
//                 alt=""
//                 height="200"
//                 width="200"
//                 className="max-w-none"
//                 draggable="false"
//               />
//             </motion.div>
//           </div>
//         </div>

//         <motion.div 
//           className="flex justify-center"
//           style={{ y: yText, opacity: opacityText }}
//         >
//           <p className="text-center text-xl mt-8 max-w-md">
//             Elevate your LinkedIn health presence with LinkedAI.
//           </p>
//         </motion.div>

//         <motion.div 
//           className="flex justify-center mt-8"
//           style={{ y: yButton }}
//         >
//           <button className="bg-white text-black py-3 px-5 rounded-lg font-medium">
//             Get Started
//           </button>
//         </motion.div>
//       </div>
//     </div>
//   );
// };









// 'use client';

// import ArroWIcon from "../assets/icons/arrow-w.svg";
// import cursorImage from "../assets/images/cursor.png";
// import messageImage from "../assets/images/message.png";
// import Image from "next/image";
// import { motion, useScroll, useTransform } from "framer-motion";
// import { useRef } from "react";

// export const Hero = () => {
//   const containerRef = useRef(null);

//   // Track scroll progress
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end start"]
//   });

//   // Transform values based on scroll position
//   const yText = useTransform(scrollYProgress, [0, 1], [0, 10]);
//   const yButton = useTransform(scrollYProgress, [0, 1], [0, 10]);
//   const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
//   const scaleImages = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
//   const yImages = useTransform(scrollYProgress, [0, 1], [0, 10]);
//   // New transforms for the background circle
//   const yCircle = useTransform(scrollYProgress, [0, 1], [0, -50]); // Moves up 200px
//   const scaleCircle = useTransform(scrollYProgress, [0, 1], [1, 2.2]); // Scales up to 120%

//   return (
//     <div 
//       className="bg-black text-white bg-[linear-gradient(to_bottom,#000,#200D42_34%,#4F21A1_65%,#A46EDB_82%)] py-[72px] sm:py-24 relative overflow-clip"
//     >
//       <motion.div 
//         className="absolute h-[375px] w-[750px] sm:w-[1536px] sm:h-[768px] lg:w-[2900px] lg:h-[1200px] rounded-[100%] bg-black left-1/2 -translate-x-1/2 border-[#B48CDE] bg-[radial-gradient(closest-side,#000_52%,#9560EB)] top-[calc(100%-96px)] sm:top[calc(100%-120px)]"
//         style={{
//           y: yCircle,
//           scale: scaleCircle
//         }}
//       />

//       <div 
//         ref={containerRef}
//         className="container relative"
//       >
//         <motion.div 
//           className="flex items-center justify-center"
//           style={{ opacity: opacityText }}
//         >
//           <a
//             href="#"
//             className="inline-flex gap-3 border py-1 px-2 rounded-lg border-white/30"
//           >
//             <span className="bg-[linear-gradient(to_right,#F87AFF,#FB93D0,#FFDD99,#C3F0B2,#2FD8FE)] text-transparent bg-clip-text [-webkit-background-clip:text">
//               LinkedIn Health? LinkedAI
//             </span>
//             <span className="inline-flex items-center gap-1">
//               <span>Read More</span>
//               <ArroWIcon />
//             </span>
//           </a>
//         </motion.div>

//         <div className="flex justify-center mt-8">
//           <div className="inline-flex relative">
//             <motion.h1 
//               className="text-7xl font-bold tracking-tighter text-center inline-flex"
//               style={{ y: yText, opacity: opacityText }}
//             >
//               Maximize Reach, Minimize Effort:
//               <br /> LinkedAI
//             </motion.h1>
//             <motion.div 
//               className="absolute top-[108px] left-[1000px] hidden sm:inline"
//               style={{ y: yImages, scale: scaleImages }}
//               drag
//               dragSnapToOrigin
//             >
//               <Image
//                 src={cursorImage}
//                 alt=""
//                 height="200"
//                 width="200"
//                 className="max-w-none"
//                 draggable="false"
//               />
//             </motion.div>
//             <motion.div 
//               className="absolute top-[200px] right-[900px] hidden sm:inline"
//               style={{ y: yImages, scale: scaleImages }}
//               drag
//               dragSnapToOrigin
//             >
//               <Image
//                 src={messageImage}
//                 alt=""
//                 height="200"
//                 width="200"
//                 className="max-w-none"
//                 draggable="false"
//               />
//             </motion.div>
//           </div>
//         </div>

//         <motion.div 
//           className="flex justify-center"
//           style={{ y: yText, opacity: opacityText }}
//         >
//           <p className="text-center text-xl mt-8 max-w-md">
//             Elevate your LinkedIn health presence with LinkedAI.
//           </p>
//         </motion.div>

//         <motion.div 
//           className="flex justify-center mt-8"
//           style={{ y: yButton }}
//         >
//           <button className="bg-white text-black py-3 px-5 rounded-lg font-medium">
//             Get Started
//           </button>
//         </motion.div>
//       </div>
//     </div>
//   );
// };







'use client';

import ArroWIcon from "../assets/icons/arrow-w.svg";
import cursorImage from "../assets/images/cursor.png";
import messageImage from "../assets/images/message.png";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { authentication } from "@/constant/routes";
// Splash cursor is now mounted globally in app/page.tsx

export const Hero = () => {
  const containerRef = useRef(null);
  const router = useRouter();

  // Track scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Transform values based on scroll position
  const yText = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const yButton = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scaleImages = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const yImages = useTransform(scrollYProgress, [0, 1], [0, 10]);
  // Transform for the background circle
  const yCircle = useTransform(scrollYProgress, [0, 1], [0, -400]); // Moves up 200px
  const scaleCircle = useTransform(scrollYProgress, [0, 1], [1, 1.2]); // Scales up to 120%

  const handleGetStarted = () => {
    router.push(authentication); // Navigate to /authentication
  };

  return (
    <div
      className="bg-black text-white 
  bg-[linear-gradient(to_bottom,#000,#200D42_20%,#4F21A1_55%,#A46EDB_90%)] 
  py-[72px] sm:py-24 relative overflow-clip h-[100dvh]"
    >

  {/* SplashCursor overlay moved to app/page.tsx to ensure global coverage */}

      {/* Wrapper div to maintain original positioning */}
  <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%-96px)] sm:top-[calc(100%-120px)] z-0 pointer-events-none">
        <motion.div
          className="h-[375px] w-[750px] sm:w-[1536px] sm:h-[768px] lg:w-[2900px] lg:h-[1200px] rounded-[100%] bg-black border-[#B48CDE] bg-[radial-gradient(closest-side,#000_22%,#9560EB)]"
          style={{
            y: yCircle,
            scale: scaleCircle,
            transformOrigin: "center" // Ensures scaling from center
          }}
        />
      </div>

      <div
        ref={containerRef}
        className="container relative z-[20]"
      >
        <motion.div
          className="flex items-center justify-center"
          style={{ opacity: opacityText }}
        >
          <a
            href="#"
            className="inline-flex gap-3 border py-1 px-2 rounded-lg border-white/30"
          >
            <span className="bg-[linear-gradient(to_right,#F87AFF,#FB93D0,#FFDD99,#C3F0B2,#2FD8FE)] text-transparent bg-clip-text [-webkit-background-clip:text">
              LinkedIn Health? LinkedAI
            </span>
            <span className="inline-flex items-center gap-1">
              <span>Read More</span>
              <ArroWIcon />
            </span>
          </a>
        </motion.div>

        <div className="flex justify-center mt-8">

          <div className="inline-flex relative">
            <motion.h1
              className="text-5xl md:text-7xl font-bold tracking-tighter text-center inline-flex relative"
              style={{ y: yText, opacity: opacityText }}
            >

              Maximize Reach, Minimize Effort:
              <br /> LinkedAI
            </motion.h1>
            <motion.div
              className="absolute z-40 top-[108px] left-[1000px] hidden sm:inline"
              style={{ y: yImages, scale: scaleImages }}
              drag
              dragSnapToOrigin
            >
              <Image
                src={cursorImage}
                alt=""
                height="200"
                width="200"
                className="max-w-none"
                draggable="false"
              />
            </motion.div>
            <motion.div
              className="absolute z-40 top-[200px] right-[900px] hidden sm:inline"
              style={{ y: yImages, scale: scaleImages }}
              drag
              dragSnapToOrigin
            >
              <Image
                src={messageImage}
                alt=""
                height="200"
                width="200"
                className="max-w-none"
                draggable="false"
              />
            </motion.div>
          </div>
        </div>

        <motion.div
          className="flex justify-center"
          style={{ y: yText, opacity: opacityText }}
        >
          <p className="text-center text-lg md:text-xl mt-8 max-w-2xl">
            LinkedAI is your AI-powered assistant for growing a strong, consistent LinkedIn presence in the health sector. Effortlessly create engaging posts, optimize content for your audience, and track performance — all in one intuitive platform.
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center mt-8"
          style={{ y: yButton }}
        >
          <button className="bg-white text-black py-3 px-5 rounded-lg font-medium" onClick={handleGetStarted}>
            Get Started
          </button>
        </motion.div>
      </div>
    </div>
  );
};