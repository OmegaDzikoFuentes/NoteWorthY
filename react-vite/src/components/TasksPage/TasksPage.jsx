import { getUserTasks } from "../../redux/task";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { selectAllUserTasks } from "../../redux/task";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import CreateTaskModal from "../CreateTaskModal/CreateTaskModal";
import "./TasksPage.css";

function TasksPage() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const tasks = useSelector(selectAllUserTasks) || [];

  const formatDate = (dateString) => {
    if (!dateString) return "No Due Date";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    dispatch(getUserTasks()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      {isLoaded && (
        <div className="tasks-page-container">
          <div className="tasks-header-box">
            <h1 className="tasks-header">My Tasks</h1>
          </div>
          <div className="tasks-search-container">
            <h4 className="task-count">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            </h4>
            <div className="new-task-search">
              <OpenModalButton
                buttonText="+ New Task"
                className="tasks-page-new"
                modalComponent={<CreateTaskModal />}
              />
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
              <p className="tasks-list-header-text tasks-list-due-date">
                Due Date
              </p>
            </div>
            <div className="tasks-list">
              {tasks.map((task) => (
                <div key={task.id} className="tasks-list-item">
                  <div className="tasks-list-box-1">
                    <input
                      type="checkbox"
                      className="tasks-list-checkbox"
                      name="group1"
                      value={task.id}
                    ></input>
                    <div className="tasks-list-text">
                      <p className="tasks-list-item-title">{task.title}</p>
                      <p className="tasks-list-item-description">
                        {task.description && task.description.length > 35
                          ? task.description.slice(0, 35) + "..."
                          : task.description || null}
                      </p>
                    </div>
                  </div>
                  <p className="tasks-list-item-due-date">
                    {formatDate(task.due_date)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TasksPage;
