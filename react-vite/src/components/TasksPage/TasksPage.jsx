import "./TasksPage.css";

function TasksPage() {
  return (
    <div className="tasks-page-container">
      <div className="tasks-header-box">
        <h1 className="tasks-header">Tasks</h1>
      </div>
      <div className="tasks-search-container">
        <h4 className="task-count">(Number) task(s)</h4>
        <div className="new-task-search">
          <button className="tasks-page-new">New Task</button>
          <input
            className="tasks-page-search"
            type="text"
            placeholder="Search..."
          />
        </div>
      </div>
      <div className="tasks-list-container">
        <div className="tasks-list-headers">
          <p className="tasks-list-header-text tasks-list-title">Title</p>
          <p className="tasks-list-header-text tasks-list-due-date">Due Date</p>
        </div>
      </div>
    </div>
  );
}

export default TasksPage;
