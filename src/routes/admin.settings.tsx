import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { 
  Settings, 
  MessageSquare, 
  Image as ImageIcon, 
  Briefcase, 
  FileText, 
  Users, 
  Star, 
  Eye, 
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Map as MapIcon,
  Home as HomeIcon,
  Phone as PhoneIcon,
  Globe,
  Volume2,
  VolumeX,
  Upload,
  Trash2,
  Plus,
  Database,
  Sparkles,
  Heading,
  AlignLeft,
  Type,
  Link2,
  Monitor,
  Layers,
  LayoutGrid
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettingsPage,
})

interface VisibilitySettings {
  show_chatbot: boolean;
  show_portfolio: boolean;
  show_services: boolean;
  show_blog: boolean;
  show_team: boolean;
  show_testimonials: boolean;
  show_enquiry_form: boolean;
  show_contact_map: boolean;
  whatsapp_number: string;
  whatsapp_message: string;
  studio_address: string;
  contact_phone: string;
  contact_email: string;
  working_hours: string;
  social_instagram: string;
  social_facebook: string;
  social_linkedin: string;
  social_twitter: string;
  chatbot_voice_enabled: boolean;
  // Menu Visibility
  show_menu_home: boolean;
  show_menu_about: boolean;
  show_menu_services: boolean;
  show_menu_portfolio: boolean;
  show_menu_testimonials: boolean;
  show_menu_blog: boolean;
  show_menu_contact: boolean;
  hero_layout: 'layout1' | 'layout2' | 'layout3';
  // Layout 1 specific
  layout1_badge: string;
  layout1_heading: string;
  layout1_subtext: string;
  layout1_button_text: string;
  layout1_button_link: string;
  // Layout 2 specific
  layout2_badge: string;
  layout2_heading: string;
  layout2_subtext: string;
  layout2_button_text: string;
  layout2_button_link: string;
  // Layout 3 specific
  layout3_badge: string;
  layout3_heading: string;
  layout3_subtext: string;
  layout3_button_text: string;
  layout3_button_link: string;
}

const VISIBILITY_GROUPS = [
  {
    id: 'menu',
    label: 'Main Navigation Menu',
    icon: Settings,
    items: [
      { id: 'show_menu_home', label: 'Home Link', description: 'Show/hide Home in main menu', icon: HomeIcon },
      { id: 'show_menu_about', label: 'About Link', description: 'Show/hide About in main menu', icon: Users },
      { id: 'show_menu_services', label: 'Services Link', description: 'Show/hide Services in main menu', icon: Briefcase },
      { id: 'show_menu_portfolio', label: 'Portfolio Link', description: 'Show/hide Portfolio in main menu', icon: ImageIcon },
      { id: 'show_menu_testimonials', label: 'Testimonials Link', description: 'Show/hide Testimonials in main menu', icon: Star },
      { id: 'show_menu_blog', label: 'Blog Link', description: 'Show/hide Blog in main menu', icon: FileText },
      { id: 'show_menu_contact', label: 'Contact Link', description: 'Show/hide Contact in main menu', icon: PhoneIcon },
    ]
  },
  {
    id: 'global',
    label: 'Global Features',
    icon: Globe,
    items: [
      { id: 'show_chatbot', label: 'AI Chatbot', description: 'Show/hide the AI concierge bot on all pages', icon: MessageSquare },
      { id: 'chatbot_voice_enabled', label: 'Chatbot Voice', description: 'Enable AI voice response by default', icon: Volume2 },
    ]
  },
  {
    id: 'home',
    label: 'Home Page Sections',
    icon: HomeIcon,
    items: [
      { id: 'show_portfolio', label: 'Portfolio Section', description: 'Display your creative work gallery', icon: ImageIcon },
      { id: 'show_services', label: 'Services Section', description: 'List of professional services offered', icon: Briefcase },
      { id: 'show_blog', label: 'Blog / News', description: 'Latest articles and studio updates', icon: FileText },
      { id: 'show_team', label: 'Team Section', description: 'Showcase your talented team members', icon: Users },
      { id: 'show_testimonials', label: 'Testimonials', description: 'Client reviews and feedback section', icon: Star },
    ]
  },
  {
    id: 'contact',
    label: 'Contact Page Features',
    icon: PhoneIcon,
    items: [
      { id: 'show_enquiry_form', label: 'Enquiry Forms', description: 'Allow users to send business enquiries', icon: MessageSquare },
      { id: 'show_contact_map', label: 'Google Map', description: 'Show/hide the studio location map', icon: MapIcon },
    ]
  }
];

function HeroImageManager({ layout }: { layout: 'layout1' | 'layout2' | 'layout3' }) {
  const isMultiple = layout === 'layout1' || layout === 'layout2';
  const settingKey = isMultiple ? `hero_slider_${layout}` : `hero_image_${layout}`;

  const [slides, setSlides] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, [settingKey]);

  async function fetchSlides() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', settingKey)
        .maybeSingle();

      if (data?.value) {
        setSlides(data.value as string[]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function saveSlides(newSlides: string[]) {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ 
        key: settingKey, 
        value: newSlides,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (error) {
      toast.error("Failed to save slider settings");
    } else {
      setSlides(newSlides);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `hero-${Date.now()}.${fileExt}`;
      const filePath = `hero/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      const newSlides = isMultiple ? [...slides, publicUrl] : [publicUrl];
      await saveSlides(newSlides);
      toast.success("Slide added successfully");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(index: number) {
    if (!confirm("Remove this slide?")) return;
    const newSlides = slides.filter((_, i) => i !== index);
    await saveSlides(newSlides);
    toast.success("Slide removed");
  }

  if (loading) return <div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <Card className="border-none shadow-xl bg-surface/50 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/5">
      <CardHeader>
        <CardTitle>{isMultiple ? 'Hero Image Slider' : 'Hero Image'}</CardTitle>
        <CardDescription>
          {isMultiple 
            ? 'Upload high-resolution images for your homepage slider (Recommended: 1920x1080).' 
            : 'Upload a high-resolution image for your hero section.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {slides.map((url, i) => (
            <div key={url} className="group relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-white/5 shadow-md">
              <img 
                src={url} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-95 group-hover:brightness-90" 
                alt="Wings Graphics Slide" 
              />
              {/* Corner Float Delete Button */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-10">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => handleDelete(i)} 
                  className="rounded-xl size-8 bg-red-500/80 hover:bg-red-600 backdrop-blur-md border border-red-500/20 active:scale-95 shadow-lg"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
          {(!slides.length || isMultiple) && (
            <label className="aspect-video rounded-xl border border-dashed border-primary/20 hover:border-primary bg-primary/5 hover:bg-primary/10 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 group shadow-inner">
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
              {uploading ? (
                <Loader2 className="animate-spin text-primary size-5" />
              ) : (
                <>
                  <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 group-hover:bg-primary/20 transition-all duration-300">
                    <Plus size={18} />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">
                    {isMultiple ? 'Add Slide' : 'Upload Image'}
                  </span>
                </>
              )}
            </label>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function AdminSettingsPage() {
  const [settings, setSettings] = useState<VisibilitySettings>({
    show_chatbot: true,
    show_portfolio: true,
    show_services: true,
    show_blog: true,
    show_team: true,
    show_testimonials: true,
    show_enquiry_form: true,
    show_contact_map: true,
    whatsapp_number: '919951979988',
    whatsapp_message: "Hi Wings Graphics! I'm interested in your services.",
    studio_address: 'SRT 12, Sanath Nagar, Hyderabad, TS 500018',
    contact_phone: '+91 9951979988',
    contact_email: 'hello@wingsgraphics.in',
    working_hours: 'Mon–Sat · 10:00 — 19:00',
    social_instagram: 'https://instagram.com/wingsgraphics',
    social_facebook: 'https://facebook.com/wingsgraphics',
    social_linkedin: 'https://linkedin.com/company/wingsgraphics',
    social_twitter: 'https://twitter.com/wingsgraphics',
    chatbot_voice_enabled: false,
    show_menu_home: true,
    show_menu_about: true,
    show_menu_services: true,
    show_menu_portfolio: true,
    show_menu_testimonials: true,
    show_menu_blog: true,
    show_menu_contact: true,
    hero_layout: 'layout1',
    // Layout 1 Defaults
    layout1_badge: 'PREMIUM STUDIO STANDARD',
    layout1_heading: 'Premium<br />branding<br /><span class="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">& print</span>',
    layout1_subtext: 'Wings Graphics blends elite print craft with strategic digital design to elevate ambitious brands into industry leaders.',
    layout1_button_text: 'Start Your Project',
    layout1_button_link: '/contact',
    // Layout 2 Defaults
    layout2_badge: 'Premium Studio Standard',
    layout2_heading: 'Premium<br />branding<br /><span class="text-gradient-brand">& print</span>',
    layout2_subtext: 'Wings Graphics blends elite print craft with strategic digital design to elevate ambitious brands into industry leaders.',
    layout2_button_text: 'Start Your Project',
    layout2_button_link: '/contact',
    // Layout 3 Defaults
    layout3_badge: 'Redefining Excellence',
    layout3_heading: 'Design that <span class="text-gradient-brand italic">performs.</span><br />Print that <span class="text-gradient italic">impresses.</span>',
    layout3_subtext: 'Wings Graphics is a premium design and print studio dedicated to crafting identities and physical materials that leave a lasting impact.',
    layout3_button_text: 'Start a project',
    layout3_button_link: '/contact',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'frontend_visibility')
        .maybeSingle();

      if (error) {
        throw error;
      } else if (data?.value) {
        setSettings(prev => ({ ...prev, ...(data.value as object) } as VisibilitySettings));
      }
    } catch (err: any) {
      console.error("Error fetching settings:", err);
      if (err.message?.includes('JWT')) {
        setSaveStatus('error');
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggle(id: keyof VisibilitySettings) {
    const newSettings = { ...settings, [id]: !settings[id] };
    setSettings(newSettings);
  }

  async function handleValueChange(id: keyof VisibilitySettings, value: string) {
    const newSettings = { ...settings, [id]: value };
    setSettings(newSettings);
  }

  async function handleSave() {
    await saveSettings(settings);
  }

  async function saveSettings(settingsToSave: VisibilitySettings) {
    try {
      setIsSaving(true);
      setSaveStatus('idle');
      
      const { error } = await supabase
        .from('site_settings')
        .upsert({ 
          key: 'frontend_visibility', 
          value: settingsToSave,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (error) throw error;
      
      setSaveStatus('success');
      toast.success("Settings saved successfully");
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      console.error("Error saving settings:", err);
      setSaveStatus('error');
      // Set a temporary error message if possible or just log it
      if (err.code === '42P01') {
        console.error("Table 'site_settings' not found. Please run the SQL setup script.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  const hasCredentials = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!hasCredentials) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-6 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-2" />
        <h2 className="text-xl font-bold">Configuration Missing</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Supabase credentials are not configured. Please check your <code className="bg-muted px-1 rounded">.env</code> file or hosting environment variables.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading site preferences...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 md:px-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Site Settings</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">Manage global visibility and site information.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {isSaving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {saveStatus === 'success' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-green-600 dark:text-green-400 text-[10px] md:text-sm font-bold bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20 animate-in fade-in zoom-in-95 duration-200"
            >
              <CheckCircle2 size={12} className="md:size-3.5" />
              Saved
            </motion.div>
          )}
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="rounded-xl px-5 h-10 md:h-11 text-xs md:text-sm font-bold bg-gradient-brand hover:opacity-95 text-brand-foreground shadow-glow active:scale-[0.98] transition-all"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="visibility" className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-3 mb-6 md:mb-8 bg-surface/50 p-1 rounded-xl md:rounded-2xl border border-border/50">
          <TabsTrigger value="visibility" className="rounded-lg md:rounded-xl flex items-center gap-2 text-xs md:text-sm data-[state=active]:bg-background">
            <Eye size={14} className="md:size-4" />
            Visibility
          </TabsTrigger>
          <TabsTrigger value="data" className="rounded-lg md:rounded-xl flex items-center gap-2 text-xs md:text-sm data-[state=active]:bg-background">
            <Database size={14} className="md:size-4" />
            Site Info
          </TabsTrigger>
          <TabsTrigger value="hero" className="rounded-lg md:rounded-xl flex items-center gap-2 text-xs md:text-sm data-[state=active]:bg-background">
            <ImageIcon size={14} className="md:size-4" />
            Hero Section
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-6 focus-visible:outline-none">
          <Card className="border-none shadow-xl bg-surface/50 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/5">
            <CardHeader className="p-5 md:p-6 pb-2">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <HomeIcon size={18} className="text-primary" />
                Hero Layout Option
              </CardTitle>
              <CardDescription className="text-[11px] md:text-sm">
                Choose the design style for your homepage hero section. Click "Save Changes" to apply this choice to the live site.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { 
                    id: 'layout3', 
                    name: 'Static image', 
                    desc: 'Centered typography with background radial glow.',
                    icon: Monitor,
                    preview: (
                      <div className="w-full h-12 bg-background/40 rounded-lg border border-border/10 mb-3 flex flex-col items-center justify-center gap-1 p-2 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                        <div className="w-12 h-1 bg-white/40 rounded-full" />
                        <div className="w-20 h-1.5 bg-primary/40 rounded-full" />
                        <div className="w-8 h-1 bg-white/20 rounded-full" />
                      </div>
                    )
                  },
                  { 
                    id: 'layout2', 
                    name: 'Full Screen Slider', 
                    desc: 'Centered typography over a rich, full-screen background image slider.',
                    icon: Layers,
                    preview: (
                      <div className="w-full h-12 bg-background/40 rounded-lg border border-border/10 mb-3 flex flex-col items-center justify-between p-1.5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                        <div className="flex flex-col items-center gap-0.5 mt-1">
                          <div className="w-16 h-1.5 bg-white/50 rounded-full" />
                          <div className="w-8 h-1 bg-white/25 rounded-full" />
                        </div>
                        <div className="flex gap-1 justify-center mb-0.5">
                          <div className="size-1 rounded-full bg-primary" />
                          <div className="size-1 rounded-full bg-white/20" />
                          <div className="size-1 rounded-full bg-white/20" />
                        </div>
                      </div>
                    )
                  },
                  { 
                    id: 'layout1', 
                    name: 'Split View', 
                    desc: 'Text content on the left, with an elegant media panel on the right.',
                    icon: LayoutGrid,
                    preview: (
                      <div className="w-full h-12 bg-background/40 rounded-lg border border-border/10 mb-3 flex gap-2 p-1.5 relative overflow-hidden">
                        <div className="w-1/2 flex flex-col justify-center gap-1.5 pl-1">
                          <div className="w-full h-1.5 bg-white/40 rounded-full" />
                          <div className="w-2/3 h-1 bg-white/25 rounded-full" />
                        </div>
                        <div className="w-1/2 h-full bg-gradient-to-tr from-primary/10 to-purple-500/10 rounded-md border border-primary/20 flex items-center justify-center">
                          <div className="w-5 h-6 bg-white/10 rounded border border-white/5 flex items-center justify-center">
                            <ImageIcon size={8} className="text-white/40" />
                          </div>
                        </div>
                      </div>
                    )
                  }
                ].map((layout) => {
                  const IconComponent = layout.icon;
                  const isSelected = settings.hero_layout === layout.id;
                  return (
                    <div 
                      key={layout.id}
                      onClick={() => handleValueChange('hero_layout', layout.id)}
                      className={cn(
                        "cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.99] flex flex-col justify-between",
                        isSelected 
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" 
                          : "border-border/30 bg-background/30 opacity-70 hover:opacity-100 hover:border-border/60"
                      )}
                    >
                      <div>
                        {layout.preview}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <IconComponent size={14} className={isSelected ? "text-primary" : "text-muted-foreground"} />
                            <h4 className="font-bold text-sm tracking-tight">{layout.name}</h4>
                          </div>
                          {isSelected && <CheckCircle2 className="text-primary animate-in zoom-in duration-200" size={16} />}
                        </div>
                        <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">{layout.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-surface/50 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/5">
            <CardHeader className="p-5 md:p-6 pb-2">
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                {settings.hero_layout === 'layout3' 
                  ? 'Static image Content' 
                  : settings.hero_layout === 'layout2' 
                    ? 'Full Screen Slider Content' 
                    : 'Split View Content'}
              </CardTitle>
              <CardDescription className="text-[11px] md:text-sm">
                Customize the typography and layout details. Click "Save Changes" to publish your edits.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-2 space-y-5">
              <div className="space-y-5">
                {/* Badge Text */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-1">
                    <Sparkles size={12} className="text-primary/70" />
                    <Label htmlFor={`${settings.hero_layout}_badge`} className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">Badge Text</Label>
                  </div>
                  <Input 
                    id={`${settings.hero_layout}_badge`}
                    value={settings[`${settings.hero_layout}_badge` as keyof VisibilitySettings] as string || ''}
                    onChange={(e) => handleValueChange(`${settings.hero_layout}_badge` as keyof VisibilitySettings, e.target.value)}
                    className="h-11 rounded-xl border border-border/30 bg-background/30 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all duration-300"
                    placeholder="e.g. PREMIUM STUDIO STANDARD"
                  />
                </div>

                {/* Heading */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <Heading size={12} className="text-primary/70" />
                      <Label htmlFor={`${settings.hero_layout}_heading`} className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">Main Heading (HTML supported)</Label>
                    </div>
                    <span className="text-[9px] text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full border border-white/5">Rich Text Helper</span>
                  </div>

                  {/* Heading Text Format Helper Chips */}
                  <div className="flex flex-wrap gap-2 pt-1 pb-1">
                    <button 
                      type="button" 
                      onClick={() => {
                        const headingKey = `${settings.hero_layout}_heading` as keyof VisibilitySettings;
                        const currentText = settings[headingKey] as string || '';
                        handleValueChange(headingKey, currentText + "<br />");
                      }}
                      className="text-[10px] font-bold bg-primary/10 text-primary px-3 py-1 rounded-lg border border-primary/20 hover:bg-primary/20 transition-all duration-200 flex items-center gap-1 active:scale-95"
                    >
                      + Line Break
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        const headingKey = `${settings.hero_layout}_heading` as keyof VisibilitySettings;
                        const currentText = settings[headingKey] as string || '';
                        handleValueChange(headingKey, currentText + '<span class="bg-gradient-to-r from-[#4A72FF] via-[#7B59FF] to-[#BD43FF] bg-clip-text text-transparent">colored text</span>');
                      }}
                      className="text-[10px] font-bold bg-[#7B59FF]/10 text-[#7B59FF] px-3 py-1 rounded-lg border border-[#7B59FF]/20 hover:bg-[#7B59FF]/20 transition-all duration-200 flex items-center gap-1 active:scale-95"
                    >
                      + Premium Gradient
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        const headingKey = `${settings.hero_layout}_heading` as keyof VisibilitySettings;
                        const currentText = settings[headingKey] as string || '';
                        handleValueChange(headingKey, currentText + '<span class="text-primary">primary text</span>');
                      }}
                      className="text-[10px] font-bold bg-white/5 text-white/80 px-3 py-1 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200 flex items-center gap-1 active:scale-95"
                    >
                      + Brand Text
                    </button>
                  </div>

                  <Textarea 
                    id={`${settings.hero_layout}_heading`}
                    value={settings[`${settings.hero_layout}_heading` as keyof VisibilitySettings] as string || ''}
                    onChange={(e) => handleValueChange(`${settings.hero_layout}_heading` as keyof VisibilitySettings, e.target.value)}
                    className="min-h-[110px] rounded-xl border border-border/30 bg-background/30 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all duration-300 font-mono text-xs leading-relaxed"
                    placeholder="Enter heading HTML..."
                  />
                </div>

                {/* Subtext */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-1">
                    <AlignLeft size={12} className="text-primary/70" />
                    <Label htmlFor={`${settings.hero_layout}_subtext`} className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">Subtext</Label>
                  </div>
                  <Textarea 
                    id={`${settings.hero_layout}_subtext`}
                    value={settings[`${settings.hero_layout}_subtext` as keyof VisibilitySettings] as string || ''}
                    onChange={(e) => handleValueChange(`${settings.hero_layout}_subtext` as keyof VisibilitySettings, e.target.value)}
                    className="min-h-[85px] rounded-xl border border-border/30 bg-background/30 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all duration-300 text-xs leading-relaxed"
                    placeholder="Enter short description..."
                  />
                </div>

                {/* Buttons Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <Type size={12} className="text-primary/70" />
                      <Label htmlFor={`${settings.hero_layout}_button_text`} className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">Button Text</Label>
                    </div>
                    <Input 
                      id={`${settings.hero_layout}_button_text`}
                      value={settings[`${settings.hero_layout}_button_text` as keyof VisibilitySettings] as string || ''}
                      onChange={(e) => handleValueChange(`${settings.hero_layout}_button_text` as keyof VisibilitySettings, e.target.value)}
                      className="h-11 rounded-xl border border-border/30 bg-background/30 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all duration-300"
                      placeholder="e.g. Start Your Project"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <Link2 size={12} className="text-primary/70" />
                      <Label htmlFor={`${settings.hero_layout}_button_link`} className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">Button Link</Label>
                    </div>
                    <Input 
                      id={`${settings.hero_layout}_button_link`}
                      value={settings[`${settings.hero_layout}_button_link` as keyof VisibilitySettings] as string || ''}
                      onChange={(e) => handleValueChange(`${settings.hero_layout}_button_link` as keyof VisibilitySettings, e.target.value)}
                      className="h-11 rounded-xl border border-border/30 bg-background/30 focus-visible:ring-1 focus-visible:ring-primary/50 transition-all duration-300"
                      placeholder="e.g. /contact"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <HeroImageManager layout={settings.hero_layout} />
          
          <div className="pt-4">
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-6 rounded-2xl bg-gradient-brand text-brand-foreground font-bold shadow-glow hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {isSaving ? "Saving..." : "Save Hero Settings"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="visibility" className="space-y-6 focus-visible:outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-xl bg-surface/50 backdrop-blur-xl overflow-hidden rounded-2xl md:rounded-3xl">
                <CardHeader className="p-5 md:p-6 pb-0 md:pb-0">
                  <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                    <Eye size={18} className="text-primary" />
                    Frontend Visibility
                  </CardTitle>
                  <CardDescription className="text-[11px] md:text-sm">Toggle major website components on or off.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-6 md:pt-6">
                  <Accordion type="single" collapsible className="w-full">
                    {VISIBILITY_GROUPS.map((group) => (
                      <AccordionItem key={group.id} value={group.id} className="border-b-0 mb-3 md:mb-4 bg-foreground/5 rounded-xl md:rounded-2xl overflow-hidden">
                        <AccordionTrigger className="px-4 md:px-6 py-3.5 md:py-4 hover:no-underline hover:bg-foreground/5 transition-colors group">
                          <div className="flex items-center gap-3 text-left">
                            <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-background text-primary">
                              <group.icon size={16} className="md:size-[18px]" />
                            </div>
                            <span className="font-bold text-sm md:text-base">{group.label}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 md:px-6 pb-4 pt-1">
                          <div className="space-y-3 md:space-y-4">
                            {group.items.map((item) => {
                              const isVisible = !!settings[item.id as keyof VisibilitySettings];
                              return (
                                <div 
                                  key={item.id} 
                                  className={cn(
                                    "flex items-center justify-between py-2.5 md:py-3 rounded-lg md:rounded-xl px-3 md:px-4 transition-all duration-300",
                                    isVisible ? "bg-background shadow-sm border border-border/30" : "bg-transparent opacity-60"
                                  )}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={cn(
                                      "p-1.5 md:p-2 rounded-lg transition-all duration-500",
                                      isVisible ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                    )}>
                                      <item.icon size={16} className="md:size-[18px]" />
                                    </div>
                                    <div>
                                      <p className="text-xs md:text-sm font-bold tracking-tight">{item.label}</p>
                                      <p className="text-[9px] md:text-[10px] text-muted-foreground leading-tight">{item.description}</p>
                                    </div>
                                  </div>
                                  <Switch 
                                    checked={isVisible}
                                    onCheckedChange={() => handleToggle(item.id as keyof VisibilitySettings)}
                                    className="data-[state=checked]:bg-primary scale-75 md:scale-90"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  
                  <div className="pt-4">
                    <Button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full py-6 rounded-2xl bg-gradient-brand text-brand-foreground font-bold shadow-glow hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      {isSaving ? "Saving..." : "Save Visibility Settings"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Quick Info card hidden on mobile or shown at bottom */}
            <div className="space-y-6">
              <Card className="border-none shadow-xl bg-gradient-to-br from-primary/5 to-purple-500/5 backdrop-blur-xl rounded-2xl md:rounded-3xl">
                <CardHeader className="p-5 md:p-6">
                  <CardTitle className="text-base md:text-lg">Visibility Tips</CardTitle>
                </CardHeader>
                <CardContent className="p-5 md:p-6 pt-0 md:pt-0 text-xs md:text-sm text-muted-foreground leading-relaxed">
                  Hiding sections can help you clean up the page during maintenance or if a specific feature is temporarily unavailable.
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-6 focus-visible:outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-xl bg-surface/50 backdrop-blur-xl rounded-2xl md:rounded-3xl">
                <CardHeader className="p-5 md:p-6">
                  <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                    <Database size={18} className="text-primary" />
                    Site Information
                  </CardTitle>
                  <CardDescription className="text-[11px] md:text-sm">Update contact details and site-wide data.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6 space-y-6 md:space-y-8">
                  {/* WhatsApp Group */}
                  <div className="space-y-3 md:space-y-4">
                    <h3 className="text-xs md:text-sm font-bold flex items-center gap-2 text-primary px-1">
                      <MessageSquare size={14} className="md:size-4" />
                      WhatsApp Business
                    </h3>
                    <div className="grid gap-5 md:gap-6 p-4 md:p-6 rounded-xl md:rounded-2xl bg-foreground/5 border border-border/50">
                      <div className="space-y-2">
                        <div className="flex flex-col gap-1">
                          <Label htmlFor="whatsapp_number" className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">WhatsApp Number</Label>
                          <p className="text-[10px] text-muted-foreground italic">10-digit numbers default to +91 (India). E.g., 9951979988</p>
                        </div>
                        <Input 
                          id="whatsapp_number"
                          value={settings.whatsapp_number}
                          onChange={(e) => handleValueChange('whatsapp_number', e.target.value)}
                          className="h-10 md:h-11 rounded-lg md:rounded-xl border-none bg-background focus-visible:ring-1 ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp_message" className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">Default Message</Label>
                        <Textarea 
                          id="whatsapp_message"
                          value={settings.whatsapp_message}
                          onChange={(e) => handleValueChange('whatsapp_message', e.target.value)}
                          className="rounded-lg md:rounded-xl border-none bg-background focus-visible:ring-1 ring-primary min-h-[80px] md:min-h-[100px] resize-none text-xs md:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Info Group */}
                  <div className="space-y-3 md:space-y-4">
                    <h3 className="text-xs md:text-sm font-bold flex items-center gap-2 text-primary px-1">
                      <PhoneIcon size={14} className="md:size-4" />
                      Contact Details
                    </h3>
                    <div className="grid gap-5 md:gap-6 p-4 md:p-6 rounded-xl md:rounded-2xl bg-foreground/5 border border-border/50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contact_phone" className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">Studio Phone</Label>
                          <Input 
                            id="contact_phone"
                            value={settings.contact_phone}
                            onChange={(e) => handleValueChange('contact_phone', e.target.value)}
                            className="h-10 md:h-11 rounded-lg md:rounded-xl border-none bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact_email" className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">Studio Email</Label>
                          <Input 
                            id="contact_email"
                            value={settings.contact_email}
                            onChange={(e) => handleValueChange('contact_email', e.target.value)}
                            className="h-10 md:h-11 rounded-lg md:rounded-xl border-none bg-background"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studio_address" className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">Studio Address</Label>
                        <Input 
                          id="studio_address"
                          value={settings.studio_address}
                          onChange={(e) => handleValueChange('studio_address', e.target.value)}
                          className="h-10 md:h-11 rounded-lg md:rounded-xl border-none bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="working_hours" className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">Working Hours</Label>
                        <Input 
                          id="working_hours"
                          value={settings.working_hours}
                          onChange={(e) => handleValueChange('working_hours', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Social Media Group */}
                  <div className="space-y-3 md:space-y-4">
                    <h3 className="text-xs md:text-sm font-bold flex items-center gap-2 text-primary px-1">
                      <Globe size={14} className="md:size-4" />
                      Social Media Links
                    </h3>
                    <div className="grid gap-5 md:gap-6 p-4 md:p-6 rounded-xl md:rounded-2xl bg-foreground/5 border border-border/50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="social_instagram" className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">Instagram</Label>
                          <Input 
                            id="social_instagram"
                            value={settings.social_instagram}
                            onChange={(e) => handleValueChange('social_instagram', e.target.value)}
                            placeholder="https://instagram.com/..."
                            className="h-10 md:h-11 rounded-lg md:rounded-xl border-none bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="social_facebook" className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">Facebook</Label>
                          <Input 
                            id="social_facebook"
                            value={settings.social_facebook}
                            onChange={(e) => handleValueChange('social_facebook', e.target.value)}
                            placeholder="https://facebook.com/..."
                            className="h-10 md:h-11 rounded-lg md:rounded-xl border-none bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="social_linkedin" className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">LinkedIn</Label>
                          <Input 
                            id="social_linkedin"
                            value={settings.social_linkedin}
                            onChange={(e) => handleValueChange('social_linkedin', e.target.value)}
                            placeholder="https://linkedin.com/in/..."
                            className="h-10 md:h-11 rounded-lg md:rounded-xl border-none bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="social_twitter" className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">Twitter / X</Label>
                          <Input 
                            id="social_twitter"
                            value={settings.social_twitter}
                            onChange={(e) => handleValueChange('social_twitter', e.target.value)}
                            placeholder="https://twitter.com/..."
                            className="h-10 md:h-11 rounded-lg md:rounded-xl border-none bg-background"
                          />
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="pt-4">
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full py-4 rounded-2xl bg-gradient-brand text-brand-foreground font-bold shadow-glow hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 size={20} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="border-none shadow-xl bg-gradient-to-br from-primary/5 to-purple-500/5 backdrop-blur-xl rounded-2xl md:rounded-3xl">
                <CardHeader className="p-5 md:p-6">
                  <CardTitle className="text-base md:text-lg">Data Management</CardTitle>
                </CardHeader>
                <CardContent className="p-5 md:p-6 pt-0 md:pt-0 text-xs md:text-sm text-muted-foreground leading-relaxed">
                  Updates are saved automatically when you click out of an input field. Changes reflect instantly on your live website.
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
