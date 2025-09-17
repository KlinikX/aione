import Image from "next/image";
import Link from "next/link";
import AuthForm from "@/components/authentication/AuthForm";
import logoImage from "@/assets/images/logosaas.png";
import { ArrowLeft } from "lucide-react";

const AuthenticationPage = () => {
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side with logo and description */}
      <div className="relative w-full flex flex-col bg-gradient-to-b from-black to-[#5D2CA8] p-6 md:p-10 text-primary-foreground">
        {/* Logo + Title Row */}
        <div className="flex items-center space-x-3">
          <Image
            src={logoImage}
            alt="login Image"
            className="w-8 h-8 md:w-10 md:h-10"
          />
          <Link href="/">
            <h2 className="text-2xl md:text-3xl font-semibold cursor-pointer hover:underline">
              Linked AI
            </h2>
          </Link>
        </div>

        {/* Spacer  */}
        <div className="flex-1" />

        {/* Quote */}
        <div className="relative z-20 mt-8 md:mt-auto">
          <blockquote className="space-y-2">
            <p className="text-base md:text-lg leading-relaxed">
              &ldquo;Our SaaS lets AI flex its health-content muscles, cooking
              up seriously smart tips with a goofy twist, then yeets them onto
              LinkedIn faster than you can say 'kale smoothie'—all hands-free,
              because your wellness vibe’s too cool to sweat the small
              stuff!&rdquo;
            </p>
            <footer className="text-xs md:text-sm">- Elon</footer>
          </blockquote>
        </div>
      </div>

      {/* Right side Auth form */}
      <div className="relative flex flex-col items-center justify-center p-6 md:p-8 h-full border-t md:border-t-0 md:border-l border-primary">
        {/* Mobile Back Button */}
        <Link
          href="/"
          className="md:hidden absolute top-4 left-4 flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </Link>

        <div className="w-full max-w-sm md:max-w-xl">
          <AuthForm />
        </div>
      </div>
    </main>
  );
};

export default AuthenticationPage;
