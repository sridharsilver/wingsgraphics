import { useSiteSettings } from "@/hooks/use-site-settings";
import { HeroLayout1 } from "./hero/HeroLayout1";
import { HeroLayout2 } from "./hero/HeroLayout2";
import { HeroLayout3 } from "./hero/HeroLayout3";

export function HomeHero() {
  const { settings, loading } = useSiteSettings();

  // Show default layout while settings load to prevent layout shift
  if (loading) {
    return <HeroLayout1 />; 
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
