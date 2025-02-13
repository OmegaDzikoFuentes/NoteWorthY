import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getNotebookById } from "../../redux/notebook";
// added this to display notes
import Notes from "../Notes/Notes";
import "./NoteBookDetailsPage.css";

const NotebookDetailsPage = () => {
  const { notebookId } = useParams();
  const dispatch = useDispatch();
  const notebook = useSelector((state) => state.notebooks.allNotebooks[notebookId]);

  useEffect(() => {
    dispatch(getNotebookById(notebookId));
  }, [dispatch, notebookId]);

  if (!notebook) return <p>Loading notebook...</p>;

  return (
    <div className="notebook-container">
      <div className="notebook-details">
        <h1>{notebook.name}</h1>
        <p>Created at: {new Date(notebook.created_at).toLocaleString()}</p>
        <p>Last updated: {new Date(notebook.updated_at).toLocaleString()}</p>
      </div>
      {/* added notes to be displayed on the left */}
      <div className="notes-panel">
        <h2>{notebook.name}</h2>
        <Notes notebookId={notebookId} />
      </div>
    </div>
  );
};

export default NotebookDetailsPage;
