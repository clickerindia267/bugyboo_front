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

export function sortVariants<T extends { ageGroup: string }>(variants: T[]): T[] {
  if (!variants || variants.length <= 1) return variants ? [...variants] : [];

  const sizeHierarchy = ["xxs", "xs", "s", "m", "l", "xl", "xxl", "xxxl", "3xl", "4xl", "5xl"];

  return [...variants].sort((a, b) => {
    const valA = (a.ageGroup || "").trim();
    const valB = (b.ageGroup || "").trim();

    // Check if both are in predefined size hierarchy
    const indexA = sizeHierarchy.indexOf(valA.toLowerCase());
    const indexB = sizeHierarchy.indexOf(valB.toLowerCase());

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    if (indexA !== -1) return 1;
    if (indexB !== -1) return -1;

    // Try to extract numbers (e.g. ranges "4-5", "1-2" or single numbers)
    const numRegex = /\d+(\.\d+)?/g;
    const matchA = valA.match(numRegex);
    const matchB = valB.match(numRegex);

    if (matchA && matchB) {
      // Compare first number
      const firstA = parseFloat(matchA[0]);
      const firstB = parseFloat(matchB[0]);

      if (firstA !== firstB) {
        return firstA - firstB;
      }

      // If first numbers are equal, compare second number (if both have one)
      if (matchA[1] && matchB[1]) {
        const secondA = parseFloat(matchA[1]);
        const secondB = parseFloat(matchB[1]);
        return secondA - secondB;
      }

      // If one has a second number and the other doesn't
      return matchA.length - matchB.length;
    }

    // If one has numbers and the other doesn't
    if (matchA) return -1;
    if (matchB) return 1;

    // Fallback: alphabetical sort
    return valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' });
  });
}


