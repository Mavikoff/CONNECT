import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import App from './App';
import NotFound from './pages/NotFound';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

function ProtectedRoute({ children }: { children: JSX.Element }) {
	const [loading, setLoading] = useState(true);
	const [authed, setAuthed] = useState<boolean>(false);
	useEffect(() => {
		let mounted = true;
		(async () => {
			const { data } = await supabase.auth.getSession();
			if (!mounted) return;
			setAuthed(Boolean(data.session));
			setLoading(false);
		})();
		return () => { mounted = false; };
	}, []);
	if (loading) {
		// Заглушка во время проверки авторизации
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="mb-4 text-lg text-gray-600">Проверка доступа...</div>
				</div>
			</div>
		);
	}
	if (!authed) {
		// если нет сессии и пытаются зайти в /app — показываем нашу 404‑страницу
		return <NotFound />;
	}
	return children;
}

export default function RootRouter() {
	return (
		<HashRouter>
			<Routes>
				{/* стартовая страница */}
				<Route path="/" element={<Landing />} />
				{/* защищённое приложение */}
				<Route path="/app/*" element={<ProtectedRoute><App /></ProtectedRoute>} />
				{/* все остальные пути отправляем на лендинг, чтобы GitHub Pages не ломал навигацию */}
				<Route path="*" element={<Landing />} />
			</Routes>
		</HashRouter>
	);
}


