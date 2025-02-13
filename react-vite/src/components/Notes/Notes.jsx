import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getNotesForNotebook } from '../../redux/notes';
import "./Notes.css"

function Notes({ notebookId }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [, setSelectedNote] = useState(null);
    const noteDetails = useSelector(state => state.notes.Notes);

    useEffect(() => {
        if (notebookId) {
            dispatch(getNotesForNotebook(notebookId));
        }
    }, [dispatch, notebookId]);

    const handleNoteSelect = (note) => {
        setSelectedNote(note);
        navigate(`/notebooks/${notebookId}/note/${note.id}`)
    };

    return (
        <div>
            <div className="notes-grid">
                {Object.values(noteDetails).map((note, index) => (
                    <div 
                        key={index} 
                        className="note-card"
                        onClick={() => handleNoteSelect(note)}
                    >
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default Notes;