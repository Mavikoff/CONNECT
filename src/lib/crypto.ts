// Simple E2EE helper built on WebCrypto (AES-GCM 256)
// We store ciphertext as: enc:v1:<base64(iv)>:<base64(ciphertext)>

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function toBase64(bytes: ArrayBuffer): string {
	const bin = String.fromCharCode(...new Uint8Array(bytes));
	return btoa(bin);
}

function fromBase64(b64: string): Uint8Array {
	const bin = atob(b64);
	return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

export async function deriveKey(passphrase: string, saltB64: string): Promise<CryptoKey> {
	const salt = fromBase64(saltB64);
	const baseKey = await crypto.subtle.importKey(
		'raw',
		textEncoder.encode(passphrase),
		{ name: 'PBKDF2' },
		false,
		['deriveKey'],
	);
	return crypto.subtle.deriveKey(
		{ name: 'PBKDF2', salt, iterations: 250_000, hash: 'SHA-256' },
		baseKey,
		{ name: 'AES-GCM', length: 256 },
		true, // extractable: we need to export to store in session
		['encrypt', 'decrypt'],
	);
}

export function generateSaltB64(): string {
	const salt = crypto.getRandomValues(new Uint8Array(16));
	return toBase64(salt.buffer);
}

export async function encryptString(plain: string, key: CryptoKey): Promise<string> {
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const ct = await crypto.subtle.encrypt(
		{ name: 'AES-GCM', iv },
		key,
		textEncoder.encode(plain),
	);
	return `enc:v1:${toBase64(iv.buffer)}:${toBase64(ct)}`;
}

export async function tryDecryptString(data: string, key: CryptoKey): Promise<string | null> {
	if (!data.startsWith('enc:v1:')) return null;
	const [, , ivB64, ctB64] = data.split(':');
	try {
		const iv = fromBase64(ivB64);
		const ct = fromBase64(ctB64);
		const plainBuf = await crypto.subtle.decrypt(
			{ name: 'AES-GCM', iv },
			key,
			ct,
		);
		return textDecoder.decode(plainBuf);
	} catch {
		return null;
	}
}

const SESSION_KEY_SLOT = 'enc:key';
const SESSION_SALT_SLOT = 'enc:salt';

export function saveSessionKeyInfo(keyB64: string, saltB64: string) {
	sessionStorage.setItem(SESSION_KEY_SLOT, keyB64);
	sessionStorage.setItem(SESSION_SALT_SLOT, saltB64);
}

export function getSessionSalt(): string | null {
	return sessionStorage.getItem(SESSION_SALT_SLOT);
}

export async function importKeyFromB64(keyB64: string): Promise<CryptoKey> {
	const raw = fromBase64(keyB64);
	return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

export async function exportKeyToB64(key: CryptoKey): Promise<string> {
	const raw = await crypto.subtle.exportKey('raw', key);
	return toBase64(raw);
}

// Utility: random human-safe passphrase (base64url-like)
export function generatePassphrase(len = 24): string {
	const bytes = crypto.getRandomValues(new Uint8Array(len));
	const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789-_';
	let out = '';
	for (let i = 0; i < bytes.length; i++) {
		out += alphabet[bytes[i] % alphabet.length];
	}
	return out;
}

// Encrypt/Decrypt a short secret (like passphrase) using password
export async function encryptSecretWithPassword(secret: string, password: string) {
	const saltB64 = generateSaltB64();
	const key = await deriveKey(password, saltB64);
	const enc = await encryptString(secret, key);
	return { saltB64, enc };
}

export async function decryptSecretWithPassword(enc: string, password: string, saltB64: string) {
	const key = await deriveKey(password, saltB64);
	return await tryDecryptString(enc, key);
}


