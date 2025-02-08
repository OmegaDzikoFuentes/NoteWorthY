import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNotebooks, createNotebook, updateNotebook, deleteNotebook } from "../../redux/notebook"

const NotebookPage = () => {
  const dispatch = useDispatch();
  const { allNotebooks, loading, error } = useSelector((state) => state.notebooks);
  const [name, setName] = useState("");
  const [editingNotebook, setEditingNotebook] = useState(null);

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

  if (loading) return <p className="loading-placeholder">Loading...</p>;
  if (error) return <p className="errors">{error}</p>;

  return (
    <div className="Notebook">
      <h1 className="NotebookPage-title">Notebooks</h1>

      <form
        onSubmit={editingNotebook ? handleUpdateNotebook : handleCreateNotebook}
        className="Notebook-edit-form"
      >
        <h2 className="Notebook-creator-editor">
          {editingNotebook ? "Edit Notebook" : "Create a Notebook"}
        </h2>
        <input
          type="text"
          placeholder="Notebook Name"
          className="Notebook-name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="submit"
          className="Notebook-submit-button"
        >
          {editingNotebook ? "Update Notebook" : "Create Notebook"}
        </button>
      </form>

      <h2 className="current-Notebook">Your Notebooks</h2>
      {Object.keys(allNotebooks).length > 0 ? (
        <ul className="Notebook-actions">
          {Object.values(allNotebooks).map((notebook) => (
            <li key={notebook.id} className="">
              <div>
                <h3 className="Notebook-name">{notebook.name}</h3>
              </div>
              <div>
                <button
                  onClick={() => handleEditClick(notebook)}
                  className="Notebook-edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteNotebook(notebook.id)}
                  className="Notebook-delete-button"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="Empty-Notebooks-error">No notebooks found.</p>
      )}
    </div>
  );
};

export default NotebookPage;
