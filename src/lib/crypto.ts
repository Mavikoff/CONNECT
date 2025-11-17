// Simple E2EE helper built on WebCrypto (AES-GCM 256)
// We store ciphertext as: enc:v1:<base64(iv)>:<base64(ciphertext)>

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

// Получаем crypto объект безопасно
function getCrypto() {
	if (typeof window !== 'undefined' && window.crypto) {
		return window.crypto;
	}
	if (typeof crypto !== 'undefined' && crypto) {
		return crypto;
	}
	return null;
}

// Проверка доступности crypto.subtle (работает только на HTTPS)
export function isEncryptionAvailable(): boolean {
	const cryptoObj = getCrypto();
	return !!(cryptoObj && cryptoObj.subtle);
}

function getCryptoSubtle() {
	if (!isEncryptionAvailable()) {
		return null;
	}
	const cryptoObj = getCrypto();
	if (!cryptoObj || !cryptoObj.subtle) {
		return null;
	}
	return cryptoObj.subtle;
}

function toBase64(bytes: ArrayBuffer): string {
	const bin = String.fromCharCode(...new Uint8Array(bytes));
	return btoa(bin);
}

function fromBase64(b64: string): Uint8Array {
	if (!b64 || b64.trim() === '') {
		return new Uint8Array(0);
	}
	try {
		const bin = atob(b64);
		return Uint8Array.from(bin, (c) => c.charCodeAt(0));
	} catch (error) {
		console.warn('fromBase64 error:', error);
		return new Uint8Array(0);
	}
}

export async function deriveKey(passphrase: string, saltB64: string): Promise<CryptoKey | null> {
	if (!isEncryptionAvailable()) {
		return null;
	}
	if (!saltB64 || saltB64.trim() === '') {
		return null;
	}
	const subtle = getCryptoSubtle();
	if (!subtle) {
		return null;
	}
	if (typeof subtle !== 'object' || typeof subtle.importKey !== 'function' || typeof subtle.deriveKey !== 'function') {
		return null;
	}
	try {
		// Дополнительная проверка перед вызовом
		if (!subtle || typeof subtle !== 'object' || !subtle.importKey || typeof subtle.importKey !== 'function' || !subtle.deriveKey || typeof subtle.deriveKey !== 'function') {
			return null;
		}
		const salt = fromBase64(saltB64);
		// Финальная проверка прямо перед вызовом
		if (!subtle || !subtle.importKey) {
			return null;
		}
		const baseKey = await subtle.importKey(
			'raw',
			textEncoder.encode(passphrase),
			{ name: 'PBKDF2' },
			false,
			['deriveKey'],
		);
		// Проверка перед deriveKey
		if (!subtle || !subtle.deriveKey || typeof subtle.deriveKey !== 'function') {
			return null;
		}
		return subtle.deriveKey(
			{ name: 'PBKDF2', salt, iterations: 250_000, hash: 'SHA-256' },
			baseKey,
			{ name: 'AES-GCM', length: 256 },
			true, // extractable: we need to export to store in session
			['encrypt', 'decrypt'],
		);
	} catch (error) {
		console.warn('deriveKey error:', error);
		return null;
	}
}

export function generateSaltB64(): string {
	const cryptoObj = getCrypto();
	if (!cryptoObj || !cryptoObj.getRandomValues) {
		// Fallback: используем Math.random (менее безопасно, но работает)
		const salt = new Uint8Array(16);
		for (let i = 0; i < 16; i++) {
			salt[i] = Math.floor(Math.random() * 256);
		}
		return toBase64(salt.buffer);
	}
	const salt = cryptoObj.getRandomValues(new Uint8Array(16));
	return toBase64(salt.buffer);
}

export async function encryptString(plain: string, key: CryptoKey | null): Promise<string> {
	// Если шифрование недоступно или ключ null, возвращаем текст как есть
	if (!key || !isEncryptionAvailable()) {
		return plain;
	}
	const subtle = getCryptoSubtle();
	if (!subtle) return plain;
	if (typeof subtle !== 'object' || typeof subtle.encrypt !== 'function') return plain;
	const cryptoObj = getCrypto();
	if (!cryptoObj || !cryptoObj.getRandomValues) {
		return plain;
	}
	try {
		const iv = cryptoObj.getRandomValues(new Uint8Array(12));
		const ct = await subtle.encrypt(
			{ name: 'AES-GCM', iv },
			key,
			textEncoder.encode(plain),
		);
		return `enc:v1:${toBase64(iv.buffer)}:${toBase64(ct)}`;
	} catch (error) {
		console.warn('encryptString error:', error);
		return plain;
	}
}

export async function tryDecryptString(data: string, key: CryptoKey | null): Promise<string | null> {
	// Если текст не зашифрован (не начинается с enc:v1:), возвращаем как есть
	if (!data.startsWith('enc:v1:')) {
		return data;
	}
	// Если шифрование недоступно или ключ null, не можем расшифровать
	if (!key || !isEncryptionAvailable()) {
		return null;
	}
	const [, , ivB64, ctB64] = data.split(':');
	try {
		const subtle = getCryptoSubtle();
		if (!subtle) return null;
		if (typeof subtle !== 'object' || typeof subtle.decrypt !== 'function') return null;
		const iv = fromBase64(ivB64);
		const ct = fromBase64(ctB64);
		const plainBuf = await subtle.decrypt(
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

export async function importKeyFromB64(keyB64: string): Promise<CryptoKey | null> {
	if (!isEncryptionAvailable()) {
		return null;
	}
	const subtle = getCryptoSubtle();
	if (!subtle) {
		return null;
	}
	if (typeof subtle !== 'object' || typeof subtle.importKey !== 'function') {
		return null;
	}
	try {
		// Дополнительная проверка перед вызовом
		if (!subtle || typeof subtle !== 'object' || !subtle.importKey || typeof subtle.importKey !== 'function') {
			return null;
		}
		const raw = fromBase64(keyB64);
		// Финальная проверка прямо перед вызовом
		if (!subtle || !subtle.importKey) {
			return null;
		}
		return subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
	} catch (error) {
		console.warn('importKeyFromB64 error:', error);
		return null;
	}
}

export async function exportKeyToB64(key: CryptoKey | null): Promise<string | null> {
	if (!key || !isEncryptionAvailable()) return null;
	const subtle = getCryptoSubtle();
	if (!subtle) return null;
	if (typeof subtle !== 'object' || typeof subtle.exportKey !== 'function') return null;
	try {
		const raw = await subtle.exportKey('raw', key);
		return toBase64(raw);
	} catch (error) {
		console.warn('exportKeyToB64 error:', error);
		return null;
	}
}

// Utility: random human-safe passphrase (base64url-like)
export function generatePassphrase(len = 24): string {
	const cryptoObj = getCrypto();
	let bytes: Uint8Array;
	if (cryptoObj && cryptoObj.getRandomValues) {
		bytes = cryptoObj.getRandomValues(new Uint8Array(len));
	} else {
		// Fallback: используем Math.random
		bytes = new Uint8Array(len);
		for (let i = 0; i < len; i++) {
			bytes[i] = Math.floor(Math.random() * 256);
		}
	}
	const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789-_';
	let out = '';
	for (let i = 0; i < bytes.length; i++) {
		out += alphabet[bytes[i] % alphabet.length];
	}
	return out;
}

// Encrypt/Decrypt a short secret (like passphrase) using password
export async function encryptSecretWithPassword(secret: string, password: string) {
	if (!isEncryptionAvailable()) {
		// Если шифрование недоступно, возвращаем пустые значения
		return { saltB64: '', enc: secret };
	}
	const saltB64 = generateSaltB64();
	const key = await deriveKey(password, saltB64);
	if (!key) {
		return { saltB64: '', enc: secret };
	}
	const enc = await encryptString(secret, key);
	return { saltB64, enc };
}

export async function decryptSecretWithPassword(enc: string, password: string, saltB64: string) {
	if (!isEncryptionAvailable() || !saltB64) {
		// Если шифрование недоступно или нет соли, возвращаем как есть
		return enc;
	}
	const key = await deriveKey(password, saltB64);
	return await tryDecryptString(enc, key);
}


