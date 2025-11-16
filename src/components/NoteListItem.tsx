import { Link } from 'react-router-dom';
import type { Note } from '../lib/db';

export default function NoteListItem({ note }: { note: Note }) {
	return (
		<Link
			to={`/app/notes/${note.id}`}
			className="block p-3 card-surface hover:opacity-90 transition"
		>
			<div className="text-sm text-gray-500">
				{note.updatedAt ? new Date(note.updatedAt).toLocaleString() : ''}
			</div>
			<div className="font-medium line-clamp-1">{note.title || 'Без названия'}</div>
			<div className="text-sm text-gray-500 line-clamp-2">{note.contentMd}</div>
		</Link>
	);
}


