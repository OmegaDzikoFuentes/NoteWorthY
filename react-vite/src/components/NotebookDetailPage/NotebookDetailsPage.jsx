import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getNotebookById } from "../../redux/notebook";
import "./NotebookDetailsPage.css"

const NotebookDetailsPage = () => {
  const { notebookId } = useParams();
  const dispatch = useDispatch();
  const notebook = useSelector((state) => state.notebooks.allNotebooks[notebookId]);

  useEffect(() => {
    dispatch(getNotebookById(notebookId));
  }, [dispatch, notebookId]);

  if (!notebook) return <p>Loading notebook...</p>;

  return (
    <div className="notebook-details-page-container">
      <div className="notebook-details-header-box">
        <h1 className="notebook-details-header">{notebook.name}</h1>
      </div>
      <div className="notebook-details-info">
        <p className="notebook-details-text">
          <strong>Created at:</strong>{" "}
          {new Date(notebook.created_at).toLocaleString()}
        </p>
        <p className="notebook-details-text">
          <strong>Last updated:</strong>{" "}
          {new Date(notebook.updated_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default NotebookDetailsPage;
