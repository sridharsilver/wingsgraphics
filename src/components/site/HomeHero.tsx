import { useSiteSettings } from "@/hooks/use-site-settings";
import { HeroLayout1 } from "./hero/HeroLayout1";
import { HeroLayout2 } from "./hero/HeroLayout2";
import { HeroLayout3 } from "./hero/HeroLayout3";
import { Sparkles } from "lucide-react";

function HeroSkeleton() {
  return (
    <section className="relative min-h-screen bg-[#06080C] flex items-center pt-28 pb-16 overflow-hidden text-white">
      {/* Background Micro Grid (Faded at edges with radial mask) */}
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(circle at center, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(circle at center, black, transparent 75%)"
        }}
      />

      {/* Breathing Glowing Orbs - High End Fluid Aurora Effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[#4A72FF]/8 to-[#7B59FF]/8 rounded-full blur-[130px] pointer-events-none animate-pulse duration-[4000ms]" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[700px] h-[700px] bg-gradient-to-tr from-[#BD43FF]/6 to-blue-500/6 rounded-full blur-[150px] pointer-events-none animate-pulse duration-[5000ms]" />

      <div className="w-full mx-auto max-w-7xl container-px grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center h-full relative z-10">
        
        {/* Left Column - Content Skeleton */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full max-w-xl xl:max-w-2xl pt-6 lg:pt-0 animate-pulse">
          {/* Eyebrow Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/40 mb-6 shadow-sm backdrop-blur-sm">
            <Sparkles size={11} className="text-white/20" />
            <div className="h-3.5 bg-white/10 rounded w-36" />
          </div>

          {/* Heading Skeleton */}
          <div className="space-y-4 mb-8 w-full">
            <div className="h-10 md:h-12 bg-white/10 rounded-2xl w-5/6" />
            <div className="h-10 md:h-12 bg-white/10 rounded-2xl w-4/5" />
            <div className="h-10 md:h-12 bg-white/10 rounded-2xl w-3/5" />
          </div>

          {/* Subtext Skeleton */}
          <div className="space-y-2.5 mb-12 w-full max-w-[480px]">
            <div className="h-4 bg-white/5 rounded w-full" />
            <div className="h-4 bg-white/5 rounded w-11/12" />
            <div className="h-4 bg-white/5 rounded w-4/5" />
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center md:justify-start mb-16">
            <div className="w-full sm:w-48 h-14 rounded-full bg-white/10" />
            <div className="w-full sm:w-36 h-14 rounded-full bg-white/5 border border-white/5" />
          </div>

          {/* Stats Bar Skeleton */}
          <div className="flex items-center justify-center md:justify-start gap-8 sm:gap-12 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-7 bg-white/10 rounded w-12" />
                <div className="h-3 bg-white/5 rounded w-20" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Media Showcase Card Skeleton */}
        <div className="relative w-full lg:max-w-[380px] xl:max-w-[410px] 2xl:max-w-none aspect-[3/4] rounded-[32px] sm:rounded-[40px] overflow-hidden mx-auto lg:ml-auto shadow-2xl border border-white/5 bg-white/5 animate-pulse flex items-center justify-center">
          <div className="size-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
            <Sparkles size={24} className="text-white/20 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>

      </div>
    </section>
  );
}

export function HomeHero() {
  const { settings, loading } = useSiteSettings();

  // Show premium loading skeleton state while settings load to prevent visual flash
  if (loading) {
    return <HeroSkeleton />; 
  }

  switch (settings.hero_layout) {
    case 'layout2':
      return <HeroLayout2 settings={settings} />;
    case 'layout3':
      return <HeroLayout3 settings={settings} />;
    case 'layout1':
    default:
      return <HeroLayout1 settings={settings} />;
  }
}
