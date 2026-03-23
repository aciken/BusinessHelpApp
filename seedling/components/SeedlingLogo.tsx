import Link from "next/link";
import { Sprout } from "lucide-react";

export function SeedlingLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="w-8 h-8 bg-accent-light rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
        <Sprout className="h-5 w-5 text-accent" />
      </div>
      <span className="font-heading font-bold text-xl text-text-primary">
        Seedling
      </span>
    </Link>
  );
}
