"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Check, PartyPopper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StepGuard from "@/components/dashboard/StepGuard";
import StepHeader from "@/components/dashboard/StepHeader";
import FormSection from "@/components/dashboard/FormSection";
import AIGenerateButton from "@/components/dashboard/AIGenerateButton";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { useToast } from "@/components/dashboard/Toast";

interface KPI {
  name: string;
  target: string;
  timeframe: string;
}

const defaultChecklist = [
  "Set up website / landing page",
  "Configure payment processing",
  "Prepare launch email sequence",
  "Create social media accounts",
  "Write press release",
  "Set up analytics & tracking",
  "Beta test with 10 users",
  "Prepare customer support process",
  "Create onboarding flow",
  "Plan launch day social posts",
  "Set up CRM and email automation",
  "Prepare launch day FAQ",
];

const growthOptions = [
  { id: "organic", name: "Organic Growth", desc: "SEO, content, word of mouth" },
  { id: "paid", name: "Paid Scaling", desc: "Advertising, partnerships" },
  { id: "product-led", name: "Product-Led Growth", desc: "Virality, referral loops" },
];

export default function LaunchPage() {
  const router = useRouter();
  const { state, updateStepData, markStepCompleted } = useDashboard();
  const { showToast } = useToast();
  const data = state.steps.launch;

  const [checklist, setChecklist] = useState<{ text: string; checked: boolean; dueDate: string }[]>(
    (data.checklist as { text: string; checked: boolean; dueDate: string }[]) ||
      defaultChecklist.map((text) => ({ text, checked: false, dueDate: "" }))
  );
  const [preLaunch, setPreLaunch] = useState((data.preLaunch as string) || "");
  const [launchDay, setLaunchDay] = useState((data.launchDay as string) || "");
  const [postLaunch, setPostLaunch] = useState((data.postLaunch as string) || "");
  const [launchTab, setLaunchTab] = useState<"pre" | "launch" | "post">("pre");
  const [kpis, setKpis] = useState<KPI[]>(
    (data.kpis as KPI[]) || [
      { name: "Revenue", target: "", timeframe: "Monthly" },
      { name: "Users", target: "", timeframe: "Monthly" },
      { name: "Conversion Rate", target: "", timeframe: "Weekly" },
      { name: "Churn Rate", target: "", timeframe: "Monthly" },
      { name: "NPS Score", target: "", timeframe: "Quarterly" },
    ]
  );
  const [scalingStrategy, setScalingStrategy] = useState((data.scalingStrategy as string) || "");
  const [selectedGrowth, setSelectedGrowth] = useState<string[]>((data.selectedGrowth as string[]) || []);
  const [growthNotes, setGrowthNotes] = useState<Record<string, string>>((data.growthNotes as Record<string, string>) || {});

  const checkedCount = checklist.filter((c) => c.checked).length;
  const allChecked = checkedCount === checklist.length && checklist.length > 0;
  const [showCelebration, setShowCelebration] = useState(false);

  const filledCount = [checklist.some((c) => c.checked), preLaunch || launchDay || postLaunch, kpis.some((k) => k.target), scalingStrategy || selectedGrowth.length > 0].filter(Boolean).length;
  const completion = Math.round((filledCount / 4) * 100);

  const toggleCheck = (i: number) => {
    const updated = [...checklist];
    updated[i] = { ...updated[i], checked: !updated[i].checked };
    setChecklist(updated);
    const newCheckedCount = updated.filter((c) => c.checked).length;
    if (newCheckedCount === updated.length && !allChecked) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const updateKPI = (i: number, field: keyof KPI, value: string) => {
    const updated = [...kpis];
    updated[i] = { ...updated[i], [field]: value };
    setKpis(updated);
  };

  const saveData = () => {
    updateStepData("launch", { checklist, preLaunch, launchDay, postLaunch, kpis, scalingStrategy, selectedGrowth, growthNotes });
  };

  const handleSave = () => { saveData(); showToast("Progress saved"); };
  const handleContinue = () => { saveData(); markStepCompleted(5); showToast("All steps completed!"); router.push("/dashboard"); };

  return (
    <StepGuard stepNumber={5}>
    <div className="space-y-6">
      <StepHeader stepNumber={5} title="Launch & Grow" description="Plan your launch and growth strategy." completionPercent={completion} />

      {/* Launch Checklist */}
      <FormSection title="Launch Checklist" description="Track everything you need before launch." delay={0}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden mr-4">
              <motion.div
                animate={{ width: `${(checkedCount / checklist.length) * 100}%` }}
                className="h-full bg-accent rounded-full"
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-sm font-medium text-text-secondary flex-shrink-0">
              {checkedCount}/{checklist.length}
            </span>
          </div>
          <div className="space-y-2">
            {checklist.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <button
                  onClick={() => toggleCheck(i)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    item.checked ? "bg-accent border-accent" : "border-border hover:border-accent/50"
                  }`}
                >
                  {item.checked && <Check className="w-3 h-3 text-white" />}
                </button>
                <span className={`text-sm flex-1 ${item.checked ? "line-through text-text-secondary" : "text-text-primary"}`}>
                  {item.text}
                </span>
                <input
                  type="date"
                  value={item.dueDate}
                  onChange={(e) => {
                    const updated = [...checklist];
                    updated[i] = { ...updated[i], dueDate: e.target.value };
                    setChecklist(updated);
                  }}
                  className="text-xs px-2 py-1 rounded-lg border border-border bg-white text-text-secondary transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
              </div>
            ))}
          </div>
          <AnimatePresence>
            {showCelebration && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-4 p-4 bg-accent-muted rounded-xl text-center"
              >
                <PartyPopper className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-sm font-semibold text-accent-dark">
                  All tasks completed! You&apos;re ready to launch!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FormSection>

      {/* Launch Plan */}
      <FormSection title="Launch Plan" delay={1}
        aiButton={<AIGenerateButton onGenerate={() => {
          setPreLaunch("Build a waitlist landing page 4 weeks before launch. Run a social media teaser campaign with behind-the-scenes content about the ocean plastic recycling process. Send early access invites to beta testers and influencer partners. Prepare all marketing assets, email sequences, and PR materials.");
          setLaunchDay("Announce on all social channels simultaneously at 9 AM EST. Send launch email to full waitlist. Publish press release through PR Newswire. Host an Instagram Live unboxing event. Offer 20% early-bird discount for first 48 hours. Monitor social mentions and engage with every comment.");
          setPostLaunch("Follow up with all launch-day customers for reviews within 7 days. Analyze launch metrics and adjust ad spend. Ramp up retargeting campaigns for website visitors who didn't convert. Begin user-generated content campaign. Implement referral program for existing customers.");
        }} />}
      >
        <div>
          <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-xl">
            {(["pre", "launch", "post"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setLaunchTab(tab)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  launchTab === tab ? "bg-white text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {tab === "pre" ? "Pre-Launch" : tab === "launch" ? "Launch Day" : "Post-Launch"}
              </button>
            ))}
          </div>
          {launchTab === "pre" && (
            <textarea value={preLaunch} onChange={(e) => setPreLaunch(e.target.value)} placeholder="What needs to happen before launch day?" rows={4}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none" />
          )}
          {launchTab === "launch" && (
            <textarea value={launchDay} onChange={(e) => setLaunchDay(e.target.value)} placeholder="What's your launch day plan?" rows={4}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none" />
          )}
          {launchTab === "post" && (
            <textarea value={postLaunch} onChange={(e) => setPostLaunch(e.target.value)} placeholder="What happens after launch?" rows={4}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none" />
          )}
        </div>
      </FormSection>

      {/* Growth Metrics */}
      <FormSection title="Growth Metrics" description="Define the KPIs you'll track." delay={2}
        aiButton={<AIGenerateButton onGenerate={() => setKpis([
          { name: "Monthly Revenue", target: "$15,000", timeframe: "Monthly" },
          { name: "Active Users", target: "500", timeframe: "Monthly" },
          { name: "Conversion Rate", target: "3.5%", timeframe: "Weekly" },
          { name: "Customer Churn", target: "<5%", timeframe: "Monthly" },
          { name: "NPS Score", target: "70+", timeframe: "Quarterly" },
        ])} />}
      >
        <div className="space-y-2">
          {kpis.map((kpi, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
              <input type="text" value={kpi.name} onChange={(e) => updateKPI(i, "name", e.target.value)} placeholder="Metric name"
                className="px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-text-primary placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
              <input type="text" value={kpi.target} onChange={(e) => updateKPI(i, "target", e.target.value)} placeholder="Target value"
                className="px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-text-primary placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
              <select value={kpi.timeframe} onChange={(e) => updateKPI(i, "timeframe", e.target.value)}
                className="px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-text-primary transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent">
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
              </select>
              <button onClick={() => setKpis(kpis.filter((_, idx) => idx !== i))} className="p-2 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={() => setKpis([...kpis, { name: "", target: "", timeframe: "Monthly" }])} className="flex items-center gap-2 text-sm text-accent font-medium hover:text-accent-dark transition-colors mt-2">
            <Plus className="w-4 h-4" /> Add Metric
          </button>
        </div>
      </FormSection>

      {/* Scaling Strategy */}
      <FormSection title="Scaling Strategy" description="How will you grow from 100 to 10,000 customers?" delay={3}
        aiButton={<AIGenerateButton onGenerate={() => {
          setScalingStrategy("Our scaling strategy combines organic community-building with strategic paid acquisition. We'll leverage our sustainability story for viral social content while investing in influencer partnerships and targeted ads on Instagram and TikTok. As we hit 1,000 customers, we'll introduce a referral program offering free filters for successful referrals, creating a product-led growth loop.");
          setSelectedGrowth(["organic", "product-led"]);
          setGrowthNotes({
            organic: "Focus on SEO for sustainability-related keywords and user-generated content campaigns showcasing the ocean plastic story.",
            "product-led": "Implement referral program: give a free filter replacement for every friend referred. Add sharing features to hydration tracking.",
          });
        }} />}
      >
        <div className="space-y-4">
          <div>
            <textarea value={scalingStrategy} onChange={(e) => setScalingStrategy(e.target.value)} placeholder="Describe your approach to scaling..." rows={4}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {growthOptions.map((opt) => {
              const isSelected = selectedGrowth.includes(opt.id);
              return (
                <div key={opt.id}>
                  <button
                    onClick={() => setSelectedGrowth(prev => prev.includes(opt.id) ? prev.filter(x => x !== opt.id) : [...prev, opt.id])}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${isSelected ? "border-accent bg-accent-muted" : "border-border bg-white hover:border-gray-300"}`}
                  >
                    <p className={`text-sm font-semibold ${isSelected ? "text-accent-dark" : "text-text-primary"}`}>{opt.name}</p>
                    <p className="text-xs text-text-secondary mt-1">{opt.desc}</p>
                  </button>
                  {isSelected && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2">
                      <textarea
                        value={growthNotes[opt.id] || ""}
                        onChange={(e) => setGrowthNotes(prev => ({ ...prev, [opt.id]: e.target.value }))}
                        placeholder="Add notes..."
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text-primary placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
                      />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </FormSection>

      <div className="flex items-center justify-between pt-4 pb-8">
        <button onClick={handleSave} className="px-6 py-2.5 rounded-full border border-border text-sm font-medium text-text-secondary hover:bg-white hover:border-gray-300 transition-all">Save Draft</button>
        <button onClick={handleContinue} className="px-8 py-3 rounded-full bg-accent text-white text-sm font-heading font-medium hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] transition-all">Complete & Finish</button>
      </div>
    </div>
    </StepGuard>
  );
}
