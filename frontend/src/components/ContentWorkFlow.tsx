"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useRouter } from "next/navigation";
import { authentication } from "@/constant/routes"; // ✅ import same as SummarySection
import dashboardImage from "@/assets/images/dashboard.png"; // ✅ fixed import

export default function ContentWorkflow() {
  const router = useRouter();

  const handleStartCreating = () => {
    router.push(authentication); // ✅ redirect to authentication route
  };

  return (
    <section className="w-full bg-black text-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold mb-4 relative z-[9999]" style={{ zIndex: 9999 }}>
          Supercharge your content creation workflow
        </h2>
        <div className="max-w-2xl mx-auto mb-8 relative z-[9999]">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4">
            <p className="text-gray-300 relative z-[9999]" style={{ zIndex: 9999 }}>
              Scripe has all the features you need to create viral and goal-oriented LinkedIn content,
              no writing skills required. Simpler and faster than ever before.
            </p>
          </div>
        </div>

        {/* CTA */}
        <Button
          size="lg"
          className="mb-12 bg-indigo-600 hover:bg-indigo-700 rounded-full transition-transform hover:scale-105 active:scale-95 relative z-[9999]"
          onClick={handleStartCreating}
          style={{ zIndex: 9999 }}
        >
          Start creating →
        </Button>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left Accordion */}
          <Accordion type="single" collapsible className="w-full text-left space-y-2 relative z-[9999]">
            <AccordionItem value="item-1">
              <AccordionTrigger>Voice to content</AccordionTrigger>
              <AccordionContent>
                Speak your thoughts with Scripe’s Voice-to-Post, or write down your ideas,
                and Scripe will create LinkedIn posts for you. Answer weekly questions for easy content.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="relative z-[9999]">
              <AccordionTrigger className="relative z-[9999]" style={{ zIndex: 9999 }}>Repurpose existing content</AccordionTrigger>
              <AccordionContent className="relative z-[9999]" style={{ zIndex: 9999 }}>
                Reuse your blogs, podcasts, or videos and turn them into fresh LinkedIn posts instantly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="relative z-[9999]">
              <AccordionTrigger className="relative z-[9999]" style={{ zIndex: 9999 }}>Fine-tune your posts</AccordionTrigger>
              <AccordionContent className="relative z-[9999]" style={{ zIndex: 9999 }}>
                Adjust tone, style, and structure to make your posts sound just right.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="relative z-[9999]">
              <AccordionTrigger className="relative z-[9999]" style={{ zIndex: 9999 }}>Posts that sound like you</AccordionTrigger>
              <AccordionContent className="relative z-[9999]" style={{ zIndex: 9999 }}>
                AI learns your unique voice to ensure every post feels authentic.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="relative z-[9999]">
              <AccordionTrigger className="relative z-[9999]" style={{ zIndex: 9999 }}>Goal-oriented analytics</AccordionTrigger>
              <AccordionContent className="relative z-[9999]" style={{ zIndex: 9999 }}>
                Track engagement, reach, and conversions to optimize for success.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Right Side Image */}
          <div className="flex justify-center relative z-[9999]">
            <Image
              src={dashboardImage}
              alt="Preview dashboard"
              width={600}
              height={400}
              className="rounded-xl shadow-lg relative z-[9999]"
              style={{ zIndex: 9999 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
