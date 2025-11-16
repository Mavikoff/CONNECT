import Dexie, { type Table } from 'dexie';

export type Note = {
	id: string;
	title: string;
	contentMd: string;
	updatedAt: number; // ms timestamp
	createdAt: number; // ms timestamp
	folderId?: string | null;
};

class ObsidianDB extends Dexie {
	notes!: Table<Note, string>;

	constructor() {
		super('obsidianOnline');
		this.version(1).stores({
			notes: 'id, updatedAt, createdAt',
		});
	}
}

export const db = new ObsidianDB();

export async function createNote(params: {
	title?: string;
	contentMd?: string;
	folderId?: string | null;
}): Promise<Note> {
	const now = Date.now();
	const id = crypto.randomUUID();
	const note: Note = {
		id,
		title: params.title ?? 'New note',
		contentMd: params.contentMd ?? '',
		folderId: params.folderId ?? null,
		createdAt: now,
		updatedAt: now,
	};
	await db.notes.add(note);
	return note;
}

export async function getNotesByOwner(_ignored: string, max = 100): Promise<Note[]> {
	// ownerId больше не используется; возвращаем локальные заметки
	return db.notes
		.orderBy('updatedAt')
		.reverse()
		.limit(max)
		.toArray();
}

export async function getAllNotes(max = 100): Promise<Note[]> {
	return db.notes.orderBy('updatedAt').reverse().limit(max).toArray();
}

export async function getNote(noteId: string): Promise<Note | null> {
	const n = await db.notes.get(noteId);
	return n ?? null;
}

export async function updateNote(noteId: string, updates: Partial<Pick<Note, 'title' | 'contentMd' | 'folderId'>>): Promise<void> {
	await db.notes.update(noteId, { ...updates, updatedAt: Date.now() });
}

export async function deleteNote(noteId: string): Promise<void> {
	await db.notes.delete(noteId);
}


