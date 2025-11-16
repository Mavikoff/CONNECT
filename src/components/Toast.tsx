import { useEffect, useState } from 'react';
import { FiCheckCircle, FiX } from 'react-icons/fi';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastProps {
	open: boolean;
	message: string;
	variant?: ToastVariant;
	autoHideMs?: number;
	onClose: () => void;
}

export function Toast({ open, message, variant = 'success', autoHideMs = 2000, onClose }: ToastProps) {
	// Локальное состояние для плавного появления/исчезновения без резкого размонтирования
	const [rendered, setRendered] = useState(open);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		let hideTimer: number | undefined;
		if (open) {
			setRendered(true);
			// следующий тик, чтобы сработала анимация
			requestAnimationFrame(() => setVisible(true));
			const t = window.setTimeout(onClose, autoHideMs);
			return () => window.clearTimeout(t);
		} else if (rendered) {
			// запускаем анимацию исчезновения
			setVisible(false);
			hideTimer = window.setTimeout(() => setRendered(false), 250);
		}
		return () => {
			if (hideTimer) window.clearTimeout(hideTimer);
		};
	}, [open, autoHideMs, onClose, rendered]);

	if (!rendered) return null;

	const color =
		variant === 'success'
			? 'text-emerald-300'
			: variant === 'error'
			? 'text-rose-300'
			: 'text-sky-300';
	const border =
		variant === 'success'
			? 'border-emerald-500/40'
			: variant === 'error'
			? 'border-rose-500/40'
			: 'border-sky-500/40';

	return (
		<div className="pointer-events-none fixed inset-0 z-50 flex items-start justify-end p-6">
			<div
				className={`pointer-events-auto flex max-w-sm items-start gap-3 rounded-lg border ${border} bg-black/70 px-4 py-3 text-gray-100 shadow-soft backdrop-blur transition-all duration-300 ease-out ${
					visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
				}`}
			>
				<span className={`mt-0.5 text-xl ${color}`}>
					<FiCheckCircle />
				</span>
				<div className="min-w-0 flex-1">
					<p className="truncate text-sm">{message}</p>
				</div>
				<button
					type="button"
					aria-label="Закрыть"
					onClick={onClose}
					className="rounded-md border border-obsidian-border/60 bg-black/40 p-1.5 text-gray-400 hover:text-gray-200"
				>
					<FiX />
				</button>
			</div>
		</div>
	);
}


