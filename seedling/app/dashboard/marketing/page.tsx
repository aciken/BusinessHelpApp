"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Share2,
  FileText as FileTextIcon,
  Search,
  DollarSign,
  Mail,
  Users,
  Newspaper,
  Handshake,
  Calendar,
  Gift,
} from "lucide-react";
import StepGuard from "@/components/dashboard/StepGuard";
import StepHeader from "@/components/dashboard/StepHeader";
import FormSection from "@/components/dashboard/FormSection";
import AIGenerateButton from "@/components/dashboard/AIGenerateButton";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { useToast } from "@/components/dashboard/Toast";

const voiceOptions = ["Professional", "Friendly", "Bold", "Playful", "Luxurious", "Technical", "Casual"];
const channelOptions = [
  { id: "social", name: "Social Media", icon: Share2 },
  { id: "content", name: "Content Marketing", icon: FileTextIcon },
  { id: "seo", name: "SEO", icon: Search },
  { id: "paid", name: "Paid Ads", icon: DollarSign },
  { id: "email", name: "Email Marketing", icon: Mail },
  { id: "influencer", name: "Influencer Marketing", icon: Users },
  { id: "pr", name: "PR", icon: Newspaper },
  { id: "partnerships", name: "Partnerships", icon: Handshake },
  { id: "events", name: "Events", icon: Calendar },
  { id: "referral", name: "Referral Program", icon: Gift },
];
const frequencyOptions = ["Daily", "3x/week", "Weekly", "Bi-weekly", "Monthly"];
const platformOptions = ["Blog", "Twitter/X", "LinkedIn", "Instagram", "TikTok", "YouTube", "Newsletter", "Podcast"];

interface ChannelConfig {
  budget: string;
  priority: string;
}

export default function MarketingPage() {
  const router = useRouter();
  const { state, updateStepData, markStepCompleted } = useDashboard();
  const { showToast } = useToast();
  const data = state.steps.marketing;

  const [brandVoice, setBrandVoice] = useState<string[]>((data.brandVoice as string[]) || []);
  const [mission, setMission] = useState((data.mission as string) || "");
  const [tagline, setTagline] = useState((data.tagline as string) || "");
  const [selectedChannels, setSelectedChannels] = useState<string[]>((data.selectedChannels as string[]) || []);
  const [channelConfigs, setChannelConfigs] = useState<Record<string, ChannelConfig>>((data.channelConfigs as Record<string, ChannelConfig>) || {});
  const [contentTopics, setContentTopics] = useState((data.contentTopics as string) || "");
  const [frequency, setFrequency] = useState((data.frequency as string) || "");
  const [platforms, setPlatforms] = useState<string[]>((data.platforms as string[]) || []);
  const [cpa, setCpa] = useState((data.cpa as string) || "");
  const [ltv, setLtv] = useState((data.ltv as string) || "");
  const [acquisitionStrategy, setAcquisitionStrategy] = useState((data.acquisitionStrategy as string) || "");

  const ltvCpaRatio = useMemo(() => {
    const l = parseFloat(ltv) || 0;
    const c = parseFloat(cpa) || 0;
    if (c === 0) return 0;
    return l / c;
  }, [ltv, cpa]);

  const filledCount = [brandVoice.length > 0, mission, tagline, selectedChannels.length > 0, contentTopics, frequency, platforms.length > 0, cpa, ltv, acquisitionStrategy].filter(Boolean).length;
  const completion = Math.round((filledCount / 10) * 100);

  const toggleChannel = (id: string) => {
    setSelectedChannels((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const updateChannelConfig = (id: string, field: keyof ChannelConfig, value: string) => {
    setChannelConfigs((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const saveData = () => {
    updateStepData("marketing", { brandVoice, mission, tagline, selectedChannels, channelConfigs, contentTopics, frequency, platforms, cpa, ltv, acquisitionStrategy });
  };

  const handleSave = () => { saveData(); showToast("Progress saved"); };
  const handleContinue = () => { saveData(); markStepCompleted(4); showToast("Step 4 completed!"); router.push("/dashboard/launch"); };

  return (
    <StepGuard stepNumber={4}>
    <div className="space-y-6">
      <StepHeader stepNumber={4} title="Marketing Strategy" description="Plan how to reach and acquire customers." completionPercent={completion} />

      {/* Brand Identity */}
      <FormSection title="Brand Identity" delay={0}
        aiButton={<AIGenerateButton onGenerate={() => { setBrandVoice(["Friendly", "Bold"]); setMission("To make sustainable hydration accessible and appealing to everyone, proving that choosing the planet doesn't mean compromising on quality or style."); setTagline("Drink Clean. Live Green."); }} />}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Brand Voice</label>
            <div className="flex flex-wrap gap-2">
              {voiceOptions.map((v) => (
                <button key={v} onClick={() => setBrandVoice(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${brandVoice.includes(v) ? "bg-accent text-white border-accent" : "bg-white text-text-secondary border-border hover:border-accent/40"}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Brand Mission Statement</label>
            <textarea value={mission} onChange={(e) => setMission(e.target.value)} placeholder="What is your brand's mission?" rows={2}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Tagline / Slogan</label>
            <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="e.g., Just Do It"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
          </div>
        </div>
      </FormSection>

      {/* Marketing Channels */}
      <FormSection title="Marketing Channels" description="Select the channels you'll use to reach customers." delay={1}
        aiButton={<AIGenerateButton onGenerate={() => {
          setSelectedChannels(["social", "content", "seo", "email", "influencer"]);
          setChannelConfigs({
            social: { budget: "2000", priority: "Primary" },
            content: { budget: "1500", priority: "Primary" },
            seo: { budget: "500", priority: "Secondary" },
            email: { budget: "300", priority: "Primary" },
            influencer: { budget: "3000", priority: "Secondary" },
          });
        }} />}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-4">
          {channelOptions.map((ch) => {
            const Icon = ch.icon;
            const isSelected = selectedChannels.includes(ch.id);
            return (
              <button key={ch.id} onClick={() => toggleChannel(ch.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${isSelected ? "border-accent bg-accent-muted text-accent-dark" : "border-border bg-white text-text-secondary hover:border-gray-300"}`}>
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium text-center">{ch.name}</span>
              </button>
            );
          })}
        </div>
        {selectedChannels.length > 0 && (
          <div className="space-y-2 mt-4 pt-4 border-t border-border-light">
            {selectedChannels.map((id) => {
              const ch = channelOptions.find((c) => c.id === id);
              const config = channelConfigs[id] || { budget: "", priority: "Primary" };
              return (
                <div key={id} className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-medium text-text-primary w-36 truncate">{ch?.name}</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">$</span>
                    <input type="number" value={config.budget} onChange={(e) => updateChannelConfig(id, "budget", e.target.value)} placeholder="Budget"
                      className="w-28 pl-7 pr-3 py-2 rounded-lg border border-border bg-white text-sm text-text-primary placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                  </div>
                  <select value={config.priority} onChange={(e) => updateChannelConfig(id, "priority", e.target.value)}
                    className="px-3 py-2 rounded-lg border border-border bg-white text-sm text-text-primary transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent">
                    <option value="Primary">Primary</option>
                    <option value="Secondary">Secondary</option>
                    <option value="Experimental">Experimental</option>
                  </select>
                </div>
              );
            })}
          </div>
        )}
      </FormSection>

      {/* Content Strategy */}
      <FormSection title="Content Strategy" delay={2}
        aiButton={<AIGenerateButton onGenerate={() => { setContentTopics("Sustainable living tips, water quality education, behind-the-scenes of ocean plastic recycling, customer impact stories, hydration health benefits, environmental activism partnerships"); setFrequency("3x/week"); setPlatforms(["Blog", "Instagram", "LinkedIn", "Newsletter"]); }} />}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Key Topics & Themes</label>
            <textarea value={contentTopics} onChange={(e) => setContentTopics(e.target.value)} placeholder="What topics will you create content about?" rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Publishing Frequency</label>
            <div className="flex flex-wrap gap-2">
              {frequencyOptions.map((f) => (
                <button key={f} onClick={() => setFrequency(f)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${frequency === f ? "bg-accent text-white border-accent" : "bg-white text-text-secondary border-border hover:border-accent/40"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Platforms</label>
            <div className="flex flex-wrap gap-2">
              {platformOptions.map((p) => (
                <button key={p} onClick={() => setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${platforms.includes(p) ? "bg-accent text-white border-accent" : "bg-white text-text-secondary border-border hover:border-accent/40"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </FormSection>

      {/* Customer Acquisition */}
      <FormSection title="Customer Acquisition" delay={3}
        aiButton={<AIGenerateButton onGenerate={() => { setCpa("25"); setLtv("120"); setAcquisitionStrategy("Our primary acquisition strategy focuses on organic social media and content marketing, targeting environmentally conscious consumers through Instagram and TikTok. We'll leverage user-generated content showing the ocean plastic impact story, combined with influencer partnerships in the sustainability and fitness niches. Email marketing will nurture leads through a free 'Sustainability Score' calculator landing page."); }} />}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Target Cost per Acquisition (CPA)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">$</span>
                <input type="number" value={cpa} onChange={(e) => setCpa(e.target.value)} placeholder="0"
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Customer Lifetime Value (LTV)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">$</span>
                <input type="number" value={ltv} onChange={(e) => setLtv(e.target.value)} placeholder="0"
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
              </div>
            </div>
          </div>
          {ltvCpaRatio > 0 && (
            <div className={`p-4 rounded-xl text-center ${ltvCpaRatio >= 3 ? "bg-accent-muted" : ltvCpaRatio >= 1 ? "bg-amber-50" : "bg-red-50"}`}>
              <p className="text-xs text-text-secondary mb-1">LTV:CPA Ratio</p>
              <p className={`text-3xl font-heading font-bold ${ltvCpaRatio >= 3 ? "text-accent" : ltvCpaRatio >= 1 ? "text-amber-600" : "text-red-500"}`}>
                {ltvCpaRatio.toFixed(1)}:1
              </p>
              <p className={`text-xs mt-1 ${ltvCpaRatio >= 3 ? "text-accent-dark" : ltvCpaRatio >= 1 ? "text-amber-700" : "text-red-600"}`}>
                {ltvCpaRatio >= 3 ? "Excellent — healthy unit economics" : ltvCpaRatio >= 1 ? "Moderate — room for improvement" : "Warning — spending more than you earn"}
              </p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Primary Acquisition Strategy</label>
            <textarea value={acquisitionStrategy} onChange={(e) => setAcquisitionStrategy(e.target.value)} placeholder="How will you acquire your first 1,000 customers?" rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none" />
          </div>
        </div>
      </FormSection>

      <div className="flex items-center justify-between pt-4 pb-8">
        <button onClick={handleSave} className="px-6 py-2.5 rounded-full border border-border text-sm font-medium text-text-secondary hover:bg-white hover:border-gray-300 transition-all">Save Draft</button>
        <button onClick={handleContinue} className="px-8 py-3 rounded-full bg-accent text-white text-sm font-heading font-medium hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] transition-all">Save & Continue</button>
      </div>
    </div>
    </StepGuard>
  );
}
