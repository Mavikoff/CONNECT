import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
	if (!authed) return <Navigate to="/404" replace />;
	return children;
}

export default function RootRouter() {
	// basename берём из BASE_URL Vite: для GitHub Pages это "/CONNECT/"
	const basename = import.meta.env.BASE_URL.replace(/\/$/, '');
	return (
		<BrowserRouter basename={basename}>
			<Routes>
				{/* корень */}
				<Route path="/" element={<Landing />} />
				<Route path="" element={<Landing />} />
				{/* защищённое приложение */}
				<Route path="/app/*" element={<ProtectedRoute><App /></ProtectedRoute>} />
				{/* явный 404 для защищённых редиректов */}
				<Route path="/404" element={<NotFound />} />
				{/* все прочие пути ведут на стартовую страницу */}
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
}


