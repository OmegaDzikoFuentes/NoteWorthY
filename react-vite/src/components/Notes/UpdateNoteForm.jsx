import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateNote, getNoteById } from "../../redux/notes";

const UpdateNoteForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { noteId } = useParams();
    const note = useSelector(state => state.notes.Notes.Note);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [notebook_id, setNotebook_id] = useState("");
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const loadNote = async () => {
            await dispatch(getNoteById(noteId));
        };
        loadNote();
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
            .then(() => {
                navigate(`/notes/${noteId}`)
            })
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
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Make changes to a current note</h1>
                <label>
                    Title
                    <input 
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        required
                    />
                </label>
                <label>
                    Content
                    <input 
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Content"
                        required
                    />
                </label>
                <label>
                    Notebook Id
                    <input 
                        type="number"
                        value={notebook_id}
                        onChange={(e) => setNotebook_id(e.target.value)}
                        placeholder="Id"
                        required
                    />
                </label>
                <div>
                    <button type="submit">Update Note</button>
                </div>
            </form>
        </div>
    )
}

export default UpdateNoteForm;