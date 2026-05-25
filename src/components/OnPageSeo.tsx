import { Link } from "react-router-dom";
import { Search, Sparkles, MapPin } from "lucide-react";

const homepageKeywords = [
  "Buy Kids Wear Online India",
  "Best Kids Clothing Brand in India",
  "Kids Wear Online Shopping India",
  "Affordable Kids Wear Online",
  "Premium Kids Fashion for Boys & Girls",
  "Trendy Baby Clothes Online India",
  "Cotton Kids Wear Manufacturer India",
  "Kids Clothing Store Online India",
  "Stylish Kids Wear at Best Price",
  "Online Kids Fashion Shopping Website"
];

const buyerIntentKeywords = [
  "Buy Baby Clothes Online India",
  "Buy Kids Dresses Online",
  "Buy Boys Clothing Online India",
  "Buy Girls Dresses Online India",
  "Kids Wear Under 999",
  "Best Cotton Baby Clothes Online",
  "Newborn Baby Clothes Online Shopping",
  "Trendy Kids Fashion Online India",
  "Comfortable Daily Wear for Kids",
  "Soft Cotton Clothes for Babies"
];

const OnPageSeo = () => {
  return (
    <section className="container mx-auto px-4 py-12 mb-16 border-t border-border/40 mt-16">
      <div className="bg-zinc-50/50 dark:bg-zinc-900/30 rounded-[2.5rem] border border-border/40 p-8 md:p-12 lg:p-16">
        
        {/* Header Block */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold tracking-wider uppercase mb-4 border border-rose-100 dark:border-rose-900/30 shadow-soft">
            <Sparkles className="h-3.5 w-3.5" />
            Discover Bugyboo Online
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-primary font-bold tracking-tight mb-4">
            Bugyboo – Premium Kids Wear & Cotton Clothing Manufacturer
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium">
            Explore our collections designed for babies, boys, and girls, keeping modern fashion trends and everyday comfort in perfect balance. As a trusted kidswear manufacturer based in Ghaziabad, Delhi NCR, Bugyboo delivers high-quality, soft, and breathable cotton clothing for children at competitive wholesale and retail pricing across India.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Main Homepage Keywords */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-primary font-bold flex items-center gap-2">
              <Search className="h-4.5 w-4.5 text-rose-600 dark:text-rose-400" />
              Popular Search Queries
            </h3>
            <div className="flex flex-wrap gap-2 pt-2">
              {homepageKeywords.map((keyword, idx) => (
                <Link
                  key={idx}
                  to="/shop"
                  className="py-1.5 px-3.5 rounded-full bg-white dark:bg-zinc-950 text-[10px] md:text-xs text-primary/80 font-bold border border-border/60 shadow-soft hover:border-rose-600 hover:text-rose-600 dark:hover:border-rose-400 dark:hover:text-rose-400 transition-all duration-300 hover:scale-102 cursor-pointer"
                >
                  {keyword}
                </Link>
              ))}
            </div>
          </div>

          {/* High Intent Keywords */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-primary font-bold flex items-center gap-2">
              <Search className="h-4.5 w-4.5 text-rose-600 dark:text-rose-400" />
              Shop by Category Interest
            </h3>
            <div className="flex flex-wrap gap-2 pt-2">
              {buyerIntentKeywords.map((keyword, idx) => (
                <Link
                  key={idx}
                  to="/shop"
                  className="py-1.5 px-3.5 rounded-full bg-white dark:bg-zinc-950 text-[10px] md:text-xs text-primary/80 font-bold border border-border/60 shadow-soft hover:border-rose-600 hover:text-rose-600 dark:hover:border-rose-400 dark:hover:text-rose-400 transition-all duration-300 hover:scale-102 cursor-pointer"
                >
                  {keyword}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Area with Location & Hub tags */}
        <div className="border-t border-border/40 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-muted-foreground text-center sm:text-left">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            <span>Serving parents & B2B retail shops in Ghaziabad, Delhi NCR, and all across India.</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 tracking-wider">
            Timely Delivery & Bulk Order Availability
          </span>
        </div>

      </div>
    </section>
  );
};

export default OnPageSeo;
