import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const NewsletterPopup = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("newsletter-shown")) return;
    const t = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem("newsletter-shown", "1");
    }, 3500);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm animate-fade-in-slow">
      <div className="relative max-w-md w-full bg-card rounded-3xl overflow-hidden shadow-elegant animate-scale-in">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center transition-colors z-10"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="bg-gradient-soft p-8 pt-12 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-background/60 backdrop-blur mb-4 animate-float">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-foreground/70 mb-2">Welcome gift</p>
          <h3 className="font-serif text-3xl md:text-4xl mb-3 text-balance">
            Enjoy <em className="italic">10% off</em> your first piece
          </h3>
          <p className="text-sm text-foreground/70 max-w-xs mx-auto">
            Join our little circle for early access to new collections and softly curated stories.
          </p>
        </div>

        <div className="p-8 pt-6">
          {subscribed ? (
            <p className="text-center font-serif text-lg italic text-primary">
              Welcome — check your inbox 💌
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setSubscribed(true);
              }}
              className="space-y-3"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full h-12 px-5 rounded-full bg-secondary/60 border border-border focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm"
              />
              <Button type="submit" className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 shadow-soft">
                Claim my 10% off
              </Button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                No thanks, I'll pay full price
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup;
