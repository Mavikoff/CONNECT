import { FiTrash2, FiPlus } from 'react-icons/fi';

interface FileListItem {
	id: string;
	name: string;
	updated?: string;
}

interface FileListProps {
	files: FileListItem[];
	onOpen: (id: string) => void;
	onDelete?: (id: string) => void;
	onRequestCreate?: () => void;
	title?: string;
	emptyHint?: string;
	showCreateButton?: boolean;
	showDelete?: boolean;
}

export function FileList({
	files,
	onOpen,
	onDelete,
	onRequestCreate,
	title = 'Файлы',
	emptyHint,
	showCreateButton = true,
	showDelete = true,
}: FileListProps) {
	return (
		<section className="flex h-full min-h-0 flex-1 flex-col px-4 pb-24 pt-16 md:px-10 md:pt-10">
			<header className="mb-3 flex items-center justify-between border-b border-obsidian-border/60 pb-2 md:mb-6 md:pb-4">
				<h1 className="text-xl font-semibold text-gray-100">{title}</h1>
				{showCreateButton && onRequestCreate ? (
					<button
						type="button"
						onClick={onRequestCreate}
						title="Создать заметку"
						className="flex h-9 items-center gap-2 rounded-md border border-obsidian-border/70 bg-black/50 px-3 text-sm text-gray-200 transition-colors hover:bg-obsidian-active/50"
					>
						<FiPlus className="text-lg" />
						<span className="hidden sm:inline">Новая</span>
					</button>
				) : <span />}
			</header>
			{files.length === 0 ? (
				<div className="rounded-md border border-obsidian-border/60 bg-black/30 px-4 py-6 text-center text-sm text-obsidian-muted">
					{emptyHint ?? 'Список пуст.'}
				</div>
			) : null}
			<ul className="mt-1 flex-1 overflow-auto divide-y divide-obsidian-border/40">
				{files.map((f) => (
					<li key={f.id}>
						<div className="group flex w-full items-center justify-between px-2 py-1.5 text-sm text-gray-200 transition-colors hover:bg-obsidian-active/30 sm:py-2">
							<button
								type="button"
								onClick={() => onOpen(f.id)}
								className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-1 text-left"
							>
								<span className="truncate">{f.name}</span>
								{f.updated ? (
									<span className="shrink-0 text-[11px] text-obsidian-muted">{f.updated}</span>
								) : null}
							</button>
							{showDelete && onDelete ? (
								<button
									type="button"
									aria-label="Удалить заметку"
									onClick={() => onDelete(f.id)}
									className="opacity-0 transition-opacity group-hover:opacity-100"
									title="Удалить"
								>
									<span className="flex h-7 w-7 items-center justify-center rounded-md border border-obsidian-border/60 bg-black/50 text-rose-300 shadow-soft hover:bg-rose-500/20 hover:text-rose-200 sm:h-8 sm:w-8">
										<FiTrash2 />
									</span>
								</button>
							) : null}
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}


