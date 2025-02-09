import { useState } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createNewNote } from "../../redux/notes";

const CreateNoteForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [notebook_id, setNotebook_id] = useState("");
    const [errors, setErrors] = useState([]);

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
        } catch (error) {
            // console.log("Error creating note:", error);
            setErrors([error.toString()]);
        }
    }
    

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Create a new note</h1>
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
                    <button type="submit">Create Note</button>
                </div>
            </form>
        </div>
    )
}

export default CreateNoteForm;