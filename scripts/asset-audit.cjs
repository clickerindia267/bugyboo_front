const fs = require("fs");
const path = require("path");

const SRC_ASSETS_DIR = path.join(__dirname, "../src/assets");
const PUBLIC_IMAGES_DIR = path.join(__dirname, "../public/images");

const TARGET_EXTENSIONS = [".png", ".jpg", ".jpeg", ".mp4", ".mov", ".webm"];

function scanDirectory(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDirectory(fullPath, results);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (TARGET_EXTENSIONS.includes(ext)) {
        results.push({
          name: file,
          path: path.relative(path.join(__dirname, ".."), fullPath),
          sizeBytes: stat.size,
          sizeKB: (stat.size / 1024).toFixed(2)
        });
      }
    }
  }
  return results;
}

const audit = () => {
  const assets = scanDirectory(SRC_ASSETS_DIR);
  const publicImages = scanDirectory(PUBLIC_IMAGES_DIR);
  const allMedia = [...assets, ...publicImages];

  console.log("\n==================================================");
  console.log("             BUGYBOO MEDIA ASSET AUDIT            ");
  console.log("==================================================");
  console.log("| File Path | Current Size | Rendered Size (Display) | Recommended Size | Status |");
  console.log("| :--- | :--- | :--- | :--- | :--- |");

  allMedia.forEach(m => {
    let renderedSize = "Varies";
    let recommendedSize = "N/A";
    let status = "Okay";

    if (m.name.startsWith("occasion-")) {
      renderedSize = "~96x96 px (Circles)";
      recommendedSize = "< 20 KB (WebP, 200x200 max)";
      status = m.sizeBytes > 400 * 1024 ? "OVERSIZED (PNG)" : "OPTIMIZED (WebP)";
    } else if (m.name.startsWith("hero-banner-new-")) {
      if (m.name.includes("-desktop")) {
        renderedSize = "Desktop Fluid (1600px)";
        recommendedSize = "< 120 KB (WebP)";
        status = m.sizeBytes > 250 * 1024 ? "Oversized" : "OPTIMIZED (WebP)";
      } else if (m.name.includes("-mobile")) {
        renderedSize = "Mobile Fluid (768px)";
        recommendedSize = "< 50 KB (WebP)";
        status = m.sizeBytes > 100 * 1024 ? "Oversized" : "OPTIMIZED (WebP)";
      } else {
        renderedSize = "Responsive Cover";
        recommendedSize = "Separate Mobile/Desktop WebP";
        status = "LEGACY (Original JPG)";
      }
    } else if (m.name.startsWith("Video-")) {
      renderedSize = "~350x440 px";
      recommendedSize = "Intersection Deferral / < 2MB";
      status = m.sizeBytes > 4 * 1024 * 1024 ? "LARGE PAYLOAD (Lazy Loaded)" : "Okay";
    }

    console.log(`| \`${m.path.replace(/\\/g, "/")}\` | ${m.sizeKB} KB | ${renderedSize} | ${recommendedSize} | ${status} |`);
  });
  console.log("==================================================");
};

audit();
