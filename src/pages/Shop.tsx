import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getProducts, type PublicProduct } from "@/lib/api";
import SEO from "@/components/SEO";
import { toSlug, getProductAltText, getProductThumbnail } from "@/lib/utils";
import { ProductCard } from "@/components/ProductCard";

const sortOptions = [
  { v: "featured", l: "Featured" },
  { v: "low", l: "Price: Low → High" },
  { v: "high", l: "Price: High → Low" },
];

const Shop = () => {
  const [params, setParams] = useSearchParams();
  const initialCategory = params.get("category");
  const [cat, setCat] = useState(initialCategory ?? "All");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Reset to page 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [cat, sort, maxPrice]);

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const allProducts: PublicProduct[] = data?.data?.filter((p) => !p.isPaused) ?? [];

  // Extract unique categories from API data
  const categories = useMemo(() => {
    const cats = allProducts.map((p) => p.category?.name).filter(Boolean);
    return ["All", ...Array.from(new Set(cats))];
  }, [allProducts]);

  const filtered = useMemo(() => {
    let list = allProducts.filter(
      (p) =>
        (cat === "All" || p.category?.name === cat) &&
        Math.min(...(p.variants?.map(v => v.sellPrice) || [0])) <= maxPrice,
    );
    if (sort === "low") list = [...list].sort((a, b) => Math.min(...(a.variants?.map(v => v.sellPrice) || [0])) - Math.min(...(b.variants?.map(v => v.sellPrice) || [0])));
    if (sort === "high") list = [...list].sort((a, b) => Math.min(...(b.variants?.map(v => v.sellPrice) || [0])) - Math.min(...(a.variants?.map(v => v.sellPrice) || [0])));
    return list;
  }, [allProducts, cat, sort, maxPrice]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const paginatedProducts = useMemo(() => {
    return filtered.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);
  }, [filtered, activePage, itemsPerPage]);

  const updateCat = (c: string) => {
    setCat(c);
    if (c === "All") params.delete("category");
    else params.set("category", c);
    setParams(params, { replace: true });
  };

  const Filters = (
    <div className="space-y-8">
      <div>
        <h4 className="font-serif text-lg mb-3 font-bold">Category</h4>
        <div className="space-y-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => updateCat(c)}
              className={`block w-full text-left text-sm py-1.5 transition-colors ${
                cat === c ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-serif text-lg mb-3 font-bold">Max price</h4>
        <input
          type="range"
          min={100}
          max={50000}
          step={100}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-primary"
          aria-label="Filter by maximum price"
        />
        <p className="text-sm text-muted-foreground mt-2 font-medium">Up to ₹{maxPrice.toLocaleString("en-IN")}</p>
      </div>
    </div>
  );

  // E-commerce Schemas for collection categories and list item indexing
  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${window.location.origin}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": cat === "All" ? "Shop" : cat,
        "item": window.location.href
      }
    ]
  };

  const collectionSchema = {
    "@type": "CollectionPage",
    "name": cat === "All" ? "The Bugyboo Collection" : `Buy ${cat} Online India`,
    "description": `Shop ${cat === "All" ? "the complete" : cat} premium kids wear collection at Bugyboo. Soft, breathable organic cotton fabrics.`,
    "url": window.location.href,
    "numberOfItems": filtered.length,
    "itemListElement": filtered.map((p, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "url": `${window.location.origin}/product/${toSlug(p.name)}`,
      "name": p.name
    }))
  };

  return (
    <PageShell title="The Collection" eyebrow="Shop" subtitle="Curated little wardrobes for your little ones.">
      <SEO 
        title="Shop Premium Kids Wear Online India | Bugyboo"
        description="Buy premium kids wear online in India. Shop our cotton clothing store featuring stylish frocks, co-ord sets, night suits, and daily wear for babies, boys and girls."
        keywords="kids clothing store online, buy baby clothes online, premium kids fashion, kids wear online shopping"
        ogType="website"
      />

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Shop Premium Kids Wear Online India",
          "description": "Buy premium kids wear online in India. Shop our cotton clothing store featuring stylish frocks, co-ord sets, night suits, and daily wear for babies, boys and girls.",
          "url": window.location.href,
          "hasPart": filtered.slice(0, 10).map(p => ({
            "@type": "Product",
            "name": p.name,
            "image": p.images?.[0] || "",
            "description": p.description,
            "sku": p._id,
            "offers": {
              "@type": "Offer",
              "priceCurrency": "INR",
              "price": p.variants?.[0]?.sellPrice || 0,
              "availability": "https://schema.org/InStock"
            }
          }))
        })}
      </script>

      <div className="pt-24 md:pt-28 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">Our Collection</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden rounded-xl border-border flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
          </div>

          <div className="flex gap-10">
            <div className="hidden lg:block w-64 shrink-0 space-y-8">
              <div className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Categories</h2>
                <div className="flex flex-col gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCat(c)}
                      className={`text-left text-sm py-1.5 transition-colors font-sans ${
                        cat === c ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Sort By</h2>
                <div className="flex flex-col gap-2">
                  {sortOptions.map((o) => (
                    <button
                      key={o.v}
                      onClick={() => setSort(o.v)}
                      className={`text-left text-sm py-1.5 transition-colors font-sans ${
                        sort === o.v ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Max Price (₹)</h2>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={maxPrice === 50000 ? 10000 : maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground font-sans">
                  <span>₹0</span>
                  <span>₹{maxPrice === 50000 ? "10,000+" : maxPrice}</span>
                </div>
              </div>
            </div>

            <div className="flex-grow">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12 lg:gap-x-8 lg:gap-y-16">
                {isLoading && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="space-y-4 animate-pulse">
                        <div className="aspect-[4/5] bg-secondary rounded-2xl" />
                        <div className="h-4 bg-secondary rounded w-2/3" />
                        <div className="h-4 bg-secondary rounded w-1/3" />
                      </div>
                    ))}
                  </>
                )}
                {!isLoading && paginatedProducts.map((p, i) => (
                  <ProductCard
                    key={p._id}
                    p={p}
                    index={i}
                    className="animate-fade-in"
                    style={{ animationDelay: `${i * 50}ms`, animationFillMode: "backwards" }}
                  />
                ))}
                {!isLoading && filtered.length === 0 && (
                  <p className="col-span-full text-center text-muted-foreground py-20 font-medium">
                    No pieces match your filters yet.
                  </p>
                )}
              </div>

              {/* Pagination controls */}
              {!isLoading && totalPages > 1 && (
                <div className="mt-12 flex items-center justify-between gap-4 font-sans border-t border-border/40 pt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentPage(prev => Math.max(prev - 1, 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={activePage === 1}
                    className="rounded-full border-border font-medium hover:bg-secondary h-10 px-4 transition-all"
                  >
                    &lt; Previous
                  </Button>
                  <div className="flex items-center gap-1.5 overflow-x-auto max-w-[150px] sm:max-w-none">
                    {[...Array(totalPages)].map((_, idx) => {
                      const pNum = idx + 1;
                      const isActive = activePage === pNum;
                      return (
                        <Button
                          key={pNum}
                          variant={isActive ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setCurrentPage(pNum);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`h-9 w-9 rounded-full font-medium transition-all ${
                            isActive 
                              ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft" 
                              : "border-border hover:bg-secondary"
                          }`}
                        >
                          {pNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentPage(prev => Math.min(prev + 1, totalPages));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={activePage === totalPages}
                    className="rounded-full border-border font-medium hover:bg-secondary h-10 px-4 transition-all"
                  >
                    Next &gt;
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {filtersOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm lg:hidden animate-fade-in-slow"
          onClick={() => setFiltersOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-80 max-w-[85%] bg-card p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl font-bold">Filters</h3>
              <button onClick={() => setFiltersOpen(false)} className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center" aria-label="Close filters">
                <X className="h-4 w-4" />
              </button>
            </div>
            {Filters}
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default Shop;
