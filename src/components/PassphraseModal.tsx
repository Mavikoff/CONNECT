import { useState } from 'react';
import { deriveKey, exportKeyToB64, generateSaltB64, saveSessionKeyInfo } from '../lib/crypto';

interface PassphraseModalProps {
	open: boolean;
	onClose: () => void;
}

export function PassphraseModal({ open, onClose }: PassphraseModalProps) {
	const [pass, setPass] = useState('');
	const [confirm, setConfirm] = useState('');
	const [loading, setLoading] = useState(false);

	if (!open) return null;

	async function handleSave(e: React.FormEvent) {
		e.preventDefault();
		if (!pass || pass !== confirm) return;
		setLoading(true);
		const saltB64 = generateSaltB64();
		const key = await deriveKey(pass, saltB64);
		const keyB64 = await exportKeyToB64(key);
		saveSessionKeyInfo(keyB64, saltB64);
		setLoading(false);
		onClose();
	}

	return (
		<div className="fixed inset-0 z-50">
			<div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
			<div className="relative z-10 mx-auto mt-16 w-[92%] max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
				<h3 className="mb-3 text-lg font-semibold text-gray-900">Фраза шифрования</h3>
				<p className="mb-4 text-sm text-gray-600">
					Введите фразу, чтобы шифровать заметки на устройстве. Фраза не отправляется на сервер.
				</p>
				<form onSubmit={handleSave} className="space-y-3">
					<input
						type="password"
						placeholder="Фраза шифрования"
						value={pass}
						onChange={(e) => setPass(e.target.value)}
						className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
					/>
					<input
						type="password"
						placeholder="Повторите фразу"
						value={confirm}
						onChange={(e) => setConfirm(e.target.value)}
						className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
					/>
					<button
						type="submit"
						disabled={loading || !pass || pass !== confirm}
						className="mt-2 w-full rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
					>
						Сохранить
					</button>
				</form>
				<p className="mt-3 text-xs text-gray-500">
					Не забудьте фразу — без неё расшифровка будет невозможна.
				</p>
			</div>
		</div>
	);
}


