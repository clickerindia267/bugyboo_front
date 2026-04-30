import p1 from "@/assets/pinktop1.jpeg";
import p11 from "@/assets/pinktop2.jpeg";
import p12 from "@/assets/pinktop3.jpeg";
import p13 from "@/assets/pinktop4.jpeg";

// nightwear

import p2 from "@/assets/nightwear2.jpeg";
import p21 from "@/assets/nightwear1.jpeg";
import p22 from "@/assets/nightwear3.jpeg";

//  frok 

import p3 from "@/assets/frok1.jpeg";
import p31 from "@/assets/frok2.jpeg";
import p32 from "@/assets/frok3.jpeg";

import p4 from "@/assets/pinktop1.jpeg";

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
  occasions?: string[];
};

export const products: Product[] = [
  {
    id: 1,
    slug: "rose-knit-cardigan",
    img: p1,
    gallery: [p1, p11, p12, p13],
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
    occasions: ["New In", "Step Out"],
  },
  {
    id: 2,
    slug: "cream-heirloom-knit",
    img: p2,
    gallery: [p2, p21, p22],
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
    occasions: ["Birthday", "Step Out"],
  },
  {
    id: 3,
    slug: "petal-ruffle-dress",
    img: p3,
    gallery: [p3, p31, p32],
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
    occasions: ["Birthday", "Step Out"],
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
    occasions: ["New In", "Vacation"],
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
    occasions: ["Birthday"],
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
    occasions: ["Step Out", "Vacation"],
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
    occasions: ["New In", "Birthday"],
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
    occasions: ["Birthday", "Step Out"],
  },
  {
    id: 9,
    slug: "sunshine-floral-dress",
    img: "https://images.unsplash.com/photo-1543854589-fdd4d3a0d181?w=600&h=800&fit=crop&crop=center",
    gallery: [
      "https://images.unsplash.com/photo-1543854589-fdd4d3a0d181?w=600&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=800&fit=crop&crop=center",
    ],
    name: "Sunshine Floral Dress",
    price: 52,
    rating: 4.9,
    reviews: 87,
    tag: "Summer",
    category: "Girls",
    ageGroup: "2-5Y",
    colors: [
      { name: "Yellow", hex: "#F9E076" },
      { name: "Peach", hex: "#FADADD" },
    ],
    sizes: ["2-3Y", "3-4Y", "4-5Y"],
    description: "A breezy floral sundress in vibrant sunshine yellow — perfect for garden parties and beach days.",
    details: ["100% organic cotton", "Adjustable straps", "Machine washable", "Made in India"],
    occasions: ["Vacation", "Step Out"],
  },
  {
    id: 10,
    slug: "ocean-breeze-shorts-set",
    img: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=800&fit=crop&crop=center",
    gallery: [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&h=800&fit=crop&crop=center",
    ],
    name: "Ocean Breeze Shorts Set",
    price: 46,
    rating: 4.8,
    reviews: 63,
    tag: "Summer",
    category: "Boys",
    ageGroup: "1-4Y",
    colors: [
      { name: "Ocean Blue", hex: "#87CEEB" },
      { name: "Sand", hex: "#E4D3BB" },
    ],
    sizes: ["1-2Y", "2-3Y", "3-4Y"],
    description: "A cool linen shorts & tee set in ocean blue — lightweight and perfect for warm summer days.",
    details: ["Linen-cotton blend", "Elastic waist", "Pre-shrunk", "Made in Portugal"],
    occasions: ["Vacation", "Step Out"],
  },
  {
    id: 11,
    slug: "tropical-print-romper",
    img: "https://images.unsplash.com/photo-1590650516441-9ef16547b58a?w=600&h=800&fit=crop&crop=faces",
    gallery: [
      "https://images.unsplash.com/photo-1590650516441-9ef16547b58a?w=600&h=800&fit=crop&crop=faces",
      "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=600&h=800&fit=crop&crop=faces",
    ],
    name: "Tropical Print Romper",
    price: 38,
    rating: 4.7,
    reviews: 45,
    tag: "New",
    category: "Unisex",
    ageGroup: "0-2Y",
    colors: [
      { name: "Tropical", hex: "#98D8C8" },
      { name: "Coral", hex: "#FF7F7F" },
    ],
    sizes: ["0-3M", "3-6M", "6-12M", "1-2Y"],
    description: "Playful tropical print romper in breathable muslin — ideal for tiny explorers in the summer heat.",
    details: ["100% muslin cotton", "Snap closures", "UPF 30+", "Made in India"],
    occasions: ["New In", "Vacation"],
  },
  {
    id: 12,
    slug: "daisy-cotton-top",
    img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=800&fit=crop&crop=center",
    gallery: [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1543854589-fdd4d3a0d181?w=600&h=800&fit=crop&crop=center",
    ],
    name: "Daisy Cotton Top",
    price: 32,
    rating: 4.8,
    reviews: 92,
    tag: "Bestseller",
    category: "Girls",
    ageGroup: "2-6Y",
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Lemon", hex: "#FFF44F" },
      { name: "Blush", hex: "#F4D5DD" },
    ],
    sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"],
    description: "A charming daisy-embroidered cotton top with flutter sleeves — summer's sweetest staple.",
    details: ["100% organic cotton", "Embroidered details", "Easy wash & wear", "Made in Portugal"],
    occasions: ["Step Out", "Vacation"],
  },
  {
    id: 13,
    slug: "safari-adventure-set",
    img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=800&fit=crop&crop=faces",
    gallery: [
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=800&fit=crop&crop=faces",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=800&fit=crop&crop=center",
    ],
    name: "Safari Adventure Set",
    price: 58,
    rating: 4.9,
    reviews: 34,
    tag: "New",
    category: "Boys",
    ageGroup: "3-6Y",
    colors: [
      { name: "Khaki", hex: "#C3B091" },
      { name: "Olive", hex: "#808000" },
    ],
    sizes: ["3-4Y", "4-5Y", "5-6Y"],
    description: "An adventure-ready safari set with cargo shorts and a matching button-up — explorer mode on.",
    details: ["Cotton twill", "Multiple pockets", "Adjustable waist", "Made in India"],
    occasions: ["New In", "Vacation"],
  },
  {
    id: 14,
    slug: "watermelon-swimsuit",
    img: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=600&h=800&fit=crop&crop=faces",
    gallery: [
      "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=600&h=800&fit=crop&crop=faces",
      "https://images.unsplash.com/photo-1590650516441-9ef16547b58a?w=600&h=800&fit=crop&crop=faces",
    ],
    name: "Watermelon Swimsuit",
    price: 36,
    rating: 4.6,
    reviews: 78,
    tag: "Summer",
    category: "Girls",
    ageGroup: "1-5Y",
    colors: [
      { name: "Watermelon", hex: "#FC6C85" },
      { name: "Mint", hex: "#98D8C8" },
    ],
    sizes: ["1-2Y", "2-3Y", "3-4Y", "4-5Y"],
    description: "A playful watermelon-print swimsuit with UPF 50+ sun protection — splash-ready and adorable.",
    details: ["Recycled nylon", "UPF 50+", "Quick-dry", "Chlorine resistant"],
    occasions: ["Vacation"],
  },
  {
    id: 15,
    slug: "linen-sun-hat",
    img: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&h=800&fit=crop&crop=center",
    gallery: [
      "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=600&h=800&fit=crop&crop=faces",
    ],
    name: "Linen Sun Hat",
    price: 24,
    rating: 4.7,
    reviews: 156,
    tag: "Bestseller",
    category: "Accessories",
    ageGroup: "0-4Y",
    colors: [
      { name: "Natural", hex: "#E8DCC8" },
      { name: "Blush", hex: "#F4D5DD" },
      { name: "Sky", hex: "#D6E7F2" },
    ],
    sizes: ["S (0-1Y)", "M (1-2Y)", "L (2-4Y)"],
    description: "A wide-brim linen sun hat with chin strap — essential sun protection with effortless style.",
    details: ["100% linen", "UPF 40+", "Adjustable chin strap", "Made in Italy"],
    occasions: ["Vacation", "Step Out"],
  },
  {
    id: 16,
    slug: "mango-cotton-co-ord",
    img: "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=600&h=800&fit=crop&crop=faces",
    gallery: [
      "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=600&h=800&fit=crop&crop=faces",
      "https://images.unsplash.com/photo-1543854589-fdd4d3a0d181?w=600&h=800&fit=crop&crop=center",
    ],
    name: "Mango Cotton Co-ord",
    price: 48,
    rating: 4.8,
    reviews: 51,
    tag: "Summer",
    category: "Unisex",
    ageGroup: "1-4Y",
    colors: [
      { name: "Mango", hex: "#FDBE34" },
      { name: "Cream", hex: "#F5EBDD" },
    ],
    sizes: ["1-2Y", "2-3Y", "3-4Y"],
    description: "A matching mango-print co-ord set in featherweight cotton — cheerful, comfy, and summer-perfect.",
    details: ["100% organic cotton", "Elastic waist", "AZO-free dyes", "Made in India"],
    occasions: ["New In", "Vacation"],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
