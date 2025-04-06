import fs from "fs";
import path from "path";
import express, { Router } from "express";
import { parse } from "yaml";

const router: Router = express.Router();

const templatesDir = path.join(__dirname, "../../templates");

router.get("/", async (_req, res) => {
  const templates: any[] = [];

  const templateDirs = fs.readdirSync(templatesDir);
  for (const dir of templateDirs) {
    const metaPath = path.join(templatesDir, dir, "meta.yaml");
    if (fs.existsSync(metaPath)) {
      const raw = fs.readFileSync(metaPath, "utf-8");
      const meta = parse(raw);
      templates.push({ id: dir, ...meta });
    }
  }

  res.json(templates);
});

export default router;