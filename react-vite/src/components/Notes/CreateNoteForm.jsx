import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createNewNote } from "../../redux/notes";
import { getNotebooks } from "../../redux/notebook";
import "./CreateNoteForm.css"

const CreateNoteForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const notebook = useSelector(state => state.notebooks.allNotebooks)
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [notebook_id, setNotebook_id] = useState("");
    const [, setErrors] = useState([]);

    useEffect(() => {
        dispatch(getNotebooks())
    }, [dispatch])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const newNote = {
            title,
            content,
            notebook_id: parseInt(notebook_id)
        };

        try {
            const createdNote = await dispatch(createNewNote(newNote));
            navigate(`/notes/${createdNote.id}`);
        } catch (error) {
            setErrors([error.toString()]);
        }
    }

    const isFormValid = () => {
        return title.trim() && content.trim() && notebook_id;
      }

    return (
        <div className="create-note-container">
            <form onSubmit={handleSubmit} className="create-note-form-container">
                <div>
                    <h1 className="create-note-title">Create a new note!</h1>
                </div>
                <div className="create-note-label-container">
                    <label className="create-note-label">
                        Title
                        <input className="create-note-title-input"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                            required
                        />
                    </label>
                </div>
                <div className="create-note-label-container">
                    <label className="create-note-label">
                        Content
                        <textarea
                            className="create-note-content-input"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Content"
                            required
                            rows={10}
                        />
                    </label>
                </div>
                <div className="create-note-label-container">
                    <label className="create-note-label">
                        Select Notebook
                        <select className="create-note-dropdown"
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
                <div className="create-note-button-container">
                    <button
                        type="submit"
                        className="create-note-button"
                        disabled={!isFormValid()}
                        style={{
                            opacity: isFormValid() ? 1 : 0.5,
                            cursor: isFormValid() ? 'pointer' : 'not-allowed'
                        }}
                    >
                        Save
                    </button>                </div>
            </form>
        </div>
    )
}

export default CreateNoteForm;