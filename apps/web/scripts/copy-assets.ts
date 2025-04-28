import { glob } from 'glob'
import path from 'path'
import { mkdir, copyFile, readdir, stat } from 'fs/promises'

async function copyRecursive(sourceDir: string, destinationDir: string) {
	// Asegurar que el destino existe
	await mkdir(destinationDir, { recursive: true })

	const entries = await readdir(sourceDir, { withFileTypes: true })

	for (const entry of entries) {
		const sourcePath = path.join(sourceDir, entry.name)
		const destPath = path.join(destinationDir, entry.name)

		if (entry.isDirectory()) {
			// Si es carpeta, copiar recursivamente
			await copyRecursive(sourcePath, destPath)
		} else if (entry.isFile()) {
			// Si es archivo, copiar
			await copyFile(sourcePath, destPath)
		}
	}
}

async function run() {
	// Buscar todas las carpetas ./templates/<nombre>/assets
	const templates = glob.sync('./templates/*/assets')

	for (const templateAssetsPath of templates) {
		// Extraer el "nombre" del template
		const slug = templateAssetsPath.split(path.sep)[1] // templates/{slug}/assets

		const destinationFolder = path.resolve('public', 'templates', slug as string, 'assets')

		console.log(`📁 Copiando assets de "${slug}" a "${destinationFolder}"`)

		await copyRecursive(templateAssetsPath, destinationFolder)
	}

	console.log('✅ Todos los assets copiados a /public/templates/')
}

run().catch(err => {
	console.error('❌ Error copiando assets:', err)
	process.exit(1)
})
