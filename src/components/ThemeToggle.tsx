import { useEffect, useState } from 'react';

export default function ThemeToggle() {
	const [dark, setDark] = useState<boolean>(() => {
		return localStorage.getItem('theme') === 'dark';
	});

	useEffect(() => {
		const root = document.documentElement;
		if (dark) {
			root.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			root.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}, [dark]);

	return (
		<button
			onClick={() => setDark((v) => !v)}
			className="px-3 py-2 rounded-md text-sm card-surface"
		>
			{dark ? '🌙 Dark' : '☀️ Light'}
		</button>
	);
}


