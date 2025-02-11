import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotesForNotebook } from '../../redux/notes';
import "./Notes.css"

function Notes({ notebookId }) {
    const dispatch = useDispatch();
    const noteDetails = useSelector(state => state.notes.Notes);

    useEffect(() => {
        if (notebookId) {
            dispatch(getNotesForNotebook(notebookId));
        }
    }, [dispatch, notebookId]);

    return (
        <div className="notes-grid">
            {Object.values(noteDetails).map((note) => (
                <div key={note.id} className="note-card">
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                </div>
            ))}
        </div>
    );
}


export default Notes;