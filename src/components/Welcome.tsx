import { useEffect, useRef, useState } from 'react';

interface WelcomeProps {
	onGoToFiles: () => void;
}

export function Welcome({ onGoToFiles }: WelcomeProps) {
	const fullText = 'Вас приветствует CONNECT...';
	const [index, setIndex] = useState(0);
	const timerRef = useRef<number | null>(null);

	useEffect(() => {
		let i = 0;
		function typeLoop() {
			timerRef.current = window.setInterval(() => {
				if (i < fullText.length) {
					i += 1;
					setIndex(i);
				} else {
					if (timerRef.current) window.clearInterval(timerRef.current);
					window.setTimeout(() => {
						i = 0;
						setIndex(0);
						typeLoop();
					}, 1200);
				}
			}, 60);
		}
		typeLoop();
		return () => {
			if (timerRef.current) window.clearInterval(timerRef.current);
		};
	}, []);

	return (
		<section className="flex h-full flex-1 flex-col items-center justify-center px-4 pb-24 pt-16 text-center md:px-10 md:pt-10">
			<div className="max-w-2xl">
				<h1 className="mb-4 text-3xl font-semibold text-gray-100">
					<span className="relative inline-flex items-center">
						<span className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-100 bg-clip-text text-transparent">
							{fullText.slice(0, index)}
						</span>
						<span className="ml-1 h-6 w-[2px] translate-y-[2px] bg-gray-400/80 align-middle caret-blink" />
					</span>
				</h1>
				<p className="mb-8 text-sm text-obsidian-muted">
					Чтобы начать работу, перейдите во вкладку&nbsp;
					<button
						type="button"
						onClick={onGoToFiles}
						className="rounded border border-obsidian-border/60 bg-black/30 px-2 py-1 text-gray-100 underline-offset-4 transition-colors hover:bg-obsidian-active/40 hover:underline"
					>
						Файлы
					</button>
					.
				</p>
				<p className="text-xs text-obsidian-muted/80">
					Слева доступен постоянный сайдбар для навигации. Создайте новую заметку или откройте существующую.
				</p>
			</div>
		</section>
	);
}


