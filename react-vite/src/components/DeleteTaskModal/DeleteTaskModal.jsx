import "./DeleteTaskModal.css";

function DeleteTaskModal({ taskId }) {
  return (
    <div className="delete-task-modal-container">
      <h3>Are you sure you want to delete this task?</h3>
      <div className="delete-task-modal-button-container">
        <button className="confirm-delete-button delete-modal-button">
          Yes, delete
        </button>
        <button className="cancel-delete-button delete-modal-button">
          No, cancel
        </button>
      </div>
    </div>
  );
}

export default DeleteTaskModal;
