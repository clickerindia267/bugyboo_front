const fs = require("fs");
const path = require("path");
const https = require("https");

const PREFERRED_DOMAIN = "https://bugyboo.com";
const DIST_DIR = path.join(__dirname, "../dist");

// Fetch live data from API with fallbacks
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

// Fallback collections for build stability
const fallbackProducts = [
  { _id: "1", name: "Rosé Knit Cardigan", description: "A soft Merino-blend cardigan in dusty rose, hand-finished with mother-of-pearl buttons. Perfectly weighted for layered dressing all year round." },
  { _id: "2", name: "Cream Heirloom Knit", description: "An heirloom-worthy cable knit, made to be passed down. Buttery soft and gently structured." },
  { _id: "3", name: "Petal Ruffle Dress", description: "A romantic ruffle dress in featherlight cotton voile, perfect for spring gatherings and quiet afternoons." },
  { _id: "4", name: "Sky Linen Romper", description: "Breathable European linen romper with snap closures — easy on, easy off for newborn days." }
];

const staticPages = [
  {
    route: "",
    title: "Buy Kids Wear Online India | Baby Clothes & Kids Fashion | Bugyboo",
    description: "Discover Bugyboo, the best kids clothing brand in India. Buy kids wear online, cotton baby clothes, and trendy kids fashion. Premium and daily wear for boys & girls.",
    keywords: "Buy Kids Wear Online India, Best Kids Clothing Brand in India, Kids Wear Online Shopping India, Cotton Kids Wear Manufacturer India",
    h1: '<h1 class="font-serif text-3xl md:text-4xl tracking-tight text-foreground">What Are You Looking for?</h1>',
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Bugyboo",
        "url": "https://bugyboo.com",
        "logo": "https://bugyboo.com/favicon.jpg",
        "description": "Bugyboo is a trusted kids wear manufacturer and wholesale supplier based in Ghaziabad, Delhi NCR.",
        "sameAs": ["https://www.facebook.com/bugyboo", "https://www.instagram.com/bugyboo"]
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Bugyboo",
        "url": "https://bugyboo.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://bugyboo.com/shop?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  },
  {
    route: "shop",
    title: "Buy Kids Wear Online India | Baby Clothes & Kids Fashion | Bugyboo",
    description: "Explore the entire kids clothing collection at Bugyboo. Breathable long-staple cotton, stylish casual wear, and daily wear essentials for babies, boys, and girls.",
    keywords: "Buy kids wear online, kids clothing brand, cotton kids wear manufacturer, Bugyboo shop",
    h1: '<h1 class="font-serif text-4xl md:text-6xl text-balance animate-fade-in">The Collection</h1>',
    schema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "The Bugyboo Collection",
      "description": "Shop the complete premium kids wear collection at Bugyboo.",
      "url": "https://bugyboo.com/shop"
    }
  },
  {
    route: "about",
    title: "About Us | Kids Wear Manufacturer & Wholesale Supplier | Bugyboo",
    description: "Bugyboo is a trusted kids wear manufacturer and wholesale supplier in Ghaziabad, Delhi NCR. Explore stylish, comfortable, affordable kids clothing for boys, girls, and babies across India.",
    keywords: "About Bugyboo, kids wear manufacturer Ghaziabad, wholesale kids wear Delhi NCR, cotton baby clothes supplier",
    h1: '<h1 class="font-serif text-3xl sm:text-4xl md:text-5xl text-primary leading-tight font-extrabold text-balance">About Bugyboo – <span class="bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-transparent">Trusted Kids Wear</span> <br class="hidden sm:inline" /> Manufacturer &amp; Wholesale Supplier in India</h1>',
    schema: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bugyboo.com/" },
        { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://bugyboo.com/about" }
      ]
    }
  },
  {
    route: "contact",
    title: "Contact Us | Premium Kids Wear Brand & Wholesaler | Bugyboo",
    description: "Get in touch with Bugyboo, Ghaziabad's premier kidswear wholesaler and manufacturer. Contact us for B2B bulk orders, retail inquiries, or customer support.",
    keywords: "Contact Bugyboo, kids wear wholesaler Ghaziabad, contact kidswear manufacturer Delhi NCR, customer care Bugyboo",
    h1: '<h1 class="font-serif text-4xl md:text-6xl text-balance animate-fade-in">Say hello</h1>',
    schema: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bugyboo.com/" },
        { "@type": "ListItem", "position": 2, "name": "Contact Us", "item": "https://bugyboo.com/contact" }
      ]
    }
  },
  {
    route: "gallery",
    title: "Lookbook & Gallery | Premium Kids Wear Joy | Bugyboo",
    description: "Explore the Bugyboo Lookbooks. View captured real-life moments of children wearing our GOTS-certified organic cotton clothing, cozy pajama sets, and festive dresses.",
    keywords: "Bugyboo lookbook, kids wear lookbook India, organic baby clothes gallery, children playwear photographs",
    h1: '<h1 class="font-serif text-4xl md:text-6xl text-balance animate-fade-in">Captured Moments of Joy</h1>',
    schema: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bugyboo.com/" },
        { "@type": "ListItem", "position": 2, "name": "Lookbook & Gallery", "item": "https://bugyboo.com/gallery" }
      ]
    }
  },
  {
    route: "blog",
    title: "Our Journal & Blog | Kids Fashion & Parenting | Bugyboo",
    description: "Explore the Bugyboo Blog for kids clothing styling tips, benefits of GOTS-certified organic cotton, fabric care guides, and design studio updates.",
    keywords: "kids clothing blog, baby fashion blog India, organic cotton baby clothes tips, parenting blogs",
    h1: '<h1 class="font-serif text-4xl md:text-6xl text-balance animate-fade-in">Our Blog</h1>',
    schema: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bugyboo.com/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://bugyboo.com/blog" }
      ]
    }
  }
];

const prerenderRoute = (templateHtml, routeInfo) => {
  const { route, title, description, keywords, h1, schema } = routeInfo;
  const canonicalUrl = `${PREFERRED_DOMAIN}/${route}`;
  
  // 1. Dynamic Head Metadata Injection
  let html = templateHtml;

  // Replace Title tag
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);

  // Clean up default/placeholder SEO tags from template to avoid duplicates
  html = html.replace(/<meta\s+name="description"[\s\S]*?>/gi, "");
  html = html.replace(/<meta\s+name="keywords"[\s\S]*?>/gi, "");
  html = html.replace(/<meta\s+property="og:type"[\s\S]*?>/gi, "");
  html = html.replace(/<meta\s+property="og:image"[\s\S]*?>/gi, "");
  html = html.replace(/<meta\s+property="og:title"[\s\S]*?>/gi, "");
  html = html.replace(/<meta\s+property="og:description"[\s\S]*?>/gi, "");
  html = html.replace(/<meta\s+name="twitter:card"[\s\S]*?>/gi, "");
  html = html.replace(/<meta\s+name="twitter:site"[\s\S]*?>/gi, "");
  html = html.replace(/<meta\s+name="twitter:image"[\s\S]*?>/gi, "");
  html = html.replace(/<meta\s+name="twitter:title"[\s\S]*?>/gi, "");
  html = html.replace(/<meta\s+name="twitter:description"[\s\S]*?>/gi, "");
  html = html.replace(/<link\s+rel="canonical"[\s\S]*?>/gi, "");

  const metaTags = `
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${keywords}" />
    <meta name="robots" content="index, follow" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${PREFERRED_DOMAIN}/favicon.jpg" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:site_name" content="Bugyboo" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${PREFERRED_DOMAIN}/favicon.jpg" />
    <meta name="twitter:site" content="@bugyboo" />
    <meta name="twitter:creator" content="@bugyboo" />
    <link rel="canonical" href="${canonicalUrl}" />
    <script type="application/ld+json" id="bugyboo-jsonld-schema">
      ${JSON.stringify(schema, null, 2)}
    </script>
  `;

  // Inject meta tags at the end of head
  html = html.replace("</head>", `${metaTags}\n</head>`);

  // 2. Body Visible H1 Injection (Inside React root for hydration compatibility)
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">\n      <div class="seo-prerender-header" style="opacity: 0.001; position: absolute; pointer-events: none; height: 1px; width: 1px; overflow: hidden;">\n        ${h1}\n      </div>\n    </div>`
  );

  // Write static route file
  const routeFolder = path.join(DIST_DIR, route);
  if (route !== "" && !fs.existsSync(routeFolder)) {
    fs.mkdirSync(routeFolder, { recursive: true });
  }

  const outputFilePath = route === "" ? path.join(DIST_DIR, "index.html") : path.join(routeFolder, "index.html");
  fs.writeFileSync(outputFilePath, html, "utf8");
  console.log(`✓ Prerendered route: /${route}`);
};

const runPrerender = async () => {
  console.log("Running SPA static prerendering engine...");
  
  if (!fs.existsSync(DIST_DIR)) {
    console.error("Error: dist/ directory not found. Please compile the app using vite build first.");
    process.exit(1);
  }

  // Load the compiled index.html template
  const templatePath = path.join(DIST_DIR, "index.html");
  if (!fs.existsSync(templatePath)) {
    console.error("Error: dist/index.html not found.");
    process.exit(1);
  }
  const templateHtml = fs.readFileSync(templatePath, "utf8");

  // 1. Prerender Static Pages
  staticPages.forEach((page) => {
    prerenderRoute(templateHtml, page);
  });

  // 2. Fetch and Prerender Dynamic Product Pages
  const apiProducts = await fetchData("/products");
  const productsList = apiProducts.length > 0 ? apiProducts : fallbackProducts;

  productsList.forEach((product) => {
    const id = product._id || product.id;
    const title = `${product.name} | Bugyboo`;
    const description = `Shop ${product.name} online at Bugyboo. Made from premium, skin-friendly cotton fabric. Soft, breathable, and affordable clothing.`;
    const canonicalUrl = `${PREFERRED_DOMAIN}/product/${id}`;

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "sku": id,
      "url": canonicalUrl,
      "brand": {
        "@type": "Brand",
        "name": "Bugyboo"
      },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": product.variants?.[0]?.sellPrice || 999,
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Bugyboo"
        }
      }
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bugyboo.com/" },
        { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://bugyboo.com/shop" },
        { "@type": "ListItem", "position": 3, "name": product.name, "item": canonicalUrl }
      ]
    };

    const routeInfo = {
      route: `product/${id}`,
      title,
      description,
      keywords: `${product.name}, Buy ${product.name} online, premium kids clothes, cotton baby wear, Bugyboo`,
      h1: `<h1 class="font-serif text-4xl md:text-5xl mb-4 font-bold">${product.name}</h1>`,
      schema: [breadcrumbSchema, productSchema]
    };

    prerenderRoute(templateHtml, routeInfo);
  });

  // 3. Fetch and Prerender Dynamic Blog Pages
  const apiBlogs = await fetchData("/blogs");
  apiBlogs.forEach((blog) => {
    const title = `${blog.title} | Bugyboo`;
    const description = blog.description.slice(0, 155).trim() + "...";
    const canonicalUrl = `${PREFERRED_DOMAIN}/blog/${blog._id}`;

    const blogSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "image": blog.images || ["https://bugyboo.com/favicon.jpg"],
      "datePublished": blog.createdAt,
      "description": description,
      "author": {
        "@type": "Person",
        "name": "Bugyboo Editor"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Bugyboo"
      }
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bugyboo.com/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://bugyboo.com/blog" },
        { "@type": "ListItem", "position": 3, "name": blog.title, "item": canonicalUrl }
      ]
    };

    const routeInfo = {
      route: `blog/${blog._id}`,
      title,
      description,
      keywords: `${blog.title}, Bugyboo blog post, kids fashion journal`,
      h1: `<h1 class="font-serif text-3xl md:text-5xl lg:text-6xl mb-6 text-balance leading-tight">${blog.title}</h1>`,
      schema: [breadcrumbSchema, blogSchema]
    };

    prerenderRoute(templateHtml, routeInfo);
  });

  console.log("✓ All SPA static pages successfully prerendered!");
};

runPrerender();
