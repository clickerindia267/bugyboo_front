import { useState } from "react";
import { Mail, MapPin, Phone, MessageCircle, Send } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast({ title: "Message sent", description: "We'll get back to you within one business day." });
      (e.target as HTMLFormElement).reset();
    }, 800);
  };

  const channels = [
    { Icon: Mail, l: "Email us", v: "hello@petitelune.com", tone: "bg-pink" },
    { Icon: Phone, l: "Call us", v: "+33 1 23 45 67 89", tone: "bg-lavender" },
    { Icon: MapPin, l: "Visit us", v: "14 Rue de Rivoli, Paris", tone: "bg-blue" },
    { Icon: MessageCircle, l: "Live chat", v: "Mon–Fri · 9am–6pm CET", tone: "bg-beige" },
  ];

  return (
    <PageShell title="Say hello" eyebrow="Contact" subtitle="We adore hearing from our little circle. We reply softly and quickly.">
      <section className="container mx-auto pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {channels.map((c) => (
            <div key={c.l} className={`rounded-3xl ${c.tone} p-6 hover-lift`}>
              <div className="w-10 h-10 rounded-full bg-background/60 flex items-center justify-center mb-4">
                <c.Icon className="h-4 w-4" />
              </div>
              <p className="text-xs uppercase tracking-wider opacity-70 mb-1">{c.l}</p>
              <p className="font-serif text-base">{c.v}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl mb-4">A note from your <em className="italic">heart</em></h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Whether it's a sizing question, an order concern, or a simple hello — drop us a line.
              Real humans read every message in our Paris atelier.
            </p>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Your name"
                  className="h-12 px-4 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm"
                />
                <input
                  required
                  type="email"
                  placeholder="Your email"
                  className="h-12 px-4 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm"
                />
              </div>
              <input
                placeholder="Subject"
                className="w-full h-12 px-4 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm"
              />
              <textarea
                required
                rows={6}
                placeholder="Your message…"
                className="w-full p-4 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm resize-none"
              />
              <Button type="submit" size="lg" disabled={sending} className="rounded-full h-12 px-8 bg-primary hover:bg-primary/90 group">
                {sending ? "Sending…" : "Send message"}
                <Send className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </form>
          </div>

          <div className="rounded-3xl overflow-hidden bg-gradient-soft aspect-[4/5] md:aspect-[4/4] relative">
            <iframe
              title="Atelier map"
              src="https://www.google.com/maps?q=14+Rue+de+Rivoli,+Paris&output=embed"
              className="w-full h-full grayscale opacity-90"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default Contact;
