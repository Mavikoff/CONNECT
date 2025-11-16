import { useEffect, useRef, useState } from 'react';
import { FiTag, FiX } from 'react-icons/fi';

interface TagsModalProps {
	open: boolean;
	initialTags: string[];
	onCancel: () => void;
	onSave: (tags: string[]) => void;
}

export function TagsModal({ open, initialTags, onCancel, onSave }: TagsModalProps) {
	const [value, setValue] = useState(initialTags.join(', '));
	const inputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (open) {
			setValue(initialTags.join(', '));
			setTimeout(() => inputRef.current?.focus(), 0);
		}
	}, [open, initialTags]);

	if (!open) return null;

	function handleSubmit(e?: React.FormEvent) {
		if (e) e.preventDefault();
		const list = value
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);
		onSave(list);
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
			<div className="relative z-10 w-[92%] max-w-md rounded-xl border border-obsidian-border/70 bg-[#0b0f18] p-5 text-gray-100 shadow-soft">
				<header className="mb-4 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="flex h-9 w-9 items-center justify-center rounded-md border border-obsidian-border/70 bg-black/40 text-xl text-gray-300">
							<FiTag />
						</span>
						<h2 className="text-lg font-semibold">Теги заметки</h2>
					</div>
					<button
						type="button"
						aria-label="Закрыть"
						onClick={onCancel}
						className="rounded-md border border-obsidian-border/60 bg-black/40 p-2 text-gray-400 transition-colors hover:text-gray-200"
					>
						<FiX />
					</button>
				</header>
				<form onSubmit={handleSubmit}>
					<label className="block text-sm text-obsidian-muted">Список тегов (через запятую)</label>
					<input
						ref={inputRef}
						value={value}
						onChange={(e) => setValue(e.target.value)}
						placeholder="напр.: проект, идеи, задачи"
						className="mt-2 w-full rounded-md border border-obsidian-border/70 bg-black/40 px-3 py-2 font-mono text-sm text-gray-100 outline-none placeholder:text-obsidian-muted"
					/>
					<div className="mt-5 flex justify-end gap-2">
						<button
							type="button"
							onClick={onCancel}
							className="rounded-md border border-obsidian-border/60 bg-transparent px-4 py-2 text-sm text-obsidian-muted hover:bg-obsidian-active/30 hover:text-gray-100"
						>
							Отмена
						</button>
						<button
							type="submit"
							className="rounded-md border border-obsidian-border/70 bg-obsidian-active/50 px-4 py-2 text-sm font-semibold text-gray-100 hover:bg-obsidian-active/70"
						>
							Сохранить
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}


