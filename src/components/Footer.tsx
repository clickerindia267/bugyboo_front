import { Instagram, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-secondary/40 pt-20 pb-10 border-t border-border/50">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 max-w-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <img src={logo} alt="BugyBoo Baby Shop" className="w-10 h-10 rounded-full object-cover shadow-soft" />
              <span className="font-serif text-2xl tracking-tight text-primary">
                <span className="font-semibold">Bugy</span><span className="italic font-light">Boo</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Heirloom-worthy fashion for ages 0–6. Crafted slowly, loved deeply.
            </p>
            <div className="flex items-center gap-2">
              {[
                { Icon: Instagram, href: "https://www.instagram.com/bugyboo_babyshop/" },
                { Icon: Facebook, href: "https://www.facebook.com/profile.php?id=61588919600654" },
                { Icon: Twitter, href: "#" }
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
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

          {/* Help Section */}
          <div>
            <h4 className="font-serif text-base mb-4">Help</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                { l: "Support", to: "/contact" },
                { l: "FAQ", to: "#" },
                { l: "Refund & Return Policy", to: "#" },
                { l: "Terms & Conditions", to: "#" },
              ].map(({ l, to }) => (
                <li key={l}>
                  <Link to={to} className="hover:text-foreground transition-colors story-link">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2026 BugyBoo Baby Shop. Crafted with love.</p>
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
