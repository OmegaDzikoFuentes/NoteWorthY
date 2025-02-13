import "./DeleteTaskModal.css";
import { deleteTask, getUserTasks } from "../../redux/task";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

function DeleteTaskModal({ taskId }) {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();

  const dispatchDelete = async () => {
    try {
      await dispatch(deleteTask(taskId));
      await dispatch(getUserTasks());

      setModalContent(null);
    } catch (e) {
      console.error("Error deleting task:", e);
    }
  };

  return (
    <div className="delete-task-modal-container">
      <h3 className="delete-task-header">Confirm Delete</h3>
      <div className="delete-task-modal-button-container">
        <button
          className="confirm-delete-button delete-modal-button"
          onClick={dispatchDelete}
        >
          Yes, delete
        </button>
        <button
          className="cancel-delete-button delete-modal-button"
          onClick={() => setModalContent(null)}
        >
          No, cancel
        </button>
      </div>
    </div>
  );
}

export default DeleteTaskModal;
