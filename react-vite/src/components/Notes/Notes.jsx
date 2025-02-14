import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getNotesForNotebook } from '../../redux/notes';
import { fetchTagsForNote } from "../../redux/tags";
import "./Notes.css"

function Notes({ notebookId }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [, setSelectedNote] = useState(null);
    const noteDetails = useSelector(state => state.notes.Notes);
    const noteTags = useSelector(state => state.tags.noteTags);

    useEffect(() => {
        if (notebookId) {
            dispatch(getNotesForNotebook(notebookId));
        }
    }, [dispatch, notebookId]);

    useEffect(() => {
        Object.values(noteDetails).forEach(note => {
            dispatch(fetchTagsForNote(note.id)); 
        });
    }, [dispatch, noteDetails]);

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
                         {/* ✅ Display Tags if Available */}
                         <div className="note-tags">
                            {noteTags[note.id] && noteTags[note.id].length > 0 ? (
                                noteTags[note.id].map(tag => (
                                    <span key={tag.id} className="tag">
                                        {tag.name}
                                    </span>
                                ))
                            ) : (
                                <span className="no-tags">No Tags</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default Notes;