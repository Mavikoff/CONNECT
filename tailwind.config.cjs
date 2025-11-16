/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./index.html',
		'./src/**/*.{js,jsx,ts,tsx}',
	],
	theme: {
		extend: {
			fontFamily: {
				mono: [
					'"JetBrains Mono"',
					'"SFMono-Regular"',
					'ui-monospace',
					'SFMono-Regular',
					'Menlo',
					'Monaco',
					'"Cascadia Mono"',
					'Roboto Mono',
					'monospace',
				],
			},
			colors: {
				obsidian: {
					panel: '#1c1f26',
					active: '#2d323b',
					border: '#2a2f36',
					muted: '#6b7280',
				},
			},
			boxShadow: {
				soft: '0 10px 30px -15px rgba(0, 0, 0, 0.6)',
			},
		},
	},
	plugins: [],
};

