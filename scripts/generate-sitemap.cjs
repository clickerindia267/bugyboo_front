const fs = require("fs");
const path = require("path");
const https = require("https");

const PREFERRED_DOMAIN = "https://bugyboo.com";

// Fallback dynamic products if API is offline
const fallbackProducts = [
  "rose-knit-cardigan", "cream-heirloom-knit", "petal-ruffle-dress", "sky-linen-romper",
  "lavender-tutu-dress", "honey-corduroy-set", "ivory-pearl-romper", "blush-bow-headband",
  "sunshine-floral-dress", "ocean-breeze-shorts-set", "tropical-print-romper", "daisy-cotton-top",
  "safari-adventure-set", "watermelon-swimsuit", "linen-sun-hat", "mango-cotton-co-ord"
];

const staticRoutes = [
  { path: "", freq: "daily", priority: "1.00" },
  { path: "shop", freq: "daily", priority: "0.90" },
  { path: "about", freq: "monthly", priority: "0.80" },
  { path: "contact", freq: "monthly", priority: "0.80" },
  { path: "blog", freq: "weekly", priority: "0.80" },
  { path: "gallery", freq: "weekly", priority: "0.70" }
];

// Helper to fetch data via https
const fetchData = (endpoint) => {
  return new Promise((resolve) => {
    https.get(`https://api.bugyboo.com/api${endpoint}`, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.data || parsed.blog || []);
        } catch {
          resolve([]);
        }
      });
    }).on("error", () => {
      resolve([]);
    });
  });
};

const toSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

const generateSitemap = async () => {
  console.log("Generating sitemap...");
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // 1. Static Pages
  staticRoutes.forEach((route) => {
    xml += "  <url>\n";
    xml += `    <loc>${PREFERRED_DOMAIN}/${route.path}</loc>\n`;
    xml += "    <lastmod>" + new Date().toISOString().split("T")[0] + "</lastmod>\n";
    xml += `    <changefreq>${route.freq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += "  </url>\n";
  });

  // 2. Fetch Live Products and Categories
  const apiProducts = await fetchData("/products");
  const productsList = apiProducts.length > 0 ? apiProducts : fallbackProducts.map((slug, idx) => ({ _id: String(idx + 1), slug }));

  // Dynamic Product Pages
  productsList.forEach((p) => {
    const id = p._id || p.id;
    const slug = p.name ? toSlug(p.name) : (p.slug || id);

    // Canonical Slug URL
    xml += "  <url>\n";
    xml += `    <loc>${PREFERRED_DOMAIN}/product/${slug}</loc>\n`;
    xml += "    <lastmod>" + new Date().toISOString().split("T")[0] + "</lastmod>\n";
    xml += "    <changefreq>weekly</changefreq>\n";
    xml += "    <priority>0.80</priority>\n";
    xml += "  </url>\n";

    // Backward compatible ID URL
    xml += "  <url>\n";
    xml += `    <loc>${PREFERRED_DOMAIN}/product/${id}</loc>\n`;
    xml += "    <lastmod>" + new Date().toISOString().split("T")[0] + "</lastmod>\n";
    xml += "    <changefreq>weekly</changefreq>\n";
    xml += "    <priority>0.60</priority>\n";
    xml += "  </url>\n";
  });

  // Dynamic Category Pages
  const categoriesSet = new Set();
  apiProducts.forEach((p) => {
    if (p.category && p.category.name) {
      categoriesSet.add(p.category.name);
    }
  });

  if (categoriesSet.size === 0) {
    // Default categories if API offline
    ["Girls", "Boys", "Newborn", "Accessories", "Unisex"].forEach((c) => categoriesSet.add(c));
  }

  categoriesSet.forEach((category) => {
    xml += "  <url>\n";
    xml += `    <loc>${PREFERRED_DOMAIN}/shop?category=${encodeURIComponent(category)}</loc>\n`;
    xml += "    <lastmod>" + new Date().toISOString().split("T")[0] + "</lastmod>\n";
    xml += "    <changefreq>weekly</changefreq>\n";
    xml += "    <priority>0.80</priority>\n";
    xml += "  </url>\n";
  });

  // 3. Dynamic Blog Pages
  const apiBlogs = await fetchData("/blogs");
  apiBlogs.forEach((blog) => {
    xml += "  <url>\n";
    xml += `    <loc>${PREFERRED_DOMAIN}/blog/${blog._id}</loc>\n`;
    xml += "    <lastmod>" + new Date().toISOString().split("T")[0] + "</lastmod>\n";
    xml += "    <changefreq>weekly</changefreq>\n";
    xml += "    <priority>0.70</priority>\n";
    xml += "  </url>\n";
  });

  xml += "</urlset>\n";

  const outputPath = path.join(__dirname, "../public/sitemap.xml");
  fs.writeFileSync(outputPath, xml, "utf8");
  console.log(`✓ Sitemap successfully generated at ${outputPath}`);
};

generateSitemap();
