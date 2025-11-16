import { FiFileText, FiStar, FiTag } from 'react-icons/fi';

interface EditorProps {
	title: string;
	subtitle?: string;
	content: string;
	onChange: (next: string) => void;
	onSave: () => void;
	onClose: () => void;
	onCursorChange: (line: number, column: number) => void;
	onToggleFavorite?: () => void;
	isFavorite?: boolean;
	onOpenTags?: () => void;
	tagsCount?: number;
}

function getCursorPosition(value: string, selectionStart: number) {
	if (value.length === 0) {
		return { line: 0, column: 0 };
	}

	const textBeforeCursor = value.slice(0, selectionStart);
	const lines = textBeforeCursor.split('\n');
	const lineNumber = selectionStart === 0 ? 1 : lines.length;
	const columnNumber = lines[lines.length - 1]?.length ?? 0;

	return {
		line: lineNumber,
		column: columnNumber + 1,
	};
}

export function Editor({ title, subtitle, content, onChange, onSave, onClose, onCursorChange, onToggleFavorite, isFavorite = false, onOpenTags, tagsCount = 0 }: EditorProps) {
	const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { value, selectionStart } = event.target;
		onChange(value);
		const { line, column } = getCursorPosition(value, selectionStart);
		onCursorChange(line, column);
	};

	const handleSelection = (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
		const { value, selectionStart } = event.currentTarget;
		const { line, column } = getCursorPosition(value, selectionStart);
		onCursorChange(line, column);
	};

	return (
		<section className="flex h-full min-h-0 flex-1 flex-col px-4 pb-24 pt-16 md:px-10 md:pt-10">
			<header className="mb-4 flex items-center justify-between border-b border-obsidian-border/60 pb-3 md:mb-8 md:pb-4">
				<div className="flex items-center gap-3">
					<span className="flex h-10 w-10 items-center justify-center rounded-lg border border-obsidian-border/80 bg-black/40 text-2xl text-gray-300">
						<FiFileText />
					</span>
					<div className="flex items-center gap-2 md:gap-3">
						{onOpenTags ? (
							<button
								type="button"
								onClick={onOpenTags}
								className="flex items-center gap-2 rounded-md border border-obsidian-border/60 bg-transparent px-3 py-2 text-sm text-obsidian-muted transition-colors hover:border-obsidian-border/80 hover:bg-obsidian-active/30 hover:text-gray-100"
								title="Добавить теги"
							>
								<FiTag />
								<span>Теги</span>
								{tagsCount > 0 ? (
									<span className="rounded bg-obsidian-active/60 px-2 py-0.5 text-xs text-gray-200">{tagsCount}</span>
								) : null}
							</button>
						) : (
							<h1 className="text-2xl font-semibold text-gray-100">{title}</h1>
						)}
						{subtitle ? <p className="hidden text-sm text-obsidian-muted sm:block">{subtitle}</p> : null}
					</div>
				</div>
				<div className="flex items-center gap-2 md:gap-3">
					{onToggleFavorite ? (
						<button
							type="button"
							onClick={onToggleFavorite}
							title={isFavorite ? 'Убрать из закладок' : 'Добавить в закладки'}
							aria-pressed={isFavorite}
							className={`rounded-md border px-3 py-2 text-sm transition-colors ${
								isFavorite
									? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20'
									: 'border-obsidian-border/60 bg-transparent text-obsidian-muted hover:border-obsidian-border/80 hover:bg-obsidian-active/30 hover:text-gray-100'
							}`}
						>
							<span className="flex items-center gap-2">
								<FiStar className={isFavorite ? 'fill-yellow-300 text-yellow-300' : ''} />
								<span className="hidden sm:inline">{isFavorite ? 'В закладках' : 'В закладки'}</span>
							</span>
						</button>
					) : null}
					<button
						type="button"
						onClick={onSave}
						className="rounded-md border border-obsidian-border/70 bg-obsidian-active/40 px-4 py-2 text-sm font-semibold text-gray-100 transition-colors hover:bg-obsidian-active/60 hover:text-white"
					>
						Сохранить
					</button>
					<button
						type="button"
						onClick={onClose}
						className="rounded-md border border-obsidian-border/40 bg-transparent px-4 py-2 text-sm font-medium text-obsidian-muted transition-colors hover:border-obsidian-border/80 hover:bg-obsidian-active/30 hover:text-gray-100"
					>
						Закрыть
					</button>
				</div>
			</header>
			<div className="flex min-h-0 flex-1 overflow-hidden rounded-xl border border-obsidian-border/60 bg-black/30 shadow-soft">
				<textarea
					value={content}
					onChange={handleInput}
					onSelect={handleSelection}
					onKeyUp={handleSelection}
					spellCheck={false}
					className="h-full min-h-0 w-full resize-none overflow-auto bg-transparent px-4 py-4 font-mono text-sm leading-relaxed text-gray-100 outline-none placeholder:text-obsidian-muted/80 md:px-6 md:py-5"
					placeholder="Начните писать Markdown..."
				/>
			</div>
		</section>
	);
}

