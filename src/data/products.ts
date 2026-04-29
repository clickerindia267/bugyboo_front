import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";

export type Product = {
  id: number;
  slug: string;
  img: string;
  gallery: string[];
  name: string;
  price: number;
  rating: number;
  reviews: number;
  tag?: string;
  category: string;
  ageGroup: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
  details: string[];
};

export const products: Product[] = [
  {
    id: 1,
    slug: "rose-knit-cardigan",
    img: p1,
    gallery: [p1, p2, p3, p4],
    name: "Rosé Knit Cardigan",
    price: 68,
    rating: 4.9,
    reviews: 128,
    tag: "New",
    category: "Girls",
    ageGroup: "2-4Y",
    colors: [
      { name: "Rosé", hex: "#F4D5DD" },
      { name: "Cream", hex: "#F5EBDD" },
      { name: "Sky", hex: "#D6E7F2" },
    ],
    sizes: ["0-3M", "3-6M", "6-12M", "1-2Y", "2-3Y", "3-4Y"],
    description:
      "A soft Merino-blend cardigan in dusty rose, hand-finished with mother-of-pearl buttons. Perfectly weighted for layered dressing all year round.",
    details: [
      "70% Merino wool · 30% organic cotton",
      "Hand-washed, low-tumble dry",
      "Mother-of-pearl buttons",
      "Crafted in Portugal",
    ],
  },
  {
    id: 2,
    slug: "cream-heirloom-knit",
    img: p2,
    gallery: [p2, p1, p4, p3],
    name: "Cream Heirloom Knit",
    price: 84,
    rating: 5.0,
    reviews: 96,
    tag: "Bestseller",
    category: "Unisex",
    ageGroup: "0-2Y",
    colors: [
      { name: "Cream", hex: "#F5EBDD" },
      { name: "Sand", hex: "#E4D3BB" },
    ],
    sizes: ["0-3M", "3-6M", "6-12M", "1-2Y"],
    description:
      "An heirloom-worthy cable knit, made to be passed down. Buttery soft and gently structured.",
    details: ["100% Merino wool", "Hand-washed", "Made in Italy", "OEKO-TEX certified"],
  },
  {
    id: 3,
    slug: "petal-ruffle-dress",
    img: p3,
    gallery: [p3, p1, p2, p4],
    name: "Petal Ruffle Dress",
    price: 92,
    rating: 4.8,
    reviews: 73,
    category: "Girls",
    ageGroup: "3-6Y",
    colors: [
      { name: "Petal", hex: "#F2C8D2" },
      { name: "Ivory", hex: "#F8F1E5" },
    ],
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"],
    description:
      "A romantic ruffle dress in featherlight cotton voile, perfect for spring gatherings and quiet afternoons.",
    details: ["100% organic cotton voile", "Lined bodice", "Hidden back zip", "Made in Portugal"],
  },
  {
    id: 4,
    slug: "sky-linen-romper",
    img: p4,
    gallery: [p4, p3, p1, p2],
    name: "Sky Linen Romper",
    price: 56,
    rating: 4.7,
    reviews: 52,
    tag: "New",
    category: "Boys",
    ageGroup: "0-2Y",
    colors: [
      { name: "Sky", hex: "#D6E7F2" },
      { name: "Cream", hex: "#F5EBDD" },
    ],
    sizes: ["0-3M", "3-6M", "6-12M", "1-2Y"],
    description:
      "Breathable European linen romper with snap closures — easy on, easy off for newborn days.",
    details: ["100% European linen", "Snap closures", "Pre-washed for softness", "Made in France"],
  },
  {
    id: 5,
    slug: "lavender-tutu-dress",
    img: p3,
    gallery: [p3, p2, p1, p4],
    name: "Lavender Tutu Dress",
    price: 110,
    rating: 4.9,
    reviews: 41,
    tag: "Limited",
    category: "Girls",
    ageGroup: "3-6Y",
    colors: [
      { name: "Lavender", hex: "#D9CCEA" },
      { name: "Petal", hex: "#F2C8D2" },
    ],
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"],
    description: "Layered tulle tutu dress with a hand-embroidered velvet bodice.",
    details: ["Silk-tulle layers", "Velvet bodice", "Hand embroidery", "Made in France"],
  },
  {
    id: 6,
    slug: "honey-corduroy-set",
    img: p1,
    gallery: [p1, p4, p2, p3],
    name: "Honey Corduroy Set",
    price: 78,
    rating: 4.8,
    reviews: 64,
    category: "Boys",
    ageGroup: "1-3Y",
    colors: [
      { name: "Honey", hex: "#D9B98A" },
      { name: "Sand", hex: "#E4D3BB" },
    ],
    sizes: ["6-12M", "1-2Y", "2-3Y", "3-4Y"],
    description: "Two-piece corduroy set in warm honey — soft, cozy, and made to play in.",
    details: ["Cotton corduroy", "Elastic waist", "Machine wash cold", "Made in Portugal"],
  },
  {
    id: 7,
    slug: "ivory-pearl-romper",
    img: p2,
    gallery: [p2, p4, p1, p3],
    name: "Ivory Pearl Romper",
    price: 64,
    rating: 4.9,
    reviews: 38,
    tag: "New",
    category: "Newborn",
    ageGroup: "0-1Y",
    colors: [{ name: "Ivory", hex: "#F8F1E5" }],
    sizes: ["0-3M", "3-6M", "6-12M"],
    description: "An ivory romper with delicate pearl buttons — christening-ready.",
    details: ["Organic cotton sateen", "Mother-of-pearl buttons", "Made in Italy"],
  },
  {
    id: 8,
    slug: "blush-bow-headband",
    img: p4,
    gallery: [p4, p3, p1, p2],
    name: "Blush Bow Headband",
    price: 28,
    rating: 4.7,
    reviews: 112,
    category: "Accessories",
    ageGroup: "0-3Y",
    colors: [
      { name: "Blush", hex: "#F4D5DD" },
      { name: "Ivory", hex: "#F8F1E5" },
    ],
    sizes: ["One size"],
    description: "A soft silk bow headband, gently elasticated for tiny heads.",
    details: ["100% silk", "Soft elastic", "Made in France"],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
