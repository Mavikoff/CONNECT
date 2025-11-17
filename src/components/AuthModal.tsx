import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { supabase } from '../lib/supabase';
import { encryptSecretWithPassword, deriveKey, exportKeyToB64, saveSessionKeyInfo, generatePassphrase, decryptSecretWithPassword } from '../lib/crypto';
import { generateAvatarDataUrl } from '../lib/avatar';

type Mode = 'signin' | 'signup';

interface AuthModalProps {
	open: boolean;
	mode: Mode;
	onClose: () => void;
	onSuccess?: () => void;
}

export function AuthModal({ open, mode, onClose, onSuccess }: AuthModalProps) {
	const [active, setActive] = useState<Mode>(mode);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// синхронизируем вкладку модала с приходящим mode при каждом открытии/смене
	// чтобы "Зарегистрироваться" всегда открывал нужную вкладку
	// и "Войти" тоже
	// (важно: делаем это до отрисовки формы)
	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		setActive(mode);
	}, [mode, open]);

	if (!open) return null;

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			if (active === 'signup') {
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
					options: { data: { first_name: firstName, last_name: lastName } },
				});
				if (error) throw error;
				const user = data.user;
				if (user) {
					// генерируем фразу и шифруем её паролем пользователя
					const passphrase = generatePassphrase();
					const { saltB64, enc } = await encryptSecretWithPassword(passphrase, password);
					// генерируем дефолтный аватар
					const avatarDataUrl = generateAvatarDataUrl(firstName || lastName || email, email);
					// upsert профиль с именем/фамилией и полями шифрования
					// На HTTP enc_salt будет пустым, master_key_enc будет содержать незашифрованный passphrase
					const { error: upErr } = await supabase
						.from('profiles')
						.upsert({
							id: user.id,
							email,
							first_name: firstName,
							last_name: lastName,
							enc_salt: saltB64 || null,
							master_key_enc: enc || null,
							avatar_url: avatarDataUrl,
						}, { onConflict: 'id' });
					if (upErr) {
						// не ломаем UX, просто логируем
						console.warn('profiles upsert:', upErr.message);
					}
					// производный ключ для шифрования заметок из passphrase
					// На HTTP encKey будет null, но это нормально - заметки будут храниться без шифрования
					if (saltB64) {
						const encKey = await deriveKey(passphrase, saltB64);
						if (encKey) {
							const b64 = await exportKeyToB64(encKey);
							if (b64) {
								saveSessionKeyInfo(b64, saltB64);
							}
						}
					}
				}
			} else {
				const { data, error } = await supabase.auth.signInWithPassword({ email, password });
				if (error) throw error;
				// попытка восстановить ключ шифрования из profiles
				const user = data.user;
				if (user) {
					const { data: prof } = await supabase
						.from('profiles')
						.select('enc_salt, master_key_enc')
						.eq('id', user.id)
						.maybeSingle();
					// На HTTP enc_salt будет пустым или null, master_key_enc будет содержать незашифрованный passphrase
					if (prof?.master_key_enc) {
						if (prof.enc_salt && prof.enc_salt.trim() !== '') {
							// HTTPS: расшифровываем passphrase
							const passphrase = await decryptSecretWithPassword(prof.master_key_enc, password, prof.enc_salt);
							if (passphrase) {
								const encKey = await deriveKey(passphrase, prof.enc_salt);
								if (encKey) {
									const b64 = await exportKeyToB64(encKey);
									if (b64) {
										saveSessionKeyInfo(b64, prof.enc_salt);
									}
								}
							}
						} else {
							// HTTP: passphrase хранится в открытом виде (небезопасно, но работает)
							// На HTTP шифрование недоступно, поэтому просто пропускаем
							console.warn('Encryption not available on HTTP. Notes will be stored unencrypted.');
						}
					}
				}
			}
			onClose();
			onSuccess?.();
		} catch (err: any) {
			setError(err?.message ?? 'Ошибка авторизации');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="fixed inset-0 z-50">
			<div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
			<div className="relative z-10 mx-auto mt-14 w-[94%] max-w-3xl">
				<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
					<div className="grid grid-cols-1 md:grid-cols-2">
						{/* Left */}
						<div className="hidden md:flex min-h-[520px] items-center justify-center bg-gray-50 p-10">
							<div className="max-w-sm text-center">
								<h3 className="text-2xl font-bold text-gray-900">Добро пожаловать в CONNECT</h3>
								<p className="mt-4 text-sm leading-6 text-gray-600">
									Локальное шифрование, автосейв и теги. Регистрация займёт меньше минуты.
								</p>
							</div>
						</div>
						{/* Right – form */}
						<div className="p-8">
							<div className="mb-6 flex items-center justify-between">
								<div className="flex gap-2">
									<button
										className={`rounded-lg px-4 py-2 text-sm transition ${active === 'signin' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
										onClick={() => setActive('signin')}
									>
										Войти
									</button>
									<button
										className={`rounded-lg px-4 py-2 text-sm transition ${active === 'signup' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
										onClick={() => setActive('signup')}
									>
										Зарегистрироваться
									</button>
								</div>
								<button
									aria-label="Закрыть"
									className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
									onClick={onClose}
								>
									<FiX className="h-5 w-5" />
								</button>
							</div>
							<form onSubmit={handleSubmit} className="space-y-4">
								{active === 'signup' && (
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
										<label className="block">
											<span className="mb-1.5 block text-sm text-gray-700">Имя</span>
											<input
												value={firstName}
												onChange={(e) => setFirstName(e.target.value)}
												required
												className="w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-800"
												autoComplete="given-name"
											/>
										</label>
										<label className="block">
											<span className="mb-1.5 block text-sm text-gray-700">Фамилия</span>
											<input
												value={lastName}
												onChange={(e) => setLastName(e.target.value)}
												required
												className="w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-800"
												autoComplete="family-name"
											/>
										</label>
									</div>
								)}
								<label className="block">
									<span className="mb-1.5 block text-sm text-gray-700">Почта</span>
									<input
										type="email"
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-800"
										autoComplete="email"
									/>
								</label>
								<label className="block">
									<span className="mb-1.5 block text-sm text-gray-700">Пароль</span>
									<input
										type="password"
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-800"
										autoComplete={active === 'signup' ? 'new-password' : 'current-password'}
									/>
								</label>
								{error ? <p className="text-sm text-rose-600">{error}</p> : null}
								<button
									type="submit"
									disabled={loading}
									className="mt-1.5 w-full rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
								>
									{active === 'signup' ? 'Создать аккаунт' : 'Войти'}
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}


