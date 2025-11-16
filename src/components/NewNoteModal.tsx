import { useEffect, useRef, useState } from 'react';
import { FiFileText, FiX } from 'react-icons/fi';

interface NewNoteModalProps {
	open: boolean;
	defaultName?: string;
	onCancel: () => void;
	onCreate: (name: string) => void;
}

export function NewNoteModal({ open, defaultName = 'Новая заметка.md', onCancel, onCreate }: NewNoteModalProps) {
	const [name, setName] = useState(defaultName);
	const inputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (open) {
			setName(defaultName);
			setTimeout(() => inputRef.current?.focus(), 0);
		}
	}, [open, defaultName]);

	if (!open) return null;

	function handleSubmit(e?: React.FormEvent) {
		if (e) e.preventDefault();
		const trimmed = name.trim();
		if (!trimmed) return;
		const finalName = trimmed.endsWith('.md') ? trimmed : `${trimmed}.md`;
		onCreate(finalName);
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
			<div className="relative z-10 w-[92%] max-w-md rounded-xl border border-obsidian-border/70 bg-[#0b0f18] p-5 text-gray-100 shadow-soft">
				<header className="mb-4 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="flex h-9 w-9 items-center justify-center rounded-md border border-obsidian-border/70 bg-black/40 text-xl text-gray-300">
							<FiFileText />
						</span>
						<h2 className="text-lg font-semibold">Новая заметка</h2>
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
					<label className="block text-sm text-obsidian-muted">Название файла</label>
					<input
						ref={inputRef}
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Например: Идеи.md"
						className="mt-2 w-full rounded-md border border-obsidian-border/70 bg-black/40 px-3 py-2 font-mono text-sm text-gray-100 outline-none ring-0 placeholder:text-obsidian-muted focus:border-obsidian-border"
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
							Создать
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}


