import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { VisibilitySettings } from "@/hooks/use-site-settings";

// Import slider images (fallbacks)
import slide1 from "@/assets/portfolio/branding.png";
import slide2 from "@/assets/portfolio/packaging.png";
import slide3 from "@/assets/portfolio/brochure.png";
import slide4 from "@/assets/portfolio/cosmetics.png";

const DEFAULT_SLIDES = [slide1, slide2, slide3, slide4];

export function HeroLayout1({ settings }: { settings?: VisibilitySettings }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSlides() {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'hero_slider_layout1')
          .maybeSingle();
        
        if (data?.value && Array.isArray(data.value) && data.value.length > 0) {
          setSlides(data.value);
        } else {
          setSlides(DEFAULT_SLIDES);
        }
      } catch (err) {
        setSlides(DEFAULT_SLIDES);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSlides();
  }, []);

  const activeSlides = slides.length > 0 ? slides : DEFAULT_SLIDES;

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides]);

  return (
    <section className="relative min-h-screen bg-[#06080C] flex items-center pt-28 pb-16 lg:py-24 xl:py-20 2xl:py-0 overflow-hidden text-white">
      {/* Custom float animations for a highly premium organic breathing effect */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-orb-1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.15); }
        }
        @keyframes float-orb-2 {
          0%, 100% { transform: translate(0px, 0px) scale(1.1); }
          50% { transform: translate(-50px, 40px) scale(0.9); }
        }
        @keyframes float-orb-3 {
          0%, 100% { transform: translate(0px, 0px) scale(0.95); }
          50% { transform: translate(30px, 30px) scale(1.1); }
        }
      `}} />

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
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[#4A72FF]/8 to-[#7B59FF]/8 rounded-full blur-[130px] pointer-events-none animate-[float-orb-1_20s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[700px] h-[700px] bg-gradient-to-tr from-[#BD43FF]/6 to-blue-500/6 rounded-full blur-[150px] pointer-events-none animate-[float-orb-2_25s_ease-in-out_infinite]" />
      <div className="absolute top-[30%] left-[40%] w-[500px] h-[500px] bg-gradient-to-r from-[#4A72FF]/4 to-[#BD43FF]/4 rounded-full blur-[140px] pointer-events-none animate-[float-orb-3_22s_ease-in-out_infinite]" />

      {/* Soft spotlight behind the showcase card for extra depth */}
      <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#7B59FF]/4 blur-[130px] rounded-full pointer-events-none hidden lg:block" />

      <div className="w-full mx-auto max-w-7xl container-px grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center h-full relative z-10">
        
        {/* Left Column - Content */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full max-w-xl xl:max-w-2xl pt-6 lg:pt-0">
          {/* Eyebrow Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] rounded-full border border-white/10 bg-white/5 text-white/90 font-bold mb-6 shadow-sm backdrop-blur-sm">
            <Sparkles size={11} className="text-white/80 animate-pulse" /> 
            {settings?.layout1_badge || 'PREMIUM STUDIO STANDARD'}
          </div>

          {/* Heading */}
          <h1 
            className="text-[2.5rem] sm:text-5xl md:text-5xl lg:text-[3.25rem] xl:text-[4rem] 2xl:text-[4.75rem] font-black leading-[1.05] tracking-tight text-white mb-6"
            dangerouslySetInnerHTML={{ __html: settings?.layout1_heading || 'Premium<br />branding<br /><span class="bg-gradient-to-r from-[#4A72FF] via-[#7B59FF] to-[#BD43FF] bg-clip-text text-transparent">& print</span>' }}
          />

          {/* Subtext */}
          <p className="text-white/60 text-base sm:text-lg max-w-[480px] mx-auto md:mx-0 leading-relaxed font-medium mb-10 lg:mb-16">
            {settings?.layout1_subtext || 'Wings Graphics blends elite print craft with strategic digital design to elevate ambitious brands into industry leaders.'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center md:justify-start mb-12 lg:mb-16">
            <Link to={settings?.layout1_button_link || "/contact"} className="w-full sm:w-auto group relative px-8 py-4 rounded-full bg-gradient-to-r from-[#4A72FF] to-[#8C4BFF] hover:from-[#3b63f0] hover:to-[#7c3aeb] text-white font-bold hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg shadow-blue-500/10">
              {settings?.layout1_button_text || 'Start Your Project'} 
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/portfolio" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/10 text-white hover:bg-white/5 hover:scale-105 active:scale-95 transition-all font-bold text-sm sm:text-base backdrop-blur-sm">
              View Our Work
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mt-4 lg:mt-6 flex items-center justify-center md:justify-start gap-8 sm:gap-12 w-full">
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl lg:text-2xl xl:text-[1.625rem] font-black text-white leading-none tracking-tight">12+</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold mt-1.5">YEARS EXPERIENCE</span>
            </div>
            
            <div className="h-10 w-px bg-white/10" />
            
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl lg:text-2xl xl:text-[1.625rem] font-black text-white leading-none tracking-tight">500+</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold mt-1.5">PREMIUM BRANDS</span>
            </div>
            
            <div className="h-10 w-px bg-white/10" />
            
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl lg:text-2xl xl:text-[1.625rem] font-black text-white leading-none tracking-tight">100%</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold mt-1.5">QUALITY PROMISE</span>
            </div>
          </div>
        </div>

        {/* Right Column - Media Showcase Card (Matches Image perfectly) */}
        <div className="relative w-full aspect-[3/4] rounded-[32px] sm:rounded-[40px] overflow-hidden mx-auto lg:ml-auto shadow-2xl border border-white/5 group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img 
                src={activeSlides[currentSlide]}
                alt="Wings Graphics Featured Showcase"
                className="w-full h-full object-cover filter brightness-[0.95]"
              />
            </motion.div>
          </AnimatePresence>

          {/* Dark Overlay Gradient at Bottom for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10 pointer-events-none" />

          {/* Slide Indicator Dots (Floating sleekly on the right side) */}
          {activeSlides.length > 1 && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-20">
              {activeSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    i === currentSlide ? 'h-7 bg-white' : 'h-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Showcase Details Overlay at bottom */}
          <div className="absolute bottom-10 left-10 right-10 z-20 pointer-events-none">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-black/30 backdrop-blur-md mb-4 shadow-sm">
              <span className="text-[9px] uppercase tracking-[0.25em] text-white font-bold">FEATURED WORK</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-md">
              Elevating global brands
            </h3>
          </div>
        </div>

      </div>

      {/* Animated Scroll Indicator (Centered at Bottom) */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: [0.4, 1, 0.4], y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer z-20 hidden md:flex"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
      >
        <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5">
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-1 h-1 rounded-full bg-white/60"
          />
        </div>
        <span className="text-[8px] uppercase tracking-[0.25em] text-white/30 font-extrabold">Scroll</span>
      </motion.div>
    </section>
  );
}
