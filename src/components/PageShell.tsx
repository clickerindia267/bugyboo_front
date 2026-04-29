import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";

type Props = {
  children: ReactNode;
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  hideHeaderSpacer?: boolean;
};

const PageShell = ({ children, title, eyebrow, subtitle, hideHeaderSpacer }: Props) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className={`flex-1 ${hideHeaderSpacer ? "" : "pt-24 md:pt-28"}`}>
        {title && (
          <section className="container mx-auto pt-6 pb-10 md:pt-10 md:pb-14 text-center max-w-2xl">
            {eyebrow && (
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3 animate-fade-in">{eyebrow}</p>
            )}
            <h1 className="font-serif text-4xl md:text-6xl text-balance animate-fade-in">{title}</h1>
            {subtitle && (
              <p className="mt-4 text-muted-foreground text-balance animate-fade-in">{subtitle}</p>
            )}
          </section>
        )}
        {children}
      </main>
      <Footer />
      <FloatingCart />
    </div>
  );
};

export default PageShell;
