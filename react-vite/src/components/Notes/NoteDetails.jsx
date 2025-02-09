import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getNoteById } from "../../redux/notes";
// deleted getCurrentUserNotes from ../../redux/notes cuz it was unused variable
// add later when you need
import UpdateNoteForm from './UpdateNoteForm';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';

function NoteDetails() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const noteDetails = useSelector((state) => state.notes.Notes);
    const [, setShowModal] = useState(false);
    const { noteId } = useParams();

    useEffect(() => {
        dispatch(getNoteById(noteId));
    }, [dispatch, noteId]);
    //added noteId to the dependency array cuz error in Vite

    return (
        <div>
            {Object.values(noteDetails).map((note, index) => (
                <div key={index}>
                    <li>{note.title}</li>
                    <li>{note.content}</li>
                    <li>{note.notebook_id}</li>
                </div>
            ))}
            <div>
                <button className='update' onClick={() => navigate(`/notes/${noteId}/edit`)}>Update Note</button>
            </div>
        </div>

    );
}

export default NoteDetails;
