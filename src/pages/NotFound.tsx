import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthModal } from '../components/AuthModal';

export default function NotFound() {
	const navigate = useNavigate();
	const [authOpen, setAuthOpen] = useState(false);
	const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
	return (
		<div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
			<header className="sticky top-0 z-40 border-b border-gray-200 bg-white/70 backdrop-blur">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
					<Link to="/" className="flex items-center gap-3">
						<span className="text-xl font-extrabold tracking-wider text-gray-900 sm:text-2xl">CONNECT</span>
					</Link>
					<div className="flex items-center gap-2">
						<button
							onClick={() => { setAuthMode('signin'); setAuthOpen(true); }}
							className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
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
				</div>
			</header>
			<main className="mx-auto max-w-7xl px-4">
				<section className="relative grid min-h-[70vh] grid-cols-1 items-center gap-6 py-16 sm:grid-cols-2 sm:py-24">
					<div className="order-2 sm:order-1">
						<h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Упс! Страница не найдена</h1>
						<p className="mt-4 max-w-xl text-sm text-gray-600">
							Кажется, вы попытались попасть туда, где вас не ждут. Доступ к приложению защищён — сначала войдите или зарегистрируйтесь.
						</p>
						<div className="mt-6 flex flex-wrap gap-3">
							<button
								onClick={() => { setAuthMode('signin'); setAuthOpen(true); }}
								className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							>
								Войти
							</button>
							<button
								onClick={() => { setAuthMode('signup'); setAuthOpen(true); }}
								className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
							>
								Зарегистрироваться
							</button>
							<Link to="/" className="rounded-md px-4 py-2 text-sm text-gray-700 hover:underline">
								На главную
							</Link>
						</div>
					</div>
					<div className="order-1 flex items-center justify-end sm:order-2">
						<div className="relative flex h-full min-h-[320px] w-full max-w-xs items-center justify-center">
							<div
								className="select-none text-8xl font-extrabold leading-none tracking-tight text-gray-900 sm:text-9xl"
								style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
							>
								404
							</div>
						</div>
					</div>
				</section>
			</main>
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


