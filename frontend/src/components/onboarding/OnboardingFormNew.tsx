"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  User, Building, MessageSquare, Target, FileText, Settings, 
  Check, ChevronRight, Sparkles 
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import apiInstance from "@/services/apiInstance";
import { saveUserProfile, getUserProfile } from "@/constant/endpoint";
import logo from "@/assets/images/logosaas.png";
import { hasCompletedOnboarding, markOnboardingComplete } from "@/utils/onboarding";

interface FormState {
  full_name: string;
  current_position: string;
  industry_specialty: string;
  years_experience: number | null;
  location: string;
  company_name: string;
  company_size: string;
  company_usp: string;
  target_audience: string;
  services_offered: string;
  communication_style: string;
  writing_style: string;
  linkedin_goals: string[];
  linkedin_goals_other: string;
  content_preferences: string[];
  content_preferences_other: string;
  topics_to_include: string;
  topics_to_avoid: string;
  posting_frequency: string;
  preferred_post_length: string;
  post_language: string;
}

const INITIAL_FORM: FormState = {
  full_name: "",
  current_position: "",
  industry_specialty: "",
  years_experience: null,
  location: "",
  company_name: "",
  company_size: "",
  company_usp: "",
  target_audience: "",
  services_offered: "",
  communication_style: "",
  writing_style: "",
  linkedin_goals: [],
  linkedin_goals_other: "",
  content_preferences: [],
  content_preferences_other: "",
  topics_to_include: "",
  topics_to_avoid: "",
  posting_frequency: "",
  preferred_post_length: "",
  post_language: "English",
};

const REQUIRED = [
  "full_name",
  "current_position", 
  "industry_specialty",
  "years_experience",
  "location",
  "company_name",
  "company_size",
  "communication_style",
  "writing_style",
  "posting_frequency",
  "preferred_post_length",
  "post_language",
];

const steps = [
  { title: "Personal", icon: User, color: "from-blue-500 to-cyan-500" },
  { title: "Company", icon: Building, color: "from-purple-500 to-pink-500" },
  { title: "Communication", icon: MessageSquare, color: "from-green-500 to-emerald-500" },
  { title: "Goals", icon: Target, color: "from-orange-500 to-red-500" },
  { title: "Content", icon: FileText, color: "from-indigo-500 to-purple-500" },
  { title: "Preferences", icon: Settings, color: "from-teal-500 to-blue-500" },
  { title: "Finish", icon: Sparkles, color: "from-yellow-500 to-orange-500" },
];

export default function OnboardingForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const toPayload = (f: FormState) => ({
    full_name: f.full_name,
    current_position: f.current_position,
    industry_specialty: f.industry_specialty,
    years_experience: f.years_experience || 0,
    location: f.location,
    company_name: f.company_name,
    company_size: f.company_size,
    company_usp: f.company_usp,
    target_audience: f.target_audience,
    services_offered: f.services_offered,
    communication_style: f.communication_style,
    writing_style: f.writing_style,
    linkedin_goals: f.linkedin_goals,
    linkedin_goals_other: f.linkedin_goals_other,
    content_preferences: f.content_preferences,
    content_preferences_other: f.content_preferences_other,
    topics_to_include: f.topics_to_include,
    topics_to_avoid: f.topics_to_avoid,
    posting_frequency: f.posting_frequency,
    preferred_post_length: f.preferred_post_length,
    post_language: f.post_language,
  });

  const missingRequired = useMemo(() =>
    REQUIRED.filter((k) => {
      const v = (form as any)[k];
      // Special handling for years_experience
      if (k === 'years_experience') {
        return v === null || v === undefined || isNaN(Number(v));
      }
      return v === undefined || v === null || String(v).trim() === "";
    }), [form]);

  useEffect(() => {
    // Check if user has already completed onboarding
    if (hasCompletedOnboarding()) {
      console.log('User has already completed onboarding, skipping profile fetch');
      return;
    }

    (async () => {
      try {
        const { data } = await apiInstance.get(getUserProfile);
        if (data && typeof data === "object") {
          // If we get a valid profile response, mark onboarding as complete
          markOnboardingComplete();
          
          setForm((prev) => ({
            ...prev,
            full_name: data.full_name ?? prev.full_name,
            current_position: data.current_position ?? prev.current_position,
            industry_specialty: data.industry_specialty ?? prev.industry_specialty,
            years_experience: data.years_experience ? Number(data.years_experience) : prev.years_experience,
            location: data.location ?? prev.location,
            company_name: data.company_name ?? prev.company_name,
            company_size: data.company_size ?? prev.company_size,
            company_usp: data.company_usp ?? prev.company_usp,
            target_audience: data.target_audience ?? prev.target_audience,
            services_offered: data.services_offered ?? prev.services_offered,
            communication_style: data.communication_style ?? prev.communication_style,
            writing_style: data.writing_style ?? prev.writing_style,
            linkedin_goals: Array.isArray(data.linkedin_goals) ? data.linkedin_goals : (data.linkedin_goals ? String(data.linkedin_goals).split(/,\s*/) : prev.linkedin_goals),
            linkedin_goals_other: data.linkedin_goals_other ?? prev.linkedin_goals_other,
            content_preferences: Array.isArray(data.content_preferences) ? data.content_preferences : (data.content_preferences ? String(data.content_preferences).split(/,\s*/) : prev.content_preferences),
            content_preferences_other: data.content_preferences_other ?? prev.content_preferences_other,
            topics_to_include: data.topics_to_include ?? prev.topics_to_include,
            topics_to_avoid: data.topics_to_avoid ?? prev.topics_to_avoid,
            posting_frequency: data.posting_frequency ?? prev.posting_frequency,
            preferred_post_length: data.preferred_post_length ?? prev.preferred_post_length,
            post_language: data.post_language ?? prev.post_language,
          }));
        }
      } catch (error) {
        console.log('No existing profile found or error fetching profile, user needs to complete onboarding');
      }
    })();
  }, []);

  const handleSubmit = async () => {
    setError(null);
    
    // Debug: Log current form state
    console.log("Current form state:", form);
    console.log("Missing required fields:", missingRequired);
    
    if (missingRequired.length) {
      setError(`Please complete all required fields: ${missingRequired.join(', ')}`);
      return;
    }
    
    setLoading(true);
    try {
      const payload = toPayload(form);
      console.log("Sending payload:", payload);
      const response = await apiInstance.post(saveUserProfile, payload);
      console.log("Profile saved successfully:", response);
      
      // Set localStorage flag to indicate onboarding is complete
      markOnboardingComplete();
      
      // Add a small delay to ensure data is saved before redirect
      setTimeout(() => {
        console.log("Redirecting to /generate-post");
        router.push("/generate-post");
      }, 1000);
      
    } catch (err: any) {
      console.error("Profile save error:", err);
      const errorMessage = err?.response?.data?.message || 
                          err?.response?.data?.error ||
                          err?.message ||
                          "Failed to save profile. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleMulti = (key: keyof FormState, value: string) => {
    setForm((f) => {
      const arr = new Set((f as any)[key] as string[]);
      if (arr.has(value)) arr.delete(value);
      else arr.add(value);
      return { ...f, [key]: Array.from(arr) } as FormState;
    });
  };

  // Define required fields for each step
  const getRequiredFieldsForStep = (step: number): string[] => {
    switch (step) {
      case 0: // Personal Information
        return ["full_name", "current_position", "industry_specialty", "years_experience", "location"];
      case 1: // Company Information
        return ["company_name", "company_size"];
      case 2: // Communication Style
        return ["communication_style", "writing_style"];
      case 3: // Goals (no required fields)
        return [];
      case 4: // Content Preferences (no required fields)
        return [];
      case 5: // Preferences
        return ["posting_frequency", "preferred_post_length", "post_language"];
      default:
        return [];
    }
  };

  const validateCurrentStep = (): boolean => {
    const requiredFields = getRequiredFieldsForStep(currentStep);
    const missingFields = requiredFields.filter((field) => {
      const value = (form as any)[field];
      // Special handling for years_experience
      if (field === 'years_experience') {
        return value === null || value === undefined || isNaN(Number(value));
      }
      return value === undefined || value === null || String(value).trim() === "";
    });
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.map(field => field.replace(/_/g, ' ')).join(', ')}`);
      return false;
    }
    
    setError(null);
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (!validateCurrentStep()) {
      // Warning is already set in validateCurrentStep function
      return;
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressValue = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-75"></div>
              <div className="relative bg-white p-2 rounded-xl">
                <Image src={logo} alt="LinkedAI" className="h-8 w-8" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">LinkedAI</h1>
              <p className="text-sm text-slate-400">Setup your profile</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-slate-300">Step {currentStep + 1} of {steps.length}</p>
              <p className="text-xs text-slate-500">{steps[currentStep].title}</p>
            </div>
            <div className="w-32">
              <Progress value={progressValue} className="h-2 bg-slate-700 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-600" />
            </div>
          </div>
        </motion.div>

        {/* Step Navigation */}
        <div className="flex items-center justify-center mb-8 space-x-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                  index <= currentStep 
                    ? `bg-gradient-to-r ${step.color} text-white shadow-lg` 
                    : 'bg-slate-700 text-slate-400'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Form Content */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-600/50 shadow-2xl shadow-purple-500/20 ring-1 ring-purple-500/10 overflow-hidden hover:shadow-purple-500/30 transition-all duration-300">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8"
            >
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Personal Information</h2>
                    <p className="text-slate-400">Tell us about yourself</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Full Name *</label>
                      <Input 
                        required 
                        value={form.full_name} 
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })} 
                        placeholder="Enter your full name" 
                        className="bg-slate-800/70 border-slate-500 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/30 focus:ring-2 hover:bg-slate-700/70 transition-colors" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Current Position *</label>
                      <Input 
                        required 
                        value={form.current_position} 
                        onChange={(e) => setForm({ ...form, current_position: e.target.value })} 
                        placeholder="e.g. Senior Doctor, Health Coach" 
                        className="bg-slate-800/70 border-slate-500 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/30 focus:ring-2 hover:bg-slate-700/70 transition-colors" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Industry / Specialty *</label>
                      <Input 
                        required 
                        value={form.industry_specialty} 
                        onChange={(e) => setForm({ ...form, industry_specialty: e.target.value })} 
                        placeholder="e.g. Cardiology, Mental Health" 
                        className="bg-slate-800/70 border-slate-500 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/30 focus:ring-2 hover:bg-slate-700/70 transition-colors" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Years of Experience *</label>
                      <Input 
                        required 
                        type="number" 
                        min={0} 
                        value={form.years_experience ?? ""} 
                        onChange={(e) => setForm({ ...form, years_experience: e.target.value ? Number(e.target.value) : null })} 
                        placeholder="5" 
                        className="bg-slate-800/70 border-slate-500 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/30 focus:ring-2 hover:bg-slate-700/70 transition-colors" 
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slate-300">Location *</label>
                      <Input 
                        required 
                        value={form.location} 
                        onChange={(e) => setForm({ ...form, location: e.target.value })} 
                        placeholder="City, Country" 
                        className="bg-slate-800/70 border-slate-500 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/30 focus:ring-2 hover:bg-slate-700/70 transition-colors" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                      <Building className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Company Information</h2>
                    <p className="text-slate-400">Tell us about your organization</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Company Name *</label>
                      <Input 
                        required 
                        value={form.company_name} 
                        onChange={(e) => setForm({ ...form, company_name: e.target.value })} 
                        placeholder="Your company name" 
                        className="bg-slate-800/70 border-slate-500 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400/30 focus:ring-2 hover:bg-slate-700/70 transition-colors" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Company Size *</label>
                      <select 
                        required 
                        value={form.company_size} 
                        onChange={(e) => setForm({ ...form, company_size: e.target.value })} 
                        className="w-full h-10 bg-slate-800/70 border border-slate-500 text-white rounded-md px-3 focus:border-purple-400 focus:ring-purple-400/30 focus:ring-2 [&>option]:bg-slate-800 [&>option]:text-white [&>option:disabled]:text-slate-500 hover:bg-slate-700/70 transition-colors"
                      >
                        <option value="" disabled className="text-slate-500">Select company size</option>
                        <option className="text-white bg-slate-800">1–10 employees</option>
                        <option className="text-white bg-slate-800">11–50 employees</option>
                        <option className="text-white bg-slate-800">51–200 employees</option>
                        <option className="text-white bg-slate-800">200+ employees</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slate-300">What makes your company unique?</label>
                      <Input 
                        value={form.company_usp} 
                        onChange={(e) => setForm({ ...form, company_usp: e.target.value })} 
                        placeholder="Your unique value proposition" 
                        className="bg-slate-800/70 border-slate-500 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400/30 focus:ring-2 hover:bg-slate-700/70 transition-colors" 
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slate-300">Target Audience</label>
                      <Input 
                        value={form.target_audience} 
                        onChange={(e) => setForm({ ...form, target_audience: e.target.value })} 
                        placeholder="Who do you serve?" 
                        className="bg-slate-800/70 border-slate-500 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400/30 focus:ring-2 hover:bg-slate-700/70 transition-colors" 
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slate-300">Services Offered</label>
                      <Textarea 
                        value={form.services_offered} 
                        onChange={(e) => setForm({ ...form, services_offered: e.target.value })} 
                        placeholder="What services or products do you offer?" 
                        className="bg-slate-800/70 border-slate-500 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-purple-400/30 focus:ring-2 hover:bg-slate-700/70 transition-colors min-h-24" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
                      <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Communication Style</h2>
                    <p className="text-slate-400">How should your content sound?</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Communication Tone *</label>
                      <select 
                        required 
                        value={form.communication_style} 
                        onChange={(e) => setForm({ ...form, communication_style: e.target.value })} 
                        className="w-full h-10 bg-slate-800/70 border border-slate-500 text-white rounded-md px-3 focus:border-green-400 focus:ring-green-400/30 focus:ring-2 [&>option]:bg-slate-800 [&>option]:text-white [&>option:disabled]:text-slate-500 hover:bg-slate-700/70 transition-colors"
                      >
                        <option value="" disabled className="text-slate-500">Select your tone</option>
                        <option className="text-white bg-slate-800">Casual & approachable</option>
                        <option className="text-white bg-slate-800">Professional & factual</option>
                        <option className="text-white bg-slate-800">Inspiring & motivational</option>
                        <option className="text-white bg-slate-800">Expert & in-depth</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Writing Style *</label>
                      <select 
                        required 
                        value={form.writing_style} 
                        onChange={(e) => setForm({ ...form, writing_style: e.target.value })} 
                        className="w-full h-10 bg-slate-800/70 border border-slate-500 text-white rounded-md px-3 focus:border-green-400 focus:ring-green-400/30 focus:ring-2 [&>option]:bg-slate-800 [&>option]:text-white [&>option:disabled]:text-slate-500 hover:bg-slate-700/70 transition-colors"
                      >
                        <option value="" disabled className="text-slate-500">Select writing style</option>
                        <option className="text-white bg-slate-800">First person ("I as an expert…")</option>
                        <option className="text-white bg-slate-800">Team voice ("We as a company…")</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">LinkedIn Goals</h2>
                    <p className="text-slate-400">What do you want to achieve?</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        "Increase visibility",
                        "Attract new clients", 
                        "Showcase expertise",
                        "Employer branding / attract new employees",
                        "Reach investors",
                        "Grow your network",
                      ].map((goal) => (
                        <motion.label
                          key={goal}
                          className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                            form.linkedin_goals.includes(goal)
                              ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/50 text-white'
                              : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-slate-500'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            form.linkedin_goals.includes(goal)
                              ? 'border-orange-500 bg-orange-500'
                              : 'border-slate-500'
                          }`}>
                            {form.linkedin_goals.includes(goal) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="text-sm font-medium">{goal}</span>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={form.linkedin_goals.includes(goal)}
                            onChange={() => toggleMulti("linkedin_goals", goal)}
                          />
                        </motion.label>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Other Goals</label>
                      <Input 
                        value={form.linkedin_goals_other} 
                        onChange={(e) => setForm({ ...form, linkedin_goals_other: e.target.value })} 
                        placeholder="Any other specific goals?" 
                        className="bg-slate-800/70 border-slate-500 text-white placeholder-slate-400 focus:border-orange-400 focus:ring-orange-400/30 focus:ring-2 hover:bg-slate-700/70 transition-colors" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Content Preferences</h2>
                    <p className="text-slate-400">What type of content do you prefer?</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        "Expert insights & tips",
                        "Personal stories / behind the scenes",
                        "Industry trends & news",
                        "Success stories & case studies",
                        "Team or company updates",
                      ].map((content) => (
                        <motion.label
                          key={content}
                          className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                            form.content_preferences.includes(content)
                              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/50 text-white'
                              : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-slate-500'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            form.content_preferences.includes(content)
                              ? 'border-indigo-500 bg-indigo-500'
                              : 'border-slate-500'
                          }`}>
                            {form.content_preferences.includes(content) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="text-sm font-medium">{content}</span>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={form.content_preferences.includes(content)}
                            onChange={() => toggleMulti("content_preferences", content)}
                          />
                        </motion.label>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Other Content Types</label>
                      <Input 
                        value={form.content_preferences_other} 
                        onChange={(e) => setForm({ ...form, content_preferences_other: e.target.value })} 
                        placeholder="Any other content preferences?" 
                        className="bg-slate-800/70 border-slate-500 text-white placeholder-slate-400 focus:border-indigo-400 focus:ring-indigo-400/30 focus:ring-2 hover:bg-slate-700/70 transition-colors" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mb-4">
                      <Settings className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Content Preferences</h2>
                    <p className="text-slate-400">Fine-tune your content strategy</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Topics to Include</label>
                      <Input 
                        value={form.topics_to_include} 
                        onChange={(e) => setForm({ ...form, topics_to_include: e.target.value })} 
                        placeholder="Keywords or topics to focus on" 
                        className="bg-slate-800/70 border-slate-500 text-white placeholder-slate-400 focus:border-teal-400 focus:ring-teal-400/30 focus:ring-2 hover:bg-slate-700/70 transition-colors" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Topics to Avoid</label>
                      <Input 
                        value={form.topics_to_avoid} 
                        onChange={(e) => setForm({ ...form, topics_to_avoid: e.target.value })} 
                        placeholder="Topics to steer clear of" 
                        className="bg-slate-800/70 border-slate-500 text-white placeholder-slate-400 focus:border-teal-400 focus:ring-teal-400/30 focus:ring-2 hover:bg-slate-700/70 transition-colors" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Posting Frequency *</label>
                      <select 
                        required 
                        value={form.posting_frequency} 
                        onChange={(e) => setForm({ ...form, posting_frequency: e.target.value })} 
                        className="w-full h-10 bg-slate-800/70 border border-slate-500 text-white rounded-md px-3 focus:border-teal-400 focus:ring-teal-400/30 focus:ring-2 [&>option]:bg-slate-800 [&>option]:text-white [&>option:disabled]:text-slate-500 hover:bg-slate-700/70 transition-colors"
                      >
                        <option value="" disabled className="text-slate-500">How often?</option>
                        <option className="text-white bg-slate-800">Once a week</option>
                        <option className="text-white bg-slate-800">2–3 times per week</option>
                        <option className="text-white bg-slate-800">Several times per week</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Post Length *</label>
                      <select 
                        required 
                        value={form.preferred_post_length} 
                        onChange={(e) => setForm({ ...form, preferred_post_length: e.target.value })} 
                        className="w-full h-10 bg-slate-800/70 border border-slate-500 text-white rounded-md px-3 focus:border-teal-400 focus:ring-teal-400/30 focus:ring-2 [&>option]:bg-slate-800 [&>option]:text-white [&>option:disabled]:text-slate-500 hover:bg-slate-700/70 transition-colors"
                      >
                        <option value="" disabled className="text-slate-500">Preferred length</option>
                        <option className="text-white bg-slate-800">Short (2–4 sentences)</option>
                        <option className="text-white bg-slate-800">Medium (5–8 sentences)</option>
                        <option className="text-white bg-slate-800">Long (storytelling, detailed)</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slate-300">Language *</label>
                      <select 
                        required 
                        value={form.post_language} 
                        onChange={(e) => setForm({ ...form, post_language: e.target.value })} 
                        className="w-full h-10 bg-slate-800/70 border border-slate-500 text-white rounded-md px-3 focus:border-teal-400 focus:ring-teal-400/30 focus:ring-2 [&>option]:bg-slate-800 [&>option]:text-white hover:bg-slate-700/70 transition-colors"
                      >
                        <option className="text-white bg-slate-800">English</option>
                        <option className="text-white bg-slate-800">German</option>
                        <option className="text-white bg-slate-800">Both</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-4">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">All Set!</h2>
                    <p className="text-slate-400">Ready to create amazing LinkedIn content?</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6 text-center">
                    <h3 className="text-xl font-semibold text-white mb-4">Your Profile Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Name</p>
                        <p className="text-white font-medium">{form.full_name || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Position</p>
                        <p className="text-white font-medium">{form.current_position || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Company</p>
                        <p className="text-white font-medium">{form.company_name || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Goals</p>
                        <p className="text-white font-medium">{form.linkedin_goals.length || 0} selected</p>
                      </div>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
                      {error}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Error Display for All Steps */}
          {error && currentStep < steps.length - 1 && (
            <div className="px-8 pb-4">
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm">
                ⚠️ {error}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between p-6 border-t border-slate-600/50 bg-slate-800/30">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="border-slate-500 text-white bg-transparent hover:bg-slate-700/70 hover:text-white hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:text-slate-400 transition-all duration-200"
            >
              Back
            </Button>
            
            <div className="flex items-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index <= currentStep ? 'bg-blue-500' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
            
            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <div className="flex flex-col items-end space-y-2">
                {missingRequired.length > 0 && (
                  <p className="text-xs text-red-400">
                    Missing: {missingRequired.join(', ')}
                  </p>
                )}
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || missingRequired.length > 0}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Complete Setup"}
                  <Sparkles className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
