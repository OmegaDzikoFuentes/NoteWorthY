import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updateNote, getNoteById } from "../../redux/notes";
import { getNotebooks } from "../../redux/notebook";
import "./NotesInNotebook.css"
import Notes from "./Notes";

const NotesInNotebook = () => {
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    const { noteId } = useParams();
    const { notebookId } = useParams();
    const note = useSelector(state => state.notes.Notes);
    const notebook = useSelector(state => state.notebooks.allNotebooks)
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [notebook_id, setNotebook_id] = useState("");
    const [, setErrors] = useState([]);

    useEffect(() => {
        dispatch(getNoteById(noteId));
        dispatch(getNotebooks())
    }, [dispatch, noteId]);

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
            setNotebook_id(note.notebook_id);
        }
    }, [note])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const updatedNote = {
            title,
            content,
            notebook_id: parseInt(notebook_id)
        };

        return dispatch(updateNote(noteId, updatedNote))
            .catch((res) => {
                if (res && res.errors) {
                    setErrors(res.errors);
                }
            });
    }

    if (!note) {
        return <div>Loading...</div>;
    }

    return (
        <div className="notebook-notes-note-container">
            <div className="notebook-notes-container">
                <h2>Notes</h2>
                <Notes notebookId={notebookId} />
            </div>
            <form onSubmit={handleSubmit} className="notebook-notes-note-form-container">
                <div>
                    <h1 className="notebook-notes-note-title">Make changes to {note.title}</h1>
                </div>
                <div className="notebook-notes-note-label-container">
                    <label className="notebook-notes-note-label">
                        Title
                        <input className="notebook-notes-note-title-input"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                            required
                        />
                    </label>
                </div>
                <div className="notebook-notes-note-label-container">
                    <label className="notebook-notes-note-label">
                        Content
                        <textarea 
                            className="notebook-notes-note-content-input"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Content"
                            required
                            rows={10}
                        />
                    </label>
                </div>
                <div className="notebook-notes-note-label-container">
                    <label className="notebook-notes-note-label">
                        Select Notebook
                        <select className="notebook-notes-note-dropdown"
                            value={notebook_id}
                            onChange={(e) => setNotebook_id(e.target.value)}
                            required
                        >
                            <option value="">Select a notebook</option>
                            {Object.values(notebook).map((nb, index) => (
                                <option key={index} value={nb.id}>
                                    {nb.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="notebook-notes-note-button-container">
                    <button type="submit" className="notebook-notes-note-button">Update Note</button>
                </div>
            </form>
        </div>
    )
}

export default NotesInNotebook;