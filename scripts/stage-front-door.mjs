import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "restart-front-door");
const stage = path.join(root, "_restart");

await mkdir(stage, { recursive: true });
await copyFile(path.join(source, "index.html"), path.join(stage, "index.html"));
await copyFile(path.join(source, "front-door.css"), path.join(stage, "front-door.css"));
await copyFile(path.join(source, "front-door.js"), path.join(stage, "front-door.js"));
await mkdir(path.join(stage, "media"), { recursive: true });
await copyFile(path.join(source, "hii-hero-front-door-final-frame.png"), path.join(stage, "media", "hii-hero-front-door-final-frame.png"));

console.log("Staged the protected front door source. Media remains checksum-controlled in _restart/media.");
