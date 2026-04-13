const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ----------------------------
// Config
// ----------------------------
const PDF_DIR = "pdfs";
const BOOK_DIR = "books";
const LIBRARY_FILE = "library.json";


// ----------------------------
// Helpers
// ----------------------------

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\.pdf$/i, "")
    .normalize("NFKD")                  // normalize unicode
    .replace(/[^\w\s-]/g, "")           // remove non-word chars
    .trim()
    .replace(/\s+/g, "-")               // spaces → hyphens
    .replace(/-+/g, "-")                // collapse hyphens
    || "book-" + Date.now();            // fallback if empty
}


// Ensure folder exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}


// Load library.json
function loadLibrary() {
  if (!fs.existsSync(LIBRARY_FILE)) return [];
  return JSON.parse(fs.readFileSync(LIBRARY_FILE, "utf-8"));
}

// Save library.json
function saveLibrary(data) {
  fs.writeFileSync(LIBRARY_FILE, JSON.stringify(data, null, 2));
}

// Check if book already exists in library
function bookExists(library, slug) {
  return library.some(b => b.folder === `books/${slug}`);
}

// Check if book folder already has images
function pagesExist(folderPath) {
  if (!fs.existsSync(folderPath)) return false;

  return fs.readdirSync(folderPath)
    .some(file => file.endsWith(".jpg"));
}

// Convert PDF → images using pdftoppm
function convertPDF(pdfPath, outputFolder) {
  console.log(`📄 Converting: ${pdfPath}`);

  ensureDir(outputFolder);

  const absOutput = path.resolve(outputFolder);
  const absPdf = path.resolve(pdfPath);

  const outputPrefix = path.join(absOutput, "page");

  execSync(
    `pdftoppm "${absPdf}" "${outputPrefix}" -jpeg -r 200`
  );

  const pages = fs.readdirSync(absOutput)
    .filter(f => f.startsWith("page") && f.endsWith(".jpg"))
    .sort((a, b) => a.localeCompare(b));

  return pages.length;
}

// ----------------------------
// Main
// ----------------------------

function run() {
  ensureDir(PDF_DIR);
  ensureDir(BOOK_DIR);

  let library = loadLibrary();

  const files = fs.readdirSync(PDF_DIR)
    .filter(f => f.toLowerCase().endsWith(".pdf"));

  if (files.length === 0) {
    console.log("⚠️ No PDFs found in /pdfs");
    return;
  }

  for (const file of files) {
    const slug = slugify(file);

    const pdfPath = path.join(PDF_DIR, file);
    const bookPath = path.join(BOOK_DIR, slug);

    // Skip if already processed
    if (bookExists(library, slug) && pagesExist(bookPath)) {
      console.log(`⏩ Skipping: ${file}`);
      continue;
    }

    // Convert PDF → images
    const pageCount = convertPDF(pdfPath, bookPath);

    // Remove old entry if exists
    library = library.filter(b => b.folder !== `books/${slug}`);

    // Add new entry
    library.push({
      title: file.replace(/\.pdf$/i, ""),
      folder: `books/${slug}`,
      pages: pageCount
    });

    console.log(`📚 Added: ${file} (${pageCount} pages)`);
  }

  saveLibrary(library);

  console.log("🎉 library.json updated successfully!");
}


// Run script
run();