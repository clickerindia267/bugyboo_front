import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function getProductAltText(name: string, categoryName: string): string {
  const lowerName = name.toLowerCase();
  const lowerCat = (categoryName || "").toLowerCase();
  
  if (lowerCat.includes("girl") || lowerName.includes("frock") || lowerName.includes("dress")) {
    if (lowerName.includes("floral")) return `${name} — Floral Cotton Frock for Girls Online`;
    if (lowerName.includes("party") || lowerName.includes("layered") || lowerName.includes("bow")) return `${name} — Stylish Girls Party Wear Frock`;
    if (lowerName.includes("check")) return `${name} — Trendy Girls Frock Collection`;
    return `${name} — Premium Girls Dress Online India`;
  }
  
  if (lowerCat.includes("coord") || lowerCat.includes("co-ord") || lowerName.includes("coord") || lowerName.includes("co-ord")) {
    if (lowerName.includes("girl")) return `${name} — Stylish Girls Co-ord Set`;
    if (lowerName.includes("cotton")) return `${name} — Cotton Co-ord Set for Kids`;
    if (lowerName.includes("matching") || lowerName.includes("check")) return `${name} — Fashionable Kids Matching Set`;
    return `${name} — Kids Co-ord Set Online India`;
  }
  
  if (lowerCat.includes("night") || lowerCat.includes("sleep") || lowerName.includes("night") || lowerName.includes("pajama")) {
    if (lowerName.includes("cotton") || lowerName.includes("pajama")) return `${name} — Cotton Pajama Set for Kids`;
    if (lowerName.includes("sleep") || lowerName.includes("comfort")) return `${name} — Comfortable Sleepwear for Children`;
    if (lowerName.includes("soft") || lowerName.includes("short")) return `${name} — Soft Kids Nightwear Collection`;
    return `${name} — Kids Night Suit Online India`;
  }
  
  if (lowerCat.includes("newborn") || lowerCat.includes("baby") || lowerName.includes("baby") || lowerName.includes("romper")) {
    if (lowerName.includes("newborn") || lowerName.includes("romper")) return `${name} — Newborn Baby Clothing India`;
    if (lowerName.includes("comfort") || lowerName.includes("soft")) return `${name} — Comfortable Baby Wear Collection`;
    if (lowerName.includes("trendy")) return `${name} — Trendy Baby Clothes Online India`;
    return `${name} — Soft Cotton Baby Clothes Online`;
  }
  
  return `${name} — Buy Kids Wear Online India at Bugyboo`;
}

export function getProductThumbnail(images?: string[]): string {
  if (!images || images.length === 0) return "";
  const firstImg = images.find(url => {
    const lower = url.toLowerCase();
    return !(lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".mov") || lower.endsWith(".avi"));
  });
  return firstImg || images[0] || "";
}

export function isPlaybackVideo(urlOrBlob?: string): boolean {
  if (!urlOrBlob) return false;
  const lowercase = urlOrBlob.toLowerCase();
  return lowercase.endsWith(".mp4") || lowercase.endsWith(".webm") || lowercase.endsWith(".mov") || lowercase.endsWith(".avi");
}

