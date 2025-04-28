'use client'

import { useParams, useRouter } from 'next/navigation'
import { useProjectsStore } from '../../../../stores/serviceStore'
import { Button } from '@repo/ui/components/ui/button'
import { Editor } from '@monaco-editor/react'
import { CreateAppDialog } from '../../../components/add-app-dialog'
import Link from 'next/link'
import { Settings } from 'lucide-react'

export default function ServiceDetailPage() {
	const params = useParams()
	const router = useRouter()
	const { projects, setProjects } = useProjectsStore()
	const project = projects.find(e => e.name === params.project)
	const config = project?.config

	const services = config?.services
	const service = services?.find(service => service.data.serviceName === params.appName)

	console.log(project, 'stack')

	async function handleDeleteProject() {
		try {
			await fetch(`http://localhost:3004/projects/${project?.id}`, {
				method: 'DELETE',
			})

			const projects = await fetch('http://localhost:3004/projects')

			setProjects(await projects.json())

			router.push('/')
		} catch (err) {
			console.error('Error al eliminar proyecto:', err)
		}
	}

	return (
		<div className="flex flex-col gap-16">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">{project?.name}</h1>
				<div>
					<CreateAppDialog id={project?.id as string} />
					<Link href={`/projects/${project?.name}/settings`}>
						<Button className="text-lg font-bold bg-transparent px-2 py-2">
							<Settings strokeWidth={2} />
						</Button>
					</Link>
				</div>
			</div>

			<div className="bg-background dark:bg-sidebar-accent/50 rounded-[16px] p-[6px] flex flex-col css-0">
				<div className="flex flex-wrap justify-between items-center p-4">
					<p>Variables de entorno</p>
				</div>
				<div className="flex-1 p-4 bg-background-secondary rounded-[12px]">
					<div className="h-full">
						<div className="h-[200px]">
							<Editor
								defaultLanguage="txt"
								theme="vs-dark"
								options={{
									padding: { top: 10, bottom: 10 },

									fontSize: 14,
									minimap: { enabled: false },
								}}
							/>
						</div>
					</div>
					<div className="mt-4">
						<Button className="bg-green-700 hover:bg-green-700/80">Guardar</Button>
					</div>
				</div>
			</div>

			<div className="bg-background dark:bg-sidebar-accent/50 rounded-[16px] p-[6px] flex flex-col css-0">
				<div className="flex flex-wrap justify-between items-center p-4">
					<p>Esquema del proyecto</p>
				</div>

				<div className="flex-1 p-4 bg-background-secondary rounded-[12px]">
					<div className="h-full">
						<div className="h-[200px]">
							<Editor
								defaultLanguage="json"
								value={JSON.stringify(config, null, 2) ?? ''}
								theme="vs-dark"
								options={{
									padding: { top: 10, bottom: 10 },
									fontSize: 14,
									minimap: { enabled: false },
									readOnly: true,
								}}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-background dark:bg-sidebar-accent/50 rounded-[16px] p-[6px] flex flex-col css-0">
				<div className="flex flex-wrap justify-between items-center p-4">
					<p>Zona de peligro</p>
				</div>

				<div className="flex-1 p-4 bg-background-secondary rounded-[12px]">
					<Button variant={'destructive'} onClick={handleDeleteProject}>
						Eliminar proyecto
					</Button>
				</div>
			</div>
		</div>
	)
}
