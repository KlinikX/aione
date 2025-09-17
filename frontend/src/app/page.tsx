import { Banner } from "@/components/Banner";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { LogoTicker } from "@/components/LogoTicker";
import { Features } from "@/components/Features";
import { ProductShowcase } from "@/components/ProductShowcase";
import { FAQs } from "@/components/FAQs";
import { CallToAction } from "@/components/CallToAction";
import Footer from "@/components/Footer";
import SummarySection from "@/components/SummarySection";
import PlansSection from "@/components/PlansSection";
import ContentWorkflow from "@/components/ContentWorkFlow";
import SplashCursor from "@/components/SplashLoader";

export default function Home() {
  return (
    <main className="relative">
      {/* Global splash cursor overlay: sits above backgrounds (z-10) and below all content (z-[15]) */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <SplashCursor
          TRANSPARENT={true}
          BACK_COLOR={{ r: 128, g: 0, b: 128 }}
          SHADING={true}
          COLOR_UPDATE_SPEED={0}
          SPLAT_FORCE={3000}
          DYE_RESOLUTION={512}
        />
      </div>
      <Banner />
      <Navbar />
      <Hero />
      <ProductShowcase />
      <LogoTicker />
      <Features />
      <ContentWorkflow />
      <FAQs />
      <PlansSection />
      <SummarySection />
      <CallToAction />
      <Footer />
    </main>
  );
}
