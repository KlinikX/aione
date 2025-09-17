"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function PlansSection() {
  const plans = [
    {
      name: "Basic",
      price: "$9",
      features: ["50 AI Post Generations/month", "2GB Media Storage", "Email Support"],
    },
    {
      name: "Pro",
      price: "$29",
      features: [
        "100 AI Post Generations/month",
        "5GB Media Storage",
        "Priority Support",
        "Advanced Analytics",
      ],
    },
    {
      name: "Enterprise",
      price: "$99",
      features: [
        "Unlimited AI Post Generations",
        "20GB Media Storage",
        "24/7 Support",
        "Advanced Analytics",
        "Custom Integration",
      ],
    },
  ];

  return (
    <section
      id="pricing"
      className="relative bg-black w-full min-h-screen md:min-h-[80vh] flex flex-col justify-center items-center text-gray-100"
    >
      <div className="relative z-[15] flex flex-col items-center text-center">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 mb-8 relative z-[15]">
          <h1 className="dark:text-white text-4xl md:text-5xl font-bold mb-4">Available Plans</h1>
          <p className="dark:text-gray-300 text-lg md:text-xl">Choose the plan that best fits your needs.</p>
        </div>

        <div className="grid gap-6 py-8 md:grid-cols-3 max-w-6xl w-full px-4 relative z-[15]">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative z-[15] flex flex-col p-4 md:p-0 justify-between transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                plan.name === "Pro" ? "border-2 border-blue-500 ring-4 ring-blue-500/20" : "border border-gray-600"
              } dark:bg-[#232326] dark:border-[#232326] backdrop-blur-sm`}
            >
              <CardHeader className="relative z-[15]">
                <CardTitle className="dark:text-white text-xl md:text-2xl">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-bold dark:text-white">{plan.price}</span>
                  <span className="text-sm text-muted-foreground dark:text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 relative z-[15]">
                <ul className="space-y-3 text-sm mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 dark:text-gray-200">
                      <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white font-bold" />
                      </div>
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`mt-auto w-full py-3 font-semibold transition-all duration-300 relative z-[15] ${
                    plan.name === "Pro"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30"
                      : "bg-gradient-to-r from-gray-700 to-gray-800 text-gray-200 hover:from-blue-600 hover:to-purple-600 hover:text-white border border-gray-600 hover:border-transparent"
                  }`}
                  variant={plan.name === "Pro" ? "default" : "outline"}
                >
                  {plan.name === "Pro" ? "✓ Current Plan" : `Choose ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
