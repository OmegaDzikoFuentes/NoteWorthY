import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DeleteNote from "./DeleteNote";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import "./NoteDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchTagsForNote } from "../../redux/tags";
import Tags from "../Tags/Tags"

function NoteDetails({ selectedNote }) {
    const { noteId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const notes = useSelector(state => state.notes.Notes);
    const [isLoaded, setIsLoaded] = useState(false);
    const [, setShowModal] = useState(false);

    useEffect(() => {
        if (noteId) {
            dispatch(fetchTagsForNote(noteId)); 
        }
    }, [dispatch, noteId]);

    const handleNoteTitleLogic = () => {
        if (!selectedNote) {
            return Object.values(notes).find(note => note.id === parseInt(noteId));
        }
    }

    const noteToDisplay = selectedNote || handleNoteTitleLogic();

    if (noteToDisplay && isLoaded === false) setIsLoaded(true);

    const handleAddTag = (e) => {
        if (e.key === "Enter" && newTag.trim()) {
            dispatch(addTagToNote(noteId, newTag.trim()));
            setNewTag(""); // Reset input field
        }
    };

    const handleRemoveTag = (tagId) => {
        dispatch(removeTagFromNote(noteId, tagId));
    };

    return (
        <>
            {isLoaded && (
                <div className="note-details-container">
                    <div className="note-container">
                        <div className="note-details-title-container">
                            <h2 className="note-details-title">{noteToDisplay.title}</h2>
                        </div>
                        <div className="note-details-content-container">
                            <p className="note-details-content">{noteToDisplay.content}</p>
                        </div>
                    </div>
                    <div className="note-details-button-container">
                        <button className='note-details-update' onClick={() => navigate(`/notes/${noteId}/edit`)}>Update Note</button>
                        <button className="note-details-delete">
                            <OpenModalMenuItem
                                itemText="Delete"
                                onItemClick={() => setShowModal(true)}
                                modalComponent={<DeleteNote noteId={noteId} />}
                            />
                        </button>
                    </div>
                    <Tags noteId={noteId} showInput={true} />
                </div>
            )}
        </>
    );
}

export default NoteDetails;
