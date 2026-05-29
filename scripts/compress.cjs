const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const DIST_DIR = path.join(__dirname, "../dist");

// Extensions of files we want to compress
const TARGET_EXTENSIONS = [".html", ".js", ".css", ".json", ".svg"];

function compressFile(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    
    // 1. Gzip compression (maximum quality 9)
    const gzipPath = `${filePath}.gz`;
    const gzipContent = zlib.gzipSync(content, { level: 9 });
    fs.writeFileSync(gzipPath, gzipContent);
    
    // 2. Brotli compression (maximum quality 11)
    const brotliPath = `${filePath}.br`;
    const brotliContent = zlib.brotliCompressSync(content, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
      },
    });
    fs.writeFileSync(brotliPath, brotliContent);
    
    const relPath = path.relative(DIST_DIR, filePath);
    const origKB = (content.length / 1024).toFixed(2);
    const gzKB = (gzipContent.length / 1024).toFixed(2);
    const brKB = (brotliContent.length / 1024).toFixed(2);
    
    console.log(`✓ Compressed: ${relPath}`);
    console.log(`  Size: ${origKB} KB -> Gzip: ${gzKB} KB | Brotli: ${brKB} KB`);
  } catch (err) {
    console.error(`❌ Error compressing file ${filePath}:`, err.message);
  }
}

function traverseAndCompress(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      traverseAndCompress(fullPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (TARGET_EXTENSIONS.includes(ext) && !file.endsWith(".gz") && !file.endsWith(".br")) {
        compressFile(fullPath);
      }
    }
  }
}

console.log("==================================================");
console.log("   BUGYBOO NATIVE COMPRESSION ENGINE (GZIP & BROTLI)");
console.log("==================================================");

if (fs.existsSync(DIST_DIR)) {
  traverseAndCompress(DIST_DIR);
  console.log("\n✓ Post-build compression completed successfully!");
} else {
  console.error("❌ Error: dist/ directory does not exist. Run vite build first.");
  process.exit(1);
}
console.log("==================================================");
