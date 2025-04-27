import { glob } from "glob";
import path from "path";
import { mkdir, copyFile, readdir, stat } from "fs/promises";

async function run() {
  const templates = glob.sync("./templates/*/assets");

  for (const templateAssetsPath of templates) {
    const slug = templateAssetsPath.split(path.sep)[1]; // templates/{slug}/assets
    const destinationFolder = path.resolve("public", "templates", slug as string, "assets");

    console.log(`📁 Copiando assets de "${slug}" a "${destinationFolder}"`);

    // Aseguramos que la carpeta destino exista
    await mkdir(destinationFolder, { recursive: true });

    // Leer archivos dentro de /assets
    const files = await readdir(templateAssetsPath);

    for (const file of files) {
      const sourceFile = path.join(templateAssetsPath, file);
      const destFile = path.join(destinationFolder, file);

      const fileStat = await stat(sourceFile);
      if (fileStat.isFile()) {
        await copyFile(sourceFile, destFile);
      }
    }
  }

  console.log("✅ Todos los assets copiados a /public/templates/");
}

run().catch((err) => {
  console.error("❌ Error copiando assets:", err);
  process.exit(1);
});
