import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// Delete usedNavigate from "react-router-dom" cuz it was unused variable
import { getNoteById } from "../../redux/notes";
// deleted getCurrentUserNotes from ../../redux/notes cuz it was unused variable
// add later when you need

function NoteDetails() {
  const dispatch = useDispatch();
  //const navigate = useNavigate();
  const noteDetails = useSelector((state) => state.notes.Notes);
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
    </div>
  );
}

export default NoteDetails;
