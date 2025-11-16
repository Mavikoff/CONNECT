import type { IconType } from 'react-icons';
import { FiFileText, FiSearch, FiTag, FiBookmark, FiSettings } from 'react-icons/fi';

function cn(...classes: Array<string | false | null | undefined>) {
	return classes.filter(Boolean).join(' ');
}

export interface SidebarNavItem {
	id: string;
	label: string;
	icon: IconType;
}

export interface SidebarFileItem {
	id: string;
	name: string;
	updated?: string;
}

interface SidebarProps {
	navItems: SidebarNavItem[];
	activeNavId: string;
	onSelectNav: (id: string) => void;
	onLogoClick?: () => void;
	className?: string;
}

export const builtInNavItems: SidebarNavItem[] = [
	{ id: 'files', label: 'Файлы', icon: FiFileText },
	{ id: 'search', label: 'Поиск', icon: FiSearch },
	{ id: 'tags', label: 'Теги', icon: FiTag },
	{ id: 'favorites', label: 'Закладки', icon: FiBookmark },
	{ id: 'settings', label: 'Настройки', icon: FiSettings },
];

export function Sidebar({
	navItems,
	activeNavId,
	onSelectNav,
	onLogoClick,
	className,
}: SidebarProps) {
	return (
		<aside className={`flex w-64 flex-col border-r border-obsidian-border/60 bg-black/40 backdrop-blur-xl ${className ?? ''}`}>
			<div className="px-5 pb-4 pt-6">
				<button
					type="button"
					onClick={onLogoClick}
					className="text-xs uppercase tracking-[0.35em] text-obsidian-muted hover:text-gray-200 transition-colors"
					title="На стартовый экран"
				>
					CONNECT
				</button>
			</div>
			<nav className="space-y-1 px-3">
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive = item.id === activeNavId;
					return (
						<button
							key={item.id}
							type="button"
							onClick={() => onSelectNav(item.id)}
							className={cn(
								'group flex w-full items-center rounded-md px-3 py-2 text-left transition-colors',
								isActive
									? 'bg-obsidian-active/70 text-gray-100 shadow-soft'
									: 'text-obsidian-muted hover:bg-obsidian-active/40 hover:text-gray-50',
							)}
						>
							<Icon className="mr-3 text-base transition-transform group-hover:scale-105" />
							<span className={cn('text-sm font-medium', isActive && 'font-semibold text-gray-50')}>
								{item.label}
							</span>
						</button>
					);
				})}
			</nav>
			<div className="flex-1" />
		</aside>
	);
}

