import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DeleteNote from "./DeleteNote";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import "./NoteDetails.css";

function NoteDetails({ selectedNote }) {
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const [, setShowModal] = useState(false);
    const { noteId } = useParams();

    if (selectedNote && isLoaded === false) setIsLoaded(true);

    return (
        <>
            {isLoaded && (
                <div className="note-details-container">
                    <div className="note-container">
                        <div className="note-details-title-container">
                            <h2 className="note-details-title">{selectedNote.title}</h2>
                        </div>
                        <div className="note-details-content-container">
                            <p className="note-details-content">{selectedNote.content}</p>
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
                </div>
            )}
        </>
    );
}

export default NoteDetails;
