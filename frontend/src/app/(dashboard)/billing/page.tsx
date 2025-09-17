"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, CreditCard, Zap } from "lucide-react";
import { useState } from "react";


import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function BillingPage() {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showPlansDialog, setShowPlansDialog] = useState(false);
  const [showInvoicesDialog, setShowInvoicesDialog] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("Basic");
  const router = useRouter();


  // Mock data for available plans
  const plans = [
    {
      name: "Basic",
      price: "$9",
      priceValue: 9,
      features: ["50 AI Post Generations/month", "2GB Media Storage", "Email Support"],
      maxPosts: 50,
      maxStorage: "2GB",
    },
    {
      name: "Pro",
      price: "$29",
      priceValue: 29,
      features: ["100 AI Post Generations/month", "5GB Media Storage", "Priority Support", "Advanced Analytics"],
      maxPosts: 100,
      maxStorage: "5GB",
    },
    {
      name: "Enterprise",
      price: "$99",
      priceValue: 99,
      features: ["Unlimited AI Post Generations", "20GB Media Storage", "24/7 Support", "Advanced Analytics", "Custom Integration"],
      maxPosts: "Unlimited",
      maxStorage: "20GB",
    },
  ];

  // Get current plan details
  const getCurrentPlan = () => {
    return plans.find(plan => plan.name === currentPlan) || plans[1]; // Default to Pro if not found
  };

  const currentPlanDetails = getCurrentPlan();

  // Mock data for all invoices
  const allInvoices = [
    { date: "May 1, 2024", amount: "$29.00", plan: "Pro Plan - Monthly", status: "Paid" },
    { date: "Apr 1, 2024", amount: "$29.00", plan: "Pro Plan - Monthly", status: "Paid" },
    { date: "Mar 1, 2024", amount: "$29.00", plan: "Pro Plan - Monthly", status: "Paid" },
    { date: "Feb 1, 2024", amount: "$29.00", plan: "Pro Plan - Monthly", status: "Paid" },
    { date: "Jan 1, 2024", amount: "$29.00", plan: "Pro Plan - Monthly", status: "Paid" },
  ];

  const handlePlans = (planName: string) => {
    setCurrentPlan(planName);
    setShowPlansDialog(false); // Close the dialog
    toast.success(`Plan changed to ${planName} successfully`);
  };

  const handleRegisterNow = () => {
    router.push("/authentication");
  };


  return (
    <div className="relative min-h-screen w-full">
      {/* Background container to allow mouse hover to show through */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-[#0a0a0f] dark:via-[#0f0f14] dark:to-[#050508] transition-all duration-500 z-0"></div>
      
      {/* Content wrapper with proper z-index */}
      <div className="relative z-[5] flex flex-col gap-8 p-8 min-h-screen text-gray-900 dark:text-gray-100 transition-colors">
        {/* Header Section */}
        <div className="relative z-[5]">
          <h2 className="text-3xl font-bold tracking-tight dark:text-white">Billing & Subscription</h2>
          <p className="text-muted-foreground mt-2 dark:text-gray-400">Manage your subscription and billing details.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 relative z-[5]">
          {/* Current Plan Card */}
          <Card className="relative z-[5] bg-white/90 dark:bg-[#1a1a1f]/90 backdrop-blur-sm border border-gray-200 dark:border-[#2a2a35] shadow-lg hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-all duration-300 ring-1 ring-gray-100 dark:ring-blue-500/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="dark:text-white">{currentPlan} Plan</CardTitle>
                  <CardDescription className="dark:text-gray-400">You are currently on the {currentPlan} plan</CardDescription>
                </div>
                <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold dark:text-white">{currentPlanDetails.price}</span>
                    <span className="text-muted-foreground dark:text-gray-400">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 dark:text-gray-400">Billed monthly</p>
                </div>

                {/* Usage Stats */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="dark:text-gray-200">Posts Generated</span>
                      <span className="dark:text-gray-200">
                        {currentPlanDetails.maxPosts === "Unlimited" ? "85/∞" : `85/${currentPlanDetails.maxPosts}`}
                      </span>
                    </div>
                    <Progress value={currentPlanDetails.maxPosts === "Unlimited" ? 20 : 85} className={`h-2 dark:bg-gray-500 dark:[&>div]:bg-gray-100 bg-gray-200 [&>div]`} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="dark:text-gray-200">Storage Used</span>
                      <span className="dark:text-gray-200">4.2GB/{currentPlanDetails.maxStorage}</span>
                    </div>
                    <Progress value={currentPlanDetails.maxStorage === "20GB" ? 21 : 84} className={`h-2 dark:bg-gray-500 dark:[&>div]:bg-gray-100 bg-gray-200 [&>div]`} />
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2">
                  {currentPlanDetails.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="dark:text-gray-200">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700">
                        <CreditCard className="h-4 w-4" />
                        Update Payment Method
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="dark:bg-[#232326] dark:text-gray-100">
                      <DialogHeader>
                        <DialogTitle className="dark:text-white">Update Payment Method</DialogTitle>
                        <DialogDescription className="dark:text-gray-400">
                          Enter your card details to update your payment method.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-number" className="dark:text-gray-200">Card Number</Label>
                          <Input id="card-number" placeholder="4242 4242 4242 4242" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry" className="dark:text-gray-200">Expiry</Label>
                            <Input id="expiry" placeholder="MM/YY" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvc" className="dark:text-gray-200">CVC</Label>
                            <Input id="cvc" placeholder="123" />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button className="dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700">Save Card</Button>
                      </div>
                    </DialogContent>
                  </Dialog>

      <Dialog open={showPlansDialog} onOpenChange={setShowPlansDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="dark:bg-[#232326] dark:border-gray-600 dark:text-gray-200 dark:hover:bg-[#2a2a2e]">View Plans</Button>
                    </DialogTrigger>
    <DialogContent className="z-[120] md:z-[140] max-w-6xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gradient-to-br dark:from-[#1a1a1d] dark:to-[#232326] dark:text-gray-100 border border-gray-200/40 dark:border-transparent shadow-2xl ring-1 ring-black/5">
                      <DialogHeader className="pb-8">
            <div className="relative z-[15] text-center space-y-4">
              <div className="animate-pulse">
                <DialogTitle className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
                  Available Plans
                </DialogTitle>
              </div>
              <div className="animate-fade-in-up">
                <DialogDescription className="text-xl md:text-2xl dark:text-gray-300 font-medium">
                  Choose the perfect plan to supercharge your LinkedIn presence
                </DialogDescription>
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full animate-pulse"></div>
                        </div>
                      </DialogHeader>
            <div className="grid gap-6 py-6 sm:grid-cols-1 md:grid-cols-3 relative z-[15]">
                        {plans.map((plan, index) => (
              <Card key={plan.name} className={`relative z-[15] flex flex-col justify-between transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 ${plan.name === currentPlan ? "border-2 border-blue-400 ring-4 ring-blue-400/30 shadow-blue-400/20" : "border border-gray-500 hover:border-blue-300 dark:border-gray-600"} dark:bg-gradient-to-br dark:from-[#1a1a20] dark:to-[#1f1f28] bg-white/95 backdrop-blur-sm animate-fade-in-up ring-1 ring-gray-200/50 dark:ring-blue-500/10`} style={{ animationDelay: `${index * 150}ms` }}>
                            <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                                <CardTitle className="text-2xl font-bold dark:text-white">{plan.name}</CardTitle>
                  {plan.name === currentPlan && (
                    <Badge className="bg-blue-500 text-white font-semibold animate-bounce">Current</Badge>
                  )}
                  {plan.name === "Pro" && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold animate-pulse">Popular</Badge>
                  )}
                </div>
                              <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-black dark:text-white">{plan.price}</span>
                                <span className="text-lg text-muted-foreground dark:text-gray-400">/month</span>
                              </div>
                            </CardHeader>
                            <CardContent className="flex flex-col flex-1">
                              <ul className="space-y-3 text-sm mb-6 flex-1">
                                {plan.features.map((feature, featureIndex) => (
                                  <li key={feature} className="flex items-center gap-3 dark:text-gray-200 animate-fade-in-left" style={{ animationDelay: `${(index * 150) + (featureIndex * 100)}ms` }}>
                    <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white font-bold" />
                    </div>
                                    <span className="font-medium">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                <Button 
                  onClick={() => handlePlans(plan.name)} 
                  className={`mt-auto w-full py-3 font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                    plan.name === currentPlan 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30' 
                      : 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-200 hover:from-blue-600 hover:to-purple-600 hover:text-white border border-gray-600 hover:border-transparent'
                  }`} 
                  variant={plan.name === currentPlan ? "default" : "outline"}
                >
                                {plan.name === currentPlan ? "✓ Current Plan" : `Choose ${plan.name}`}
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing History Card */}
          <Card className="relative z-[5] bg-white/80 dark:bg-[#232326]/80 backdrop-blur-sm border border-gray-200 dark:border-[#232326] shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="dark:text-white">Billing History</CardTitle>
              <CardDescription className="dark:text-gray-400">View your recent billing history and download invoices.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Recent Invoices */}
                <div className="space-y-4">
                  {allInvoices.slice(0, 3).map((invoice, index) => (
                    <div key={index} className="flex items-center justify-between py-4 border-b dark:border-gray-700">
                      <div>
                        <p className="font-medium dark:text-gray-200">{invoice.plan}</p>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">{invoice.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium dark:text-gray-200">{invoice.amount}</span>
                        <Button variant="outline" size="sm" className="dark:bg-[#232326] dark:border-gray-600 dark:text-gray-200 dark:hover:bg-[#2a2a2e]">
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full dark:bg-[#232326] dark:border-gray-600 dark:text-gray-200 dark:hover:bg-[#2a2a2e]">
                      View All Invoices
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl dark:bg-[#232326] dark:text-gray-100">
                    <DialogHeader>
                      <DialogTitle className="dark:text-white">All Invoices</DialogTitle>
                      <DialogDescription className="dark:text-gray-400">
                        Complete history of your billing and invoices.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      {allInvoices.map((invoice, index) => (
                        <div key={index} className="flex items-center justify-between py-4 border-b dark:border-gray-700">
                          <div>
                            <p className="font-medium dark:text-gray-200">{invoice.plan}</p>
                            <p className="text-sm text-muted-foreground dark:text-gray-400">{invoice.date}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant={invoice.status === "Paid" ? "default" : "destructive"} className={invoice.status === "Paid" ? 'dark:bg-blue-900/30 dark:text-blue-400' : ''}>
                              {invoice.status}
                            </Badge>
                            <span className="font-medium dark:text-gray-200">{invoice.amount}</span>
                            <Button variant="outline" size="sm" className="dark:bg-[#232326] dark:border-gray-600 dark:text-gray-200 dark:hover:bg-[#2a2a2e]">
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="relative z-[5] text-center py-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Supercharge Your LinkedIn Presence?
            </h3>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
              Join thousands of professionals who are already creating engaging LinkedIn content with our AI-powered platform.
            </p>
            <Button 
              onClick={handleRegisterNow}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Register Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}