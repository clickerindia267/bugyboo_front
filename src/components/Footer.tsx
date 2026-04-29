import { Instagram, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary/40 pt-20 pb-10 border-t border-border/50">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-soft flex items-center justify-center shadow-soft">
                <span className="font-serif text-lg italic text-primary">p</span>
              </div>
              <span className="font-serif text-2xl">
                Petite <span className="italic">Lune</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Heirloom-worthy fashion for ages 0–6. Crafted slowly, loved deeply.
            </p>
            <div className="flex items-center gap-2">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-background hover:bg-primary hover:text-primary-foreground transition-all duration-500 flex items-center justify-center"
                  aria-label="Social"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-serif text-base mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                { l: "About", to: "/contact" },
                { l: "Shop", to: "/shop" },
                { l: "Blog", to: "/blog" },
                { l: "Contact", to: "/contact" },
              ].map(({ l, to }) => (
                <li key={l}>
                  <Link to={to} className="hover:text-foreground transition-colors story-link">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-base mb-4">Care</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {["Shipping", "Returns", "Size guide", "FAQ"].map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-foreground transition-colors story-link">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2026 Petite Lune. Crafted with love in Paris.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
