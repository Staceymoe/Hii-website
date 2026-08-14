import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "restart-front-door");
const stage = path.join(root, "_restart");

await mkdir(stage, { recursive: true });
await copyFile(path.join(source, "index.html"), path.join(stage, "index.html"));
await copyFile(path.join(source, "front-door.css"), path.join(stage, "front-door.css"));
await copyFile(path.join(source, "front-door.js"), path.join(stage, "front-door.js"));

console.log("Staged the protected front door source. Media remains checksum-controlled in _restart/media.");
