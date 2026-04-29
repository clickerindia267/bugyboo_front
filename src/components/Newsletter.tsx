import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({ title: "Welcome to Petite Lune", description: "Check your inbox for your 10% off code." });
    setEmail("");
  };

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-soft p-10 md:p-16 text-center shadow-soft">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-pink/40 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-lavender/40 blur-3xl" />

          <div className="relative max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full glass mb-6 animate-float">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/70 mb-3">Letters from Lune</p>
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-balance">
              Soft stories, <em className="italic">softly delivered</em>
            </h2>
            <p className="text-foreground/70 mb-8 max-w-md mx-auto leading-relaxed">
              Join our little circle for early access to new collections, seasonal stories, and a welcome 10% off
              your first piece.
            </p>
            <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 h-12 px-5 rounded-full bg-background/80 backdrop-blur border border-border focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm"
              />
              <button
                type="submit"
                className="h-12 px-7 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-soft"
              >
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <p className="text-xs text-muted-foreground mt-5">No spam. Unsubscribe with one click.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
