import { useMemo, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

interface TagBrowserNote {
	id: string;
	name: string;
}

interface TagBrowserProps {
	notes: Record<string, { id: string; name: string; tags?: string[] }>;
	onOpen: (id: string) => void;
}

export function TagBrowser({ notes, onOpen }: TagBrowserProps) {
	const groups = useMemo(() => {
		const map = new Map<string, TagBrowserNote[]>();
		const entries = Object.values(notes);
		for (const n of entries) {
			const tagList = (n.tags ?? []).length ? n.tags! : ['Без тега'];
			for (const t of tagList) {
				const key = t.trim() || 'Без тега';
				if (!map.has(key)) map.set(key, []);
				map.get(key)!.push({ id: n.id, name: n.name });
			}
		}
		// сортируем по алфавиту
		return Array.from(map.entries())
			.sort((a, b) => a[0].localeCompare(b[0]))
			.map(([tag, list]) => ({ tag, list: list.sort((a, b) => a.name.localeCompare(b.name)) }));
	}, [notes]);

	const [openSet, setOpenSet] = useState<Record<string, boolean>>({});
	const toggle = (tag: string) => setOpenSet((s) => ({ ...s, [tag]: !s[tag] }));
	const isOpen = (tag: string) => openSet[tag] ?? true;

	return (
		<section className="flex h-full flex-1 flex-col px-10 pb-24 pt-10">
			<header className="mb-6 border-b border-obsidian-border/60 pb-4">
				<h1 className="text-xl font-semibold text-gray-100">Теги</h1>
			</header>
			<div className="space-y-2">
				{groups.map(({ tag, list }) => (
					<div key={tag} className="rounded-md border border-obsidian-border/50 bg-black/30">
						<button
							type="button"
							onClick={() => toggle(tag)}
							className="flex w-full items-center justify-between px-4 py-2 text-left hover:bg-obsidian-active/30"
						>
							<span className="flex items-center gap-2 text-sm text-gray-100">
								<FiChevronDown
									className={`transition-transform ${isOpen(tag) ? 'rotate-0' : '-rotate-90'}`}
								/>
								{tag}
							</span>
							<span className="text-xs text-obsidian-muted">{list.length}</span>
						</button>
						{isOpen(tag) ? (
							<ul className="divide-y divide-obsidian-border/40">
								{list.map((n) => (
									<li key={n.id}>
										<button
											type="button"
											onClick={() => onOpen(n.id)}
											className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-gray-200 hover:bg-obsidian-active/40"
										>
											<span className="truncate">{n.name}</span>
										</button>
									</li>
								))}
							</ul>
						) : null}
					</div>
				))}
			</div>
		</section>
	);
}


