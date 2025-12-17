// scripts/manifest-to-datasets.cjs
// (This is the same script you used, extended to support RelativePath.)
const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const XLSX = require("xlsx");

const ARGV = process.argv.slice(2);
if (ARGV.length < 1) {
  console.error("Usage: node scripts/manifest-to-datasets.cjs manifest.xlsx");
  process.exit(1);
}
const manifestPath = ARGV[0];

if (!fs.existsSync(manifestPath)) {
  console.error("File not found:", manifestPath);
  process.exit(2);
}

const wb = XLSX.readFile(manifestPath, { cellDates: true });
const sheetDatabases = wb.Sheets["Databases"] || wb.Sheets["Database"] || wb.Sheets["DBs"];
const sheetFiles = wb.Sheets["Files"] || wb.Sheets["Files "];

if (!sheetDatabases) {
  console.error("Could not find a sheet named 'Databases' (case-sensitive).");
  process.exit(3);
}
if (!sheetFiles) {
  console.error("Could not find a sheet named 'Files' (case-sensitive).");
  process.exit(3);
}

const dbRows = XLSX.utils.sheet_to_json(sheetDatabases, { defval: "" });
const fileRows = XLSX.utils.sheet_to_json(sheetFiles, { defval: "" });

const out = { company: {} };
const warnings = [];

function ensureDepartment(deptName) {
  if (!out.company[deptName]) out.company[deptName] = {};
  return out.company[deptName];
}

// process databases (same as before)
dbRows.forEach((r, i) => {
  const rowIndex = i + 2;
  const Department = (r.Department || "").toString().trim();
  const Section = (r.Section || "").toString().trim();
  const DB_ID = (r.DB_ID || r.DBId || r.db_id || "").toString().trim();
  const DB_Name = (r.DB_Name || r.DBName || r.DB || "").toString().trim();
  const DB_Type = (r.DB_Type || r.Type || "").toString().trim();
  const EmbedURL = (r.EmbedURL || r.EmbedUrl || "").toString().trim();
  const Description = (r.Description || "").toString().trim();

  if (!Department || !Section || !DB_ID || !DB_Name) {
    warnings.push(`Databases sheet row ${rowIndex}: missing required fields (Department, Section, DB_ID, DB_Name).`);
    return;
  }

  const dept = ensureDepartment(Department);
  if (!dept[Section]) dept[Section] = {};
  dept[Section][DB_Name] = {
    dashId: DB_ID,
    type: DB_Type || undefined,
    embedUrl: EmbedURL || undefined,
    description: Description || "",
    dataset: { files: [] }
  };
});

// index DBs by DB_ID
const dbIdIndex = {};
Object.entries(out.company).forEach(([deptName, sections]) => {
  Object.entries(sections).forEach(([sectionName, dashboards]) => {
    Object.entries(dashboards).forEach(([dashName, dashObj]) => {
      if (dashObj && dashObj.dashId) {
        dbIdIndex[dashObj.dashId] = { deptName, sectionName, dashName, dashObj };
      }
    });
  });
});

// process files (extended)
fileRows.forEach((r, i) => {
  const rowIndex = i + 2;
  const DB_ID = (r.DB_ID || r.DBId || r.db_id || "").toString().trim();
  const File_ID = (r.File_ID || r.FileId || r.file_id || `file-${Date.now()}-${i}`).toString().trim();
  const File_Name = (r.File_Name || r.FileName || r.Name || "").toString().trim();
  const File_Type = ((r.File_Type || r.Type || "").toString().trim() || "").toLowerCase();
  const URL = (r.URL || r.Url || r.Link || "").toString().trim();
  const RelativePath = (r.RelativePath || r.Path || r.FolderPath || "").toString().trim();
  const Description = (r.Description || "").toString().trim();

  if (!DB_ID || !File_Name || !URL) {
    warnings.push(`Files sheet row ${rowIndex}: DB_ID, File_Name and URL are required.`);
    return;
  }

  const dbEntry = dbIdIndex[DB_ID];
  if (!dbEntry) {
    warnings.push(`Files sheet row ${rowIndex}: DB_ID '${DB_ID}' not found in Databases sheet.`);
    return;
  }

  const fileObj = {
    id: File_ID || `file-${Date.now()}-${i}`,
    name: File_Name,
    type: (File_Type === "local" || File_Type === "external") ? File_Type : (URL.startsWith("/") ? "local" : "external"),
    url: URL,
    relativePath: RelativePath || "",   // NEW: store the relative path
    description: Description || ""
  };

  // attach
  dbEntry.dashObj.dataset.files.push(fileObj);

  // if local, create folder structure under public/data/<dept>/<section>/<dbId>/<RelativePath>
  if (fileObj.type === "local") {
    const cleanDept = dbEntry.deptName.replace(/[^\w-]/g, "_").toLowerCase();
    const cleanSection = dbEntry.sectionName.replace(/[^\w-]/g, "_").toLowerCase();
    const cleanDb = (dbEntry.dashObj.dashId || dbEntry.dashName).toString().replace(/[^\w-]/g, "_").toLowerCase();
    // use relativePath segments if provided
    const relPath = (fileObj.relativePath || "").split("/").filter(Boolean);
    const dbFolder = path.join("public", "data", cleanDept, cleanSection, cleanDb, ...relPath);
    fse.ensureDirSync(dbFolder);
    // create README+placeholder for file (only if filename is given)
    const placeholder = path.join(dbFolder, `.README_${fileObj.id}.md`);
    if (!fs.existsSync(placeholder)) {
      const fileTarget = path.posix.join("/", dbFolder.replace(/\\/g, "/"), path.basename(fileObj.url));
      fs.writeFileSync(placeholder, `Placeholder for ${fileObj.name}\n\nDrop the real file at: ${fileTarget}\n`, "utf8");
    }
  }
});

// write datasets.json
const outPath = path.join(process.cwd(), "src", "data", "datasets.json");
fse.ensureDirSync(path.dirname(outPath));
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");

console.log("Created src/data/datasets.json");
if (warnings.length) {
  console.log("\nWarnings:");
  warnings.forEach(w => console.log(" -", w));
} else {
  console.log("No warnings.");
}

console.log("\nPublic local folders created for any 'local' file entries (placeholders).");
