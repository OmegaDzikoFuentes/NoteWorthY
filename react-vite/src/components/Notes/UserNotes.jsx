import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUserNotes, updateNote } from '../../redux/notes';
import { fetchNotesByTag } from '../../redux/tags';
import './UserNotes.css';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getNotebooks } from '../../redux/notebook';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteNote from './DeleteNote';
import Tags from "../Tags/Tags";

function UserNotes() {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const noteDetails = useSelector(state => state.notes.Notes);
    const notesByTag = useSelector(state => state.tags.notesByTag);
    const notebooks = useSelector(state => state.notebooks.allNotebooks);
    const navigate = useNavigate();
    const { noteId } = useParams();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [notebook_id, setNotebook_id] = useState("");
    const [selectedNote, setSelectedNote] = useState(null)
    const [, setErrors] = useState([]);
    const [, setIsLoaded] = useState(false);
    const [, setShowModal] = useState(false);
   
    const selectedTags = new Set(searchParams.getAll("tag"));

    useEffect(() => {
        dispatch(getCurrentUserNotes()).then(() => setIsLoaded(true));
        dispatch(getNotebooks())
    }, [dispatch])

    useEffect(() => {
        if (selectedTags.size > 0) {
            Array.from(selectedTags).forEach(tag => {
                if (!notesByTag[tag]) dispatch(fetchNotesByTag(tag));
            });
        } else {
            dispatch(getCurrentUserNotes());
        }
    }, [dispatch, Array.from(selectedTags).join(",")]);

     const displayedNotes = selectedTags.size > 0
        ? Object.values(noteDetails).filter(note =>
            Array.from(selectedTags).every(tag => notesByTag[tag]?.some(filteredNote => filteredNote.id === note.id))
        )
        : Object.values(noteDetails);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const updatedNote = {
            title,
            content,
            notebook_id: parseInt(notebook_id)
        };

        return dispatch(updateNote(noteId, updatedNote))
            .then(() => {
                dispatch(getCurrentUserNotes());
            })
            .catch((res) => {
                if (res && res.errors) {
                    setErrors(res.errors);
                }
            });
    }

    const handleNoteSelect = (note) => {
        setSelectedNote(note);
        setTitle(note.title);
        setContent(note.content);
        setNotebook_id(note.notebook_id);
        const params = new URLSearchParams();
        selectedTags.forEach(tag => params.append("tag", tag)); 
    
        navigate(`/notes/${note.id}?${params.toString()}`);
    };
    

    const handleDelete = async () => {
        await dispatch(getCurrentUserNotes());
        setSelectedNote(null);
    }

    useEffect(() => {
        if (selectedNote) {
            setTitle(selectedNote.title);
            setContent(selectedNote.content);
            setNotebook_id(selectedNote.notebook_id);
        }
    }, [selectedNote])

    const removeTagFilter = (tagToRemove) => {
        const newTags = Array.from(selectedTags).filter(tag => tag !== tagToRemove);
        setSearchParams(newTags.length > 0 ? newTags.map(tag => ["tag", tag]) : {});
    };

    const clearTagFilter = () => {
        setSearchParams({}); 
    };

    return (
         <div className="notebook-notes-note-container">
            <div className="notebook-notes-container">
            <h2>Notes</h2>
                
            {selectedTags.size > 0 && (
                <div className="filter-banner">
                    <span>Filtered by Tags:</span>
                    {Array.from(selectedTags).map(tag => (
                        <span key={tag} className="filter-tag">
                            {tag} <button onClick={() => removeTagFilter(tag)}>✖</button>
                        </span>
                    ))}
                    <button onClick={clearTagFilter} className="clear-filter-btn">Clear Filter ✖</button>
                </div>
            )}

                {displayedNotes.length > 0 ? (
                    displayedNotes.map((note) => (
                        <div
                            key={note.id}
                            className="notebook-note-card"
                            onClick={() => handleNoteSelect(note)}
                        >
                            <h3>{note.title}</h3>
                            <p>{note.content}</p>
                            <Tags noteId={note.id} showInput={false} />
                        </div>
                    ))
                ) : (
                    <p>No notes found for this tag.</p>
                )}
            </div>
            {selectedNote && (
                <form onSubmit={handleSubmit} className="notebook-notes-note-form-container">
                    <div>
                        <h1 className="notebook-notes-note-title">{selectedNote.title}</h1>
                    </div>
                    <div className="notebook-notes-note-label-container">
                        <label className="notebook-notes-note-label">
                            Title
                            <input className="notebook-notes-note-title-input"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                                required
                            />
                        </label>
                    </div>
                    <div className="notebook-notes-note-label-container">
                        <label className="notebook-notes-note-label">
                            Content
                            <textarea
                                className="notebook-notes-note-content-input"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Content"
                                required
                                rows={10}
                            />
                        </label>
                    </div>
                    <div className="notebook-notes-note-label-container">
                        <label className="notebook-notes-note-label">
                            Select Notebook
                            <select className="notebook-notes-note-dropdown"
                                value={notebook_id}
                                onChange={(e) => setNotebook_id(e.target.value)}
                                required
                            >
                                <option value="">Select a notebook</option>
                                {Object.values(notebooks).map((nb, index) => (
                                    <option key={index} value={nb.id}>
                                        {nb.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div className="notebook-notes-note-button-container">
                        <button type="submit" className="notebook-notes-note-button">Save</button>
                        <button className="note-details-delete">
                            <OpenModalMenuItem
                                itemText="Delete"
                                onItemClick={() => setShowModal(true)}
                                modalComponent={<DeleteNote noteId={noteId} />}
                                onModalClose={() => handleDelete()}
                            />
                        </button>
                    </div>
                    <Tags noteId={selectedNote.id} showInput={true} />
                </form>
            )}
        </div>
    )
}

export default UserNotes;