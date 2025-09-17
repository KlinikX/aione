import appScreen from "../assets/images/app-screen.png";
import Image from "next/image";
import { TabsDemo } from "./TabsDemo";
import SlideTabs from "./SlideTabs";

export const ProductShowcase = () => {
  return (
    <div className="relative bg-black text-white bg-gradient-to-b from-black to-[#5D2CA8] py-[72px] pb-16 ">
      <div className="container text-center relative z-[20]">
        {/* Heading */}
        <h2 className="text-5xl sm:text-6xl font-bold tracking-tighter cursor-pointer inline-block relative z-[9999]" style={{ zIndex: 9999 }}>
          how it Looks!
        </h2>

        {/* Paragraph is always BELOW heading */}
        <p className="text-xl text-white/70 mt-5 mb-8 relative z-[9999]" style={{ zIndex: 9999 }}>
          Celebrate the joy of accomplishment with an app designed to generate,
          track and outreach your health related Linkedin Post
        </p>

        <div className="mx-auto rounded-md">
          <SlideTabs />
          {/* <TabsDemo/> */}
        </div>

        {/* <Image src={appScreen} alt="product showcase" className="mt-14 mx-auto" /> */}
      </div>
    </div>
  );
};
