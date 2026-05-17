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

export function HeroLayout2({ settings }: { settings?: VisibilitySettings }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSlides() {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'hero_slider_layout2')
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
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-black text-white">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.45, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={activeSlides[currentSlide]}
              alt="Wings Graphics Fullscreen Showcase"
              className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.05]"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b11] via-[#090b11]/30 to-black/60 z-0" />
      </div>

      {/* Spacer for top navbar navigation */}
      <div className="h-24" />

      {/* Main Content Area */}
      <div className="relative z-10 w-full mx-auto max-w-7xl container-px flex flex-col items-center justify-center text-center flex-grow py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center w-full"
        >
          {/* Eyebrow Pill Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] rounded-full bg-brand/10 text-brand border border-brand/20 font-bold mb-6 sm:mb-8 backdrop-blur-md">
            <Sparkles size={12} className="text-brand animate-pulse" /> 
            {settings?.layout2_badge || 'THE PREMIUM STUDIO STANDARD'}
          </span>

          {/* Heading */}
          <h1 
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-black leading-[1.08] tracking-tight max-w-4xl pb-6 text-white"
            dangerouslySetInnerHTML={{ __html: settings?.layout2_heading || 'Premium branding,<br />& print solutions<br /><span class="text-gradient-brand">for growing businesses</span>' }}
          />

          {/* Subtext */}
          <p className="text-white/70 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed font-medium mb-10">
            {settings?.layout2_subtext || 'Wings Graphics blends elite print craft with strategic digital design to elevate ambitious brands into industry leaders.'}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto mb-8">
            <Link to={settings?.layout2_button_link || "/contact"} className="w-full sm:w-auto group relative px-8 py-4 rounded-full bg-gradient-brand text-brand-foreground font-bold hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg shadow-brand/20">
              {settings?.layout2_button_text || 'Start Your Project'} 
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/portfolio" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white hover:bg-white/10 hover:scale-105 active:scale-95 transition-all font-bold text-sm sm:text-base backdrop-blur-sm">
              View Our Work
            </Link>
          </div>

          {/* Slide Indicator Dots */}
          {activeSlides.length > 1 && (
            <div className="flex items-center gap-2.5 mt-2">
              {activeSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 transition-all duration-300 rounded-full ${
                    idx === currentSlide ? "w-8 bg-brand" : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Centered stats section at the bottom, exact match to Image 2 design */}
      <div className="relative z-10 w-full mx-auto max-w-7xl container-px pb-12 sm:pb-16 mt-auto">
        {/* Subtle Horizontal Divider */}
        <div className="w-full h-px bg-white/10 mb-8 sm:mb-10" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12">
          {[["12+", "YEARS EXPERIENCE"], ["500+", "PREMIUM BRANDS"], ["100%", "QUALITY PROMISE"]].map(([n, l]) => (
            <div key={l} className="flex flex-col items-center text-center">
              <div className="text-3xl sm:text-4xl font-black text-white leading-none tracking-tight">{n}</div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-bold mt-2.5">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
