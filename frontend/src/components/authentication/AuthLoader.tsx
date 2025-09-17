'use client';
import Lottie from "lottie-react";
import animationData from "@/animations/login_loader.json";

const AuthLoader = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <Lottie animationData={animationData} loop autoplay />
    </div>
  );
};

export default AuthLoader;
