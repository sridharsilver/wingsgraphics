import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { VisibilitySettings } from "@/hooks/use-site-settings";

import slide1 from "@/assets/portfolio/branding.png";

export function HeroLayout3({ settings }: { settings?: VisibilitySettings }) {
  const [heroImage, setHeroImage] = useState<string>(slide1);

  useEffect(() => {
    async function fetchSlides() {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'hero_image_layout3')
          .maybeSingle();
        
        if (data?.value && Array.isArray(data.value) && data.value.length > 0) {
          setHeroImage(data.value[0]);
        }
      } catch (err) {
        // use default
      }
    }
    fetchSlides();
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[90vh] md:min-h-screen flex items-center justify-center pt-20 pb-20 lg:pt-0 lg:pb-0">
      <div className="absolute inset-0 bg-background z-0" />
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-10 bg-cover bg-center bg-no-repeat grayscale mix-blend-overlay"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-brand/10 blur-[120px] rounded-full z-0 pointer-events-none" />
      
      <div className="relative z-10 w-full mx-auto max-w-7xl px-6 sm:px-10 md:px-16 lg:px-20 2xl:px-0 text-center pt-10 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] rounded-full bg-surface border border-border text-foreground font-black mb-8 shadow-sm"
          >
            <Sparkles size={14} className="text-primary" /> {settings?.layout3_badge || 'Redefining Excellence'}
          </motion.span>

          <h1 
            className="text-5xl md:text-7xl lg:text-[7rem] font-black leading-[0.95] tracking-tighter text-foreground pb-6"
            dangerouslySetInnerHTML={{ __html: settings?.layout3_heading || 'Design that <span class="text-gradient-brand italic">performs.</span><br />Print that <span class="text-gradient italic">impresses.</span>' }}
          />

          <p className="mt-4 text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            {settings?.layout3_subtext || 'Wings Graphics is a premium design and print studio dedicated to crafting identities and physical materials that leave a lasting impact.'}
          </p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto"
          >
            <Link to={settings?.layout3_button_link || "/contact"} className="w-full sm:w-auto group relative px-10 py-5 rounded-full bg-foreground text-background font-black shadow-elegant hover:scale-105 active:scale-95 transition-all overflow-hidden flex justify-center border border-transparent dark:border-white/10">
              <span className="relative flex items-center gap-2 text-lg">
                {settings?.layout3_button_text || 'Start a project'} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Minimalist Stats Bar */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-20 md:mt-24 pt-10 border-t border-border/50 flex flex-wrap justify-center gap-10 md:gap-24"
        >
          {[["12+", "Years Experience"], ["500+", "Premium Brands"], ["100%", "Quality Promise"]].map(([n, l]) => (
            <div key={l} className="space-y-2">
              <div className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-none tracking-tighter">{n}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">{l}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Animated Scroll Indicator (Centered at Bottom) */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: [0.4, 1, 0.4], y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer z-20 hidden md:flex"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
      >
        <div className="w-4 h-7 rounded-full border border-foreground/20 flex justify-center pt-1">
          <motion.div 
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-1 h-1 rounded-full bg-foreground/60"
          />
        </div>
      </motion.div>
    </section>
  );
}
