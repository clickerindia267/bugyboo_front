const fs = require("fs");
const path = require("path");

const DIST_DIR = path.join(__dirname, "../dist");

// Start with static routes
const routesToVerify = [
  {
    path: "index.html",
    name: "Homepage",
    expectedTitle: "Buy Kids Wear Online India | Frocks, Co-ord Sets & Night Suits",
    expectedDesc: "Shop premium kids wear online in India at Bugyboo. Discover stylish girls frocks, trendy co-ord sets, comfortable night suits, and soft cotton baby clothes at affordable prices with delivery across India.",
    expectedH1: "Buy Kids Wear Online India – Premium Fashion for Babies, Boys & Girls"
  },
  {
    path: "about/index.html",
    name: "About Page",
    expectedTitle: "About Us | Kids Wear Manufacturer & Wholesale Supplier | Bugyboo",
    expectedDesc: "Bugyboo is a trusted kids wear manufacturer and wholesale supplier",
    expectedH1: "About Bugyboo – <span class=\"bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-transparent\">Trusted Kids Wear</span> <br class=\"hidden sm:inline\" /> Manufacturer &amp; Wholesale Supplier in India"
  },
  {
    path: "shop/index.html",
    name: "Shop Page",
    expectedTitle: "Buy Kids Wear Online India | Baby Clothes & Kids Fashion | Bugyboo",
    expectedDesc: "Explore the entire kids clothing collection at Bugyboo.",
    expectedH1: "The Collection"
  },
  {
    path: "contact/index.html",
    name: "Contact Page",
    expectedTitle: "Contact Us | Premium Kids Wear Brand & Wholesaler | Bugyboo",
    expectedDesc: "Get in touch with Bugyboo",
    expectedH1: "Say hello"
  },
  {
    path: "gallery/index.html",
    name: "Gallery Page",
    expectedTitle: "Lookbook & Gallery | Premium Kids Wear Joy | Bugyboo",
    expectedDesc: "Explore the Bugyboo Lookbooks.",
    expectedH1: "Captured Moments of Joy"
  },
  {
    path: "blog/index.html",
    name: "Blog Listing Page",
    expectedTitle: "Our Journal & Blog | Kids Fashion & Parenting | Bugyboo",
    expectedDesc: "Explore the Bugyboo Blog",
    expectedH1: "Our Blog"
  }
];

// Dynamically discover and add pre-rendered dynamic routes for verification
try {
  const productBase = path.join(DIST_DIR, "product");
  if (fs.existsSync(productBase)) {
    const productDirs = fs.readdirSync(productBase).filter(f => fs.statSync(path.join(productBase, f)).isDirectory());
    if (productDirs.length > 0) {
      const prodId = productDirs[0];
      const prodPath = `product/${prodId}/index.html`;
      const fullProdPath = path.join(DIST_DIR, prodPath);
      if (fs.existsSync(fullProdPath)) {
        const prodHtml = fs.readFileSync(fullProdPath, "utf8");
        const titleMatch = prodHtml.match(/<title>([^|]+)\|[^<]*<\/title>/i);
        if (titleMatch) {
          const prodName = titleMatch[1].trim();
          routesToVerify.push({
            path: prodPath,
            name: `Dynamic Product Detail (${prodName})`,
            expectedTitle: `${prodName} | Bugyboo`,
            expectedDesc: `Shop ${prodName} online at Bugyboo.`,
            expectedH1: prodName
          });
        }
      }
    }
  }

  const blogBase = path.join(DIST_DIR, "blog");
  if (fs.existsSync(blogBase)) {
    const blogDirs = fs.readdirSync(blogBase).filter(f => fs.statSync(path.join(blogBase, f)).isDirectory());
    if (blogDirs.length > 0) {
      const blogId = blogDirs[0];
      const blogPath = `blog/${blogId}/index.html`;
      const fullBlogPath = path.join(DIST_DIR, blogPath);
      if (fs.existsSync(fullBlogPath)) {
        const blogHtml = fs.readFileSync(fullBlogPath, "utf8");
        const titleMatch = blogHtml.match(/<title>([^|]+)\|[^<]*<\/title>/i);
        if (titleMatch) {
          const blogTitle = titleMatch[1].trim();
          routesToVerify.push({
            path: blogPath,
            name: `Dynamic Blog Detail (${blogTitle})`,
            expectedTitle: `${blogTitle} | Bugyboo`,
            expectedDesc: ``, // dynamic check will verify presence
            expectedH1: blogTitle
          });
        }
      }
    }
  }
} catch (e) {
  console.warn("  ⚠️ Warning while detecting dynamic routes:", e.message);
}

const verifySeo = () => {
  console.log("\n==================================================");
  console.log("   BUGYBOO CRAWLER - VIEW SOURCE VALIDATOR");
  console.log("==================================================\n");

  let totalErrors = 0;

  routesToVerify.forEach((route) => {
    const filePath = path.join(DIST_DIR, route.path);
    console.log(`Checking [${route.name}] at: dist/${route.path}...`);

    if (!fs.existsSync(filePath)) {
      console.warn(`  ⚠️ Warning: File not found at ${filePath}`);
      return;
    }

    const html = fs.readFileSync(filePath, "utf8");
    let routeErrors = 0;

    // 1. Title verification
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (!titleMatch) {
      console.error("  ❌ Fail: Title tag is missing!");
      routeErrors++;
    } else if (titleMatch[1].trim() !== route.expectedTitle) {
      console.error(`  ❌ Fail: Title tag mismatch!\n     Found:    "${titleMatch[1].trim()}"\n     Expected: "${route.expectedTitle}"`);
      routeErrors++;
    } else {
      console.log(`  ✓ Pass: Title is correct ("${titleMatch[1].trim()}")`);
    }

    // 2. Meta Description verification
    const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    if (!descMatch) {
      console.error("  ❌ Fail: Meta Description is missing!");
      routeErrors++;
    } else if (route.expectedDesc && !descMatch[1].includes(route.expectedDesc)) {
      console.error(`  ❌ Fail: Meta Description mismatch!\n     Found: "${descMatch[1]}"\n     Expected to contain: "${route.expectedDesc}"`);
      routeErrors++;
    } else {
      console.log(`  ✓ Pass: Meta Description is present and correct`);
    }

    // 3. Canonical URL verification
    const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
    if (!canonicalMatch) {
      console.error("  ❌ Fail: Canonical Link tag is missing!");
      routeErrors++;
    } else if (!canonicalMatch[1].startsWith("https://bugyboo.com")) {
      console.error(`  ❌ Fail: Canonical Link must be normalised to https://bugyboo.com preferred domain!\n     Found: "${canonicalMatch[1]}"`);
      routeErrors++;
    } else {
      console.log(`  ✓ Pass: Canonical Normalization is correct ("${canonicalMatch[1]}")`);
    }

    // 4. JSON-LD Schema verification
    const hasSchema = html.includes('type="application/ld+json"');
    if (!hasSchema) {
      console.error("  ❌ Fail: JSON-LD Structured Data Schema block is missing!");
      routeErrors++;
    } else {
      console.log(`  ✓ Pass: JSON-LD Structured Data Schema block is present`);
    }

    // 5. Single H1 Tag verification
    const h1Count = (html.match(/<h1/gi) || []).length;
    if (h1Count !== 1) {
      console.error(`  ❌ Fail: Page must contain exactly ONE H1 tag! Found: ${h1Count}`);
      routeErrors++;
    } else {
      const h1ContentMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      if (h1ContentMatch && h1ContentMatch[1].trim().includes(route.expectedH1)) {
        console.log(`  ✓ Pass: Page contains exactly ONE visible H1: "${route.expectedH1}"`);
      } else {
        console.error(`  ❌ Fail: H1 tag content mismatch!\n     Found:    "${h1ContentMatch ? h1ContentMatch[1].trim() : 'None'}"\n     Expected: "${route.expectedH1}"`);
        routeErrors++;
      }
    }

    if (routeErrors === 0) {
      console.log(`  🎉 Success: [${route.name}] is 100% SEO Crawler Compliant!\n`);
    } else {
      totalErrors += routeErrors;
      console.log(`  ❌ Failed: [${route.name}] has ${routeErrors} compliance error(s).\n`);
    }
  });

  console.log("==================================================");
  if (totalErrors === 0) {
    console.log("  🎉 ALL PRERENDERED STATIC FILES ARE 100% SEO COMPLIANT!");
    console.log("  View Source contains: Page-specific Titles, Descriptions, Canonical links, JSON-LD Schemas, and 1 H1 Tag.");
    console.log("==================================================\n");
    process.exit(0);
  } else {
    console.error(`  ❌ VERIFICATION FAILED: Found ${totalErrors} compliance error(s) across static build routes.`);
    console.error("  Please inspect build logs and script generator configurations.");
    console.log("==================================================\n");
    process.exit(1);
  }
};

verifySeo();
