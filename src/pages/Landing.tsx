import { Link, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiLock, FiZap, FiLayout, FiArrowRight, FiChevronDown, FiPlus, FiMinus } from 'react-icons/fi';
import { useEffect, useRef, useState } from 'react';
import { AuthModal } from '../components/AuthModal';

export default function Landing() {
	const navigate = useNavigate();
	const [authOpen, setAuthOpen] = useState(false);
	const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
	const [menuOpen, setMenuOpen] = useState(false);
	return (
		<div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
			<header className="sticky top-0 z-40 border-b border-gray-200 bg-white/70 backdrop-blur">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
					<Link to="/" className="flex items-center gap-3">
						<span className="text-xl font-extrabold tracking-wider text-gray-900 sm:text-2xl">CONNECT</span>
					</Link>
					<nav className="hidden flex-1 items-center justify-center gap-6 text-sm text-gray-600 md:flex">
						<a href="#features" className="hover:text-gray-900">Возможности</a>
						<a href="#how" className="hover:text-gray-900">Как это работает</a>
						<a href="#faq" className="hover:text-gray-900">FAQ</a>
					</nav>
					<div className="hidden items-center gap-2 md:flex">
						<button
							onClick={() => { setAuthMode('signin'); setAuthOpen(true); }}
							className="hidden rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 md:block"
						>
							Войти
						</button>
						<button
							onClick={() => { setAuthMode('signup'); setAuthOpen(true); }}
							className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
						>
							Зарегистрироваться
						</button>
					</div>
					<div className="md:hidden">
						<button
							aria-label="Открыть меню"
							onClick={() => setMenuOpen((v) => !v)}
							className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700"
						>
							<span className="relative block h-4 w-4">
								<span className={`absolute left-0 top-0 h-0.5 w-full bg-current transition ${menuOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
								<span className={`absolute left-0 top-1.5 h-0.5 w-full bg-current transition ${menuOpen ? 'opacity-0' : ''}`} />
								<span className={`absolute left-0 top-3 h-0.5 w-full bg-current transition ${menuOpen ? '-translate-y-1.5 -rotate-45' : ''}`} />
							</span>
						</button>
					</div>
				</div>
				{/* Mobile panel */}
				<div className={`md:hidden ${menuOpen ? 'block' : 'hidden'}`}>
					<div className="border-t border-gray-200 bg-white/90 px-4 py-3">
						<nav className="flex flex-col gap-2 text-sm text-gray-700">
							<a href="#features" className="rounded-md px-2 py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Возможности</a>
							<a href="#how" className="rounded-md px-2 py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Как это работает</a>
							<a href="#faq" className="rounded-md px-2 py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>FAQ</a>
						</nav>
						<div className="mt-3 flex flex-col gap-2">
							<button
								onClick={() => { setAuthMode('signin'); setAuthOpen(true); setMenuOpen(false); }}
								className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
							>
								Войти
							</button>
							<button
								onClick={() => { setAuthMode('signup'); setAuthOpen(true); setMenuOpen(false); }}
								className="w-full rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
							>
								Зарегистрироваться
							</button>
						</div>
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-7xl px-4">
				<section className="relative py-16 sm:py-24 text-center">
					<h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
						Заметки под вашим ключом
					</h1>
					<p className="mx-auto mt-5 max-w-3xl text-lg text-gray-600">
						CONNECT — шустрый Markdown‑заметочник с локальным шифрованием на устройстве (AES‑GCM).<br className="hidden sm:block" />
						Ваши тексты уходят на сервер в виде шифртекста, ключ остаётся у вас. Автосейв, теги, офлайн‑режим — из коробки.
					</p>
					<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
						<button
							onClick={() => { setAuthMode('signup'); setAuthOpen(true); }}
							className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 font-semibold text-white hover:opacity-95 shadow"
						>
							Попробовать CONNECT <FiArrowRight />
						</button>
						<a href="#features" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-gray-700 hover:bg-gray-100">
							Узнать больше
						</a>
					</div>
					<div className="mt-12 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft">
						<DemoPreview
							onCreate={() => {
								setAuthMode('signup');
								setAuthOpen(true);
							}}
						/>
					</div>
				</section>

				<section id="features" className="py-12 sm:py-16">
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<FeatureCard icon={<FiZap />} title="Быстро" text="Мгновенный отклик и автосохранение без лишних кликов." />
						<FeatureCard icon={<FiLayout />} title="Удобно" text="Чистый интерфейс, темы (тёмная/светлая) и адаптив под любой экран." />
						<FeatureCard icon={<FiCheckCircle />} title="Организованно" text="Теги, избранное и поиск — порядок в заметках без усилий." />
						<FeatureCard icon={<FiLock />} title="Конфиденциально" text="Локальное шифрование (AES‑GCM): ключ у вас, на сервере — только шифртекст." />
					</div>
				</section>

				<section id="how" className="py-12 sm:py-16">
					<h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">3 шага к порядку в заметках</h2>
					<div className="mt-8 grid gap-4 sm:grid-cols-3">
						<StepCard step="1" title="Создайте и назовите" text="Откройте CONNECT и начните с чистого листа — за секунду." />
						<StepCard step="2" title="Пишите — всё сохранится" text="Автосейв на каждом вводе и офлайн‑режим прямо в браузере." />
						<StepCard step="3" title="Наводите порядок" text="Теги, избранное и быстрый поиск — нужное всегда под рукой." />
					</div>
				</section>

				<section id="faq" className="py-12 sm:py-16">
					<h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">Вопросы и ответы</h2>
					<p className="mx-auto mt-2 max-w-2xl text-center text-sm text-gray-600">Самые частые вопросы о приватности, данных и начале работы.</p>
					<div className="mx-auto mt-8 max-w-3xl">
						<FAQList
							items={[
								{ q: 'Как CONNECT защищает мои заметки?', a: 'Шифрование выполняется на вашем устройстве (AES‑GCM). На сервер отправляется только шифртекст, а ключ остаётся у вас.' },
								{ q: 'Что если я офлайн?', a: 'Приложение — веб, сервер хранит шифртекст. В браузере может кэшироваться копия для комфорта: при появлении интернета изменения докачаются.' },
								{ q: 'Где хранятся данные?', a: 'В базе на сервере — только в виде шифртекста. В браузере хранится временный кэш для быстрого доступа и офлайн‑черновиков.' },
								{ q: 'Можно ли восстановить доступ к зашифрованным заметкам?', a: 'Да, если у вас есть пароль и сгенерированная фраза. Ключ шифрования восстанавливается из этих данных.' },
								{ q: 'Сколько это стоит?', a: 'Базовый функционал — бесплатно. Платные планы с расширенными возможностями будут позже.' },
								{ q: 'Будет ли синхронизация между устройствами?', a: 'Да, это в планах. Синхронизация сохранит приватность — на сервере только шифртекст, ключ хранится у вас.' },
							]}
						/>
					</div>
					<div className="mt-8 text-center">
						<button
							onClick={() => { setAuthMode('signup'); setAuthOpen(true); }}
							className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 font-semibold text-white hover:opacity-95 shadow"
						>
							Попробовать CONNECT <FiArrowRight />
						</button>
					</div>
				</section>
			</main>
			<footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500">
				<p>© {new Date().getFullYear()} CONNECT.</p>
			</footer>
			<AuthModal
				open={authOpen}
				mode={authMode}
				onClose={() => setAuthOpen(false)}
				onSuccess={() => {
					setAuthOpen(false);
					navigate('/app');
				}}
			/>
		</div>
	);
}

function FeatureCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
	return (
		<div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
			<div className="text-2xl text-cyan-600">{icon}</div>
			<h3 className="mt-3 text-lg font-semibold text-gray-900">{title}</h3>
			<p className="mt-1 text-sm text-gray-600">{text}</p>
		</div>
	);
}

function StepCard({ step, title, text }: { step: string; title: string; text: string }) {
	return (
		<div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
			<div className="mx-auto select-none text-4xl font-extrabold leading-none tracking-tight text-transparent sm:text-5xl bg-gradient-to-b from-gray-700 via-gray-500 to-gray-800 bg-clip-text">
				{step}
			</div>
			<h4 className="mt-3 text-base font-semibold text-gray-900">{title}</h4>
			<p className="mt-1 text-sm text-gray-600">{text}</p>
		</div>
	);
}

// hooks are already imported above

function FAQ({ q, a }: { q: string; a: string }) {
	const [open, setOpen] = useState(false);
	return (
		<div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white/90 shadow-lg transition hover:shadow-xl">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="flex w-full items-center justify-between px-5 py-4 text-left"
				aria-expanded={open}
			>
				<span className="text-base font-semibold text-gray-900">{q}</span>
				<span
					className={`ml-3 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 shadow-sm transition-transform duration-300 ${
						open ? 'rotate-180' : ''
					}`}
				>
					<FiChevronDown className="h-4 w-4" />
				</span>
			</button>
			<div
				className={`grid transition-[grid-template-rows,opacity] duration-400 ease-out ${
					open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
				}`}
			>
				<div className="min-h-0 px-5 pb-5 text-sm leading-6 text-gray-600">
					{a}
				</div>
			</div>
		</div>
	);
}

function FAQList({ items }: { items: Array<{ q: string; a: string }> }) {
	const [openIdx, setOpenIdx] = useState<number | null>(0);
	return (
		<div className="space-y-3">
			{items.map((it, idx) => (
				<div key={it.q}>
					<FAQ
						q={it.q}
						a={it.a}
					/>
				</div>
			))}
		</div>
	);
}

function DemoPreview({ onCreate }: { onCreate: () => void }) {
	const [title, setTitle] = useState('Новая заметка');
	const phrases = useRef([
		'Заголовок',
		'Список дел:',
		'- Купить кофе',
		'- Переименовать заметки',
		'# Markdown — это просто',
	]).current;
	const [idx, setIdx] = useState(0);
	const [pos, setPos] = useState(0);
	const [deleting, setDeleting] = useState(false);
	const [line, setLine] = useState('');

	useEffect(() => {
		const current = phrases[idx % phrases.length];
		const speed = deleting ? 45 : 90;
		const t = window.setTimeout(() => {
			if (!deleting) {
				const next = current.slice(0, pos + 1);
				setLine(next);
				setPos(pos + 1);
				if (next.length === current.length) {
					setDeleting(true);
					setTimeout(() => {}, 1200);
				}
			} else {
				const next = current.slice(0, Math.max(0, pos - 1));
				setLine(next);
				setPos(pos - 1);
				if (next.length === 0) {
					setDeleting(false);
					setIdx((i) => i + 1);
				}
			}
		}, speed);
		return () => clearTimeout(t);
	}, [pos, deleting, idx, phrases]);

	return (
		<div className="grid gap-0 sm:grid-cols-[2fr,1fr]">
			<div className="relative border-r border-gray-200">
				<div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
					<div className="flex items-center gap-2 text-sm text-gray-500">
						<span className="h-2.5 w-2.5 rounded-full bg-red-400" />
						<span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
						<span className="h-2.5 w-2.5 rounded-full bg-green-400" />
					</div>
					<div className="text-xs text-gray-500">demo.md</div>
				</div>
				<div className="h-full min-h-[320px] bg-gray-50 p-5 sm:min-h-[360px]">
					<div className="mx-auto max-w-2xl">
						<div className="mb-4 text-2xl font-semibold text-gray-800">{title || 'Новая заметка'}</div>
						<pre className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 font-mono text-sm leading-6 text-gray-800">
{`# `}
							<span className="align-middle">{line}</span>
							<span className="ml-0.5 inline-block h-4 w-[2px] translate-y-[3px] bg-gray-800 align-middle animate-pulse" />
						</pre>
					</div>
				</div>
			</div>
			<form
				className="flex flex-col gap-3 p-5"
				onSubmit={(e) => {
					e.preventDefault();
					onCreate();
				}}
			>
				<label className="text-sm font-medium text-gray-800">Название заметки</label>
				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Например: Идеи на неделю"
					className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-gray-400"
				/>
				<button
					type="submit"
					className="mt-2 rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
				>
					Создать
				</button>
				<p className="text-xs text-gray-500">
					Начните бесплатно: создайте черновик сейчас, а регистрацию можно пройти позже и сохранить прогресс.
				</p>
			</form>
		</div>
	);
}


