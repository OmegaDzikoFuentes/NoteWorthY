import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUserNotes } from '../../redux/notes';
import './UserNotes.css';
import { useNavigate } from 'react-router-dom';
import NoteDetails from './NoteDetails';

function UserNotes() {
    const dispatch = useDispatch();
    const noteDetails = useSelector(state => state.notes.Notes);
    const navigate = useNavigate()
    const [selectedNote, setSelectedNote] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(getCurrentUserNotes()).then(() => setIsLoaded(true))
    }, [dispatch])

    const handleNoteSelect = (note) => {
        setSelectedNote(note);
        navigate(`/notes/${note.id}`);
    }

    return (
        <>
            {isLoaded && (
                <div className='notes-container'>
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
                    <div className='note-details'>
                        <NoteDetails selectedNote={selectedNote} />
                    </div>
                </div>
            )}
        </>
    );
}

export default UserNotes;