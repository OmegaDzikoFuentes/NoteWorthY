import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserNotes } from '../../redux/notes';

function Notes() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const noteDetails = useSelector(state => state.notes.Notes);

    useEffect(() => {
        dispatch(getCurrentUserNotes());
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


export default Notes;