"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import StepGuard from "@/components/dashboard/StepGuard";
import StepHeader from "@/components/dashboard/StepHeader";
import FormSection from "@/components/dashboard/FormSection";
import AIGenerateButton from "@/components/dashboard/AIGenerateButton";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { useToast } from "@/components/dashboard/Toast";

interface CostRow {
  category: string;
  oneTime: string;
  monthly: string;
}

interface Milestone {
  name: string;
  date: string;
  description: string;
}

export default function PlanPage() {
  const router = useRouter();
  const { state, updateStepData, markStepCompleted } = useDashboard();
  const { showToast } = useToast();
  const data = state.steps.plan;

  const [execSummary, setExecSummary] = useState((data.execSummary as string) || "");
  const [customers, setCustomers] = useState((data.customers as string) || "");
  const [avgRevenue, setAvgRevenue] = useState((data.avgRevenue as string) || "");
  const [growthRate, setGrowthRate] = useState((data.growthRate as string) || "");
  const [costs, setCosts] = useState<CostRow[]>(
    (data.costs as CostRow[]) || [
      { category: "Product Development", oneTime: "", monthly: "" },
      { category: "Marketing", oneTime: "", monthly: "" },
      { category: "Legal & Admin", oneTime: "", monthly: "" },
      { category: "Operations", oneTime: "", monthly: "" },
      { category: "Technology", oneTime: "", monthly: "" },
      { category: "Other", oneTime: "", monthly: "" },
    ]
  );
  const [milestones, setMilestones] = useState<Milestone[]>(
    (data.milestones as Milestone[]) || [
      { name: "MVP Launch", date: "", description: "" },
      { name: "First 100 Users", date: "", description: "" },
      { name: "Break Even", date: "", description: "" },
      { name: "Series A", date: "", description: "" },
    ]
  );

  // Revenue calculations
  const monthlyRevenue = useMemo(() => {
    const c = parseFloat(customers) || 0;
    const r = parseFloat(avgRevenue) || 0;
    return c * r;
  }, [customers, avgRevenue]);

  const annualRevenue = monthlyRevenue * 12;
  const year2Projection = useMemo(() => {
    const g = (parseFloat(growthRate) || 0) / 100;
    return annualRevenue * (1 + g * 12);
  }, [annualRevenue, growthRate]);

  const totalOneTime = costs.reduce((sum, c) => sum + (parseFloat(c.oneTime) || 0), 0);
  const totalMonthly = costs.reduce((sum, c) => sum + (parseFloat(c.monthly) || 0), 0);

  const wordCount = execSummary.trim().split(/\s+/).filter(Boolean).length;

  const filledCount = [execSummary, customers, avgRevenue, costs.some((c) => c.oneTime || c.monthly), milestones.some((m) => m.name && m.date)].filter(Boolean).length;
  const completion = Math.round((filledCount / 5) * 100);

  const updateCost = (i: number, field: keyof CostRow, value: string) => {
    const updated = [...costs];
    updated[i] = { ...updated[i], [field]: value };
    setCosts(updated);
  };

  const updateMilestone = (i: number, field: keyof Milestone, value: string) => {
    const updated = [...milestones];
    updated[i] = { ...updated[i], [field]: value };
    setMilestones(updated);
  };

  const saveData = () => {
    updateStepData("plan", { execSummary, customers, avgRevenue, growthRate, costs, milestones });
  };

  const handleSave = () => { saveData(); showToast("Progress saved"); };
  const handleContinue = () => { saveData(); markStepCompleted(3); showToast("Step 3 completed!"); router.push("/dashboard/marketing"); };

  const formatNum = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  return (
    <StepGuard stepNumber={3}>
    <div className="space-y-6">
      <StepHeader stepNumber={3} title="Business Plan" description="Create a structured business plan and financial projections." completionPercent={completion} />

      {/* Executive Summary */}
      <FormSection title="Executive Summary" delay={0}
        aiButton={<AIGenerateButton onGenerate={() => setExecSummary("EcoBottle is poised to disrupt the $11.5 billion reusable water bottle market by offering the first product that combines ocean plastic sustainability with advanced three-stage water filtration. Our target market of environmentally conscious millennials and Gen-Z professionals represents a $2.4 billion serviceable market growing at 12% annually.\n\nOur go-to-market strategy leverages direct-to-consumer sales through our e-commerce platform, supplemented by strategic retail partnerships with REI, Whole Foods, and specialty outdoor retailers. With a projected Year 1 revenue of $180,000 and a clear path to profitability by Month 18, we're seeking $500K in seed funding to scale production and expand our marketing reach.\n\nThe founding team brings 15+ years of combined experience in sustainable manufacturing and consumer products, with established relationships in the recycled plastics supply chain.")} />}
      >
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Write a compelling executive summary</label>
          <textarea value={execSummary} onChange={(e) => setExecSummary(e.target.value)} placeholder="Summarize your business vision, market opportunity, and why you'll succeed..." rows={8}
            className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none" />
          <p className="text-xs text-text-secondary mt-1.5 text-right">{wordCount} words</p>
        </div>
      </FormSection>

      {/* Revenue Model */}
      <FormSection title="Revenue Model" description="Project your revenue potential." delay={1}
        aiButton={<AIGenerateButton onGenerate={() => { setCustomers("500"); setAvgRevenue("30"); setGrowthRate("15"); }} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Expected Customers (Year 1)</label>
            <input type="number" value={customers} onChange={(e) => setCustomers(e.target.value)} placeholder="0"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Avg Revenue per Customer</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">$</span>
              <input type="number" value={avgRevenue} onChange={(e) => setAvgRevenue(e.target.value)} placeholder="0"
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Monthly Growth Rate</label>
            <div className="relative">
              <input type="number" value={growthRate} onChange={(e) => setGrowthRate(e.target.value)} placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent pr-8" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">%</span>
            </div>
          </div>
        </div>
        {monthlyRevenue > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-accent-muted rounded-xl">
            <div className="text-center">
              <p className="text-xs text-text-secondary mb-1">Monthly Revenue</p>
              <p className="text-2xl font-heading font-bold text-accent">${formatNum(monthlyRevenue)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-text-secondary mb-1">Annual Revenue</p>
              <p className="text-2xl font-heading font-bold text-accent">${formatNum(annualRevenue)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-text-secondary mb-1">Year 2 Projection</p>
              <p className="text-2xl font-heading font-bold text-accent">${formatNum(year2Projection)}</p>
            </div>
          </div>
        )}
      </FormSection>

      {/* Startup Costs */}
      <FormSection title="Startup Costs" description="Estimate your initial and ongoing costs." delay={2}
        aiButton={<AIGenerateButton onGenerate={() => setCosts([
          { category: "Product Development", oneTime: "35000", monthly: "2000" },
          { category: "Marketing", oneTime: "5000", monthly: "3000" },
          { category: "Legal & Admin", oneTime: "8000", monthly: "500" },
          { category: "Operations", oneTime: "3000", monthly: "1500" },
          { category: "Technology", oneTime: "2000", monthly: "800" },
          { category: "Other", oneTime: "2000", monthly: "500" },
        ])} />}
      >
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 text-xs font-medium text-text-secondary px-1">
            <span>Category</span>
            <span className="w-28 text-center">One-time ($)</span>
            <span className="w-28 text-center">Monthly ($)</span>
            <span className="w-10" />
          </div>
          {costs.map((cost, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center">
              <input type="text" value={cost.category} onChange={(e) => updateCost(i, "category", e.target.value)} placeholder="Category"
                className="px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-text-primary placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
              <input type="number" value={cost.oneTime} onChange={(e) => updateCost(i, "oneTime", e.target.value)} placeholder="0"
                className="w-28 px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-text-primary placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent text-center" />
              <input type="number" value={cost.monthly} onChange={(e) => updateCost(i, "monthly", e.target.value)} placeholder="0"
                className="w-28 px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-text-primary placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent text-center" />
              <button onClick={() => setCosts(costs.filter((_, idx) => idx !== i))} className="p-2 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={() => setCosts([...costs, { category: "", oneTime: "", monthly: "" }])} className="flex items-center gap-2 text-sm text-accent font-medium hover:text-accent-dark transition-colors mt-2">
            <Plus className="w-4 h-4" /> Add Cost
          </button>
          {(totalOneTime > 0 || totalMonthly > 0) && (
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center mt-4 pt-3 border-t border-border-light">
              <span className="text-sm font-semibold text-text-primary px-3">Total</span>
              <span className="w-28 text-center text-sm font-bold text-text-primary">${formatNum(totalOneTime)}</span>
              <span className="w-28 text-center text-sm font-bold text-text-primary">${formatNum(totalMonthly)}/mo</span>
              <span className="w-10" />
            </div>
          )}
        </div>
      </FormSection>

      {/* Milestones */}
      <FormSection title="Milestones & Timeline" description="Plan your key business milestones." delay={3}
        aiButton={<AIGenerateButton onGenerate={() => setMilestones([
          { name: "MVP Launch", date: "2025-06", description: "Launch initial product with core filtration feature on Shopify store" },
          { name: "First 100 Users", date: "2025-09", description: "Hit 100 paying customers through DTC and social marketing" },
          { name: "Retail Partnership", date: "2025-12", description: "Secure first retail partner (REI or Whole Foods)" },
          { name: "Break Even", date: "2026-06", description: "Monthly revenue covers all operating costs" },
          { name: "Series A", date: "2026-12", description: "Raise Series A to expand into European markets" },
        ])} />}
      >
        <div className="relative pl-8">
          {/* Timeline line */}
          <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border-light" />
          <div className="space-y-6">
            {milestones.map((m, i) => (
              <div key={i} className="relative">
                {/* Dot */}
                <div className={`absolute -left-[22px] top-3 w-3 h-3 rounded-full border-2 ${m.name && m.date ? "bg-accent border-accent" : "bg-white border-border"}`} />
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_2fr_auto] gap-2 items-start">
                  <input type="text" value={m.name} onChange={(e) => updateMilestone(i, "name", e.target.value)} placeholder="Milestone name"
                    className="px-3 py-2.5 rounded-lg border border-border bg-white text-sm font-medium text-text-primary placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                  <input type="month" value={m.date} onChange={(e) => updateMilestone(i, "date", e.target.value)}
                    className="px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-text-primary transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                  <input type="text" value={m.description} onChange={(e) => updateMilestone(i, "description", e.target.value)} placeholder="Brief description"
                    className="px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-text-primary placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                  <button onClick={() => setMilestones(milestones.filter((_, idx) => idx !== i))} className="p-2 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setMilestones([...milestones, { name: "", date: "", description: "" }])} className="flex items-center gap-2 text-sm text-accent font-medium hover:text-accent-dark transition-colors mt-4 ml-2">
            <Plus className="w-4 h-4" /> Add Milestone
          </button>
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
