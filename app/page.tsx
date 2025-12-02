import fs from "fs";
import path from "path";
import Link from "next/link";

export default function ProjectsHome() {
  const projectsDir = path.join(process.cwd(), "app", "projects");

  // Read folders inside /app/projects
  const entries = fs.readdirSync(projectsDir, { withFileTypes: true });

  // Filter only directories, ignore this page file itself
  const folders = entries
    .filter(
      dir =>
        dir.isDirectory() &&
        dir.name !== "api" && 
        dir.name !== "(components)" &&
        dir.name !== "(utils)"
    )
    .map(dir => dir.name);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1 style={{ marginBottom: "20px" }}>Mini Projects Directory</h1>
      <p style={{ marginBottom: "20px" }}>
        Select any project below to open it.
      </p>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {folders.map(folder => (
          <li
            key={folder}
            style={{
              marginBottom: "12px",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              transition: "0.2s",
            }}
          >
            <Link
              href={`/projects/${folder}`}
              style={{
                textDecoration: "none",
                fontSize: "18px",
                color: "#0070f3",
                fontWeight: "bold",
              }}
            >
              {folder}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
