'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Spark",
    price: "$0",
    period: "/mo",
    description: "Ideal for individuals testing ideas or learning AI.",
    features: [
      "30 message credits/month",
      "500 credits/month",
      "2 website previews",
    ],
    cta: "Start for Free",
    popular: false,
  },
  {
    name: "Launch",
    price: "$15",
    period: "/mo",
    description: "Great for solo developers and early MVPs.",
    features: [
      "Includes everything in Free, plus:",
      "150 message credits/month",
      "2,500 credits/month",
      "Unlimited public & 3 private apps",
      "Version history (7 days)",
      "Basic analytics dashboard",
    ],
    cta: "Choose Launch",
    popular: false,
  },
  {
    name: "Forge",
    price: "$40",
    period: "/mo",
    description: "For freelancers or small teams scaling their apps.",
    features: [
      "Includes everything in Starter, plus:",
      "500 message credits/month",
      "10,000 credits/month",
      "10 private websites",
      "Custom domain support",
      "GitHub integration",
    ],
    cta: "Choose Forge",
    popular: true,
  },
  {
    name: "Scale",
    price: "$80",
    period: "/mo",
    description: "For startups and growing projects.",
    features: [
        "Includes everything in Builder, plus:",
        "1,200 message credits/month",
        "30,000 credits/month",
        "Unlimited private websites",
    ],
    cta: "Choose Scale",
    popular: false,
  },
  {
    name: "Apex",
    price: "$160",
    period: "/mo",
    description: "For scale-ups or heavy app usage.",
    features: [
        "Includes everything in Pro, plus:",
        "3,000 message credits/month",
        "75,000 credits/month",
        "Uptime SLA (99.9%)",
    ],
    cta: "Choose Apex",
    popular: false,
  },
    {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored for large teams, agencies, and corporates.",
    features: [
        "Includes everything in Elite, plus:",
        "Custom user roles (Admins, Devs, Viewers)",
        "Role-based access control",
        "On-prem or hybrid deployment",
        "SSO/SAML & SCIM integration",
        "Advanced analytics & audit logs",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];


export default function Pricing() {
  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
       <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-4">Pricing Plans</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Choose the perfect plan for your project. From hobbyists to large enterprises, we've got you covered.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {tiers.map((tier) => (
             <Card key={tier.name} className={cn("flex flex-col", tier.popular ? "border-primary/50 shadow-lg" : "")}>
                <CardHeader>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">{tier.price}</span>
                        {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                    </div>
                    <CardDescription>
                        {tier.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <ul className="space-y-3">
                        {tier.features.map((feature, i) => (
                             <li key={i} className="flex items-start gap-3">
                                <Check className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                 <CardFooter>
                    <Button className="w-full" variant={tier.popular ? "default" : "outline"}>{tier.cta}</Button>
                </CardFooter>
            </Card>
           ))}
        </div>
    </div>
  );
}
