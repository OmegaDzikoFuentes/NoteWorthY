import { useState, useEffect } from "react";
import "./CreateTaskForm.css";

function CreateTaskForm() {
  return (
    <div className="create-task-form-container">
      <h2 className="create-task-header">Create a New Task</h2>
      <form className="create-task-form">
        <label htmlFor="notebooks" className="input-label notebook-select">
          Notebook:
          <select name="notebooks" id="notebooks"></select>
        </label>

        <label className="input-label title-input">
          Title:
          <input type="text" placeholder="Title..." />
        </label>
        <label className="input-label">
          Description:
          <textarea placeholder="Description..." />
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
