"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import StepGuard from "@/components/dashboard/StepGuard";
import StepHeader from "@/components/dashboard/StepHeader";
import FormSection from "@/components/dashboard/FormSection";
import AIGenerateButton from "@/components/dashboard/AIGenerateButton";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { useToast } from "@/components/dashboard/Toast";

interface Feature {
  name: string;
  description: string;
  priority: string;
}

const productTypes = ["Physical Product", "Digital Product", "SaaS", "Service", "Marketplace", "Other"];
const pricingModels = ["One-time", "Subscription", "Freemium", "Pay-per-use", "Tiered"];

const uvpTemplates = [
  "We help [audience] achieve [outcome] by [method]",
  "The only [product type] that [unique benefit]",
  "Unlike [competitor], we [differentiator]",
];

export default function ProductPage() {
  const router = useRouter();
  const { state, updateStepData, markStepCompleted } = useDashboard();
  const { showToast } = useToast();
  const data = state.steps.product;

  const [productName, setProductName] = useState((data.productName as string) || "");
  const [productType, setProductType] = useState((data.productType as string) || "");
  const [productDesc, setProductDesc] = useState((data.productDesc as string) || "");
  const [features, setFeatures] = useState<Feature[]>(
    (data.features as Feature[]) || [
      { name: "", description: "", priority: "Must Have" },
      { name: "", description: "", priority: "Must Have" },
      { name: "", description: "", priority: "Nice to Have" },
    ]
  );
  const [pricingModel, setPricingModel] = useState((data.pricingModel as string) || "");
  const [basePrice, setBasePrice] = useState((data.basePrice as string) || "");
  const [tiers, setTiers] = useState(
    (data.tiers as { name: string; price: string; desc: string }[]) || [
      { name: "Basic", price: "", desc: "" },
      { name: "Pro", price: "", desc: "" },
      { name: "Enterprise", price: "", desc: "" },
    ]
  );
  const [pricingJustification, setPricingJustification] = useState((data.pricingJustification as string) || "");
  const [uvp, setUvp] = useState((data.uvp as string) || "");

  const filledCount = [productName, productType, productDesc, features.some((f) => f.name), pricingModel, basePrice, uvp].filter(Boolean).length;
  const completion = Math.round((filledCount / 7) * 100);

  const updateFeature = (i: number, field: keyof Feature, value: string) => {
    const updated = [...features];
    updated[i] = { ...updated[i], [field]: value };
    setFeatures(updated);
  };

  const saveData = () => {
    updateStepData("product", { productName, productType, productDesc, features, pricingModel, basePrice, tiers, pricingJustification, uvp });
  };

  const handleSave = () => { saveData(); showToast("Progress saved"); };
  const handleContinue = () => { saveData(); markStepCompleted(2); showToast("Step 2 completed!"); router.push("/dashboard/plan"); };

  return (
    <StepGuard stepNumber={2}>
    <div className="space-y-6">
      <StepHeader stepNumber={2} title="Define Your Product" description="Detail what you're actually building or selling." completionPercent={completion} />

      {/* Product Overview */}
      <FormSection title="Product Overview" delay={0}
        aiButton={<AIGenerateButton onGenerate={() => { setProductName("EcoBottle Pro"); setProductType("Physical Product"); setProductDesc("A premium reusable water bottle made from 100% recycled ocean plastic, featuring a proprietary three-stage filtration system. Available in 500ml and 750ml sizes with interchangeable caps and a lifetime warranty. Each bottle prevents approximately 200 single-use plastic bottles from entering landfills annually."); }} />}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Product / Service Name</label>
            <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g., EcoBottle Pro"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Type</label>
            <select value={productType} onChange={(e) => setProductType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent">
              <option value="">Select a type...</option>
              {productTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Product Description</label>
            <textarea value={productDesc} onChange={(e) => setProductDesc(e.target.value)} placeholder="Describe your product in detail..." rows={4}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none" />
          </div>
        </div>
      </FormSection>

      {/* Key Features */}
      <FormSection title="Key Features" description="List the core features of your product." delay={1}
        aiButton={<AIGenerateButton onGenerate={() => setFeatures([
          { name: "Three-Stage Filtration", description: "Activated carbon, ion exchange, and ultrafiltration membrane for spring-water quality", priority: "Must Have" },
          { name: "Ocean Plastic Body", description: "Made from 100% certified recycled ocean-bound plastic with premium matte finish", priority: "Must Have" },
          { name: "Smart Hydration Tracking", description: "Built-in LED ring tracks daily water intake and syncs with health apps", priority: "Must Have" },
          { name: "Modular Cap System", description: "Interchangeable sport, sip, and straw caps for different activities", priority: "Nice to Have" },
          { name: "Filter Life Indicator", description: "Color-changing indicator shows when filter needs replacement", priority: "Must Have" },
        ])} />}
      >
        <div className="space-y-3">
          {features.map((f, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr_auto_auto] gap-2 items-start">
              <input type="text" value={f.name} onChange={(e) => updateFeature(i, "name", e.target.value)} placeholder="Feature name"
                className="px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-text-primary placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
              <input type="text" value={f.description} onChange={(e) => updateFeature(i, "description", e.target.value)} placeholder="Short description"
                className="px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-text-primary placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
              <select value={f.priority} onChange={(e) => updateFeature(i, "priority", e.target.value)}
                className="px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-text-primary transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent">
                <option value="Must Have">Must Have</option>
                <option value="Nice to Have">Nice to Have</option>
                <option value="Future">Future</option>
              </select>
              <button onClick={() => setFeatures(features.filter((_, idx) => idx !== i))} className="p-2.5 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={() => setFeatures([...features, { name: "", description: "", priority: "Must Have" }])} className="flex items-center gap-2 text-sm text-accent font-medium hover:text-accent-dark transition-colors mt-2">
            <Plus className="w-4 h-4" /> Add Feature
          </button>
        </div>
      </FormSection>

      {/* Pricing Strategy */}
      <FormSection title="Pricing Strategy" delay={2}
        aiButton={<AIGenerateButton onGenerate={() => { setPricingModel("Tiered"); setBasePrice("39"); setTiers([{ name: "Essentials", price: "29", desc: "500ml bottle with basic filter — perfect for everyday use" }, { name: "Pro", price: "49", desc: "750ml bottle with premium filter + smart tracking" }, { name: "Ultimate", price: "79", desc: "750ml bottle with all features + lifetime filter subscription" }]); setPricingJustification("Premium pricing justified by superior filtration technology and sustainable materials. Comparable to Hydro Flask pricing but with added filtration value."); }} />}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Pricing Model</label>
            <select value={pricingModel} onChange={(e) => setPricingModel(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent">
              <option value="">Select a model...</option>
              {pricingModels.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Base Price</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">$</span>
              <input type="text" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} placeholder="0"
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
            </div>
          </div>
          {pricingModel === "Tiered" && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm font-medium text-text-primary">Pricing Tiers</p>
              {tiers.map((tier, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_2fr] gap-2 items-start">
                  <input type="text" value={tier.name} onChange={(e) => { const u = [...tiers]; u[i] = { ...u[i], name: e.target.value }; setTiers(u); }} placeholder="Tier name"
                    className="px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-text-primary placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">$</span>
                    <input type="text" value={tier.price} onChange={(e) => { const u = [...tiers]; u[i] = { ...u[i], price: e.target.value }; setTiers(u); }} placeholder="0"
                      className="w-24 pl-7 pr-3 py-2.5 rounded-lg border border-border bg-white text-sm text-text-primary placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                  </div>
                  <input type="text" value={tier.desc} onChange={(e) => { const u = [...tiers]; u[i] = { ...u[i], desc: e.target.value }; setTiers(u); }} placeholder="Brief description"
                    className="px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-text-primary placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
                </div>
              ))}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Pricing Justification</label>
            <textarea value={pricingJustification} onChange={(e) => setPricingJustification(e.target.value)} placeholder="Why is this the right price point?" rows={2}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none" />
          </div>
        </div>
      </FormSection>

      {/* Unique Value Proposition */}
      <FormSection title="Unique Value Proposition" description="Your elevator pitch in one sentence." delay={3}
        aiButton={<AIGenerateButton onGenerate={() => setUvp("Unlike traditional reusable bottles, EcoBottle combines ocean plastic sustainability with advanced filtration — so you can drink clean water anywhere while helping clean up our oceans.")} />}
      >
        <div className="space-y-4">
          <div>
            <textarea value={uvp} onChange={(e) => { if (e.target.value.length <= 150) setUvp(e.target.value); }} placeholder="In one sentence, why should someone choose you?" rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white text-lg text-text-primary placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none font-medium" />
            <p className={`text-xs mt-1.5 text-right ${uvp.length > 140 ? "text-amber-500" : "text-text-secondary"}`}>{uvp.length} / 150</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary mb-2">Need inspiration? Try a template:</p>
            <div className="flex flex-wrap gap-2">
              {uvpTemplates.map((tpl) => (
                <button key={tpl} onClick={() => setUvp(tpl)} className="text-xs px-3 py-1.5 rounded-full border border-border text-text-secondary hover:border-accent/40 hover:text-accent transition-all">
                  {tpl}
                </button>
              ))}
            </div>
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
