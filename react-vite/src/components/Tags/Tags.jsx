import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUserTags, fetchTagsForNote, addTagToNote, removeTagFromNote } from "../../redux/tags";
import "./Tags.css";

const Tags = ({  noteId, showInput = true }) => {
    const dispatch = useDispatch();
    const noteTags = useSelector(state => state.tags.noteTags[noteId] || []);
    const [newTag, setNewTag] = useState("");

    useEffect(() => {
        if (noteId && !isNaN(parseInt(noteId))) {
            dispatch(fetchTagsForNote(noteId))
                .catch((error) => console.error(`Error fetching tags for note ${noteId}:`, error));
        }
    }, [dispatch, noteId]);

    const handleAddTag = async (e) => {
        if (e.key === "Enter" && newTag.trim()) {
            await dispatch(addTagToNote({ noteId, tagName: newTag.trim() }));
            setNewTag(""); 
            dispatch(fetchTagsForNote(noteId));
        }
    };

    const handleRemoveTag = async (tagName) => {
        if (!tagName || typeof tagName !== "string") return;

        try {
            await dispatch(removeTagFromNote({ noteId, tagName }));
            await dispatch(fetchTagsForNote(noteId));
            await dispatch(fetchCurrentUserTags());
        } catch (error) {
            console.error("Error removing tag:", error);
        }
    };

    return (
        <div className="tags-container">
            {showInput && (
                <div className="tags-input-container">
                    <label className="tags-title">Tags:</label>
                    <input
                        type="text"
                        className="tag-input"
                        placeholder="Add a tag and press Enter"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={handleAddTag}
                    />
                </div>
            )}
    
            {noteTags.length > 0 && (
                <div className="tags-list">
                    {noteTags.map(tag => (
                        <span key={tag.id} className="tag">
                            {tag.name}
                            <button onClick={() => handleRemoveTag(tag.name)}>✖</button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tags;
