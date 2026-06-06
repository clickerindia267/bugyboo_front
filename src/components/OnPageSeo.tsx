import { Link } from "react-router-dom";
import { Star, Heart, Flame, Shield } from "lucide-react";

const OnPageSeo = () => {
  return (
    <section className="bg-[#fcfbf9] border-t border-border/40 py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-[1200px]">
        {/* Intro Block */}
        <div className="bg-white p-8 rounded-3xl border border-border/20 shadow-sm mb-16">
          <h3 className="font-serif text-xl md:text-2xl text-primary font-bold mb-4">
            Welcome to Bugyboo Baby Shop
          </h3>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-sans">
            Welcome to Bugyboo, your trusted destination to buy kids wear online in India. Explore a beautiful collection of girls frocks, kids co-ord sets, night suits, and baby clothing designed with comfort, style, and quality in mind. Our premium cotton outfits are perfect for daily wear, special occasions, and every memorable childhood moment. Shop affordable and fashionable kids clothing online with easy ordering and nationwide delivery.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          <div className="space-y-4 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-border/20">
            <div className="w-12 h-12 rounded-full bg-[#3f646f]/10 flex items-center justify-center text-[#3f646f]">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl text-foreground font-bold">
              Explore Stylish Girls Frocks &amp; Co-ord Sets
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Find beautiful choices to <strong>buy girls frocks online</strong> or discover matching <strong>kids co-ord sets online India</strong>. Made with soft, premium materials, our designs are perfect for both play dates and festive celebrations.
            </p>
          </div>

          <div className="space-y-4 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-border/20">
            <div className="w-12 h-12 rounded-full bg-[#3f646f]/10 flex items-center justify-center text-[#3f646f]">
              <Flame className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl text-foreground font-bold">
              Comfortable Kids Night Suits for Everyday Wear
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our <strong>kids night suit online India</strong> collection offers the perfect bedtime companion. Crafted from breathable cotton pajama sets, these sleepsuits ensure soft, cozy nights for your children.
            </p>
          </div>

          <div className="space-y-4 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-border/20">
            <div className="w-12 h-12 rounded-full bg-[#3f646f]/10 flex items-center justify-center text-[#3f646f]">
              <Star className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl text-foreground font-bold">
              Latest Kids Fashion Collection Available Across India
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Experience the best of <strong>trendy kids fashion online India</strong>. We offer stylish options at affordable prices with fast shipping across India, making kids clothing store online shopping a absolute breeze.
            </p>
          </div>

          <div className="space-y-4 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-border/20">
            <div className="w-12 h-12 rounded-full bg-[#3f646f]/10 flex items-center justify-center text-[#3f646f]">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl text-foreground font-bold">
              Soft, Safe &amp; Stylish Clothes for Every Little Star
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our products are crafted with organic cotton kids wear options to ensure your baby's safety. Discover durable, breathable, and daily wear outfits that make Bugyboo the <strong>best kids clothing brand in India</strong>.
            </p>
          </div>
        </div>

        {/* SEO Linking & Keywords directory */}
        <div className="border-t border-border/30 pt-10">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6 text-center md:text-left">
            Quick Navigation Directory
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm font-semibold text-primary mb-3">Shop Collections</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link to="/shop" className="hover:text-primary transition-colors">All Kids Clothing</Link></li>
                <li><Link to="/shop?category=Girls" className="hover:text-primary transition-colors">Girls Frocks &amp; Dresses</Link></li>
                <li><Link to="/shop?category=Co-ord%20Sets" className="hover:text-primary transition-colors">Kids Co-ord Sets</Link></li>
                <li><Link to="/shop?category=Nightwear" className="hover:text-primary transition-colors">Children Night Suits</Link></li>
                <li><Link to="/shop?category=Newborn" className="hover:text-primary transition-colors">Baby Rompers &amp; Newborn Wear</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-primary mb-3">B2B Solutions</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link to="/about" className="hover:text-primary transition-colors">Manufacturing Units</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Bulk Order Enquiries</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors">Why Wholesale Supplier</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Become a Retail Partner</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-primary mb-3">Our Journal</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link to="/blog" className="hover:text-primary transition-colors">Parenting Tips &amp; Blog</Link></li>
                <li><Link to="/blog" className="hover:text-primary transition-colors">Organic Cotton Benefits</Link></li>
                <li><Link to="/blog" className="hover:text-primary transition-colors">Kidswear Fabric Guide</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-primary mb-3">Company</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link to="/about" className="hover:text-primary transition-colors">About Bugyboo</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
                <li><Link to="/gallery" className="hover:text-primary transition-colors">Lookbook Gallery</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnPageSeo;
