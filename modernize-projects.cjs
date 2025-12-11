// modernize-projects.cjs
// Run with: node modernize-projects.cjs

const fs = require("fs");
const path = require("path");

let fetchFn = global.fetch;
if (!fetchFn) {
  fetchFn = require("node-fetch");
}

// ---------------- CONFIG ----------------

// Put your Claude (Anthropic) API key here
// Get it from: https://console.anthropic.com
const CLAUDE_API_KEY = ""; // <<< REPLACE THIS

// Claude messages endpoint + model
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const CLAUDE_MODEL = "claude-sonnet-4-5-20250929"; // or another Claude model

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
 * SELECTED_PROJECTS behavior:
 * - If this array is EMPTY: run ALL projects found under app/legacy
 * - If this array has names: ONLY run those projects
 */
const SELECTED_PROJECTS = [
  // "typing-game",
  // add more if you want:
  // "movie-seat-booking",
  // "expense-tracker",
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

  if (files.readme) {
    prompt += "README:\n```markdown\n" + files.readme + "\n```\n\n";
  }

  if (files.html) {
    prompt += "HTML:\n```html\n" + files.html + "\n```\n\n";
  }

  if (files.js) {
    prompt += "JavaScript:\n```javascript\n" + files.js + "\n```\n\n";
  }

  if (files.css) {
    prompt += "CSS:\n```css\n" + files.css + "\n```\n\n";
  }

  prompt +=
    "Please output ONLY the complete Next.js .tsx page component, including all imports, in a single TypeScript React code block.\n";

  return prompt;
}

// Call Claude Messages API
async function callClaude(prompt) {
  if (!CLAUDE_API_KEY) {
    throw new Error(
      "No Claude API key provided. Put your key into CLAUDE_API_KEY at the top of the file."
    );
  }

  const body = {
    model: CLAUDE_MODEL,
    max_tokens: 4000, // adjust if needed
    system:
      "You are an expert at modernizing vanilla JS webapps into idiomatic Next.js 15+ TypeScript (.tsx) pages. Preserve all functionality.",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  const res = await fetchFn(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Claude API error: ${res.status} ${res.statusText} - ${text}`
    );
  }

  const data = await res.json();

  // Claude returns: { content: [ { type: "text", text: "..." }, ... ] }
  const textPart = data.content?.find((p) => p.type === "text");
  const text = textPart?.text || "";

  return stripCodeFences(text);
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
  console.log("Calling Claude...");

  try {
    const prompt = buildPromptForProject(projectName, files);
    const tsx = await callClaude(prompt);

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
