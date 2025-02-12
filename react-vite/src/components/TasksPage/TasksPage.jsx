import { getUserTasks } from "../../redux/task";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { selectAllUserTasks, updateTask } from "../../redux/task";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import CreateTaskModal from "../CreateTaskModal/CreateTaskModal";
import UpdateTaskModal from "../UpdateTaskModal/UpdateTaskModal";
import { useModal } from "../../context/Modal";
import "./TasksPage.css";

function TasksPage() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkedTasks, setCheckedTasks] = useState({});
  const rawTasks = useSelector(selectAllUserTasks) || [];
  const tasks = rawTasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date) - new Date(b.due_date);
    });
  const { setModalContent } = useModal();

  const formatDate = (dateString) => {
    if (!dateString) return "No Due Date";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleTaskClick = (task) => {
    const selectedTask = tasks.find((t) => t.id === task.id);
    if (!selectedTask) return;

    setModalContent(<UpdateTaskModal taskId={task.id} task={selectedTask} />);
  };

  const handleCheckBoxChange = async (taskId) => {
    setCheckedTasks((prev) => {
      const newCheckedTasks = { ...prev, [taskId]: !prev[taskId] };

      if (!prev[taskId]) {
        dispatch(updateTask(taskId, { completed: true }));
      } else {
        dispatch(updateTask(taskId, { completed: false }));
      }

      dispatch(getUserTasks());
      return newCheckedTasks;
    });
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
              {searchQuery === ""
                ? `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`
                : `${tasks.length} ${
                    tasks.length === 1 ? "task" : "tasks"
                  } found`}
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
                placeholder="Search By Title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                      checked={checkedTasks[task.id]}
                      onChange={() => handleCheckBoxChange(task.id)}
                      name="group1"
                      value={task.id}
                    ></input>
                    <div className="tasks-list-text">
                      <p
                        className="tasks-list-item-title"
                        onClick={() => handleTaskClick(task)}
                        style={{
                          color: task.completed ? "#bcbcbc" : "inherit",
                          textDecoration: task.completed
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {task.title}
                      </p>
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
