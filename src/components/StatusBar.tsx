interface StatusBarProps {
	characters: number;
	lines: number;
	column: number;
	language?: string;
}

export function StatusBar({ characters, lines, column, language = 'Markdown' }: StatusBarProps) {
	return (
		<footer className="pointer-events-none fixed inset-x-0 bottom-0 z-30 border-t border-obsidian-border/70 bg-black/70 px-3 py-2 text-[11px] text-obsidian-muted backdrop-blur-lg md:px-8 md:py-3">
			<div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between">
				<div className="hidden items-center gap-4 sm:flex">
					<span className="uppercase tracking-[0.35em] text-[9px] text-obsidian-muted/80">Режим</span>
					<span className="font-medium text-gray-200">{language}</span>
				</div>
				<div className="grid w-full grid-cols-3 items-center gap-2 text-center sm:w-auto sm:flex sm:gap-6 sm:text-left">
					<span>Символов: {characters}</span>
					<span>Строка: {lines}</span>
					<span>Колонка: {column}</span>
				</div>
			</div>
		</footer>
	);
}

