import { useEffect, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

export interface SearchResultItem {
	id: string;
	name: string;
	snippet?: string;
}

interface SearchOverlayProps {
	open: boolean;
	query: string;
	results: SearchResultItem[];
	onQueryChange: (q: string) => void;
	onClose: () => void;
	onOpen: (id: string) => void;
}

export function SearchOverlay({ open, query, results, onQueryChange, onClose, onOpen }: SearchOverlayProps) {
	const inputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (open) {
			setTimeout(() => inputRef.current?.focus(), 0);
		}
	}, [open]);

	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') onClose();
		}
		if (open) {
			window.addEventListener('keydown', onKey);
			return () => window.removeEventListener('keydown', onKey);
		}
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50">
			<div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
			<div className="relative z-10 mx-auto mt-24 w-[92%] max-w-2xl">
				<div className="flex items-center gap-3 rounded-xl border border-obsidian-border/70 bg-[#0b0f18]/90 px-4 py-3 shadow-soft">
					<FiSearch className="text-lg text-gray-300" />
					<input
						ref={inputRef}
						value={query}
						onChange={(e) => onQueryChange(e.target.value)}
						placeholder="Поиск заметок..."
						className="h-9 w-full bg-transparent text-sm text-gray-100 placeholder:text-obsidian-muted outline-none"
					/>
					<button
						type="button"
						onClick={onClose}
						className="rounded-md border border-obsidian-border/60 bg-black/40 p-2 text-gray-400 hover:text-gray-200"
						aria-label="Закрыть"
					>
						<FiX />
					</button>
				</div>
				<div className="mt-3 max-h-[50vh] overflow-auto rounded-xl border border-obsidian-border/60 bg-black/40 p-2">
					{results.length === 0 ? (
						<p className="px-3 py-4 text-sm text-obsidian-muted">Ничего не найдено</p>
					) : (
						<ul className="divide-y divide-obsidian-border/50">
							{results.map((r) => (
								<li key={r.id}>
									<button
										type="button"
										onClick={() => onOpen(r.id)}
										className="flex w-full items-start justify-between gap-3 px-3 py-3 text-left hover:bg-obsidian-active/30"
									>
										<div className="min-w-0">
											<p className="truncate text-sm text-gray-100">{r.name}</p>
											{r.snippet ? (
												<p className="mt-1 line-clamp-2 text-xs text-obsidian-muted">{r.snippet}</p>
											) : null}
										</div>
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}


