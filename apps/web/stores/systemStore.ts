// stores/systemStore.ts
import { create } from 'zustand'
import { io, Socket } from 'socket.io-client'

type SystemData = {
	system: {
		cpu: {
			count: number
			model: string
			usagePercent: number
		}
		memory: {
			total: number
			free: number
			used: number
			usedPercent: number
		}
		disk: {
			total: number
			free: number
			used: number
			usedPercent: number
		}
		platform: string
		arch: string
		uptime: number
	}
	docker: {
		info: any
		containers: Array<{
			id: string
			names: string[]
			image: string
			state: string
			status: string
			labels: any
			ports: any[]
		}>
	}
}

type SocketStore = {
	socket: Socket | null
	data: SystemData | null
	connect: () => void
	disconnect: () => void
}

export const useSystemStore = create<SocketStore>((set, get) => ({
	socket: null,
	data: null,

	connect: () => {
		if (get().socket) return

		const socket = io('http://localhost:3004') // Cambia al host correcto si es necesario

		socket.on('connect', () => {
			console.log('Socket conectado:', socket.id)
		})

		socket.on('system-update', (data: SystemData) => {
			set({ data })
		})

		socket.on('disconnect', () => {
			console.log('Socket desconectado')
		})

		set({ socket })
	},

	disconnect: () => {
		const socket = get().socket
		if (socket) {
			socket.disconnect()
			set({ socket: null })
		}
	},
}))
