
const statuses = ["To Do", "In Progress", "Done"];

function TaskCard({ task, onEdit, onDelete, onMove }) {
  return (
    <article
      className="task-card"
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("taskId", String(task.id));
        event.dataTransfer.effectAllowed = "move";
      }}
    >
      <div className="task-card-top">
        <span className="task-card-mark">✳</span>

        <div className="task-actions">
          <button
            type="button"
            className="icon-button"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
            title="Edit task"
          >
            ✎
          </button>

          <button
            type="button"
            className="icon-button delete-icon"
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
            title="Delete task"
          >
            ×
          </button>
        </div>
      </div>

      <h4>{task.title}</h4>

      <p className="task-description">
        {task.description || "No description added."}
      </p>

      <div className="task-card-bottom">
        <span className={`task-status-label ${task.status === "Done" ? "label-done" : task.status === "In Progress" ? "label-progress" : "label-todo"}`}>
          {task.status}
        </span>

        <span className="drag-handle" title="Drag to move">
          ⠿
        </span>
      </div>

      <div className="task-move">
        <label htmlFor={`status-${task.id}`}>Move to</label>

        <select
          id={`status-${task.id}`}
          value={task.status}
          onChange={(event) => onMove(task.id, event.target.value)}
          onClick={(event) => event.stopPropagation()}
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </article>
  );
}

export default TaskCard;
