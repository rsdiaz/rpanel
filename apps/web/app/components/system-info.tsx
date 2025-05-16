/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { useSystemStore } from '../../stores/systemStore'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/ui/card'
import { Box, Clock, Cpu, HardDrive, Info, Server } from 'lucide-react'
import { Badge } from '@repo/ui/components/ui/badge'
import templates from '../../templates/list.json'

export default function SystemInfo() {
	const [containers, setContainers] = useState<any[]>([])
	const [systemInfo, setSystemInfo] = useState<Record<any, any>>()
	// const [dockerInfo, setDockerInfo] = useState<any[]>([])

	const [loading, setLoading] = useState(true)

	const { connect, disconnect, data } = useSystemStore()

	const usagePercent = data?.system?.cpu?.usagePercent ?? 0
	const usageRam = data?.system?.memory?.usedPercent ?? 0
	const usageDisk = data?.system?.disk?.usedPercent ?? 0

	useEffect(() => {
		fetch('http://localhost:3004/system')
			.then(res => res.json())
			.then(json => {
				setContainers(json.docker.containers)
				setSystemInfo(json.system)
				setLoading(false)
			})

		connect()
		return () => {
			disconnect()
		}
	}, [connect, disconnect])

	const systemData = [
		{ name: 'CPU', value: usagePercent, icon: Cpu, color: 'bg-green-500' },
		{ name: 'Memoria', value: usageRam, icon: Cpu, color: 'bg-yellow-500' },
		{ name: 'Disco', value: usageDisk, icon: HardDrive, color: 'bg-green-500' },
	]

	if (loading) return <p className="p-4">Cargando datos del sistema...</p>

	// Función para determinar el color basado en el valor
	const getColorClass = (value: number) => {
		if (value < 50) return 'bg-green-500'
		if (value < 80) return 'bg-yellow-500'
		return 'bg-red-500'
	}

	console.log(containers)

	const dockerInfo = {
		version: '24.0.6',
		status: 'Activo',
		containers: {
			running: 5,
			stopped: 3,
			total: 8,
		},
		images: 12,
		resources: {
			cpu: '2.5%',
			memory: '1.2 GB',
		},
		system: {
			os: 'Linux',
			arch: 'x86_64',
			kernelVersion: '5.15.0-91-generic',
		},
		apiVersion: '1.43',
		buildTime: '2023-09-26T11:43:31Z',
		experimental: false,
	}

	return (
		<>
			<h1 className="text-2xl font-bold">Panel</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
				{/* System monitor  */}
				<Card className="w-full bg-background border-0 shadow-none">
					<CardHeader>
						<CardTitle className="text-xl">System Monitor</CardTitle>
						<CardDescription>Check the system performance and usage</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{systemData.map(item => (
							<div key={item.name} className="space-y-1.5">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<item.icon className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm font-medium">{item.name}</span>
									</div>
									<span className="text-sm font-medium">{item.value}%</span>
								</div>
								<div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
									<div
										className={`h-full rounded-full ${getColorClass(item.value)} transition-all`}
										style={{ width: `${item.value}%` }}
									/>
								</div>
								<div className="flex justify-between text-xs text-muted-foreground">
									<span>0%</span>
									<span>50%</span>
									<span>100%</span>
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				{/*  Docker information  */}
				<Card className="w-full bg-background border-0 shadow-none">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div className="flex flex-col gap-2">
								<CardTitle className="text-xl">Docker Status</CardTitle>
							</div>
							<Badge
								variant={dockerInfo?.status === 'Activo' ? 'default' : 'destructive'}
								className={dockerInfo?.status === 'Activo' ? 'bg-green-500' : ''}
							>
								{dockerInfo.status}
							</Badge>
						</div>
						<CardDescription>Check the docker status and information</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Versión y API */}
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Info className="h-4 w-4" />
									<span>Versión</span>
									<p className="font-medium text-white">{dockerInfo.version}</p>
								</div>
							</div>
							<div className="space-y-1">
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Server className="h-4 w-4" />
									<span>API</span>
									<p className="font-medium text-white">{dockerInfo.apiVersion}</p>
								</div>
							</div>
						</div>

						<hr></hr>

						{/* Contenedores e imágenes */}
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Box className="h-4 w-4" />
									<span>Contenedores</span>
									<span className="font-medium text-white">{containers.length}</span>
								</div>
								<div className="flex flex-col">
									{/* 									<div className="flex gap-4 text-sm">
										<span className="text-green-500">{dockerInfo.containers.running} Activos</span>
										<span className="text-gray-500">{dockerInfo.containers.stopped} Detenidos</span>
									</div> */}
								</div>
							</div>
							<div className="space-y-1">
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<HardDrive className="h-4 w-4" />
									<span>Imágenes</span>
									<p className="font-medium text-white">{dockerInfo.images}</p>
								</div>
							</div>
						</div>

						<hr></hr>

						{/* Sistema */}
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Info className="h-4 w-4" />
									<span>OS</span>
									<p className="font-medium text-white">{dockerInfo.system.os}</p>
								</div>
							</div>
							<div className="space-y-1">
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Info className="h-4 w-4" />
									<span>Arq</span>
									<p className="font-medium text-white">{dockerInfo.system.arch}</p>
								</div>
							</div>
						</div>
						<hr></hr>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Info className="h-4 w-4" />
									<span>Kernel</span>
								</div>
							</div>
							<p className="text-sm text-white">{dockerInfo.system.kernelVersion}</p>
						</div>
					</CardContent>
				</Card>

				{/* Last templates  */}
				<Card className="w-full bg-background border-0 shadow-none">
					<CardHeader>
						<CardTitle className="text-xl">Últimos templates</CardTitle>
						<CardDescription>Consulta los últimos templates añadidos</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{templates.slice(0, 4).map(template => (
							<div key={template.slug} className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<img
										src={`/templates/${template.name}/assets/${template.logo}`}
										alt={template.name}
										width="40"
										height="40"
										className="rounded"
									/>
									<span className="text-sm font-medium">{template.name}</span>
								</div>
								<Badge variant={'secondary'}>Abrir</Badge>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Actions  */}
				<Card className="w-full bg-background border-0 shadow-none">
					<CardHeader>
						<CardTitle className="text-xl">Acciones</CardTitle>
						<CardDescription>Estado actual de los recursos del sistema</CardDescription>
					</CardHeader>
					<CardContent>
						<div>
							<div className="divide-y">
								<div className="p-3 hover:bg-muted/50">
									<div className="flex items-start gap-2">
										<div className={`p-1 rounded-full`}>
											<Info className={`h-4 w-4`} />
										</div>
										<div className="flex-1 space-y-1">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<Badge>info</Badge>
													<span className="text-sm font-medium">DEPLOY</span>
												</div>
												<div className="flex items-center text-xs text-muted-foreground">
													<Clock className="h-3 w-3 mr-1" />
												</div>
											</div>
											<p className="text-sm"></p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	)
}
