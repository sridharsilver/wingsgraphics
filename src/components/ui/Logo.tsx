import logo from "@/assets/wings-logo.png";

export function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <>
      {/* Light Mode */}
      <div className={`relative ${className} dark:hidden inline-block`}>
        <img src={logo} alt="Wings Graphics" className="h-full w-auto object-contain" />
      </div>
      
      {/* Dark Mode */}
      <div className={`relative ${className} hidden dark:inline-block`}>
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
    </>
  );
}
