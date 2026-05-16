import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { Section, SectionHeader } from "@/components/site/Section";
import { PageHero } from "@/components/site/PageHero";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — Wings Graphics" },
      { name: "description", content: "Real stories from brands we've helped grow with print, branding and web design." },
      { property: "og:title", content: "Testimonials — Wings Graphics" },
      { property: "og:description", content: "Hear from our happy clients." },
    ],
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  const [data, setData] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Load Testimonials
      const { data: res } = await supabase
        .from("wg_testimonials")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (res) setData(res);

      // Load Client Logos
      const { data: clientRes } = await supabase
        .from("wg_clients")
        .select("*")
        .order("created_at", { ascending: true });
      if (clientRes) setClients(clientRes);

      setLoading(false);
    }
    load();
  }, []);
  
  const [idx, setIdx] = useState(0);
  const featured = (data || []).slice(0, 3);
  const reviews = (data || []).slice(3);

  useEffect(() => {
    if (featured.length === 0) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % featured.length), 5000);
    return () => clearInterval(t);
  }, [featured.length]);

  if (loading) {
    return (
      <SiteLayout>
        <PageHero eyebrow="Testimonials" title="Loading stories..." desc="Please wait while we fetch our latest reviews." />
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHero 
        eyebrow="Testimonials"
        title="Loved by brands across India"
        desc="Hear from teams we've helped grow."
      />

      {featured.length > 0 && (
        <Section>
          <div className="relative max-w-3xl mx-auto">
            <div className="rounded-3xl glass shadow-elegant p-8 md:p-12 text-center min-h-[280px] grid place-items-center bg-gradient-hero">
              <AnimatePresence mode="wait">
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Quote className="text-brand mx-auto" size={32} />
                  <p className="mt-4 text-xl md:text-2xl font-display">"{featured[idx].content}"</p>
                  <div className="flex justify-center gap-0.5 mt-5">
                    {Array.from({ length: featured[idx].rating }).map((_, i) => <Star key={i} size={16} className="fill-brand text-brand" />)}
                  </div>
                  <div className="mt-4">
                    <div className="font-semibold">{featured[idx].name}</div>
                    <div className="text-sm text-muted-foreground">{featured[idx].company}</div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            {featured.length > 1 && (
              <>
                <button onClick={() => setIdx((i) => (i - 1 + featured.length) % featured.length)} className="absolute -left-2 md:-left-12 top-1/2 -translate-y-1/2 size-10 grid place-items-center rounded-full glass shadow-elegant" aria-label="Prev"><ChevronLeft size={18} /></button>
                <button onClick={() => setIdx((i) => (i + 1) % featured.length)} className="absolute -right-2 md:-right-12 top-1/2 -translate-y-1/2 size-10 grid place-items-center rounded-full glass shadow-elegant" aria-label="Next"><ChevronRight size={18} /></button>
                <div className="flex justify-center gap-2 mt-5">
                  {featured.map((_, i) => (
                    <button key={i} onClick={() => setIdx(i)} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-gradient-brand" : "w-2 bg-white/20"}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        </Section>
      )}

      {reviews.length > 0 && (
        <Section>
          <SectionHeader eyebrow="More reviews" title="Words from our clients" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="p-6 rounded-2xl glass shadow-elegant">
                <div className="flex gap-0.5">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} size={14} className="fill-brand text-brand" />)}</div>
                <p className="mt-3 text-sm">"{r.content}"</p>
                <div className="mt-4">
                  <div className="font-semibold text-sm">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {clients.length > 0 && (
        <Section>
          <SectionHeader eyebrow="Trusted by" title="Brands we've worked with" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {clients.map((c) => (
              <div key={c.id} className="h-24 rounded-xl glass shadow-elegant p-4 grid place-items-center hover:scale-105 transition-all">
                <img 
                  src={c.logo_url} 
                  alt={c.name} 
                  className="max-h-full max-w-full object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
                />
              </div>
            ))}
          </div>
        </Section>
      )}
    </SiteLayout>
  );
}
