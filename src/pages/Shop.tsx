import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getProducts, type PublicProduct } from "@/lib/api";

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

  const updateCat = (c: string) => {
    setCat(c);
    if (c === "All") params.delete("category");
    else params.set("category", c);
    setParams(params, { replace: true });
  };

  const Filters = (
    <div className="space-y-8">
      <div>
        <h4 className="font-serif text-lg mb-3">Category</h4>
        <div className="space-y-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => updateCat(c)}
              className={`block w-full text-left text-sm py-1.5 transition-colors ${
                cat === c ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-serif text-lg mb-3">Max price</h4>
        <input
          type="range"
          min={100}
          max={50000}
          step={100}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <p className="text-sm text-muted-foreground mt-2">Up to ₹{maxPrice.toLocaleString("en-IN")}</p>
      </div>
    </div>
  );

  return (
    <PageShell title="The Collection" eyebrow="Shop" subtitle="Curated little wardrobes for your little ones.">
      <section className="container mx-auto pb-24 px-4">
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading..." : `${filtered.length} pieces`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full lg:hidden"
              onClick={() => setFiltersOpen(true)}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 mr-2" />
              Filters
            </Button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm h-9 rounded-full px-4 bg-background border border-border focus:outline-none focus:ring-2 focus:ring-ring/30"
            >
              {sortOptions.map((s) => (
                <option key={s.v} value={s.v}>
                  {s.l}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-10">
          <aside className="hidden lg:block">{Filters}</aside>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {isLoading && (
              <>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="rounded-2xl bg-secondary aspect-[4/5] mb-3 shimmer" />
                    <div className="h-4 w-3/4 rounded shimmer mb-2" />
                    <div className="h-3 w-1/2 rounded shimmer" />
                  </div>
                ))}
              </>
            )}
            {!isLoading && filtered.map((p, i) => (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                className="group animate-fade-in"
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: "backwards" }}
              >
                <div className="relative overflow-hidden rounded-2xl bg-secondary aspect-[4/5] mb-3 hover-lift">
                  <img
                    src={p.images?.[0] ?? ""}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-contain md:object-cover transition-transform duration-1200 ease-out group-hover:scale-110"
                  />
                  {p.variants?.some(v => v.basePrice > v.sellPrice) && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur text-[10px] uppercase tracking-wider font-medium">
                      Sale
                    </span>
                  )}
                </div>
                <div className="px-1">
                  <p className="text-[11px] text-muted-foreground mb-1">{p.category?.name}</p>
                  <h3 className="font-serif text-base leading-tight mb-1">{p.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Starting From ₹{Math.min(...(p.variants?.map(v => v.sellPrice) || [0]))}</span>
                  </div>
                </div>
              </Link>
            ))}
            {!isLoading && filtered.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground py-20">
                No pieces match your filters yet.
              </p>
            )}
          </div>
        </div>
      </section>

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
              <h3 className="font-serif text-2xl">Filters</h3>
              <button onClick={() => setFiltersOpen(false)} className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center">
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
