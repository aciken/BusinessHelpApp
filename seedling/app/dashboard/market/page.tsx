"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Info } from "lucide-react";
import StepGuard from "@/components/dashboard/StepGuard";
import StepHeader from "@/components/dashboard/StepHeader";
import FormSection from "@/components/dashboard/FormSection";
import AIGenerateButton from "@/components/dashboard/AIGenerateButton";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { useToast } from "@/components/dashboard/Toast";

interface Competitor {
  name: string;
  strength: string;
  weakness: string;
  threat: string;
}

function Tooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex ml-1">
      <Info className="w-3.5 h-3.5 text-text-secondary cursor-help" />
      <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 text-xs text-white bg-gray-900 rounded-lg shadow-lg z-10">
        {text}
      </span>
    </span>
  );
}

export default function MarketPage() {
  const router = useRouter();
  const { state, updateStepData, markStepCompleted } = useDashboard();
  const { showToast } = useToast();
  const data = state.steps.market;

  const [tam, setTam] = useState((data.tam as string) || "");
  const [sam, setSam] = useState((data.sam as string) || "");
  const [som, setSom] = useState((data.som as string) || "");
  const [competitors, setCompetitors] = useState<Competitor[]>(
    (data.competitors as Competitor[]) || [
      { name: "", strength: "", weakness: "", threat: "Medium" },
      { name: "", strength: "", weakness: "", threat: "Medium" },
      { name: "", strength: "", weakness: "", threat: "Medium" },
    ]
  );
  const [trends, setTrends] = useState((data.trends as string) || "");
  const [trendDirection, setTrendDirection] = useState((data.trendDirection as string) || "");
  const [strengths, setStrengths] = useState((data.strengths as string) || "");
  const [weaknesses, setWeaknesses] = useState((data.weaknesses as string) || "");
  const [opportunities, setOpportunities] = useState((data.opportunities as string) || "");
  const [threats, setThreats] = useState((data.threats as string) || "");

  const filledCount = [tam, sam, som, competitors.some((c) => c.name), trends, trendDirection, strengths, weaknesses, opportunities, threats].filter(Boolean).length;
  const completion = Math.round((filledCount / 10) * 100);

  const updateCompetitor = (i: number, field: keyof Competitor, value: string) => {
    const updated = [...competitors];
    updated[i] = { ...updated[i], [field]: value };
    setCompetitors(updated);
  };

  const saveData = () => {
    updateStepData("market", { tam, sam, som, competitors, trends, trendDirection, strengths, weaknesses, opportunities, threats });
  };

  const handleSave = () => {
    saveData();
    showToast("Progress saved");
  };

  const handleContinue = () => {
    saveData();
    markStepCompleted(1);
    showToast("Step 1 completed!");
    router.push("/dashboard/product");
  };

  return (
    <StepGuard stepNumber={1}>
    <div className="space-y-6">
      <StepHeader
        stepNumber={1}
        title="Market Validation"
        description="Research the market opportunity and competitive landscape."
        completionPercent={completion}
      />

      {/* Market Size */}
      <FormSection
        title="Market Size"
        description="Estimate your market opportunity at different levels."
        delay={0}
        aiButton={
          <AIGenerateButton
            onGenerate={() => {
              setTam("12,500,000,000");
              setSam("2,400,000,000");
              setSom("48,000,000");
            }}
          />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="flex items-center text-sm font-medium text-text-primary mb-1.5">
              TAM
              <Tooltip text="Total Addressable Market — the total revenue opportunity if you captured 100% of the market." />
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">$</span>
              <input
                type="text"
                value={tam}
                onChange={(e) => setTam(e.target.value)}
                placeholder="0"
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </div>
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-text-primary mb-1.5">
              SAM
              <Tooltip text="Serviceable Addressable Market — the segment of TAM you can realistically target." />
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">$</span>
              <input
                type="text"
                value={sam}
                onChange={(e) => setSam(e.target.value)}
                placeholder="0"
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </div>
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-text-primary mb-1.5">
              SOM
              <Tooltip text="Serviceable Obtainable Market — the portion of SAM you can capture short-term." />
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">$</span>
              <input
                type="text"
                value={som}
                onChange={(e) => setSom(e.target.value)}
                placeholder="0"
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
            </div>
          </div>
        </div>

        {/* Nested circles visualization */}
        {(tam || sam || som) && (
          <div className="flex items-center justify-center py-4">
            <div className="relative w-48 h-48 rounded-full bg-accent/5 border-2 border-accent/20 flex items-center justify-center">
              <span className="absolute top-2 text-[10px] font-medium text-accent-dark">TAM</span>
              <div className="w-32 h-32 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
                <span className="absolute text-[10px] font-medium text-accent-dark" style={{ marginTop: "-3.5rem" }}>SAM</span>
                <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent/40 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-accent-dark">SOM</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </FormSection>

      {/* Competitor Analysis */}
      <FormSection
        title="Competitor Analysis"
        description="Identify key players in your space."
        delay={1}
        aiButton={
          <AIGenerateButton
            onGenerate={() =>
              setCompetitors([
                { name: "Hydro Flask", strength: "Strong brand recognition & retail presence", weakness: "No filtration technology, premium pricing", threat: "High" },
                { name: "Brita", strength: "Trusted filtration brand, wide distribution", weakness: "Outdated design, not eco-focused", threat: "Medium" },
                { name: "LifeStraw", strength: "Advanced filtration, outdoor niche", weakness: "Limited everyday appeal, niche market", threat: "Low" },
                { name: "S'well", strength: "Fashion-forward design, lifestyle brand", weakness: "No filtration, sustainability messaging lacking", threat: "Medium" },
              ])
            }
          />
        }
      >
        <div className="space-y-3">
          {competitors.map((comp, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto_auto] gap-2 items-start">
              <input
                type="text"
                value={comp.name}
                onChange={(e) => updateCompetitor(i, "name", e.target.value)}
                placeholder="Competitor name"
                className="px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-text-primary placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
              <input
                type="text"
                value={comp.strength}
                onChange={(e) => updateCompetitor(i, "strength", e.target.value)}
                placeholder="Their strength"
                className="px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-text-primary placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
              <input
                type="text"
                value={comp.weakness}
                onChange={(e) => updateCompetitor(i, "weakness", e.target.value)}
                placeholder="Their weakness"
                className="px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-text-primary placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
              <select
                value={comp.threat}
                onChange={(e) => updateCompetitor(i, "threat", e.target.value)}
                className="px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-text-primary transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <button
                onClick={() => setCompetitors(competitors.filter((_, idx) => idx !== i))}
                className="p-2.5 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => setCompetitors([...competitors, { name: "", strength: "", weakness: "", threat: "Medium" }])}
            className="flex items-center gap-2 text-sm text-accent font-medium hover:text-accent-dark transition-colors mt-2"
          >
            <Plus className="w-4 h-4" /> Add Competitor
          </button>
        </div>
      </FormSection>

      {/* Market Trends */}
      <FormSection
        title="Market Trends"
        description="What's happening in your industry?"
        delay={2}
        aiButton={
          <AIGenerateButton
            onGenerate={() => {
              setTrends(
                "The sustainable products market is experiencing rapid growth, driven by increasing environmental awareness among younger consumers. The reusable water bottle market alone is projected to reach $11.5B by 2028. Key trends include: integration of smart technology, focus on circular economy principles, and growing demand for products that combine functionality with sustainability."
              );
              setTrendDirection("Growing");
            }}
          />
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Key trends in your industry
            </label>
            <textarea
              value={trends}
              onChange={(e) => setTrends(e.target.value)}
              placeholder="Describe the major trends shaping your industry..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Market Direction
            </label>
            <div className="flex gap-2">
              {["Growing", "Stable", "Declining"].map((dir) => (
                <button
                  key={dir}
                  onClick={() => setTrendDirection(dir)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    trendDirection === dir
                      ? dir === "Growing"
                        ? "bg-accent text-white border-accent"
                        : dir === "Stable"
                        ? "bg-amber-500 text-white border-amber-500"
                        : "bg-red-500 text-white border-red-500"
                      : "bg-white text-text-secondary border-border hover:border-gray-300"
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>
        </div>
      </FormSection>

      {/* SWOT Analysis */}
      <FormSection
        title="SWOT Analysis"
        description="Assess your strategic position."
        delay={3}
        aiButton={
          <AIGenerateButton
            onGenerate={() => {
              setStrengths("Unique combination of sustainability + filtration. First-mover advantage in eco-filtration niche. Strong emotional appeal to environmentally conscious consumers. Made from recycled ocean plastic — compelling brand story.");
              setWeaknesses("Higher production costs due to recycled materials. No established brand recognition yet. Reliance on proprietary filter technology — supply chain risk. Limited initial capital for scaling.");
              setOpportunities("Growing $11.5B reusable bottle market. Corporate wellness programs seeking eco-friendly products. Partnership potential with environmental organizations. Subscription model for replacement filters.");
              setThreats("Major brands (Hydro Flask, Brita) could enter the space. Raw material price volatility for recycled plastics. Consumer skepticism about filtration effectiveness. Economic downturn could shift priorities from premium to budget products.");
            }}
          />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-accent-muted/50 rounded-xl p-4">
            <label className="block text-sm font-semibold text-accent-dark mb-2">Strengths</label>
            <textarea
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              placeholder="What are your advantages?"
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg border border-accent/20 bg-white text-sm text-text-primary placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
            />
          </div>
          <div className="bg-red-50/50 rounded-xl p-4">
            <label className="block text-sm font-semibold text-red-700 mb-2">Weaknesses</label>
            <textarea
              value={weaknesses}
              onChange={(e) => setWeaknesses(e.target.value)}
              placeholder="Where could you improve?"
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg border border-red-200 bg-white text-sm text-text-primary placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 resize-none"
            />
          </div>
          <div className="bg-blue-50/50 rounded-xl p-4">
            <label className="block text-sm font-semibold text-blue-700 mb-2">Opportunities</label>
            <textarea
              value={opportunities}
              onChange={(e) => setOpportunities(e.target.value)}
              placeholder="What opportunities could you exploit?"
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg border border-blue-200 bg-white text-sm text-text-primary placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 resize-none"
            />
          </div>
          <div className="bg-amber-50/50 rounded-xl p-4">
            <label className="block text-sm font-semibold text-amber-700 mb-2">Threats</label>
            <textarea
              value={threats}
              onChange={(e) => setThreats(e.target.value)}
              placeholder="What challenges could harm you?"
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg border border-amber-200 bg-white text-sm text-text-primary placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 resize-none"
            />
          </div>
        </div>
      </FormSection>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 pb-8">
        <button onClick={handleSave} className="px-6 py-2.5 rounded-full border border-border text-sm font-medium text-text-secondary hover:bg-white hover:border-gray-300 transition-all">
          Save Draft
        </button>
        <button onClick={handleContinue} className="px-8 py-3 rounded-full bg-accent text-white text-sm font-heading font-medium hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25 hover:scale-[1.02] active:scale-[0.98] transition-all">
          Save & Continue
        </button>
      </div>
    </div>
    </StepGuard>
  );
}
