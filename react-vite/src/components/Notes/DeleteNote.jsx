import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { useNavigate } from 'react-router-dom';
import { deleteNote } from '../../redux/notes';
import { getCurrentUserNotes } from '../../redux/notes';
import "./DeleteNote.css";

function DeleteNote({ noteId }) {
    const { closeModal } = useModal();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClick = async () => {
        await dispatch(deleteNote(noteId))
            .then(() => {
                navigate(`/notes/current`)
            });
        await dispatch(getCurrentUserNotes());
        closeModal();
    }

    const handleCancel = () => {
        closeModal();
    };

    return (
        <div className='delete-note-container'>
            <h1>Confirm Delete</h1>
            <div className='button-container'>
                <button className='yes-button' onClick={handleClick}>Yes (Delete Note)</button>
                <button className='no-button' onClick={handleCancel}>No (Cancel)</button>
            </div>
        </div>
        
    )
}

export default DeleteNote;