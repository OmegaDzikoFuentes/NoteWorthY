import "./CreateTaskForm.css";
import { useState, useEffect } from "react";
import { csrfFetch } from "../../redux/csrf";

function CreateTaskForm() {
  const [notebooks, setNotebooks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

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
      console.log("DATA", data);
      setNotebooks(data.notebooks);
      setIsLoaded(true);
    } catch (error) {
      console.error("Error fetching notebooks:", error);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    getUserNotebooks();
  }, []);

  return (
    <div className="create-task-form-container">
      <h2 className="create-task-header">Create a New Task</h2>
      <form className="create-task-form">
        <label htmlFor="notebooks" className="input-label notebook-select">
          Notebook:
          <select name="notebooks" id="notebooks">
            {notebooks.map((notebook) => (
              <option key={notebook.id} value={notebook.id}>
                {notebook.name}
              </option>
            ))}
          </select>
        </label>

        <label className="input-label title-input">
          Title:
          <input
            className="create-task-input"
            type="text"
            placeholder="Title..."
          />
        </label>
        <label className="input-label">
          Description:
          <textarea className="create-task-ta" placeholder="Description..." />
        </label>
        <label className="input-label due-date-input">
          Due Date:
          <input type="date" />
        </label>
        <button className="create-task-btn">Create Task</button>
      </form>
    </div>
  );
}

export default CreateTaskForm;
