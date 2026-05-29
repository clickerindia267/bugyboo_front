const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ASSETS_DIR = path.join(__dirname, "../src/assets");

// Occasion images to process (resize to 200x200 max, convert to WebP)
const occasionImages = [
  "occasion-baby-wardrobe.png",
  "occasion-birthday.png",
  "occasion-boys-wardrobe.png",
  "occasion-boys.png",
  "occasion-girls-wardrobe.png",
  "occasion-girls.png",
  "occasion-new-in.png",
  "occasion-step-out.png",
  "occasion-vacation.png"
];

// Hero banner images to process (generate 1600px desktop WebP and 768px mobile WebP)
const heroBanners = [
  "hero-banner-new-1.jpg",
  "hero-banner-new-2.jpg",
  "hero-banner-new-3.jpg"
];

const runImageOptimization = async () => {
  console.log("==================================================");
  console.log("   BUGYBOO IMAGE OPTIMIZATION ENGINE (SHARP)");
  console.log("==================================================");

  // 1. Process Occasion Images
  console.log("\n--- Processing Occasion Circles (PNG -> 200x200 WebP) ---");
  for (const imgName of occasionImages) {
    const srcPath = path.join(ASSETS_DIR, imgName);
    const destName = imgName.replace(".png", ".webp");
    const destPath = path.join(ASSETS_DIR, destName);

    if (!fs.existsSync(srcPath)) {
      console.warn(`⚠️ Warning: Source file not found: ${imgName}`);
      continue;
    }

    const beforeStats = fs.statSync(srcPath);
    const beforeSizeKB = (beforeStats.size / 1024).toFixed(2);

    try {
      await sharp(srcPath)
        .resize(200, 200, {
          fit: "cover",
          position: "top"
        })
        .webp({ quality: 85 })
        .toFile(destPath);

      const afterStats = fs.statSync(destPath);
      const afterSizeKB = (afterStats.size / 1024).toFixed(2);
      const ratio = ((1 - afterStats.size / beforeStats.size) * 100).toFixed(1);

      console.log(`✓ Optimized ${imgName} -> ${destName}`);
      console.log(`  Size: ${beforeSizeKB} KB -> ${afterSizeKB} KB (-${ratio}%)`);
    } catch (err) {
      console.error(`❌ Error processing ${imgName}:`, err.message);
    }
  }

  // 2. Process Hero Banners
  console.log("\n--- Processing Hero Banners (JPG -> Mobile/Desktop WebP) ---");
  for (const imgName of heroBanners) {
    const srcPath = path.join(ASSETS_DIR, imgName);
    
    if (!fs.existsSync(srcPath)) {
      console.warn(`⚠️ Warning: Source file not found: ${imgName}`);
      continue;
    }

    const beforeStats = fs.statSync(srcPath);
    const beforeSizeKB = (beforeStats.size / 1024).toFixed(2);

    const baseName = imgName.replace(".jpg", "");

    // A. Desktop Variant (1600px width, cover)
    const desktopName = `${baseName}-desktop.webp`;
    const desktopPath = path.join(ASSETS_DIR, desktopName);

    // B. Mobile Variant (768px width, cover)
    const mobileName = `${baseName}-mobile.webp`;
    const mobilePath = path.join(ASSETS_DIR, mobileName);

    try {
      // Generate Desktop
      await sharp(srcPath)
        .resize(1600, null, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(desktopPath);

      const desktopStats = fs.statSync(desktopPath);
      const desktopSizeKB = (desktopStats.size / 1024).toFixed(2);

      console.log(`✓ Generated Desktop Variant: ${desktopName} (${desktopSizeKB} KB)`);

      // Generate Mobile
      await sharp(srcPath)
        .resize(768, null, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(mobilePath);

      const mobileStats = fs.statSync(mobilePath);
      const mobileSizeKB = (mobileStats.size / 1024).toFixed(2);

      console.log(`✓ Generated Mobile Variant:  ${mobileName}  (${mobileSizeKB} KB)`);
      console.log(`  Base Image: ${imgName} (${beforeSizeKB} KB)`);
    } catch (err) {
      console.error(`❌ Error processing banner ${imgName}:`, err.message);
    }
  }

  console.log("\n==================================================");
  console.log("   IMAGE OPTIMIZATION COMPLETED SUCCESSFULLY!");
  console.log("==================================================");
};

runImageOptimization();
