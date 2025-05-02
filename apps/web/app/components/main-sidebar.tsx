import { Home, Settings, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../../../../packages/ui/src/lib/utils'

export default function MainSidebar() {
	const path = usePathname()

	return (
		<div className="flex flex-row whitespace-nowrap overflow-clip ease-in-out transition-[width] duration-500 will-change-[width] transform-gpu w-[300px]">
			<div className="flex flex-col w-full h-full p-4 overflow-y-auto no-scrollbar">
				<div className="flex items-center gap-4 -m-1 p-1 overflow-clip ">
					<Link
						className="size-12 box-border border border-sidebar-border shadow-sm rounded-lg p-1 shrink-0 active"
						href="/"
						data-status="active"
					>
						<Image alt="Home" src="/logo.png" width={100} height={100} />
					</Link>
					<div className="">RPanel - v0.0.1</div>
				</div>

				<div className="mt-12 flex flex-col gap-2">
					<Link
						href="/"
						className={cn(
							'group flex items-center gap-4 rounded-lg py-[10px] px-[15px] overflow-clip transition-all',
							path === '/' ? 'bg-background-secondary' : 'bg-transparent hover:hover:bg-gray-500/20',
						)}
					>
						<Home width={24} height={24} className="lucide lucide-house size-[18px] shrink-0" />
						<span className="font-medium transition-opacity duration-150 group-data-[state=collapsed]/sidebar:opacity-0 flex-1 text-left">
							Panel
						</span>
					</Link>

					<Link
						href="/templates"
						className={cn(
							'group flex items-center gap-4 rounded-lg py-[10px] px-[15px] overflow-clip transition-all',
							path === '/templates' ? 'bg-background-secondary' : 'bg-transparent hover:hover:bg-gray-500/20',
						)}
					>
						<ShoppingBag width={24} height={24} className="lucide lucide-house size-[18px] shrink-0" />
						<span className="font-medium transition-opacity duration-150 group-data-[state=collapsed]/sidebar:opacity-0 flex-1 text-left">
							Templates
						</span>
					</Link>

					<Link
						href="/settings"
						className={cn(
							'group flex items-center gap-4 rounded-lg py-[10px] px-[15px] overflow-clip transition-all',
							path === '/settings' ? 'bg-background-secondary' : 'bg-transparent hover:bg-gray-500/20',
						)}
					>
						<Settings width={24} height={24} className="lucide lucide-house size-[18px] shrink-0" />
						<span className="font-medium transition-opacity duration-150 group-data-[state=collapsed]/sidebar:opacity-0 flex-1 text-left">
							Settings
						</span>
					</Link>
				</div>
			</div>
		</div>
	)
}
