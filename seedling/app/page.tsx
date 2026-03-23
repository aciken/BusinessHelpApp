"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lightbulb,
  Search,
  Package,
  FileText,
  Megaphone,
  Rocket,
  Brain,
  Compass,
  BarChart3,
  Zap,
  ArrowRight,
  Star,
  Quote,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/Button";
import { AnimateInView } from "@/components/AnimateInView";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const rotatingWords = ["Idea", "Vision", "Side Project", "Dream"];

const steps = [
  {
    icon: Lightbulb,
    title: "Share Your Idea",
    description:
      "Tell us about your business concept — even if it's just a spark. We'll help you shape it.",
  },
  {
    icon: Search,
    title: "Market Validation",
    description:
      "AI-powered research into your target market, competitors, and opportunity size.",
  },
  {
    icon: Package,
    title: "Define Your Product",
    description:
      "Clarify what you're building, who it's for, and what makes it uniquely valuable.",
  },
  {
    icon: FileText,
    title: "Business Plan",
    description:
      "Generate an investor-ready business plan with financials, strategy, and roadmap.",
  },
  {
    icon: Megaphone,
    title: "Marketing Strategy",
    description:
      "Get a custom marketing playbook tailored to your niche, budget, and goals.",
  },
  {
    icon: Rocket,
    title: "Launch & Grow",
    description:
      "Execute your launch with guided checklists, milestones, and growth tactics.",
  },
];

const features = [
  {
    icon: Brain,
    title: "AI Market Analysis",
    description:
      "We research your market, analyze competitors, and identify opportunities — so you don't have to spend weeks doing it yourself.",
  },
  {
    icon: Compass,
    title: "Step-by-Step Guidance",
    description:
      "Never wonder what to do next. Our guided workflow breaks the overwhelming journey into clear, manageable actions.",
  },
  {
    icon: BarChart3,
    title: "Business Plan Generator",
    description:
      "Create investor-ready documents in minutes, not months. Financial projections, market analysis, and strategy — all included.",
  },
  {
    icon: Zap,
    title: "Marketing Playbook",
    description:
      "Custom marketing strategies tailored to your niche, audience, and budget. From social media to SEO to launch campaigns.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "0",
    description: "Perfect for exploring your idea and getting started.",
    features: [
      "1 business project",
      "Basic market analysis",
      "Step-by-step guidance",
      "Community access",
      "Email support",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "29",
    description: "Everything you need to validate, plan, and launch.",
    features: [
      "Unlimited projects",
      "Deep AI market analysis",
      "Full business plan generator",
      "Marketing playbook",
      "Competitor tracking",
      "Financial projections",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Scale",
    price: "79",
    description: "For serious founders ready to grow and raise funding.",
    features: [
      "Everything in Pro",
      "Investor-ready documents",
      "Pitch deck generator",
      "Growth analytics dashboard",
      "1-on-1 AI strategy sessions",
      "Custom integrations",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Founder, Bloom Studio",
    quote:
      "Seedling turned my vague idea for a design studio into a real business with paying clients in just 6 weeks. The step-by-step guidance was exactly what I needed.",
    avatar: "SC",
  },
  {
    name: "Marcus Rivera",
    role: "CEO, FreshBite",
    quote:
      "As a first-time founder, I was overwhelmed. Seedling's AI analyzed my market and gave me a clear path forward. The business plan it generated helped me secure my first round of funding.",
    avatar: "MR",
  },
  {
    name: "Priya Patel",
    role: "Co-founder, LearnLoop",
    quote:
      "The marketing playbook alone was worth it. Seedling understood our ed-tech niche and gave us strategies that actually worked — not generic advice.",
    avatar: "PP",
  },
];

function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Find the longest word to reserve space and prevent layout shift
  const longestWord = rotatingWords.reduce((a, b) =>
    a.length > b.length ? a : b
  );

  return (
    <span className="inline-block relative align-bottom">
      {/* Invisible sizer — holds the width of the longest word */}
      <span className="invisible">{longestWord}</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={rotatingWords[index]}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute left-0 top-0 text-accent whitespace-nowrap"
        >
          {rotatingWords[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function AvatarStack() {
  const initials = ["JD", "AK", "LM", "TS", "RW"];
  return (
    <div className="flex items-center gap-3 mt-8">
      <div className="flex -space-x-2.5">
        {initials.map((init, i) => (
          <div
            key={init}
            className="w-9 h-9 rounded-full border-2 border-white bg-accent-light flex items-center justify-center text-xs font-semibold text-accent-dark"
            style={{ zIndex: initials.length - i }}
          >
            {init}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
            />
          ))}
        </div>
        <span className="text-sm text-text-secondary">
          Join 2,000+ entrepreneurs
        </span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user._id) {
          router.replace("/dashboard");
        }
      } catch {
        // invalid data, ignore
      }
    }
  }, [router]);

  return (
    <>
      <Navbar />
      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Dot grid background */}
        <div className="absolute inset-0 dot-grid opacity-[0.35]" />
        {/* Green orbs */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] green-orb pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] green-orb pointer-events-none" />

        <div className="relative max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-light rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-sm font-medium text-accent-dark">
                  AI-Powered Business Builder
                </span>
              </div>

              <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold text-text-primary leading-[1.1] tracking-tight">
                Turn Your{" "}
                <RotatingWord />
                <br />
                Into a Business
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-text-secondary leading-relaxed max-w-lg">
                The AI co-founder you never had. Seedling walks you from raw
                idea to running business — step by step, with expert guidance at
                every stage.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link href="/sign-up">
                  <Button size="lg" className="gap-2">
                    Start Building — it&apos;s free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button variant="secondary" size="lg">
                    See How It Works
                  </Button>
                </a>
              </div>

              <AvatarStack />
            </motion.div>

            {/* Hero visual placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-border-light p-8 aspect-[4/3]">
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <svg
                    viewBox="0 0 400 300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    {/* Ground */}
                    <ellipse
                      cx="200"
                      cy="260"
                      rx="120"
                      ry="12"
                      fill="#DCFCE7"
                    />

                    {/* Stem */}
                    <path
                      d="M200 260 C200 220, 195 180, 200 140"
                      stroke="#22C55E"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M200 260 C200 230, 198 200, 200 170"
                      stroke="#166534"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.3"
                    />

                    {/* Left leaf */}
                    <path
                      d="M200 190 C175 175, 145 170, 130 155 C140 180, 165 195, 200 190Z"
                      fill="#22C55E"
                      opacity="0.7"
                    />
                    <path
                      d="M200 190 C180 183, 155 176, 130 155"
                      stroke="#166534"
                      strokeWidth="1.5"
                      opacity="0.4"
                      fill="none"
                    />

                    {/* Right leaf */}
                    <path
                      d="M200 170 C225 155, 255 150, 270 135 C260 160, 235 175, 200 170Z"
                      fill="#22C55E"
                      opacity="0.8"
                    />
                    <path
                      d="M200 170 C220 163, 245 156, 270 135"
                      stroke="#166534"
                      strokeWidth="1.5"
                      opacity="0.4"
                      fill="none"
                    />

                    {/* Top small leaf */}
                    <path
                      d="M200 140 C188 125, 178 115, 170 100 C185 110, 195 125, 200 140Z"
                      fill="#22C55E"
                      opacity="0.6"
                    />

                    {/* Sparkles */}
                    <circle cx="150" cy="100" r="3" fill="#22C55E" opacity="0.3" />
                    <circle cx="260" cy="110" r="2" fill="#22C55E" opacity="0.4" />
                    <circle cx="130" cy="140" r="2" fill="#22C55E" opacity="0.2" />
                    <circle cx="280" cy="90" r="2.5" fill="#22C55E" opacity="0.3" />
                    <circle cx="170" cy="80" r="1.5" fill="#22C55E" opacity="0.5" />
                    <circle cx="240" cy="75" r="2" fill="#22C55E" opacity="0.25" />

                    {/* Progress bar */}
                    <rect
                      x="80"
                      y="274"
                      width="240"
                      height="4"
                      rx="2"
                      fill="#E5E7EB"
                    />
                    <rect
                      x="80"
                      y="274"
                      width="160"
                      height="4"
                      rx="2"
                      fill="#22C55E"
                    />
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <circle
                        key={i}
                        cx={80 + i * 48}
                        cy="276"
                        r="6"
                        fill={i < 4 ? "#22C55E" : "#E5E7EB"}
                        stroke="white"
                        strokeWidth="2"
                      />
                    ))}
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-24 lg:py-32 bg-warm-gray relative"
      >
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateInView className="text-center mb-16 lg:mb-20">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-light rounded-full text-sm font-medium text-accent-dark mb-4">
              The Journey
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
              From Idea to Launch in 6 Steps
            </h2>
            <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
              Every successful business starts somewhere. We guide you through
              each stage with AI-powered insights and actionable steps.
            </p>
          </AnimateInView>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((step, i) => (
              <AnimateInView key={step.title} delay={i * 0.08}>
                <div className="group relative bg-white rounded-2xl p-6 lg:p-8 border border-border-light hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent-light text-sm font-bold text-accent-dark font-heading">
                        {i + 1}
                      </span>
                    </div>
                    <div>
                      <div className="w-10 h-10 bg-accent-light rounded-xl flex items-center justify-center mb-3 group-hover:bg-accent/15 transition-colors">
                        <step.icon className="h-5 w-5 text-accent" />
                      </div>
                      <h3 className="font-heading font-semibold text-lg text-text-primary mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 lg:py-32">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateInView className="text-center mb-16 lg:mb-20">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-light rounded-full text-sm font-medium text-accent-dark mb-4">
              Features
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
              Everything You Need to Launch
            </h2>
            <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
              Built for first-time founders who want expert-level guidance
              without the expert-level price tag.
            </p>
          </AnimateInView>

          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feature, i) => (
              <AnimateInView key={feature.title} delay={i * 0.1}>
                <div className="group bg-warm-gray rounded-2xl p-8 lg:p-10 border border-transparent hover:border-accent/20 hover:bg-white hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-accent-light rounded-2xl flex items-center justify-center mb-5 group-hover:bg-accent/15 transition-colors">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 lg:py-32 bg-warm-gray relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] green-orb pointer-events-none opacity-30" />
        <div className="relative max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateInView className="text-center mb-16 lg:mb-20">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-light rounded-full text-sm font-medium text-accent-dark mb-4">
              Pricing
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
              Start free, upgrade when you&apos;re ready. No hidden fees, no surprises.
            </p>
          </AnimateInView>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
            {pricingPlans.map((plan, i) => (
              <AnimateInView key={plan.name} delay={i * 0.1}>
                <div
                  className={`relative rounded-2xl p-8 lg:p-10 h-full flex flex-col transition-all duration-300 ${
                    plan.popular
                      ? "bg-white border-2 border-accent shadow-xl shadow-accent/10 scale-[1.02]"
                      : "bg-white border border-border-light hover:border-accent/20 hover:shadow-lg"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-accent text-white text-xs font-bold rounded-full shadow-lg shadow-accent/25">
                        <Sparkles className="h-3.5 w-3.5" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="font-heading font-semibold text-lg text-text-primary">
                      {plan.name}
                    </h3>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="font-heading text-5xl font-extrabold text-text-primary tracking-tight">
                        ${plan.price}
                      </span>
                      <span className="text-text-secondary text-sm">/month</span>
                    </div>
                    <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-text-secondary">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/sign-up">
                    <Button
                      variant={plan.popular ? "primary" : "secondary"}
                      fullWidth
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-32">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateInView className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-light rounded-full text-sm font-medium text-accent-dark mb-4">
              Testimonials
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
              Loved by Founders
            </h2>
          </AnimateInView>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((t, i) => (
              <AnimateInView key={t.name} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-8 border border-border-light h-full flex flex-col">
                  <Quote className="h-8 w-8 text-accent/20 mb-4 flex-shrink-0" />
                  <p className="text-text-secondary leading-relaxed flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border-light">
                    <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center text-sm font-bold text-accent-dark font-heading">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-sm text-text-primary">
                        {t.name}
                      </p>
                      <p className="text-xs text-text-secondary">{t.role}</p>
                    </div>
                  </div>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 lg:py-32 bg-accent-muted relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] green-orb pointer-events-none opacity-40" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] green-orb pointer-events-none opacity-30" />

        <div className="relative max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateInView>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
              Ready to Plant Your Seedling?
            </h2>
            <p className="mt-4 text-lg text-text-secondary max-w-xl mx-auto">
              Join thousands of entrepreneurs who turned their ideas into real
              businesses. Your journey starts with one click.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="gap-2">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-text-secondary">
              No credit card required
            </p>
          </AnimateInView>
        </div>
      </section>

      <Footer />
    </>
  );
}
