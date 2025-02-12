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
                        <h2>{selectedNote.title}</h2>
                        <p>{selectedNote.content}</p>
                    </div>
                    <div>
                        <button className='update' onClick={() => navigate(`/notes/${noteId}/edit`)}>Update Note</button>
                        <button className="delete">
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
