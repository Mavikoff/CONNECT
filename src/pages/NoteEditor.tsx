import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNote, updateNote } from '../lib/db';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExt from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useDebouncedCallback } from 'use-debounce';

export default function NoteEditor() {
	const { id } = useParams<{ id: string }>();
	const [title, setTitle] = useState('');
	const [loading, setLoading] = useState(true);

	const editor = useEditor({
		extensions: [
			StarterKit,
			LinkExt.configure({ openOnClick: true }),
			Placeholder.configure({ placeholder: 'Начните писать…' }),
		],
		content: '',
		editable: true,
	});

	useEffect(() => {
		let active = true;
		(async () => {
			if (!id) return;
			setLoading(true);
			const data = await getNote(id);
			if (data && active) {
				setTitle(data.title || '');
				editor?.commands.setContent(data.contentMd || '');
			}
			setLoading(false);
		})();
		return () => { active = false; };
	}, [id, editor]);

	const debouncedSave = useDebouncedCallback(async (t: string, md: string) => {
		if (!id) return;
		await updateNote(id, { title: t, contentMd: md });
	}, 600);

useEffect(() => {
	if (!editor) return;
	const handler = () => {
		debouncedSave(title, editor.getHTML());
	};
	editor.on('update', handler);
	return () => { editor.off('update', handler); };
}, [editor, title, debouncedSave]);

	useEffect(() => {
		debouncedSave(title, editor?.getHTML() ?? '');
	}, [title]);

	if (loading) {
		return <div className="p-4">Загрузка…</div>;
	}

	return (
		<div className="min-h-screen">
			<div className="sticky top-0 z-10 backdrop-blur bg-white/50 dark:bg-gray-900/50 border-b">
				<div className="max-w-5xl mx-auto p-3 flex items-center gap-2">
					<Link to="/app" className="px-3 py-2 rounded-md border">← Назад</Link>
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Заголовок"
						className="flex-1 px-3 py-2 rounded-md bg-transparent border border-gray-300 dark:border-gray-600"
					/>
				</div>
			</div>
			<div className="max-w-5xl mx-auto p-4">
				<div className="card-surface p-4">
					<EditorContent editor={editor} className="tiptap" />
				</div>
			</div>
		</div>
	);
}


