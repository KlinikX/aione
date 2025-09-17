import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { selectTemplate } from "@/constant/endpoint";
import { templates } from "@/constant/templates";
import { apiInstance } from "@/services";
import { formatTextToHtml } from "@/utils/formatTextToHtml";
import { motion } from "framer-motion";
import {
  Briefcase,
  Globe,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Send,
  ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface TemplateSelectProps {
  setIsTemplateSelected: (isTemplateSelected: boolean) => void;
}

export const TemplateSelect = ({
  setIsTemplateSelected,
}: TemplateSelectProps) => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleContinue = async () => {
    if (!selectedTemplate) return;

    setIsLoading(true);
    try {
      const response = await apiInstance.post(selectTemplate, null, {
        params: { template_number: selectedTemplate },
        headers: { "Content-Type": "application/json" },
      });

      const data = response.data;

      // Store selected template in localStorage
      localStorage.setItem("selectedTemplate", selectedTemplate.toString());

      // Show success message
      toast({
        title: "Success",
        description: data.message,
      });

      setIsTemplateSelected(true);
    } catch (error) {
      console.error("Template selection error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to select template",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-w-full flex items-center justify-center bg-gray-50 dark:bg-[#121212] p-4 sm:p-6">
      <div className="w-max-2xl bg-white dark:bg-[#1d1d1d] rounded-3xl dark:shadow-[#000000]/10 p-4 sm:p-6 flex flex-col">
        <div className="text-center space-y-2 mb-4">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
            Choose Your Content Style
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
            Select a template that matches your professional voice
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 flex-1">
          <div className="flex-1 flex flex-col">
            <h2 className="font-semibold text-gray-900 dark:text-gray-200 mb-2 sm:mb-3 text-sm">
              Preview
            </h2>
            <Card className="flex-1 max-w-2xl bg-white dark:bg-[#2d2d2d] shadow-xl dark:shadow-[#000000]/20 rounded-xl border-0 flex flex-col">
              <div className="p-3 sm:p-4 flex flex-col flex-1 overflow-hidden">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative">
                      <Image
                        src="https://randomuser.me/api/portraits/women/76.jpg"
                        alt="Profile"
                        width={40}
                        height={40}
                        className="rounded-full sm:w-12 sm:h-12 w-10 h-10"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded-full flex items-center justify-center">
                        <Globe className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm">
                        Dr. Sarah Mitchell, MD
                      </h3>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <span className="text-[10px] sm:text-xs">
                            Chief Medical Officer at HealthCare Plus
                          </span>
                          <Briefcase className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </div>
                        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          <span>1,234 followers</span>
                          <span>•</span>
                          <span>1d</span>
                          <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-6 w-6 sm:h-8 sm:w-8 hover:bg-gray-100 dark:hover:bg-[#363636]"
                  >
                    <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                </div>
                <div className="text-xs sm:text-sm text-gray-800 dark:text-gray-300 leading-relaxed overflow-y-auto flex-1">
                  {selectedTemplate && (
                    <div
                      className="post-content text-sm"
                      dangerouslySetInnerHTML={{
                        __html: formatTextToHtml(
                          templates.find(
                            (t, index) => index + 1 === selectedTemplate
                          )?.description || ""
                        ),
                      }}
                    />
                  )}
                </div>
                <div className="mt-3">
                  <div className="flex items-center gap-2 py-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-[#363636]">
                    <div className="flex -space-x-1">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[8px] sm:text-[10px]">
                        👍
                      </div>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-[8px] sm:text-[10px]">
                        ❤️
                      </div>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-[8px] sm:text-[10px]">
                        🎯
                      </div>
                    </div>
                    <span className="flex-1">47 • 8 comments • 3 reposts</span>
                  </div>
                  {/* Post Actions */}
                  <div className="flex justify-between pt-1 border-t border-gray-200 dark:border-[#363636]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 h-6 sm:h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#363636] transition-colors"
                    >
                      <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-[10px] sm:text-xs font-medium">
                        Like
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 h-6 sm:h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#363636] transition-colors"
                    >
                      <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-[10px] sm:text-xs font-medium">
                        Comment
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 h-6 sm:h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#363636] transition-colors"
                    >
                      <Repeat2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-[10px] sm:text-xs font-medium">
                        Repost
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 h-6 sm:h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#363636] transition-colors"
                    >
                      <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-[10px] sm:text-xs font-medium">
                        Send
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div className="w-full md:w-[250px] flex flex-col gap-3">
            <div className="bg-gray-50/50 dark:bg-[#2d2d2d] rounded-xl p-3 sm:p-4 flex-1 border border-gray-100 dark:border-[#363636]">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-2 sm:mb-3">
                Templates
              </h2>
              <div className="grid gap-2">
                {templates.map((template, index) => (
                  <motion.div
                    key={template.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={
                        selectedTemplate === index + 1 ? "default" : "outline"
                      }
                      className={`w-full p-1.5 sm:p-2 h-auto flex items-center gap-1.5 sm:gap-2 rounded-lg transition-all duration-200 justify-start ${
                        selectedTemplate === index + 1
                          ? "bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-400 text-white border-0 shadow-md shadow-indigo-500/20 dark:shadow-indigo-400/10"
                          : "hover:bg-white/50 dark:hover:bg-[#1a1a1a] dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#404040] dark:text-white"
                      }`}
                      onClick={() => setSelectedTemplate(index + 1)}
                    >
                      <div
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm sm:text-base font-semibold shrink-0
                                                  ${
                                                    selectedTemplate ===
                                                    index + 1
                                                      ? "bg-white/20 text-white"
                                                      : "bg-gray-100 dark:bg-[#1a1a1a] text-gray-600 dark:text-white"
                                                  }`}
                      >
                        {template.name[0]}
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs font-medium ${
                          selectedTemplate === index + 1
                            ? "text-white"
                            : "text-gray-700 dark:text-white"
                        }`}
                      >
                        {template.name}
                      </span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
            <Button
              className="w-full h-8 sm:h-9 text-xs sm:text-sm font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white dark:from-indigo-500 dark:to-indigo-400 dark:hover:from-indigo-600 dark:hover:to-indigo-500 transition-all duration-200 shadow-md shadow-indigo-500/20 dark:shadow-indigo-400/10"
              onClick={handleContinue}
              isLoading={isLoading}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
