import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrentUserNotes, getNoteById } from '../../redux/notes';

function NoteDetails() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const noteDetails = useSelector(state => state.notes.Notes);
    const { noteId } = useParams();

    useEffect(() => {
        dispatch(getNoteById(noteId));
    }, [dispatch]);

    return (
        <div>
            {Object.values(noteDetails).map((note, index) => (
                <div key={index}>
                    <li>{note.title}</li>
                    <li>{note.content}</li>
                    <li>{note.notebook_id}</li>
                </div>
            ))}
        </div>
    )
}


export default NoteDetails;