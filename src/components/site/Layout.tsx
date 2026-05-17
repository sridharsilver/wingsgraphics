import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface SiteLayoutProps {
  children: ReactNode;
  fullBleed?: boolean;
}

export function SiteLayout({ children, fullBleed = false }: SiteLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-1 ${fullBleed ? "" : "pt-24"}`}>{children}</main>
      <Footer />
    </div>
  );
}
