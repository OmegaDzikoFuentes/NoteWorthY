import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserNotes } from "../../redux/notes";
import {
  fetchTagsForNote,
  fetchCurrentUserTags,
  addTagToNote,
} from "../../redux/tags";
import { useModal } from "../../context/Modal";
import "./TagsModal.css";

const TagsModal = () => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const notes = useSelector((state) => state.notes.Notes);

  const [newTag, setNewTag] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState("");

  useEffect(() => {
    dispatch(getCurrentUserNotes());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedNoteId && Object.keys(notes).length > 0) {
      setSelectedNoteId(Object.keys(notes)[0]);
    }
  }, [notes, selectedNoteId]);

  const handleApply = async () => {
    if (newTag.trim() && selectedNoteId) {
      try {
        const noteId = parseInt(selectedNoteId);
        await dispatch(addTagToNote({ noteId, tagName: newTag.trim() }));
        await dispatch(fetchTagsForNote(noteId));
        await dispatch(fetchCurrentUserTags());
        closeModal();
      } catch (error) {
        console.error("Error applying tag:", error);
      }
    }
  };

  return (
    <div className="tags-modal">
      <h2 className="tags-modal-header">Add a Tag</h2>
      <p className="tags-modal-text">Create a new tag and attach it to any note.</p>

      <input
        type="text"
        className="tag-input-modal"
        placeholder="Enter tag name..."
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
      />

      <select
        className="tag-note-dropdown"
        value={selectedNoteId}
        onChange={(e) => setSelectedNoteId(e.target.value)}
      >
        <option value="">Select a Note</option>
        {Object.values(notes).length > 0 ? (
          Object.values(notes).map((note) => (
            <option key={note.id} value={note.id}>
              {note.title}
            </option>
          ))
        ) : (
          <option disabled>No Notes Available</option>
        )}
      </select>

      <div className="tags-modal-buttons">
        <button
          onClick={handleApply}
          className="tags-modal-apply"
          disabled={!selectedNoteId || !newTag.trim()}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default TagsModal;
