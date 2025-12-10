// modernize-projects.cjs
// Run with: node modernize-projects.cjs

const fs = require("fs");
const path = require("path");

let fetchFn = global.fetch;
if (!fetchFn) {
  fetchFn = require("node-fetch");
}

// ---------------- CONFIG ----------------

// Hardcode your API key directly here (new key, not the old leaked one)
const DEEPSEEK_API_KEY = "sk-8c1492e882ed404298d9b4672516ac46"; // <<< PUT YOUR KEY HERE

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_MODEL = "deepseek-chat";

// Folder paths
const LEGACY_ROOT = path.resolve("app/legacy");
const MODERN_ROOT = path.resolve("app/projects");

// Typical file names
const FILE_NAMES = {
  html: "index.html",
  js: "script.js",
  css: "style.css",
  readme: "README.md",
};

// Main modernization prompt
const BASE_PROMPT =
  "Modernize the provided webapp code while preserving full functionality and required dependencies. Produce the entire solution as a single NextJS .tsx file.";

/**
 * List ONLY the projects you want to run here.
 * Names must match the folder names under app/legacy and app/projects.
 *
 * Examples (uncomment the ones you want):
 *
 * const SELECTED_PROJECTS = [
 *   "movie-seat-booking",
 *   "expense-tracker",
 *   "form-validator",
 * ];
 */
const SELECTED_PROJECTS = [
  "typing-game",
];

// ---------------- HELPERS ----------------

function readFileIfExists(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf8");
    }
    return null;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return null;
  }
}

function getProjectFolders(root) {
  if (!fs.existsSync(root)) {
    console.error(`Folder does not exist: ${root}`);
    return [];
  }

  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function buildPromptForProject(projectName, files) {
  let prompt = BASE_PROMPT + "\n\n";
  prompt += `Project name: ${projectName}\n\n`;
  prompt += "Here are the source files:\n\n";

  if (files.readme)
    prompt += "README:\n```markdown\n" + files.readme + "\n```\n\n";

  if (files.html)
    prompt += "HTML:\n```html\n" + files.html + "\n```\n\n";

  if (files.js)
    prompt += "JavaScript:\n```javascript\n" + files.js + "\n```\n\n";

  if (files.css)
    prompt += "CSS:\n```css\n" + files.css + "\n```\n\n";

  prompt +=
    "Please output ONLY the complete Next.js .tsx page component, including all imports, in a single code block.\n";

  return prompt;
}

async function callDeepSeek(prompt) {
  if (!DEEPSEEK_API_KEY) {
    throw new Error("No API key provided. Add your key to the script.");
  }

  const body = {
    model: DEEPSEEK_MODEL,
    messages: [
      { role: "system", content: "You modernize webapps into Next.js + TypeScript." },
      { role: "user", content: prompt },
    ],
    temperature: 0,
  };

  const res = await fetchFn(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `DeepSeek API error: ${res.status} ${res.statusText} - ${text}`
    );
  }

  const data = await res.json();
  const content =
    data.choices?.[0]?.message?.content ||
    data.choices?.[0]?.delta?.content ||
    "";

  return stripCodeFences(content);
}

function stripCodeFences(text) {
  const match = text.match(/```[a-zA-Z]*\s*([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

// ---------------- MAIN PIPELINE ----------------

async function processProject(projectName) {
  const legacyDir = path.join(LEGACY_ROOT, projectName);
  const modernDir = path.join(MODERN_ROOT, projectName);
  const targetTsxPath = path.join(modernDir, "page.tsx");

  if (!fs.existsSync(legacyDir)) {
    console.warn(
      `Skipping "${projectName}" because legacy folder does not exist: ${legacyDir}`
    );
    return;
  }

  if (!fs.existsSync(modernDir)) {
    console.warn(
      `Skipping "${projectName}" because modern folder does not exist: ${modernDir}`
    );
    return;
  }

  const files = {
    html: readFileIfExists(path.join(legacyDir, FILE_NAMES.html)),
    js: readFileIfExists(path.join(legacyDir, FILE_NAMES.js)),
    css: readFileIfExists(path.join(legacyDir, FILE_NAMES.css)),
    readme: readFileIfExists(path.join(legacyDir, FILE_NAMES.readme)),
  };

  if (!files.html && !files.js && !files.css) {
    console.warn(`Skipping "${projectName}" — no source files found.`);
    return;
  }

  console.log(`\n=== Processing: ${projectName} ===`);
  console.log("Calling DeepSeek...");

  try {
    const prompt = buildPromptForProject(projectName, files);
    const tsx = await callDeepSeek(prompt);

    fs.writeFileSync(targetTsxPath, tsx, "utf8");
    console.log(`✔️ Wrote Next.js file to ${targetTsxPath}`);
  } catch (err) {
    console.error(`❌ Error in ${projectName}:`, err);
  }
}

async function main() {
  console.log("Scanning:", LEGACY_ROOT);

  let projects;
  if (SELECTED_PROJECTS.length > 0) {
    projects = SELECTED_PROJECTS;
    console.log("Using selected projects:", projects.join(", "));
  } else {
    projects = getProjectFolders(LEGACY_ROOT);
    console.log("No selected projects set, using all:", projects.join(", "));
  }

  for (const p of projects) {
    await processProject(p);
  }

  console.log("\n🏁 All done.");
}

main();
