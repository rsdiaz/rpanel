import { writeFile } from "fs/promises";
import * as path from "path";
import templates from "../templates";
import prettier from "prettier";

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
