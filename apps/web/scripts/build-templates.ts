import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import prettier from 'prettier'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Librerías que haremos import dinámico
let glob: typeof import('glob').glob
let compile: typeof import('json-schema-to-typescript').compile
let YAML: typeof import('yaml')

async function run() {
	// Importar dinámicamente glob, json-schema-to-typescript y yaml
	const globModule = await import('glob')
	glob = globModule.glob

	const yamlModule = await import('yaml')
	YAML = yamlModule.default ?? yamlModule

	const compileModule = await import('json-schema-to-typescript')
	compile = compileModule.compile

	console.log('🔎 Buscando templates...')

	const templatesRoot = path.resolve(__dirname, '../templates')
	const templatePaths = await glob('./*/index.ts', { cwd: templatesRoot })

	const items = templatePaths
		.map(filePath => path.dirname(filePath)) // 👈 corregido aquí
		.sort()

	console.log(`📦 Encontrados ${items.length} templates`)

	await Promise.all(
		items.map(async item => {
			try {
				const metaYamlPath = path.join(templatesRoot, item, 'meta.yaml')
				const metaYaml = await readFile(metaYamlPath, 'utf-8')
				const meta = YAML.parse(metaYaml)

				const types = await compile(meta.schema, 'Input', {
					additionalProperties: false,
					bannerComment: '',
				})

				const logo = await getLogo(path.join(templatesRoot, item, 'assets'))
				const screenshots = await getScreenshots(path.join(templatesRoot, item, 'assets'))

				const output = [
					`// Generated using "pnpm build-templates"`,
					``,
					`export const meta = ${JSON.stringify({ ...meta, logo, screenshots })}`,
					``,
					types,
				].join('\n')

				const formatted = await prettier.format(output, {
					parser: 'typescript',
				})

				await writeFile(path.join(templatesRoot, item, 'meta.ts'), formatted)

				console.log(`✅ Template generado: ${item}`)
			} catch (error) {
				console.error(`⚠️ Error generando template ${item}:`, error)
			}
		}),
	)

	await generateIndex(items, templatesRoot)
	await generateListJson(items, templatesRoot)
}

async function generateIndex(items: string[], templatesRoot: string) {
	console.log('🛠 Generando index.ts de templates...')

	const output: string[] = [`// Generated using "pnpm build-templates"`, ``]

	items.forEach(item => {
		output.push(`import { meta as meta_${snakeCase(item)} } from "./${item}/meta";`)
		output.push(`import { generate as generate_${snakeCase(item)} } from "./${item}";`)
	})

	output.push('', 'const templates = [')

	items.forEach(item => {
		output.push(`  { slug: "${item}", meta: meta_${snakeCase(item)}, generate: generate_${snakeCase(item)} },`)
	})

	output.push('];', '', 'export default templates;', '')

	const indexPath = path.join(templatesRoot, 'index.ts')
	const formatted = await prettier.format(output.join('\n'), {
		parser: 'typescript',
	})

	await writeFile(indexPath, formatted)

	console.log(`✅ Index generado en ${indexPath}`)
}

async function getLogo(dir: string) {
	const files = await glob(path.join(dir, 'logo.{png,svg}'))
	return files.length > 0 ? path.basename(files[0] as string) : null
}

async function getScreenshots(dir: string) {
	const files = await glob(path.join(dir, 'screenshot*.{png,jpg,gif}'))
	return files.map(file => path.basename(file))
}

function snakeCase(str: string) {
	return str.toLowerCase().replace(/([^a-z0-9]+)/g, '_')
}

async function generateListJson(items: string[], templatesRoot: string) {
	console.log('🛠 Generando list.json de templates...')

	const list = await Promise.all(
		items.map(async item => {
			const metaPath = path.join(templatesRoot, item, 'meta.ts')

			// ⚡ Import dinámico porque estamos en ESM
			const metaModule = await import(pathToFileURL(metaPath).href)
			const meta = metaModule.meta

			return {
				slug: item,
				logo: meta.logo,
				name: meta.name,
				description: meta.description,
				tags: meta.tags ?? [],
			}
		}),
	)

	const outputPath = path.join(templatesRoot, 'list.json')
	const formatted = await prettier.format(JSON.stringify(list), { parser: 'json' })

	await writeFile(outputPath, formatted)

	console.log(`✅ List generado en ${outputPath}`)
}

// Ejecutar
run().catch(error => {
	console.error('❌ Error al generar templates:', error)
	process.exit(1)
})
