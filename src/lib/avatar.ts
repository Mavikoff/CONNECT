// Generate deterministic circle avatar as SVG data URL with initial
// Color is derived from input (email or id) via simple hash

function hashString(input: string): number {
	let h = 2166136261 >>> 0; // FNV-1a
	for (let i = 0; i < input.length; i++) {
		h ^= input.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}

function hslFromHash(h: number) {
	const hue = h % 360;
	const sat = 65;
	const light = 55;
	return `hsl(${hue}, ${sat}%, ${light}%)`;
}

export function makeInitial(name?: string, email?: string) {
	const source = (name || '').trim() || (email || '').trim() || 'U';
	const initial = source.charAt(0).toUpperCase();
	return initial || 'U';
}

export function generateAvatarDataUrl(name?: string, email?: string): string {
	const seed = (email || name || 'user').toLowerCase();
	const color = hslFromHash(hashString(seed));
	const initial = makeInitial(name, email);
	const svg =
		`<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'>` +
		`<defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0%' stop-color='${color}' stop-opacity='1'/>` +
		`<stop offset='100%' stop-color='${color}' stop-opacity='0.85'/></linearGradient></defs>` +
		`<rect width='256' height='256' rx='128' fill='url(#g)'/>` +
		`<text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial' font-size='128' fill='rgba(255,255,255,0.92)'>${initial}</text>` +
		`</svg>`;
	return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}


