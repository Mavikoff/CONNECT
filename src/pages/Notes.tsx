import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNote, getAllNotes } from '../lib/db';
import type { Note } from '../lib/db';
import NoteListItem from '../components/NoteListItem';
import ThemeToggle from '../components/ThemeToggle';

export default function Notes() {
	const [notes, setNotes] = useState<Note[]>([]);
	const [loading, setLoading] = useState(true);
	const [title, setTitle] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			setLoading(true);
			const list = await getAllNotes(200);
			setNotes(list);
			setLoading(false);
		})();
	}, []);

	async function handleCreate() {
		const newNote = await createNote({ title: title || 'New note' });
		setTitle('');
		navigate(`/app/notes/${newNote.id}`);
	}

	return (
		<div className="min-h-screen p-4 max-w-5xl mx-auto space-y-4">
			<header className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Мои заметки</h1>
				<div className="flex items-center gap-2">
					<ThemeToggle />
				</div>
			</header>

			<div className="flex gap-2">
				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Название новой заметки"
					className="flex-1 px-3 py-2 rounded-md bg-transparent border border-gray-300 dark:border-gray-600"
				/>
				<button onClick={handleCreate} className="px-3 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black">Создать</button>
			</div>

			{loading ? (
				<div className="text-sm text-gray-500">Загрузка…</div>
			) : (
				<div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
					{notes.map((n) => (
						<NoteListItem key={n.id} note={n} />
					))}
				</div>
			)}
		</div>
	);
}


