import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Detect build folder (Vite: dist, CRA: build)
const staticDir = fs.existsSync(path.join(__dirname, "dist"))
  ? "dist"
  : "build";
const root = path.join(__dirname, staticDir);

app.use(express.static(root, { maxAge: "1d", index: false }));

// SPA fallback
app.get("*", (_req, res) => {
  res.sendFile(path.join(root, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}, serving ${staticDir}`);
});
