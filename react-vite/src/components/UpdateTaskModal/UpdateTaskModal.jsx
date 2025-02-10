import "./UpdateTaskModal.css";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { csrfFetch } from "../../redux/csrf";
import { useModal } from "../../context/Modal";
import { updateTask, getUserTasks } from "../../redux/task";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteTaskModal from "../DeleteTaskModal";

function UpdateTaskModal({ taskId, task, onTaskUpdated }) {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const [notebooks, setNotebooks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = date.getUTCDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    title: task.title || "",
    description: task.description || "",
    due_date: task.due_date ? formatDate(task.due_date) : "",
    notebook_id: task.notebook_id || "",
  });

  // Get all user notebooks for now
  const getUserNotebooks = async () => {
    try {
      const response = await csrfFetch("/api/notebooks/notebooks", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notebooks");
      }

      const data = await response.json();

      const sortedNotebooks = data.notebooks.sort((a, b) => {
        return new Date(a.created_at) - new Date(b.created_at);
      });

      setNotebooks(sortedNotebooks);
      setFormData((prevFormData) => ({
        ...prevFormData,
        notebook_id:
          task.notebook_id ||
          (sortedNotebooks.length > 0 ? sortedNotebooks[0].id : ""),
      }));
      setIsLoaded(true);
    } catch (error) {
      console.error("Error fetching notebooks:", error);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    getUserNotebooks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = {
      id: taskId,
      title: formData.title,
      notebook_id: formData.notebook_id,
    };

    if (formData.description) {
      submissionData.description = formData.description;
    }

    if (formData.due_date) {
      const date = new Date(formData.due_date);
      const formattedDueDate = `${(date.getUTCMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date
        .getUTCDate()
        .toString()
        .padStart(2, "0")}/${date.getUTCFullYear()}`;
      submissionData.due_date = formattedDueDate;
    }

    try {
      await dispatch(updateTask(taskId, submissionData));
      await dispatch(getUserTasks()); // Fetch the updated list of tasks
      setModalContent(null);
      if (onTaskUpdated) {
        onTaskUpdated();
      }
    } catch (e) {
      console.log("Error updating task:", e);
      return e;
    }
  };

  const isDueDateInvalid =
    formData.due_date &&
    new Date(formData.due_date).setHours(0, 0, 0, 0) <
      new Date().setHours(0, 0, 0, 0);

  return (
    <>
      {isLoaded && (
        <div className="update-task-form-container">
          <h2 className="update-task-header">Update Task</h2>
          <form className="update-task-form" onSubmit={handleSubmit}>
            <label htmlFor="notebooks" className="input-label notebook-select">
              Notebook:
              <select
                name="notebook_id"
                id="notebooks"
                value={formData.notebook_id}
                onChange={handleChange}
              >
                {notebooks.map((notebook) => (
                  <option key={notebook.id} value={notebook.id}>
                    {notebook.name}
                  </option>
                ))}
              </select>
            </label>
            {formData.title.length <= 0 ? (
              <p className="task-title-requirement">Title Is Required</p>
            ) : null}
            <label className="input-label title-input">
              Title:
              <input
                className="update-task-input"
                type="text"
                placeholder="Title..."
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </label>
            <label className="input-label">
              Description:
              <textarea
                className="update-task-ta"
                placeholder="Description..."
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </label>
            <label className="input-label due-date-input">
              Due Date:
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
              />
            </label>
            {isDueDateInvalid ? (
              <p className="task-title-requirement">
                Due Date Can't Be Before Today
              </p>
            ) : null}
            <div className="task-update-buttons">
              <OpenModalButton
                buttonText="Delete Task"
                className="delete-task-button"
                modalComponent={<DeleteTaskModal taskId={taskId} />}
              />
              <button
                type="submit"
                disabled={formData.title.length <= 0 || isDueDateInvalid}
                className="update-task-btn"
                style={{
                  backgroundColor:
                    formData.title.length <= 0 || isDueDateInvalid
                      ? "#ccc"
                      : "#b378ee",
                  cursor:
                    formData.title.length <= 0 || isDueDateInvalid
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                Update Task
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default UpdateTaskModal;
