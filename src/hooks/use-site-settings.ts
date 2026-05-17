import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface VisibilitySettings {
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

const DEFAULT_SETTINGS: VisibilitySettings = {
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
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<VisibilitySettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'frontend_visibility')
          .maybeSingle(); // Use maybeSingle to avoid errors on empty results

        if (error) {
          console.warn('Site settings fetch error (using defaults):', error.message);
          // If the error is 'relation "site_settings" does not exist', we know the table is missing
          if (error.code === '42P01') {
            console.error('Table "site_settings" is missing from your Supabase database. Please run the setup SQL script.');
          }
          return;
        }

        if (data?.value) {
          setSettings({ ...DEFAULT_SETTINGS, ...(data.value as object) } as VisibilitySettings);
        } else {
          console.log('No site settings found in DB, using defaults.');
        }
      } catch (err: any) {
        console.error('Critical error fetching site settings:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();

    // Subscribe to real-time changes with a unique channel name
    const channelId = `site_settings_${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'site_settings',
          filter: "key=eq.frontend_visibility"
        },
        (payload) => {
          if (payload.new && (payload.new as any).value) {
            setSettings({ ...DEFAULT_SETTINGS, ...((payload.new as any).value as object) } as VisibilitySettings);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { settings, loading };
}
