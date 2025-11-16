import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import RootRouter from './RootRouter.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RootRouter />
	</StrictMode>,
);

// Apply saved theme immediately after mount
try {
	const raw = localStorage.getItem('userSettingsV1');
	if (raw) {
		const settings = JSON.parse(raw);
		const theme = settings?.theme ?? 'dark';
		document.body.classList.add(`theme-${theme}`);
	} else {
		document.body.classList.add('theme-dark');
	}
} catch {
	document.body.classList.add('theme-dark');
}
