import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { Section } from "@/components/site/Section";
import { PageHero } from "@/components/site/PageHero";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Selected Creative Projects & Printing Showcase" },
      { name: "description", content: "Explore our diverse portfolio of premium print design, strategic branding, custom packaging, and modern website development projects." },
      { property: "og:title", content: "Our Creative Portfolio — Wings Graphics" },
      { property: "og:description", content: "A showcase of premium design and print projects crafted for ambitious brands." },
      { name: "twitter:title", content: "Wings Graphics Portfolio" },
      { name: "twitter:description", content: "A curated look at our projects across print, brand, and digital." },
    ],
  }),
  component: PortfolioPage,
});

type Project = { id: string | number; title: string; category: string; description: string; image_url: string; featured: boolean };

function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [open, setOpen] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("wg_portfolio")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setProjects(data);
      setLoading(false);
    }
    load();
  }, []);
  
  // Dynamically derive categories from data
  const categories = ["All", ...Array.from(new Set(projects.map(p => (p.category || "").trim()))).filter(Boolean).sort()];
  
  const list = filter === "All" ? projects : projects.filter((p) => (p.category || "").trim() === filter);

  return (
    <SiteLayout>
      <PageHero 
        eyebrow="Portfolio"
        title="Selected work from our studio"
        desc="A curated look at projects across print, brand and digital."
      />
      <Section>
        <div className="mt-2 relative overflow-hidden -mx-5 px-5 md:mx-0 md:px-0">
          <div className="flex md:flex-wrap items-center gap-2 overflow-x-auto no-scrollbar pb-3 md:pb-0 scroll-smooth snap-x snap-mandatory [mask-image:linear-gradient(to_right,transparent,white_20px,white_calc(100%-20px),transparent)] md:[mask-image:none] [-webkit-mask-image:linear-gradient(to_right,transparent,white_20px,white_calc(100%-20px),transparent)] md:[-webkit-mask-image:none]">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 text-sm rounded-full transition-all shrink-0 snap-start ${
                  filter === c 
                    ? "bg-gradient-brand text-brand-foreground shadow-glow scale-[1.02]" 
                    : "glass hover:bg-white/10 text-muted-foreground hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[220px]">
          <AnimatePresence>
            {list.map((p) => (
              <motion.button
                layout
                key={p.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                onClick={() => setOpen(p)}
                className={`group relative rounded-2xl overflow-hidden glass shadow-elegant text-left ${p.featured ? "row-span-2" : ""}`}
              >
                <img 
                  src={p.image_url} 
                  alt={p.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition" />
                <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-300 text-white">
                  <div className="text-[10px] uppercase tracking-widest text-brand-purple font-bold">{p.category}</div>
                  <div className="font-bold mt-1 text-lg leading-tight">{p.title}</div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </Section>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-sm p-4"
          >
            <div className="relative w-full max-w-4xl flex items-center justify-center gap-4">
              {/* Previous Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const idx = list.findIndex(p => p.id === open.id);
                  const prev = list[idx - 1] || list[list.length - 1];
                  setOpen(prev);
                }}
                className="hidden md:grid size-12 place-items-center rounded-full bg-surface-elevated/80 hover:bg-surface-elevated text-foreground hover:scale-105 active:scale-95 transition-all shrink-0 border border-border/40"
                aria-label="Previous Project"
              >
                <ChevronLeft size={24} />
              </button>

              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-3xl rounded-3xl bg-card border border-border dark:bg-transparent dark:glass shadow-elegant overflow-hidden max-h-[90vh] overflow-y-auto"
              >
                <div className="relative overflow-hidden bg-black/40 flex items-center justify-center min-h-[300px] max-h-[60vh]">
                  {/* Premium blurred backdrop glow */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20 scale-110 pointer-events-none" 
                    style={{ backgroundImage: `url(${open.image_url})` }}
                  />
                  <img 
                    src={open.image_url} 
                    alt={open.title} 
                    className="object-contain max-h-[60vh] w-full relative z-10"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-20" />
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-normal">{open.category}</div>
                      <h3 className="mt-1 text-2xl font-bold text-foreground">{open.title}</h3>
                    </div>
                    <div className="flex gap-2">
                      {/* Mobile Nav Arrows */}
                      <button 
                        onClick={() => {
                          const idx = list.findIndex(p => p.id === open.id);
                          const prev = list[idx - 1] || list[list.length - 1];
                          setOpen(prev);
                        }}
                        className="md:hidden size-9 grid place-items-center rounded-full bg-surface-elevated/80 hover:bg-surface-elevated text-foreground border border-border/40 transition-all"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          const idx = list.findIndex(p => p.id === open.id);
                          const next = list[idx + 1] || list[0];
                          setOpen(next);
                        }}
                        className="md:hidden size-9 grid place-items-center rounded-full bg-surface-elevated/80 hover:bg-surface-elevated text-foreground border border-border/40 transition-all"
                      >
                        <ChevronRight size={16} />
                      </button>
                      <button 
                        onClick={() => setOpen(null)} 
                        className="size-9 grid place-items-center rounded-full bg-surface-elevated/80 hover:bg-surface-elevated text-foreground border border-border/40 transition-all hover:scale-105 active:scale-95" 
                        aria-label="Close"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 pt-5 border-t border-border/50">
                    <h4 className="text-[11px] font-normal uppercase tracking-wider text-muted-foreground">Project Details</h4>
                    <p className="mt-2 text-[15px] text-foreground/95 leading-relaxed whitespace-pre-wrap">{open.description}</p>
                  </div>
                </div>
              </motion.div>

              {/* Next Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const idx = list.findIndex(p => p.id === open.id);
                  const next = list[idx + 1] || list[0];
                  setOpen(next);
                }}
                className="hidden md:grid size-12 place-items-center rounded-full bg-surface-elevated/80 hover:bg-surface-elevated text-foreground hover:scale-105 active:scale-95 transition-all shrink-0 border border-border/40"
                aria-label="Next Project"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SiteLayout>
  );
}
