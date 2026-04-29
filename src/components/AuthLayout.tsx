import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const AuthLayout = ({
  title,
  subtitle,
  children,
  footer,
  side,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  side: ReactNode;
}) => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-20 md:pt-24 grid lg:grid-cols-2 min-h-screen">
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md animate-fade-in">
          <Link to="/" className="inline-block mb-10">
            <span className="font-serif text-2xl">
              Petite <span className="italic">Lune</span>
            </span>
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl mb-3">{title}</h1>
          <p className="text-muted-foreground mb-8">{subtitle}</p>
          {children}
          <div className="mt-8 text-sm text-center text-muted-foreground">{footer}</div>
        </div>
      </div>
      <div className="hidden lg:block relative bg-gradient-soft overflow-hidden">{side}</div>
    </main>
  </div>
);

export default AuthLayout;
