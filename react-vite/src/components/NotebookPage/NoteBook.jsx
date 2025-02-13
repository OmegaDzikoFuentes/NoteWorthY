import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getNotebooks,
  createNotebook,
  updateNotebook,
  deleteNotebook,
} from "../../redux/notebook";
import "./Notebook.css";

const NotebookPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allNotebooks, loading, error } = useSelector(
    (state) => state.notebooks
  );
  const [name, setName] = useState("");
  const [editingNotebook, setEditingNotebook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getNotebooks());
  }, [dispatch]);

  const handleCreateNotebook = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await dispatch(createNotebook({ name }));
    setName("");
  };

  const handleUpdateNotebook = async (e) => {
    e.preventDefault();
    if (!editingNotebook || !name.trim()) return;
    await dispatch(updateNotebook(editingNotebook.id, { name }));
    setName("");
    setEditingNotebook(null);
  };

  const handleEditClick = (notebook) => {
    setEditingNotebook(notebook);
    setName(notebook.name);
  };

  const handleDeleteNotebook = async (notebookId) => {
    await dispatch(deleteNotebook(notebookId));
  };

  const handleNotebookClick = (notebookId) => {
    navigate(`/notebooks/${notebookId}`);
  };

  const filteredNotebooks = Object.values(allNotebooks).filter((notebook) =>
    notebook.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="notebooks-page-container">
        <div className="notebooks-header-box">
          <h1 className="notebooks-header">My Notebooks</h1>
        </div>
        <div className="notebook-form-container">
          <form
            onSubmit={
              editingNotebook ? handleUpdateNotebook : handleCreateNotebook
            }
            className="notebook-edit-form"
          >
            <h2 className="notebook-creator-editor">
              {editingNotebook ? "Edit Notebook" : "Create a Notebook"}
            </h2>
            <input
              type="text"
              placeholder="Notebook Name"
              className="notebook-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button type="submit" className="notebook-submit-button">
              {editingNotebook ? "Update Notebook" : "Create Notebook"}
            </button>
          </form>
        </div>
        <div className="notebooks-search-container">
          <h4 className="notebook-count">
            {filteredNotebooks.length}{" "}
            {filteredNotebooks.length === 1 ? "notebook" : "notebooks"}
          </h4>
          <div className="new-notebook-search">
            <input
              className="notebooks-page-search"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="notebooks-list-container">
          <div className="notebooks-list-headers">
            <p className="notebooks-list-header-text notebooks-list-title">
              Title
            </p>
          </div>
          <div className="notebooks-list">
            {loading ? (
              <p className="loading-placeholder">Loading...</p>
            ) : error ? (
              <p className="errors">{error}</p>
            ) : filteredNotebooks.length > 0 ? (
              filteredNotebooks.map((notebook) => (
                <div key={notebook.id} className="notebooks-list-item">
                  <div className="notebooks-list-box-1">
                    <div
                      className="notebooks-list-text"
                      onClick={() => handleNotebookClick(notebook.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <p className="notebooks-list-item-title">
                        {notebook.name}
                      </p>
                    </div>
                  </div>
                  <div className="notebook-buttons-container">
                    <button
                      onClick={() => handleEditClick(notebook)}
                      className="notebooks-list-edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteNotebook(notebook.id)}
                      className="notebooks-list-delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="Empty-Notebooks-error">No notebooks found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotebookPage;
