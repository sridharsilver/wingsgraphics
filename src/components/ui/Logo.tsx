import logo from "@/assets/wings-logo.png";
import { useTheme } from "@/hooks/use-theme";

export function Logo({ className = "h-8", forceDark = false }: { className?: string; forceDark?: boolean }) {
  const { theme } = useTheme();
  const isDark = theme === "dark" || forceDark;

  if (isDark) {
    return (
      <div className={`relative ${className} inline-block`}>
        <img 
          src={logo} 
          alt="Wings Graphics" 
          className="h-full w-auto object-contain brightness-0 invert"
        />
        <img 
          src={logo} 
          alt="" 
          className="absolute inset-0 h-full w-auto object-contain"
          style={{ clipPath: 'inset(0 72% 0 0)' }} 
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className} inline-block`}>
      <img src={logo} alt="Wings Graphics" className="h-full w-auto object-contain" />
    </div>
  );
}
