import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { useNavigate } from 'react-router-dom';
import { deleteNote } from '../../redux/notes';

function DeleteNote({ noteId }) {
    const { closeModal } = useModal();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(deleteNote(noteId))
            .then(() => {
                navigate(`/notes/current`)
            });
        closeModal();
    }

    const handleCancel = () => {
        closeModal();
    };

    return (
        <div>
            <h1>Confirm Delete</h1>
            <div className='button-container'>
                <button className='yes-button' onClick={handleClick}>Yes (Delete Note)</button>
                <button className='no-button' onClick={handleCancel}>No (Cancel)</button>
            </div>
        </div>
        
    )
}

export default DeleteNote;