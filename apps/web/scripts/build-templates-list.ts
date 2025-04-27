import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import templates from "../templates";
import prettier from "prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatesPath = path.resolve(__dirname, "../templates");

async function run() {
  const list = templates.map(({ slug, meta }) => ({
    slug,
    logo: meta.logo,
    name: meta.name,
    description: meta.description,
    tags: meta.tags ?? [],
  }));

  await writeFile(
    path.resolve(templatesPath, "list.json"),
    await prettier.format(JSON.stringify(list), { parser: "json" })
  );
}

run().catch(console.error);
