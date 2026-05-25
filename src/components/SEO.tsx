import { useEffect } from "react";

type SEOProps = {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "product" | "article";
  schemaData?: object | object[];
};

const SEO = ({
  title = "Bugyboo — Premium Kids Wear & Wholesale Supplier",
  description = "Explore stylish, comfortable, and affordable premium kids clothing for babies, boys, and girls. Trusted kids wear manufacturer in India.",
  keywords = "Buy Kids Wear Online India, Best Kids Clothing Brand in India, Kids Wear Online Shopping India, Cotton Kids Wear Manufacturer India",
  canonicalUrl,
  ogImage = "/favicon.jpg",
  ogType = "website",
  schemaData
}: SEOProps) => {
  useEffect(() => {
    // 1. Dynamic document title
    document.title = title;

    // Helper to get or create a meta tag
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Standard Metadata
    setMetaTag("name", "description", description);
    setMetaTag("name", "keywords", keywords);
    setMetaTag("name", "robots", "index, follow");

    // 3. Open Graph Metadata
    const currentUrl = canonicalUrl || window.location.href;
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:image", ogImage.startsWith("http") ? ogImage : `${window.location.origin}${ogImage}`);
    setMetaTag("property", "og:type", ogType);
    setMetaTag("property", "og:url", currentUrl);
    setMetaTag("property", "og:site_name", "Bugyboo");

    // 4. Twitter Cards
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", ogImage.startsWith("http") ? ogImage : `${window.location.origin}${ogImage}`);

    // 5. Canonical Link
    let canonicalLink = document.querySelector("link[rel='canonical']");
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", currentUrl);

    // 6. JSON-LD Schema Structured Data Injection
    const existingScript = document.getElementById("bugyboo-jsonld-schema");
    if (existingScript) {
      existingScript.remove();
    }

    if (schemaData) {
      const script = document.createElement("script");
      script.id = "bugyboo-jsonld-schema";
      script.type = "application/ld+json";
      
      const structuredObject = Array.isArray(schemaData) 
        ? { "@context": "https://schema.org", "@graph": schemaData }
        : { "@context": "https://schema.org", ...schemaData };

      script.text = JSON.stringify(structuredObject);
      document.head.appendChild(script);
    }

    return () => {
      // Clean up dynamic schema tags on unmount
      const scriptToRemove = document.getElementById("bugyboo-jsonld-schema");
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, schemaData]);

  return null;
};

export default SEO;
