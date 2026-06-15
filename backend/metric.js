const fs = require("fs");
const path = require("path");

const CONTROLLER_DIR = "./controllers";

function countFunctions(content) {
  const patterns = [
    /exports\.\w+\s*=/g,
    /module\.exports\.\w+\s*=/g,
    /async\s*\([^)]*\)\s*=>/g,
  ];

  let count = 0;

  patterns.forEach((p) => {
    const matches = content.match(p);
    if (matches) count += matches.length;
  });

  return count;
}

function countImports(content) {
  const requireMatches = content.match(/require\s*\(/g) || [];
  const importMatches = content.match(/import\s+/g) || [];

  return requireMatches.length + importMatches.length;
}

function countMethodCalls(content) {
  const calls = content.match(/\.\w+\s*\(/g) || [];
  return calls.length;
}

function estimateLCOM(content) {
  const prismaCalls = (content.match(/prisma\./g) || []).length;
  const reqUsage = (content.match(/req\./g) || []).length;

  if (prismaCalls > 0 && reqUsage > 0) return 0;
  if (prismaCalls > 0 || reqUsage > 0) return 1;

  return 2;
}

console.log(
  "FILE".padEnd(20) +
    "WMC".padStart(8) +
    "RFC".padStart(8) +
    "CBO".padStart(8) +
    "LCOM".padStart(8)
);

console.log("-".repeat(52));

const files = fs
  .readdirSync(CONTROLLER_DIR)
  .filter((f) => f.endsWith(".js"));

files.forEach((file) => {
  const fullPath = path.join(CONTROLLER_DIR, file);
  const content = fs.readFileSync(fullPath, "utf8");

  const wmc = countFunctions(content);

  const externalCalls = countMethodCalls(content);

  const rfc = wmc + externalCalls;

  const cbo = countImports(content);

  const lcom = estimateLCOM(content);

  console.log(
    file.padEnd(20) +
      String(wmc).padStart(8) +
      String(rfc).padStart(8) +
      String(cbo).padStart(8) +
      String(lcom).padStart(8)
  );
});
