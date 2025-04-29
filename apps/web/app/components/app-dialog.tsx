/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@repo/ui/components/ui/dialog'
import { Label } from '@repo/ui/components/ui/label'
import AppTemplates from '../../templates/index'
import { Input } from '@repo/ui/components/ui/input'
import { Badge } from '@repo/ui/components/ui/badge'
import { Button } from '@repo/ui/components/ui/button'
import Link from 'next/link'

function DynamicForm({ schema }: { schema: any }) {
	const [formData, setFormData] = useState(() => {
		const defaults: Record<string, any> = {}

		Object.keys(schema.properties).forEach(key => {
			defaults[key] = schema.properties[key].default || ''
		})
		return defaults
	})

	const handleChange = (e: any) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSubmit = (e: any) => {
		e.preventDefault()
		console.log('Resultado:', formData)
		alert(JSON.stringify(formData, null, 2))
	}

	return (
		<div className="">
			<form onSubmit={handleSubmit} className="h-full flex flex-col">
				<div>
					{Object.keys(schema.properties).map(key => {
						const property = schema.properties[key]
						return (
							<div key={key} className="flex flex-col gap-2 mb-4">
								<Label htmlFor={key}>
									{property.title || key} {schema.required.includes(key) ? <span className="text-red-400">*</span> : ''}
								</Label>
								<Input
									type="text"
									id={key}
									name={key}
									defaultValue={formData[key]}
									required={schema.required.includes(key)}
									onChange={handleChange}
								/>
							</div>
						)
					})}
					<Button
						variant={'secondary'}
						className="bg-background-secondary hover:bg-background-secondary/80 transition-colors duration-300"
						type="submit"
					>
						Create
					</Button>
				</div>
			</form>
		</div>
	)
}

export function AppDialog({ children, template }: { children: React.ReactNode; template: any }) {
	const appTemplate = AppTemplates.find(t => t.slug === template.slug)

	console.log('appTemplate', appTemplate)

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent
				className="sm:max-w-[825px]"
				onOpenAutoFocus={event => {
					event.preventDefault()
				}}
			>
				<DialogHeader className="pb-6">
					<DialogTitle>Create {template.name}</DialogTitle>
				</DialogHeader>
				<div className="grid grid-cols-2 gap-12">
					<DynamicForm schema={appTemplate?.meta.schema} />
					<div>
						<p className="pb-4">Description</p>
						<div className="text-sm text-muted-foreground">{template.description}</div>
						<div>
							<p className="pt-8 pb-4">Links</p>
							<div className="flex gap-4">
								{appTemplate?.meta.links.map(info => (
									<Link key={info.label} href={info.url} target="_blank">
										<Badge className="bg-gray-500/20 text-muted-foreground hover:bg-gray-500/20 hover:text-foreground transition-colors duration-300">
											{info.label}
										</Badge>
									</Link>
								))}
							</div>
						</div>
					</div>
				</div>
				<DialogFooter></DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
