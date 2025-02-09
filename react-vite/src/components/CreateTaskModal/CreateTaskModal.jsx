import "./CreateTaskModal.css";
import { useState, useEffect } from "react";
import { csrfFetch } from "../../redux/csrf";
import { useModal } from "../../context/Modal";

function CreateTaskModal() {
  const { setModalContent } = useModal();
  const [notebooks, setNotebooks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    notebook_id: "",
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
        notebook_id: sortedNotebooks.length > 0 ? sortedNotebooks[0].id : "",
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
    console.log("LOOK HERE", { ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      title: formData.title,
      notebook_id: formData.notebook_id,
    };

    if (formData.description) {
      submissionData.description = formData.description;
    }

    if (formData.due_date) {
      const date = new Date(formData.due_date);
      const formattedDueDate = `${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date
        .getDate()
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
      submissionData.due_date = formattedDueDate;
    }

    setModalContent(null);
    console.log("Form submitted with data:", submissionData);
  };

  const isDueDateInvalid =
    formData.due_date &&
    new Date(formData.due_date).setHours(0, 0, 0, 0) <
      new Date().setHours(0, 0, 0, 0);

  return (
    <>
      {isLoaded && (
        <div className="create-task-form-container">
          <h2 className="create-task-header">Create a New Task</h2>
          <form className="create-task-form" onSubmit={handleSubmit}>
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
                className="create-task-input"
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
                className="create-task-ta"
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
                Due Date Can&apos;t Be On Or Before Today
              </p>
            ) : null}
            <button
              type="submit"
              disabled={formData.title.length <= 0 || isDueDateInvalid}
              className="create-task-btn"
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
              Create Task
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default CreateTaskModal;
